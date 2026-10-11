interface Env {
  DB: D1Database;
  LMS_ASSETS: R2Bucket;
  MIGRATION_ADMIN_TOKEN?: string;
}

type RunStatus = "pending" | "running" | "paused" | "failed" | "verified" | "complete";

const RUN_STATUSES = new Set<RunStatus>([
  "pending", "running", "paused", "failed", "verified", "complete"
]);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff"
    }
  });

function constantTimeEqual(a: string, b: string): boolean {
  const left = new TextEncoder().encode(a);
  const right = new TextEncoder().encode(b);
  let difference = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i += 1) {
    difference |= (left[i] ?? 0) ^ (right[i] ?? 0);
  }
  return difference === 0;
}

function authorised(request: Request, env: Env): boolean {
  const expected = env.MIGRATION_ADMIN_TOKEN;
  if (!expected || expected.length < 32) return false;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  return constantTimeEqual(supplied, expected);
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().includes("application/json")) return null;
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > 32_768) return null;
  try {
    const raw = await request.text();
    if (raw.length > 32_768) return null;
    const value = JSON.parse(raw);
    return value && typeof value === "object" && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}

function textField(value: unknown, max = 200): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= max ? trimmed : null;
}

function hex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, "0")).join("");
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message.slice(0, 500) : "Unknown internal error";
}

async function migrationStatus(env: Env) {
  const [runs, objects, records] = await Promise.all([
    env.DB.prepare(
      "SELECT status, COUNT(*) AS count FROM migration_runs GROUP BY status ORDER BY status"
    ).all<{ status: string; count: number }>(),
    env.DB.prepare(
      "SELECT COUNT(*) AS total, SUM(CASE WHEN verified = 1 THEN 1 ELSE 0 END) AS verified, " +
      "SUM(CASE WHEN source_deleted = 1 THEN 1 ELSE 0 END) AS source_deleted " +
      "FROM migration_object_manifest"
    ).first<{ total: number; verified: number | null; source_deleted: number | null }>(),
    env.DB.prepare(
      "SELECT COUNT(*) AS total, SUM(CASE WHEN verified = 1 THEN 1 ELSE 0 END) AS verified " +
      "FROM migration_record_manifest"
    ).first<{ total: number; verified: number | null }>()
  ]);
  return {
    runs: runs.results ?? [],
    objects: {
      total: objects?.total ?? 0,
      verified: objects?.verified ?? 0,
      source_deleted: objects?.source_deleted ?? 0
    },
    records: {
      total: records?.total ?? 0,
      verified: records?.verified ?? 0
    }
  };
}

