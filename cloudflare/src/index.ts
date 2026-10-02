interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  AI_ROUTER_WORKER_TOKEN: string;
  CONTENT_QUEUE: Queue;
  LMS_ASSETS: R2Bucket;
  MIGRATION_MODE?: string;
}

type Job = {
  id: string;
  curriculum_id: string | null;
  topic_id: string | null;
  job_type: string;
  status: string;
  priority: number;
  requested_at: string;
  completed_at: string | null;
  error_message: string | null;
  metadata: Record<string, unknown>;
};

const RESOURCE_TYPES = [
  "lesson",
  "study_note",
  "worked_example",
  "practice",
  "assessment",
  "answers",
  "marking_guide",
  "revision",
  "teacher_guide",
  "activities",
  "audio_script",
  "video_script",
  "downloadable",
  "workbook"
] as const;

async function supabase(
  env: Env,
  path: string,
  init: RequestInit = {}
): Promise<any> {
  const headers = new Headers(init.headers);
  headers.set("apikey", env.SUPABASE_SERVICE_ROLE_KEY);
  headers.set("Authorization", `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`);
  headers.set("Content-Type", "application/json");
  const response = await fetch(`${env.SUPABASE_URL}${path}`, { ...init, headers });
  const text = await response.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!response.ok) {
    throw new Error(`Supabase ${response.status}: ${typeof body === "string" ? body : JSON.stringify(body)}`);
  }
  return body;
}

async function updateJob(env: Env, id: string, patch: Record<string, unknown>) {
  await supabase(env, `/rest/v1/lms_curriculum_content_jobs?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(patch)
  });
}

async function claimContentJobs(env: Env, limit = 5): Promise<Job[]> {
  return await supabase(env, "/rest/v1/rpc/claim_curriculum_content_jobs", {
    method: "POST",
    body: JSON.stringify({ p_limit: Math.max(1, Math.min(limit, 10)) })
  });
}

async function askAI(
  env: Env,
  prompt: string,
  mode: "creative" | "reasoning" | "research" = "creative",
  web = false
): Promise<any> {
  const response = await fetch(`${env.SUPABASE_URL}/functions/v1/ai-router`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
      "x-worker-token": env.AI_ROUTER_WORKER_TOKEN
    },
    body: JSON.stringify({
      workflow: "curriculum-content-worker",
      prompt,
      mode,
      web
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.text) {
    throw new Error(payload.error || "AI router unavailable");
  }

  const raw = String(payload.text);
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI response did not contain JSON");
  return JSON.parse(match[0]);
}

async function getTopic(env: Env, topicId: string) {
  const rows = await supabase(
    env,
    `/rest/v1/lms_curriculum_topics?id=eq.${encodeURIComponent(topicId)}&select=*`
  );
  if (!rows?.[0]) throw new Error("Topic not found");
  return rows[0];
}

async function getCurriculum(env: Env, curriculumId: string | null) {
  if (!curriculumId) return null;
  const rows = await supabase(
    env,
    `/rest/v1/curriculum_catalogue?id=eq.${encodeURIComponent(curriculumId)}&select=name,description,official_source`
  );
  return rows?.[0] ?? null;
}

async function reconcile(env: Env, job: Job, topic: any, curriculum: any) {
  const prompt = [
    "You are the Phenom Best Academy curriculum reconciliation worker.",
    "Use the authoritative source identified below. Research the official source when web access is available.",
    "Do not invent curriculum requirements. If the source cannot be verified, return verified:false and explain why.",
    "Return ONLY JSON with: verified, topic_title, topic_code, learning_outcomes, assessment_expectations, source_reference, source_version, notes.",
    "Current stored topic:",
    JSON.stringify(topic),
    "Curriculum:",
    JSON.stringify(curriculum),
    "Authoritative source:",
    JSON.stringify({
      official_url: topic.official_source || curriculum?.official_source,
      source_reference: topic.source_reference,
      source_version: topic.source_version
    })
  ].join("\n");

  const result = await askAI(env, prompt, "research", true);
  if (result.verified !== true) {
    throw new Error(`Authoritative reconciliation could not be verified: ${String(result.notes || "unverified source")}`);
  }

  await supabase(env, `/rest/v1/lms_curriculum_topics?id=eq.${encodeURIComponent(topic.id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      topic_title: String(result.topic_title || topic.topic_title).trim(),
      topic_code: result.topic_code ? String(result.topic_code) : topic.topic_code,
      learning_outcomes: result.learning_outcomes ?? topic.learning_outcomes ?? {},
      assessment_expectations: result.assessment_expectations ?? topic.assessment_expectations ?? {},
      official_source: String(topic.official_source || curriculum?.official_source || result.source_reference || ""),
      source_reference: String(result.source_reference || topic.source_reference || ""),
      source_version: result.source_version ? String(result.source_version) : topic.source_version,
      source_status: "verified",
      metadata: {
        ...(topic.metadata || {}),
        reconciled_by: "phenom-lms-background",
        reconciliation_verified: true,
        reconciliation_notes: String(result.notes || ""),
        reconciled_at: new Date().toISOString()
      }
    })
  });

  await updateJob(env, job.id, {
    status: "completed",
    completed_at: new Date().toISOString(),
    error_message: null,
    metadata: { ...(job.metadata || {}), reconciled: true, verified: true, processor: "cloudflare" }
  });
}

