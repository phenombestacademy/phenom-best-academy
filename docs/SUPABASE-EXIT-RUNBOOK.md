# Phenom Best Academy — Supabase Exit Runbook

Status: migration implementation in progress; no production cutover has occurred.

## Critical security finding — 14 October 2026

The current Supabase inventory reports that `public.cloudflare_migration_manifest` has Row Level Security disabled. The Supabase advisor marks this critical because client roles may read or modify every row. Do not put secrets or sensitive migration data in this table.

Supabase's suggested remediation is:

```sql
ALTER TABLE public.cloudflare_migration_manifest ENABLE ROW LEVEL SECURITY;
```

This is deliberately not applied automatically: enabling RLS without appropriate policies can block legitimate migration-worker access. Review the intended server-only access model and apply a controlled migration with the required policy or service-role-only access design.

## Source project and observed inventory

Project: `hajrdejlamuiqjjhdnsv` — ACTIVE_HEALTHY, PostgreSQL 17.6.1.

Recorded inventory:
- 171 public base tables; 170 have RLS enabled and one (`cloudflare_migration_manifest`) does not.
- 314 public RLS policies, 67 public functions and 29 triggers.
- 4 Storage buckets and 53,130 Storage objects (53,128 in `phenom-curriculum-assets`, 2 in `media`).
- 2 Auth users.
- 18 active Edge Functions at inspection time.
- High-volume curriculum data includes 146,759 curriculum resource-pack rows, 63,188 content-job rows, 76,612 asset rows, 53,496 asset-job rows, 64,208 library-item rows, 53,444 topic links and 14,266 curriculum-topic rows. Counts must be refreshed and reconciled before cutover.

These are inventory snapshots, not proof that data has been exported or migrated.

## Repository and implementation state

Repository: `phenombestacademy/phenom-best-academy`
Branch: `feat/supabase-exit`
Draft PR: [#4 — Cloudflare Workers preview](https://github.com/phenombestacademy/phenom-best-academy/pull/4)

The TanStack Start hosting configuration is prepared for Cloudflare Workers. The application is NOT yet Supabase-independent: `src/lib/cms.ts` contains a hard-coded Supabase URL/key fallback and directly uses Supabase database, Auth and Storage APIs. The background Worker also uses Supabase REST/RPC. The active Edge Functions include CBT, payments/webhooks, user administration, email, curriculum ingestion and media/library processing. They all need replacement implementations and parity tests.

No Cloudflare account/deployment tool or authenticated Wrangler environment is available in the current session. No Cloudflare deployment, production DNS change or production data migration has occurred.

## Target architecture

The user's stated target is Cloudflare-native: Workers, D1, R2, Queues and appropriate Durable Objects/Workflows. D1 uses SQLite, so PostgreSQL schema, functions, triggers, RLS and transactions require reviewed conversion. A PostgreSQL dump cannot simply be imported as a complete D1 application.

## Required workstreams

1. Remove Supabase SDK calls and the hard-coded fallback from application and Worker code only as each replacement API is implemented and tested.
2. Convert every relevant table, view, constraint, index, function, trigger, extension dependency, grant, policy, sequence, job and webhook to the D1/Workers model.
3. Implement server-side authentication/session lifecycle and account recovery; preserve user IDs and school memberships.
4. Replace all RLS policies with tested server-side authorization, including tenant isolation and negative privilege tests.
5. Copy all Storage objects to R2 with metadata/path mapping and checksum reconciliation; replace signed URL and resumable upload workflows.
6. Port every active Edge Function, preserving JWT validation, payment webhook signatures, idempotency, retries, rate limits and response contracts.
7. Replace Realtime, scheduled jobs, queues and dead-letter handling; preserve idempotency and observability.
8. Move secrets to Cloudflare secrets/bindings; never commit credentials or expose private keys to browser bundles.
9. Reconcile all table rows and storage objects; run end-to-end CBT, marking, report-card, school billing/payment, invites, uploads/downloads and admin tests.
10. Deploy a separate preview, perform security/performance/restore tests, use a documented write-freeze or delta-sync strategy, then cut over DNS and observe a rollback window.
11. Decommission Supabase only after zero traffic is verified, backups and rollback are proven, and final approval is recorded.

## Acceptance gates

- [ ] Cloudflare account access and preview deployment verified.
- [ ] Full schema and authorization conversion reviewed.
- [ ] All rows and objects reconciled; no unexplained differences.
- [ ] Authentication, recovery and user-role mapping tested.
- [ ] Tenant isolation and privilege escalation tests pass.
- [ ] Every Edge Function and background job has a tested replacement.
- [ ] CBT, reports, billing/payments, invites and storage end-to-end tests pass.
- [ ] Logs, alerts, backups, restore test and rollback procedure verified.
- [ ] Production cutover and smoke tests pass.
- [ ] Zero production Supabase traffic observed for an agreed period.
- [ ] Supabase deletion only after separate explicit final approval.

Keep the live Supabase project intact until all gates pass.