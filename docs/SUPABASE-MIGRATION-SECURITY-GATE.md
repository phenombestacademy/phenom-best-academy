# Supabase security gate for the Cloudflare exit

Checked: 11 October 2026 against project `hajrdejlamuiqjjhdnsv`.

This report is a review gate, not an automatic security change. No production Supabase schema, grants, functions, data, or storage were changed by this review.

## Critical finding: migration manifest RLS

The Supabase security advisor reports Row Level Security disabled on `public.cloudflare_migration_manifest`. The table currently has zero rows. The current role-grant inspection showed table privileges for `postgres` and `service_role`, but none for `anon` or `authenticated`. Still, enable RLS as defence in depth before storing migration state in it.

Suggested SQL for an authorised operator to review and run:

```sql
ALTER TABLE public.cloudflare_migration_manifest ENABLE ROW LEVEL SECURITY;
```

Do not add broad client policies. The migration-control table should remain server-side only. The service role bypasses RLS; keep its key server-side and never place it in browser code. Verify intended service-role access and table grants after the change.

## Seven SECURITY DEFINER functions with anon EXECUTE

The security advisor and read-only privilege query identified these public-schema functions as executable by `anon` while marked SECURITY DEFINER:

- `public.get_my_phenom_user_id()`
- `public.lookup_auth_email_by_phenom_user_id(p_phenom_user_id text)`
- `public.mark_message_assignment_retained(p_message_id uuid)`
- `public.purge_expired_ephemeral_communications()`
- `public.subscribe_email(p_email text)`
- `public.sync_curriculum_asset_to_library()`
- `public.verify_lms_certificate(p_code text)`

This is a review finding, not proof that each function is exploitable. Review each function body, search_path, data returned, side effects, and intended public use before changing privileges. In particular, email subscription and public certificate verification may have legitimate anonymous use cases; identity lookup and state-changing/maintenance functions need especially careful review.

Recommended review sequence:
1. Retrieve and inspect each function definition and its dependencies.
2. Confirm whether anonymous invocation is required by the product.
3. For functions not intended as public APIs, revoke EXECUTE from PUBLIC/anon and grant only to the required role; verify dependent triggers and application paths.
4. For functions intentionally public, enforce strict input validation, fixed safe search_path, minimal returned data, and narrowly bounded effects.
5. Re-run Supabase security advisors and end-to-end tests after any approved change.

Do not run blanket revocations against all seven without checking their usage; that could break existing product functionality.

## Performance advisory

Supabase performance advisors report 196 foreign-key constraints without covering indexes. This is a broad optimisation backlog, not a migration blocker by itself. Prioritise indexes using query plans and real query patterns, then benchmark before applying batches. Avoid creating hundreds of indexes without checking write overhead and duplicate/existing indexes.

## Migration safety status

- Cloudflare D1 migration-control schema exists in GitHub but has not been verified as applied to a live D1 database.
- Supabase `cloudflare_migration_manifest` is empty.
- No production data export, D1 import, or R2 object copy was performed in this review.
- Keep Supabase as the production system of record until Cloudflare data reconciliation, authentication, permissions, payment/webhook, learner/school/admin workflows, and rollback tests all pass.