async function generateResourcePack(env: Env, job: Job, topic: any, curriculum: any) {
  const base = [
    "Curriculum:", curriculum?.name || job.curriculum_id,
    "Topic:", topic.topic_title,
    "Topic code:", topic.topic_code || "",
    "Level:", topic.level_id || "",
    "Official source:", topic.official_source || curriculum?.official_source || "",
    "Source reference:", topic.source_reference || "",
    "Source version:", topic.source_version || "",
    "Learning outcomes:", JSON.stringify(topic.learning_outcomes || {}),
    "Assessment expectations:", JSON.stringify(topic.assessment_expectations || {}),
    "Instruction:", String(job.metadata?.instruction || "Create original curriculum-aligned educational content."),
    "Create original human-ready Phenom educational content in British English. Do not copy official wording. Distinguish statutory/source facts from Phenom-authored teaching material. Include source/provenance references where relevant."
  ].join("\n");

  const first = await askAI(
    env,
    base + "\nReturn JSON exactly with lesson,study_note,worked_example,practice,assessment,answers,marking_guide.",
    "creative"
  );
  const second = await askAI(
    env,
    base + "\nReturn JSON exactly with revision,teacher_guide,activities,audio_script,video_script,downloadable,workbook.",
    "creative"
  );

  const all = { ...first, ...second };
  const now = new Date().toISOString();

  for (let i = 0; i < RESOURCE_TYPES.length; i++) {
    const type = RESOURCE_TYPES[i];
    const value = String(all[type] ?? "");
    if (value.length < 120) throw new Error(`Missing or too-short ${type}`);

    const existing = await supabase(
      env,
      `/rest/v1/lms_curriculum_resource_packs?topic_id=eq.${encodeURIComponent(topic.id)}&resource_type=eq.${encodeURIComponent(type)}&select=id,locale,support_locale&limit=1`
    );
    const locale = existing?.[0]?.locale || "en-NG";
    const supportLocale = existing?.[0]?.support_locale || "en-NG";

    const r2Key = `curriculum-content/${job.curriculum_id || topic.curriculum_id}/${topic.id}/${type}-${locale}.txt`;
    await env.LMS_ASSETS.put(r2Key, value, {
      httpMetadata: { contentType: "text/plain; charset=utf-8" },
      customMetadata: {
        curriculum_id: String(job.curriculum_id || topic.curriculum_id || ""),
        topic_id: String(topic.id),
        resource_type: type,
        locale
      }
    });

    const row = {
      topic_id: topic.id,
      pack_code: `${job.curriculum_id || topic.curriculum_id}-${topic.id}-${type}`,
      resource_type: type,
      title: `${String(topic.topic_title)} — ${type.replaceAll("_", " ")}`,
      content: value,
      locale,
      support_locale: supportLocale,
      sequence_no: i + 1,
      status: "ready",
      curriculum_alignment: {
        curriculum_id: job.curriculum_id || topic.curriculum_id,
        topic_id: topic.id,
        official_source: topic.official_source || curriculum?.official_source,
        source_reference: topic.source_reference,
        source_version: topic.source_version
      },
      brand_metadata: {
        brand: "Phenom Best Academy",
        engine: "Phenom Best Core",
        generated_by: "phenom-lms-background",
        iqa_required: true,
        job_type: job.job_type,
        processor: "cloudflare",
        r2_key: r2Key
      }
    };

    await supabase(env, "/rest/v1/lms_curriculum_resource_packs?on_conflict=topic_id%2Cresource_type%2Clocale", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(row)
    });
  }

  await updateJob(env, job.id, {
    status: "completed",
    completed_at: now,
    error_message: null,
    metadata: {
      ...(job.metadata || {}),
      generated: true,
      pending_independent_iqa: true,
      architecture: "cloudflare-worker-plus-queues",
      processor: "cloudflare"
    }
  });
}

async function processJob(env: Env, job: Job) {
  const current = await supabase(
    env,
    `/rest/v1/lms_curriculum_content_jobs?id=eq.${encodeURIComponent(job.id)}&select=id,status,job_type,curriculum_id,topic_id,priority,requested_at,completed_at,error_message,metadata&limit=1`
  );
  if (!current?.[0] || current[0].status === "completed") return;

  if (!job.topic_id) throw new Error("Content job has no topic_id");

  const topic = await getTopic(env, job.topic_id);
  const curriculum = await getCurriculum(env, job.curriculum_id);

  if (job.job_type === "topic_reconciliation") {
    await reconcile(env, job, topic, curriculum);
    return;
  }

  if (["full_resource_pack", "resource_expansion"].includes(job.job_type)) {
    await generateResourcePack(env, job, topic, curriculum);
    return;
  }

  await updateJob(env, job.id, {
    status: "completed",
    completed_at: new Date().toISOString(),
    error_message: null,
    metadata: { ...(job.metadata || {}), skipped_unknown_job_type: job.job_type, processor: "cloudflare" }
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      return Response.json({
        service: "phenom-lms-background",
        status: "ok",
        architecture: "Cloudflare Worker + Queues + R2 + Supabase",
        phase: "content-processing"
      });
    }
    return new Response("Not found", { status: 404 });
  },

  async scheduled(_controller: ScheduledController, env: Env): Promise<void> {
    if (env.MIGRATION_MODE !== "content") return;
    const jobs = await claimContentJobs(env, 5);
    for (const job of jobs) {
      try {
        await env.CONTENT_QUEUE.send(job);
      } catch (error) {
        await updateJob(env, job.id, {
          status: "queued",
          error_message: `Cloudflare queue publish failed: ${String(error)}`
        });
        throw error;
      }
    }
  },

  async queue(batch: MessageBatch<Job>, env: Env): Promise<void> {
    for (const message of batch.messages) {
      try {
        await processJob(env, message.body);
        message.ack();
      } catch (error) {
        console.error("curriculum content job failed", {
          job_id: message.body.id,
          error: String(error)
        });
        await updateJob(env, message.body.id, {
          status: "queued",
          error_message: String(error)
        }).catch(() => undefined);
        message.retry();
      }
    }
  }
} satisfies ExportedHandler<Env>;
