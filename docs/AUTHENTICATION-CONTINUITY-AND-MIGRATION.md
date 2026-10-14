# Authentication continuity and account migration

Status: **foundation created; authentication is not yet cut over**.

## Non-negotiable continuity rule

Supabase Auth remains the live identity provider until the Cloudflare replacement has passed staging and cutover checks. Do not disable Supabase Auth, change production login configuration, delete users, invalidate sessions, or alter password credentials as part of this groundwork.

The LMS depends on existing logins and user identities. Database rows that refer to Supabase user UUIDs must retain a deterministic mapping to the new identity IDs; role and school membership data must remain attached to the correct person.

## Read-only source snapshot

A read-only aggregate query against project `hajrdejlamuiqjjhdnsv` on 14 October 2026 returned:
- 2 rows in `auth.users`;
- 1 row with a non-empty `encrypted_password` value;
- 2 rows with an email address;
- 0 rows with a phone number.

This is only an aggregate snapshot, not a full inventory of identities, providers, sessions, MFA factors, confirmation state or linked profile/tenant data. Recheck the counts immediately before any eventual export. Do not copy personal values or credentials into logs or this document.

## What the D1 foundation does

Migration `0003_auth_continuity_foundation.sql` creates:
- `app_users` — stable application identity and optional legacy Supabase UUID mapping;
- `auth_sessions` — hashed session-token storage, expiry and revocation;
- `auth_one_time_tokens` — hashed, purpose-limited verification/reset/sign-in tokens;
- `auth_security_events` — minimal security audit events.

The provisioning workflow applies this migration to the isolated migration D1. These tables are not yet a functioning login service and are not exposed as a public database API. No Supabase users have been imported.

## Password and session handling

- Never export plaintext passwords, raw session tokens, OTPs or recovery tokens.
- Supabase password hashes may be preserved only after confirming the exact hash format and compatibility with the chosen Cloudflare Worker verification implementation. Do not assume every account has a password hash or uses password authentication.
- For accounts whose existing authentication method cannot be migrated safely, use a verified account-recovery/password-reset journey rather than creating a replacement account or silently changing the login.
- Existing Supabase sessions will not automatically become valid Cloudflare sessions. Users must receive a controlled session transition, normally by signing in again or completing a verified recovery flow.
- Do not trust user-editable metadata for roles. Import roles and school memberships from authoritative records and enforce them server-side on every request.
- Never expose privileged D1 access, service credentials or password hashes to browser code.

## Required cutover sequence

1. Inventory all Auth users, linked identities/providers, email confirmation/MFA state, profile UUID references, roles, school memberships and relevant session expectations without logging personal data.
2. Decide and test a compatible password-hash verification strategy and a recovery path for accounts without a migratable password hash.
3. Implement login, logout, session renewal/revocation, verification, password reset, rate limits, account lockout and security audit events in Worker code.
4. Import users with stable ID mapping into isolated D1; reconcile user counts, linked profile/membership counts and role assignments.
5. Test both valid and invalid credentials, unverified accounts, disabled accounts, expired/revoked sessions, reset-token replay, tenant isolation and administrator permissions.
6. Run a staged user acceptance test. Keep Supabase Auth available and retain a documented rollback route.
7. Only after approval, change the application auth endpoint/configuration and perform a monitored cutover. Do not delete or disable the Supabase project as part of the same deployment.

## Acceptance gate

Authentication migration is complete only when existing users can regain access without identity duplication, all protected data retains its original owner/tenant boundaries, session/recovery security tests pass, and rollback has been exercised. The current D1 schema foundation alone does not meet this gate.