async function handle(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();

  if (url.pathname === "/health" && method === "GET") {
    try {
      await env.DB.prepare("SELECT 1 AS ok").first();
      return json({ ok: true, service: "phenom-migration-control" });
    } catch {
      return json({ ok: false, service: "phenom-migration-control" }, 503);
    }
  }

  if (!url.pathname.startsWith("/internal/migration/")) {
    return json({ error: "Not found" }, 404);
  }
  if (!env.MIGRATION_ADMIN_TOKEN || env.MIGRATION_ADMIN_TOKEN.length < 32) {
    return json({ error: "Migration control is not configured" }, 503);
  }
  if (!authorised(request, env)) return json({ error: "Unauthorised" }, 401);

  if (url.pathname === "/internal/migration/status" && method === "GET") {
    try {
      return json(await migrationStatus(env));
    } catch {
      return json({ error: "Migration schema is not installed or status query failed" }, 503);
    }
  }

  if (url.pathname === "/internal/migration/runs" && method === "POST") {
    const body = await readJson(request);
    const entityType = textField(body?.entity_type, 100);
    if (!entityType) return json({ error: "entity_type is required" }, 400);
    const id = crypto.randomUUID();
    try {
      await env.DB.prepare(
        "INSERT INTO migration_runs (id, entity_type, status) VALUES (?, ?, 'pending')"
      ).bind(id, entityType).run();
      return json({ id, entity_type: entityType, status: "pending" }, 201);
    } catch {
      return json({ error: "Could not create migration run; check that migration schema is installed" }, 503);
    }
  }

  const runMatch = url.pathname.match(/^\/internal\/migration\/runs\/([0-9a-f-]{36})$/i);
  if (runMatch && method === "PATCH") {
    const body = await readJson(request);
    if (!body) return json({ error: "A JSON object is required" }, 400);
    const id = runMatch[1];
    const current = await env.DB.prepare(
      "SELECT status FROM migration_runs WHERE id = ?"
    ).bind(id).first<{ status: RunStatus }>();
    if (!current) return json({ error: "Migration run not found" }, 404);

    const nextStatus = body.status === undefined ? current.status : body.status as RunStatus;
    if (!RUN_STATUSES.has(nextStatus)) return json({ error: "Invalid status" }, 400);
    const allowedTransitions: Record<RunStatus, RunStatus[]> = {
      pending: ["pending", "running", "paused", "failed"],
      running: ["running", "paused", "failed", "verified"],
      paused: ["paused", "running", "failed"],
      failed: ["failed", "paused", "running"],
      verified: ["verified", "complete", "paused", "failed"],
      complete: ["complete"]
    };
    if (!allowedTransitions[current.status].includes(nextStatus)) {
      return json({ error: `Invalid status transition: ${current.status} -> ${nextStatus}` }, 409);
    }

    const cursor = body.cursor === undefined ? null : textField(body.cursor, 2_000);
    if (body.cursor !== undefined && body.cursor !== null && cursor === null) {
      return json({ error: "cursor must be a string of at most 2000 characters" }, 400);
    }
    const counters: Record<string, number> = {};
    for (const field of ["records_seen", "records_written", "records_verified"] as const) {
      if (body[field] !== undefined) {
        const value = body[field];
        if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
          return json({ error: `${field} must be a non-negative safe integer` }, 400);
        }
        counters[field] = value;
      }
    }
    const lastError = body.last_error === undefined ? null :
      body.last_error === null ? null : textField(body.last_error, 500);
    if (body.last_error !== undefined && body.last_error !== null && lastError === null) {
      return json({ error: "last_error must be at most 500 characters" }, 400);
    }
    const completedAt = nextStatus === "complete" ? new Date().toISOString() : null;
    const assignments = ["status = ?", "updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')"];
    const values: (string | number | null)[] = [nextStatus];
    if (body.cursor !== undefined) {
      assignments.push("cursor = ?");
      values.push(cursor);
    }
    for (const [field, value] of Object.entries(counters)) {
      assignments.push(`${field} = ?`);
      values.push(value);
    }
    if (body.last_error !== undefined) {
      assignments.push("last_error = ?");
      values.push(lastError);
    }
    if (nextStatus === "running") {
      assignments.push("started_at = COALESCE(started_at, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))");
    }
    if (completedAt) {
      assignments.push("completed_at = ?");
      values.push(completedAt);
    }
    values.push(id, current.status);
    const result = await env.DB.prepare(
      `UPDATE migration_runs SET ${assignments.join(", ")} WHERE id = ? AND status = ?`
    ).bind(...values).run();
    if (!result.success || result.meta.changes !== 1) {
      return json({ error: "Migration run changed concurrently; reload and retry" }, 409);
    }
    return json({ id, status: nextStatus, updated: true });
  }

  if (url.pathname === "/internal/migration/objects/register" && method === "POST") {
    const body = await readJson(request);
    const sourceType = textField(body?.source_type, 100);
    const sourceId = textField(body?.source_id, 500);
    const destinationKey = textField(body?.destination_key, 1_024);
    const sha256 = textField(body?.sha256, 64)?.toLowerCase() ?? null;
    const byteCount = body?.byte_count;
    if (!sourceType || !sourceId || !destinationKey ||
        !sha256 || !/^[a-f0-9]{64}$/.test(sha256) ||
        typeof byteCount !== "number" || !Number.isSafeInteger(byteCount) || byteCount < 0) {
      return json({ error: "source_type, source_id, destination_key, SHA-256 and non-negative byte_count are required" }, 400);
    }
    try {
      const existing = await env.DB.prepare(
        "SELECT verified, source_deleted FROM migration_object_manifest " +
        "WHERE source_type = ? AND source_id = ?"
      ).bind(sourceType, sourceId).first<{ verified: number; source_deleted: number }>();
      if (existing?.verified || existing?.source_deleted) {
        return json({ error: "A verified or source-deleted object cannot be re-registered" }, 409);
      }
      await env.DB.prepare(
        "INSERT INTO migration_object_manifest " +
        "(source_type, source_id, destination_key, sha256, byte_count, verified, source_deleted, attempts) " +
        "VALUES (?, ?, ?, ?, ?, 0, 0, 0) " +
        "ON CONFLICT(source_system, source_type, source_id) DO UPDATE SET " +
        "destination_key = excluded.destination_key, sha256 = excluded.sha256, byte_count = excluded.byte_count, " +
        "attempts = migration_object_manifest.attempts + 1, last_error = NULL " +
        "WHERE migration_object_manifest.verified = 0 AND migration_object_manifest.source_deleted = 0"
      ).bind(sourceType, sourceId, destinationKey, sha256, byteCount).run();
      return json({ registered: true, source_type: sourceType, source_id: sourceId }, 201);
    } catch {
      return json({ error: "Could not register object; verify schema and unique destination key" }, 409);
    }
  }

  if (url.pathname === "/internal/migration/objects/verify" && method === "POST") {
    const body = await readJson(request);
    const sourceType = textField(body?.source_type, 100);
    const sourceId = textField(body?.source_id, 500);
    if (!sourceType || !sourceId) return json({ error: "source_type and source_id are required" }, 400);
    const manifest = await env.DB.prepare(
      "SELECT destination_key, sha256, byte_count, verified FROM migration_object_manifest " +
      "WHERE source_type = ? AND source_id = ?"
    ).bind(sourceType, sourceId).first<{
      destination_key: string; sha256: string; byte_count: number; verified: number;
    }>();
    if (!manifest) return json({ error: "Object is not registered" }, 404);
    const object = await env.LMS_ASSETS.head(manifest.destination_key);
    if (!object) return json({ error: "Destination object does not exist" }, 409);
    if (object.size !== manifest.byte_count) {
      return json({ error: "Destination byte count does not match source manifest", expected: manifest.byte_count, actual: object.size }, 409);
    }
    const checksum = object.checksums?.sha256 ? hex(object.checksums.sha256) : null;
    if (!checksum || checksum !== manifest.sha256) {
      return json({ error: "Destination SHA-256 is missing or does not match the source manifest" }, 409);
    }
    const updated = await env.DB.prepare(
      "UPDATE migration_object_manifest SET verified = 1, verified_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), " +
      "last_error = NULL WHERE source_type = ? AND source_id = ? AND destination_key = ? AND sha256 = ? AND byte_count = ? AND source_deleted = 0"
    ).bind(sourceType, sourceId, manifest.destination_key, manifest.sha256, manifest.byte_count).run();
    if (!updated.success || updated.meta.changes !== 1) {
      return json({ error: "Manifest changed concurrently; reload and retry verification" }, 409);
    }
    return json({ verified: true, source_type: sourceType, source_id: sourceId, byte_count: object.size, sha256: checksum });
  }

  return json({ error: "Not found" }, 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "GET" && request.method !== "POST" && request.method !== "PATCH") {
      return json({ error: "Method not allowed" }, 405);
    }
    try {
      return await handle(request, env);
    } catch (error) {
      // Do not log request bodies, tokens, file contents or learner data.
      console.error("Migration-control request failed", errorMessage(error));
      return json({ error: "Internal server error" }, 500);
    }
  }
};
