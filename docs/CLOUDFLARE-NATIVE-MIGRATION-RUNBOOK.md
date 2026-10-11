# Cloudflare-native LMS migration runbook

Status: **not cut over**. This runbook is the execution gate for the Supabase exit. Do not describe the LMS as migrated until the acceptance checks below pass.

## Target architecture

- Cloudflare Workers: authenticated application API and replacement for Supabase Edge Functions.
- Cloudflare D1: relational data only after every PostgreSQL feature, query, constraint, transaction, and authorization rule has a verified compatible implementation. D1 is not a drop-in PostgreSQL replacement.
- Cloudflare R2: private curriculum/library/media objects; serve through authenticated Worker routes or short-lived signed URLs.
- Cloudflare Queues and scheduled Workers: asynchronous ingestion, bulk copy, retries, and reconciliation.
- Cloudflare-native authentication: implement and test account lifecycle, sessions, password recovery, email verification, role/tenant boundaries, and token rotation before removing Supabase Auth.
- Cloudflare observability: structured logs, alerts, dead-letter handling, and migration run records.

Gemini configuration is outside this migration scope and must remain unchanged.

## Verified starting point (11 October 2026)

- Supabase project: `hajrdejlamuiqjjhdnsv`, currently ACTIVE_HEALTHY, PostgreSQL 17.
- Repository: `phenombestacademy/phenom-best-academy`.
- Migration branch: `migration/cloudflare-native-backend`.
- Draft PR: #2, “Cloudflare-native Supabase exit groundwork”.
- Inventory already recorded in PR: 171 tables, 67 functions, 47 triggers, 314 RLS policies, approximately 53,130 Storage objects, and 19 Edge Functions.
- A `cloudflare_migration_manifest` table exists.
- Existing application dependencies still include `@supabase/supabase-js`; the Vite/Nitro configuration still targets Vercel.
- Cloudflare resource provisioning and live data/object transfer have not been verified. The migration-control Worker is not deployed.
- A previously reported Supabase egress quota warning was a transfer gate; re-check current quota and reset date before starting bulk exports.

## Execution phases

### 0. Access and safety gate
1. Verify Cloudflare account access, account ID, Worker deployment permission, D1 creation permission, R2 access, Queues permission, and domain/DNS access.
2. Confirm quota/egress availability and export limits on Supabase.
3. Store all tokens only as Cloudflare Worker secrets or GitHub Actions secrets. Never commit credentials.
4. Record current production deployment, DNS, environment variables, Supabase project settings, and rollback steps.
5. Create isolated staging resources. Do not point production traffic at empty D1/R2 resources.

### 1. Resource provisioning
1. Create and verify a D1 database and apply versioned SQL migrations.
2. Create/verify a private R2 bucket and configure CORS only for approved origins.
3. Create Queues for object/data import and retry/dead-letter processing if required.
4. Deploy a minimal Worker health endpoint; validate bindings and secret access without exposing secret values.
5. Add reproducible Wrangler configuration and CI deployment using scoped credentials.

### 2. Complete dependency mapping
1. Enumerate every Supabase client import, direct table query, RPC, auth call, Storage operation, Realtime subscription, and Edge Function invocation in the codebase.
2. Map each route and operation to a Cloudflare Worker endpoint and target schema.
3. For every PostgreSQL function, trigger, view, extension, RLS policy, and transaction, choose and test an explicit D1-compatible replacement or a justified alternative Cloudflare service.
4. Do not assume translating SQL syntax alone preserves PostgreSQL semantics or RLS guarantees.

### 3. Data and object transfer
1. Export data in resumable batches with stable primary-key ordering and checkpoints.
2. Copy Storage objects to private R2 in bounded, retryable batches. Preserve object keys and required metadata.
3. For each record/object, verify counts and SHA-256 checksums where possible; record source, destination, status, byte size, attempts, and errors in the manifest.
4. Reconcile missing, duplicate, and failed items; repeat incremental delta transfer after the initial snapshot.
5. Do not delete source data or objects during migration.

### 4. Authentication, authorization, and API replacement
1. Implement and test signup/login/logout, email verification, password reset, session renewal/revocation, role assignment, and account deletion.
2. Replace RLS with explicit server-side authorization. Enforce learner isolation, school/tenant isolation, teacher scope, administrator privileges, and private curriculum/library access in every endpoint.
3. Port all 19 Edge Functions and their secrets, webhook verification, idempotency, rate limits, and error semantics. Pay particular attention to payment/webhook functions and AI routes.
4. Replace Storage upload/download policies with authenticated, bounded, type-checked upload routes and private R2 delivery.
5. Replace Realtime usage with Queues, Durable Objects, or another suitable Cloudflare-native pattern where required; do not silently drop live features.

### 5. Staging validation
- Build, typecheck, lint, and run automated tests.
- Compare row counts and data checksums for every migrated table.
- Verify R2 object counts, byte totals, checksums, content types, and private access.
- Run end-to-end tests for learner, teacher, school administrator, platform administrator, curriculum/library upload/download, quiz/assessment, result release, payments, and webhooks.
- Test tenant/role isolation, expired/revoked sessions, malformed uploads, rate limits, retries, and recovery from partial import.
- Perform load and backup/restore tests; verify logs contain no secrets or sensitive learner data.

### 6. Controlled cutover and rollback
1. Require all acceptance checks to pass and obtain a reviewed go/no-go.
2. Pause writes briefly or enable a reliable change-data/delta capture mechanism; import and reconcile final deltas.
3. Deploy Worker API and frontend configuration to staging, run smoke tests, then switch production traffic in a controlled window.
4. Monitor errors, authentication failures, data writes, payments/webhooks, queue depth, and latency.
5. Keep Supabase intact and read-only during the agreed rollback window. Roll back traffic immediately if integrity, authorization, payment, or learner-access checks fail.
6. Only retire Supabase after a separately approved retention/export decision and successful recovery test.

## Acceptance criteria

- No production LMS path depends on Supabase Auth, PostgREST, Supabase Storage, Realtime, or Edge Functions.
- No Supabase credentials are required by the deployed application.
- All mapped data and objects reconcile; all failed manifest entries are resolved.
- Security tests prove equivalent or stronger tenant/role isolation.
- All critical learner, school, admin, payment, upload/download, and webhook journeys pass in production smoke tests.
- Rollback and recovery have been exercised and documented.

## Current hard blockers

The connected tools available for this run can inspect and modify GitHub and inspect Supabase, but do not expose Cloudflare account/resource management or Worker deployment. Therefore this run cannot honestly provision/verify D1, R2, Queues, secrets, deploy the Worker, or perform the bulk transfer. The next executable step is to make Cloudflare account access available through an authorized Cloudflare connection or a scoped deployment credential in GitHub Actions, then execute phases 0–5. Keep production on the existing backend until then.
