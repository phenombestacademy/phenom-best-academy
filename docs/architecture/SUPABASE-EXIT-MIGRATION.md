# Phenom Best Academy — Supabase Exit Migration

## Objective

Move the production LMS and its supporting platform completely off Supabase. The final application must not call `*.supabase.co`, depend on Supabase Auth/Storage/Realtime/Edge Functions, or require Supabase keys at runtime. Gemini model notices are explicitly out of scope and remain deferred.

This is a staged migration. Supabase remains intact as the source of truth until the replacement is deployed, reconciled, security-tested and accepted. Do not delete rows, buckets, functions or the project during the migration.

## Repository and current runtime

- Repository: `phenombestacademy/phenom-best-academy`
- Working branch: `migration/cloudflare-native-backend`
- Existing website: React 19, TypeScript, TanStack Start/Router, Vite and Tailwind.
- Current browser data/auth client: `src/lib/cms.ts` creates a Supabase JS client and contains a fallback project URL/key.
- Several platform services call Supabase directly from the browser; this is not a one-file endpoint replacement. Initial code review confirms direct Auth/RPC use in `src/lib/platform.ts`, direct data access and a hard-coded fallback URL/publishable key in `src/lib/cms.ts`, Edge Function calls in `src/lib/ai.ts`, `src/lib/quiz.ts` and `src/lib/school.ts`, and direct database plus Realtime channel use in `src/routes/chat.tsx` and `src/routes/community.tsx`.
- Existing Cloudflare background Worker at `cloudflare/src/index.ts` still uses the Supabase REST API and the Supabase `ai-router` Edge Function. It is a transitional worker, not yet Supabase-independent.
- Existing Cloudflare Worker config has an R2 binding and queue declarations, but `triggers.crons` is empty and no verified R2 migration manifest records exist.
- The project also contains a separate `workers/curriculum` area; inspect it before consolidating or replacing worker responsibilities.

## Read-only production inventory captured before migration

The connected Supabase project reported:

| Item | Observed state |
|---|---:|
| Database size including indexes | 486 MB (510,004,371 bytes) |
| Public tables | 171 |
| Public SQL functions | 67 |
| Public RLS policies | 314 |
| Public triggers | 47 |
| Active Edge Functions | 19 |
| Auth users | 2 |
| Storage buckets | 4 |
| Storage objects | 53,130 |
| Existing Cloudflare migration manifest rows | 0 |

Largest estimated public tables include:

- `lms_curriculum_resource_packs`: 141,887 rows
- `lms_curriculum_assets`: 76,612 rows
- `lms_curriculum_library_items`: 63,768 rows
- `lms_curriculum_content_jobs`: 63,188 rows
- `lms_curriculum_asset_jobs`: 53,496 rows
- `lms_curriculum_library_topic_links`: 52,062 rows
- `lms_curriculum_topics`: 13,839 rows

Storage inventory:
- `phenom-curriculum-assets`: 53,128 objects; summed object metadata size approximately 92.5 MB.
- `media`: 2 objects; summed object metadata size approximately 2.2 MB.
- `profile-avatars` and `school-cbt-media`: currently 0 objects each.

These are inventory observations, not a completed backup or verified migration. The row figures for large tables are PostgreSQL planner estimates, and object metadata sizes are not a substitute for a byte-for-byte export/hash check. The current database size is below D1's paid per-database ceiling, but close to the D1 Free storage allowance before growth; a paid D1 target and growth headroom must be confirmed. D1 has SQLite semantics, a 10 GB paid per-database ceiling, a 2 MB maximum row size and a 100-column-per-table limit, so every schema object still needs compatibility checks.

The project has a broad PostgreSQL-specific surface: 171 tables, 67 SQL functions, 47 triggers and 314 policies. Porting these requires deliberate conversion of stored procedures, tenant/learner authorization, audit logic, transactions and data constraints. A blanket SQL syntax conversion would be unsafe.

## Target architecture

