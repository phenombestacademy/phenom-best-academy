# Phenom Best Academy — Supabase Exit Runbook

Status: planning and hosting-preview preparation only. This document is not evidence of a completed migration.

## Non-negotiable safety rule

Do not delete, truncate, disable, or empty the production Supabase project until the replacement has passed data reconciliation, identity/authentication tests, security tests, file integrity checks, end-to-end CBT/reporting/payment tests, production cutover, and an agreed rollback window. Keep the existing project recoverable until sign-off.

## Verified source inventory (14 October 2026)

Supabase project: `hajrdejlamuiqjjhdnsv` (ACTIVE_HEALTHY; PostgreSQL 17.6.1).

Previously recorded read-only inventory:
- 171 public base tables
- 314 public RLS policies; RLS enabled on 170 tables
- 67 public functions and 29 triggers
- 4 Storage buckets; 53,130 Storage objects (53,128 in `phenom-curriculum-assets`, 2 in `media`)
- 2 Auth users
- 18 active Edge Functions were returned by the project API at the time of inspection

The numbers are a baseline, not proof that every row/object has been exported. Re-run inventory at migration time and reconcile all schemas, sequences, extensions, views, grants, policies, triggers, scheduled jobs, webhooks, secrets, Auth identities, and Storage metadata.

## Current repository / deployment state

- Repository: `phenombestacademy/phenom-best-academy`
- Hosting preparation branch: `feat/supabase-exit`
- Draft PR: #4, Cloudflare Workers hosting preview
- Existing app uses `@supabase/supabase-js` for database queries, Auth, Storage, RPCs and Functions. `src/lib/cms.ts` contains a hard-coded Supabase project fallback. This means the app is still Supabase-dependent.
- Existing `cloudflare/` Worker is a background content processor that also calls Supabase REST/RPC and the Supabase AI Router. It is not yet an independent replacement.
- CI quality workflow on the inspected commit completed successfully (install, build, typecheck, lint). This verifies the current branch build only; it does not verify a Cloudflare deployment or Supabase exit.
- No Cloudflare account connection/deployment action is available to the current assistant tool session. No Cloudflare resources or production DNS were changed.

## Architecture decision — required before database implementation

The request says all services should move to Cloudflare. Choose one of these deliberately:

### Option A — Cloudflare-native data plane
Cloudflare Workers + D1 + R2 + Queues + Workers/Access/Turnstile as appropriate. This keeps the database on Cloudflare but requires redesigning PostgreSQL-specific SQL, RPCs, triggers, RLS, and transaction patterns for SQLite/D1. Do not treat a PostgreSQL dump as a directly importable D1 migration.

### Option B — lower-risk PostgreSQL transition
Cloudflare Workers + Hyperdrive + a PostgreSQL provider, with R2/Queues on Cloudflare. This can reduce application rewrite effort, but the database itself is not hosted by Cloudflare and therefore does not satisfy a literal all-Cloudflare requirement.

Do not mix these options implicitly. The user requested Cloudflare-only, so Option A is the target unless the user explicitly accepts an external PostgreSQL provider.

## Required migration workstreams

1. **Application inventory:** locate every Supabase SDK import, `.from()`, `.rpc()`, `auth.*`, `storage.*`, `functions.invoke()`, Realtime channel, signed URL, and direct REST call. Map each use to a replacement API and test.
2. **Schema conversion:** export schema and data from every relevant schema; catalogue all 171 public tables, 67 functions, 29 triggers, RLS policies/grants, constraints/indexes/sequences, views, extensions, and dependencies. Convert and review the schema for D1 before loading any production data.
3. **Identity:** replace Supabase Auth without breaking sign-in, sessions, password recovery, role claims, school membership, invitations, MFA (if enabled), and user-to-profile foreign keys. Exporting two user rows is not sufficient: verify credentials/password migration strategy and account recovery.
4. **Authorisation:** replace all 314 RLS policies with server-enforced access checks. School/tenant isolation, Super Admin restrictions, teacher/student/parent access, and least privilege must have negative tests. Never trust client-supplied role flags.
5. **Files:** inventory every bucket, object, path, content type, size, cache metadata, access rule and reference. Copy objects to R2 with checksums and a durable mapping manifest. Verify signed/private access, public URLs, download behaviour and orphan references.
6. **Edge Functions:** port each function to a Worker or a suitable Cloudflare service. Preserve JWT verification, payment/webhook signature checks, idempotency, retry rules, rate limits, secrets and error contracts.
7. **Realtime/jobs:** map subscriptions to Durable Objects/WebSockets or another suitable pattern; map cron, queues, retries and dead-letter handling. Ensure each job is idempotent and observable.
8. **Secrets/integrations:** inventory payment, AI, email, storage and webhook secrets. Recreate them only in Cloudflare secrets/bindings; never commit values or place private keys in `VITE_*` variables.
9. **Verification:** compare per-table row counts and stable-key checksums; compare per-bucket object counts and checksums; test all roles and tenant boundaries; run CBT creation, timed attempt, submission, marking, report cards, school billing, payment webhooks, invites, uploads, downloads and admin workflows.
10. **Cutover:** freeze writes briefly or use a documented delta-sync strategy; run final reconciliation; deploy and smoke-test; switch DNS only after passing gates; monitor errors/latency and retain rollback.
11. **Decommission:** after an agreed stable period, revoke old app credentials, remove Supabase URLs/keys from app and Worker configuration, confirm zero production traffic, then archive/export the project. Delete the Supabase project only after separate final confirmation and verified backups.

## Cutover acceptance gates

- [ ] Cloudflare account access available; preview Worker deployed and reachable.
- [ ] Replacement schema and all migrations reviewed.
- [ ] All rows reconciled; no unexplained missing/extra records.
- [ ] All Storage objects copied and checksums verified.
- [ ] Auth/session/password recovery and user-role mappings tested.
- [ ] Tenant-isolation and privilege-escalation negative tests pass.
- [ ] All Edge Functions and background jobs have replacement equivalents.
- [ ] CBT, results/report cards, billing/payments, invites and library upload/download E2E tests pass.
- [ ] Logs, alerts, backups, restore test and rollback procedure verified.
- [ ] Production DNS cutover and smoke tests pass.
- [ ] Zero Supabase requests observed for the agreed observation period.
- [ ] Explicit final approval recorded before deleting the old project.

## Immediate blockers

- The current tool session has GitHub and Supabase access, but no Cloudflare account/deployment API or authenticated Wrangler environment.
- A full Cloudflare-native D1 conversion is a substantial application and database rewrite; the current hosting PR is not that conversion.
- Production Supabase must remain intact until the acceptance gates above are met.
