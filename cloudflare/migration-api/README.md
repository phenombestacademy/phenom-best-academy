# Cloudflare migration-control API (not yet deployed)

This Worker is a protected control plane for tracking the Supabase exit migration. It is separate from the current curriculum worker so it does not change the existing production queue consumers.

## Routes

- `GET /health` — minimal health check; verifies the D1 binding with `SELECT 1`.
- `GET /internal/migration/status` — counts migration runs, object manifests and record manifests.
- `POST /internal/migration/runs` — starts a tracked migration run for an entity type.
- `PATCH /internal/migration/runs/:uuid` — updates status, cursor, counters and error state with validated status transitions and a compare-and-swap status check.
- `POST /internal/migration/objects/register` — records the source ID, R2 destination key, source SHA-256 and byte count before copying.
- `POST /internal/migration/objects/verify` — verifies the destination R2 object's byte count and R2-native SHA-256 before marking it verified.

All `/internal/migration/*` routes require `Authorization: Bearer <MIGRATION_ADMIN_TOKEN>`. The secret must be at least 32 characters. The API does not enable browser CORS. Do not place this token in browser code or commit it to GitHub.

## Prerequisites

1. Create a dedicated Cloudflare D1 database in the intended account.
2. Create or confirm the R2 bucket for LMS assets.
3. Add D1 binding `DB` and R2 binding `LMS_ASSETS` to a new Worker configuration.
4. Apply `../migrations/0001_migration_control.sql` to the new D1 database.
5. Configure `MIGRATION_ADMIN_TOKEN` using `wrangler secret put MIGRATION_ADMIN_TOKEN`.
6. Set up staging deployment and test the auth gate, state transitions, object-size checks and R2-native SHA-256 checks before running any import.

The actual Cloudflare D1 database ID and account resources have not yet been provisioned through the available connection. Consequently, this Worker has no deployable config and has not been deployed. Do not invent a database ID or point it at a production resource before confirming the target account and database.

## Object-copy integrity

Register the expected SHA-256 and byte count from the source object. The copy process must upload to R2 with the checksum supplied so R2 stores a native SHA-256 checksum. The verification endpoint intentionally does not trust a user-provided custom metadata field as proof of content integrity.

The endpoint never marks a source object as deleted. Cleanup must remain a separate, explicitly approved post-cutover operation.

## Operational safeguards

- Use a dedicated migration token, rotate it, and never reuse an application/session secret.
- Do not log request bodies, tokens, object contents or learner data.
- Keep batches bounded and idempotent; save checkpoints after verified batches.
- A failed or paused run is resumable; a completed run cannot be reopened.
- The API is only a tracking/verification foundation. It does not yet migrate relational records or copy source files itself.