1. **Cloudflare Workers** — application API and server-side business logic. Browser code must not receive database credentials or privileged service tokens.
2. **Cloudflare D1** — candidate relational store for application and curriculum records, subject to schema-compatibility and total-size gates. D1 is SQLite-based; do not assume PostgreSQL functions, triggers, RLS policies, extensions or SQL will run unchanged. If the measured database or required transactional behaviour cannot fit safely, use a non-Supabase PostgreSQL service accessed through Cloudflare Hyperdrive rather than force an unsafe D1 conversion. Either route must remove Supabase from production runtime.
3. **Cloudflare R2** — durable object storage for curriculum assets, media, avatars and generated artefacts, with private-by-default access and short-lived authorised downloads where appropriate.
4. **Cloudflare Queues / Workflows** — durable background work with retries, idempotency and a dead-letter path.
5. **Durable Objects or a deliberately chosen equivalent** — realtime conversations, presence and WebSocket coordination if the current feature audit confirms they are needed.
6. **Authentication** — replace Supabase Auth with a maintained authentication implementation compatible with the selected Cloudflare database. Preserve user UUIDs and role mappings where possible; test email/password, Google OAuth, email verification/recovery, session expiry and role changes. Do not build ad-hoc password handling.
7. **Authorization** — reimplement every material RLS rule as server-enforced, tested authorization. Never rely on hidden UI controls or user-editable metadata for permissions.
8. **AI and payments** — move Edge Function responsibilities into independently authenticated Worker endpoints. Keep provider credentials server-side. Payment webhooks must retain provider signature verification and idempotency.

## Migration phases and exit gates

### Phase 0 — Freeze scope and inventory (current)
- Preserve the source branch and production database.
- Map every browser import, route, RPC, table, SQL function, trigger, RLS policy, storage bucket, Edge Function, webhook, cron and realtime subscription.
- Measure actual database size and per-table byte/row counts; export schema and data through a supported client-side route.
- Establish a recoverable backup and baseline counts/checksums.
- Record Cloudflare account resources and existing Workers without assuming a generic welcome email means resources are deployed.

**Gate:** inventory and backup are verified; no production writes have been changed.

### Phase 1 — Cloudflare foundations
- Provision the target database and R2 resources in the actual Cloudflare account.
- Add versioned D1 migrations or a versioned PostgreSQL schema, Worker bindings, local test fixtures and CI checks.
- Implement health checks, structured logs, request IDs, rate limits, CORS/CSRF rules as applicable, secret handling and API validation.
- Add a migration ledger/checkpoint system outside the old Supabase manifest.

**Gate:** the replacement API runs in staging with no production data mutation.

### Phase 2 — Identity and authorization
- Port profiles, account categories, onboarding, roles and stable user IDs.
- Migrate or reset credentials through a secure supported process; do not export plaintext passwords.
- Port tenant isolation, student/parent/teacher scope, admin restrictions and audit trails.
- Test denied access as thoroughly as allowed access.

**Gate:** automated tests demonstrate no cross-school, cross-learner or unauthorised admin access.

### Phase 3 — Curriculum and learning records
- Port curriculum catalogue, levels, subjects, topics, sources, requirements, resource packs, library links, course/lesson records, assignments, quizzes, attempts, progress and certificates.
- Convert all SQL RPCs, triggers and transaction-dependent logic into reviewed database operations or Worker services.
- Migrate data in restartable batches with source IDs preserved, per-batch counts and checksums.
- Keep large files in R2 rather than bloating relational rows.

**Gate:** counts, relationships, sample records, curriculum quality-control states and representative user journeys reconcile.

### Phase 4 — Storage, AI, payments, communication and school operations
- Copy all 53,130 source objects to R2; verify size and SHA-256 per object before switching references.
- Port AI routing, quiz generation/submission, admin functions, invitations, email, result release, translation, payments and webhooks.
- Port school management, attendance, assessment, results, finance, HR and record-retention controls.
- Port realtime/community features only after feature usage and privacy semantics are inventoried.

**Gate:** each endpoint has positive and negative tests; payment signatures and replay protection pass; private files are inaccessible without authorisation.

### Phase 5 — Cutover and Supabase removal
- Run a read-only shadow comparison, then a controlled write freeze or dual-write window with explicit reconciliation.
- Switch production traffic only after data and security gates pass.
- Remove the Supabase JS dependency, `VITE_SUPABASE_*` settings, hard-coded fallback URL/key, Supabase Edge Function calls and all `supabase.co` runtime references.
- Search the built output and repository for residual runtime dependencies.
- Keep the old project read-only for a rollback window; only archive or delete it after explicit acceptance and a verified final backup.

**Definition of done:** production journeys work on the new backend, security tests pass, data reconciliation is signed off, monitoring/restore procedures exist, and no application runtime depends on Supabase.

## Additional live schema assessment committed on the working branch

- `docs/architecture/LIVE-SUPABASE-SCHEMA-INVENTORY.md` captures the 171 public tables, 1,699 columns, primary keys, planner-estimated rows, relation sizes, 215 foreign-key relationships, 314 complete RLS policy definitions, 67 public function signatures, 47 trigger-event definitions and RLS status.
- `docs/architecture/D1-COMPATIBILITY-ASSESSMENT.md` records PostgreSQL type frequencies, the four public views, extensions and D1 conversion risks. The initial inspection found no public base table without a declared primary key. That does not eliminate the need to validate composite-key pagination, constraints and exact row counts.
- `docs/architecture/SQL-FUNCTION-TRIGGER-PORTING-REVIEW.md` records all 67 public function signatures, security-definer prevalence and compatibility markers for 47 trigger-event entries.
- `docs/architecture/EDGE-FUNCTION-MIGRATION-INVENTORY.md` inventories all 19 deployed Edge Functions, their current JWT-gateway settings, tables/RPCs touched and authentication/webhook review requirements.
- `docs/architecture/RLS-AUTHORIZATION-PORTING-REGISTER.md` records policy counts and identifies unconditional policies requiring contextual review. No live policies were changed.
- `docs/architecture/VIEW-PORTING-REVIEW.md` records all four public view definitions and highlights visibility/quiz-answer considerations.
- `docs/architecture/SUPABASE-MIGRATION-HISTORY.md` captures the 107 migration versions recorded by the live project; the latest is `cloudflare_background_job_claims` (2 October 2026).
- `cloudflare/migration-api/src/index.ts` adds a protected, not-yet-deployed migration control API for run tracking and R2-native SHA-256/size verification. Its setup and deployment blockers are documented in `cloudflare/migration-api/README.md`.
- `scripts/migration/audit-supabase-dependencies.mjs` and `npm run audit:supabase` add a read-only static code scanner to find remaining runtime dependencies as the app is ported.
- The inventory is metadata only; no full production data export or backup has yet been verified.

## Migration-control foundation committed on the working branch

`cloudflare/migrations/0001_migration_control.sql` creates D1-compatible run, object and record manifests. It supports restartable batches and records hashes/counts, and enforces that a source object cannot be marked deleted before destination verification. The SQL syntax and the delete-before-verify guard were tested against SQLite locally. This is migration tooling only; it has not been applied to a live D1 database because a D1 target has not yet been provisioned through the available connections.

## Source-project quota gate

The owner received a Supabase organisation egress-quota notice reporting 16.57 GB against a 5.5 GB quota, with project requests dropped until the quota refills on 16 October 2026. Do not start a bulk export or 53,130-object transfer until service availability and the quota state are confirmed, or the plan/quota has been deliberately changed. Continue with repository-side migration engineering and non-invasive metadata review in the meantime. No bulk data export or file copy has been performed.

## Immediate next work

1. Complete the route/service-to-table/RPC mapping and extract the full definitions/bodies of every function, trigger and view.
2. Export and measure the actual database before locking in D1 versus a non-Supabase PostgreSQL destination.
3. Audit the 19 deployed Edge Functions and both Cloudflare worker directories, then define one canonical API/worker layout.
4. Implement the first vertical slice on a migration branch and test it before touching production traffic.

## Safety rules

- Never commit secrets, service-role keys, OAuth secrets, webhook signing keys or user credentials.
- Never disable RLS, triggers, old workers or the old backend merely to make a test pass.
- Never mark a storage object migrated until its destination object is verified.
- Never claim migration completion based only on successful deployment; test the actual user journeys and data.
