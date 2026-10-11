# Supabase Edge Function Migration and Security Inventory

Read-only inspection of all 19 active Edge Functions in project `hajrdejlamuiqjjhdnsv` on 11 October 2026. This document records metadata and code-pattern findings; it does not copy the deployed function source into GitHub or change deployed functions.

## Function register

| Function | Deployed version | Supabase JWT gateway verification | Tables accessed directly | RPCs | Wildcard CORS | Auth-related checks | Signature/HMAC code |
|---|---:|---|---|---|---|---|---|
| `admin-directory` | 3 | Enabled | `profiles` | — | Yes | Yes, inspect exact control flow | No common signature marker detected |
| `ai-router` | 17 | Disabled — function must authenticate its own caller | — | — | Yes | Yes, inspect exact control flow | No common signature marker detected |
| `create-payment` | 4 | Enabled | `payment_orders` | — | Yes | Yes, inspect exact control flow | No common signature marker detected |
| `curriculum-asset-worker` | 14 | Disabled — function must authenticate its own caller | `lms_curriculum_assets`, `lms_curriculum_topics`, `lms_curriculum_levels`, `lms_curriculum_resource_packs`, `lms_curriculum_asset_jobs`, `lms_curriculum_library_items` | `claim_curriculum_asset_jobs` | No pattern detected | Yes, inspect exact control flow | No common signature marker detected |
| `curriculum-content-worker` | 9 | Disabled — function must authenticate its own caller | `lms_curriculum_topics`, `lms_curriculum_content_jobs`, `lms_curriculum_resource_packs`, `curriculum_catalogue` | — | No pattern detected | Yes, inspect exact control flow | No common signature marker detected |
| `curriculum-ingest` | 3 | Enabled | `profiles`, `lms_curriculum_sources`, `lms_curriculum_topics`, `lms_curriculum_ingestion_runs` | — | Yes | Yes, inspect exact control flow | No common signature marker detected |
| `curriculum-iqa-worker` | 6 | Disabled — function must authenticate its own caller | `lms_curriculum_topics`, `lms_curriculum_resource_packs`, `lms_curriculum_quality_reviews` | — | No pattern detected | Yes, inspect exact control flow | No common signature marker detected |
| `flutterwave-webhook` | 4 | Disabled — function must authenticate its own caller | `payment_orders`, `subscription_plans`, `subscriptions` | — | No pattern detected | No common auth marker detected | Yes, inspect exact control flow |
| `generate-quiz` | 4 | Enabled | `learning_quizzes`, `quiz_questions` | — | Yes | Yes, inspect exact control flow | No common signature marker detected |
| `generate-result-comment` | 4 | Enabled | — | — | Yes | Yes, inspect exact control flow | No common signature marker detected |
| `manage-user-role` | 3 | Enabled | `profiles`, `audit_logs` | — | Yes | Yes, inspect exact control flow | No common signature marker detected |
| `payment-webhook` | 3 | Disabled — function must authenticate its own caller | `payment_orders`, `subscriptions` | — | No pattern detected | No common auth marker detected | Yes, inspect exact control flow |
| `phenom-library-upload` | 4 | Disabled — function must authenticate its own caller | `lms_curriculum_assets`, `lms_curriculum_library_items` | — | No pattern detected | No common auth marker detected | Yes, inspect exact control flow |
| `school-member-invite` | 4 | Enabled | `profiles`, `school_members`, `school_member_invites` | `is_school_admin_for`, `is_super_admin` | No pattern detected | Yes, inspect exact control flow | No common signature marker detected |
| `send-admin-email` | 3 | Enabled | `profiles`, `email_subscribers` | — | Yes | Yes, inspect exact control flow | No common signature marker detected |
| `send-result-release` | 4 | Enabled | `profiles`, `school_result_publications`, `school_members`, `result_release_notifications` | — | Yes | Yes, inspect exact control flow | No common signature marker detected |
| `send-welcome-email` | 3 | Enabled | `profiles` | — | Yes | Yes, inspect exact control flow | No common signature marker detected |
| `submit-quiz` | 3 | Enabled | `quiz_questions`, `quiz_attempts` | — | Yes | Yes, inspect exact control flow | No common signature marker detected |
| `translate-ui` | 10 | Enabled | `profiles`, `ui_translation_resources` | — | Yes | Yes, inspect exact control flow | No common signature marker detected |

## Initial priority findings

### 1. JWT verification disabled on seven functions

The current gateway setting is disabled for:

- `ai-router` (deployed version 17)
- `curriculum-asset-worker` (deployed version 14)
- `curriculum-content-worker` (deployed version 9)
- `curriculum-iqa-worker` (deployed version 6)
- `flutterwave-webhook` (deployed version 4)
- `payment-webhook` (deployed version 3)
- `phenom-library-upload` (deployed version 4)

This can be appropriate for webhooks and machine-to-machine workers, but each endpoint must implement an independent, strong authentication or signature check. Do not carry over `verify_jwt=false` by default when moving endpoints to Workers.

- `ai-router`: the code has its own authentication routine and supports a worker token, but it also checks configured publishable/anonymous keys. Those keys are intentionally public in browser apps. Before moving it, decide which workflows may be called by end users, require authenticated user identity or a scoped server-issued token, add rate/cost limits, and prevent privilege escalation through caller-supplied workflow fields. The current wildcard CORS header is not an authentication control.
- `curriculum-asset-worker`, `curriculum-content-worker`, and `curriculum-iqa-worker`: code checks a shared key or worker token. Preserve secret-only access, rotate credentials for the new service, and ensure browser clients cannot call these job runners directly.
- `flutterwave-webhook` and `payment-webhook`: gateway JWT is not suitable for third-party webhooks; verify the provider signature/hash against the raw request body as required by the provider, compare in constant time where feasible, and make event processing idempotent.
- `phenom-library-upload`: verify the current upload-specific authentication, file limits, object-key ownership and metadata updates before replacing it.

### 2. Wildcard CORS appears in multiple functions

Wildcard CORS was detected in these function implementations:

- `admin-directory`
- `ai-router`
- `create-payment`
- `curriculum-ingest`
- `generate-quiz`
- `generate-result-comment`
- `manage-user-role`
- `send-admin-email`
- `send-result-release`
- `send-welcome-email`
- `submit-quiz`
- `translate-ui`

Wildcard CORS is not automatically an exploit by itself, but it expands which browser origins can attempt requests. Replace it with a deliberate origin allowlist where cookie/session credentials or privileged operations are involved. Keep CORS and authorization as separate controls.

### 3. Payments and role administration are high-integrity flows

- `create-payment`, `payment-webhook` and `flutterwave-webhook` touch payment orders and subscriptions. Preserve signature checks, amount/currency/reference validation, replay protection and idempotency.
- `manage-user-role`, `admin-directory`, `school-member-invite`, `send-admin-email` and `send-result-release` need explicit server-side role checks and audit events. Do not substitute UI-only checks for the existing database authorization rules.

### 4. Curriculum workers rely on atomic PostgreSQL RPCs

- `curriculum-asset-worker` calls `claim_curriculum_asset_jobs`.
- `school-member-invite` calls `is_school_admin_for` and `is_super_admin`.

The first is a concurrency-sensitive job claim and must be replaced with an atomic queue/job claim. The membership RPCs need equivalent, tested school-scope and admin checks. The full function/trigger report contains the wider PostgreSQL function inventory.

### 5. Source code and secrets

A basic scan of the deployed function source did not find common hard-coded provider-key patterns. This is not a guarantee that no secret is embedded: verify all deployed environment variables and rotate any credential whose history or exposure is uncertain. Do not export environment values or secrets into GitHub.

## Migration acceptance checklist for every endpoint

- Explicit caller identity and authorization model documented.
- JWT or webhook signature verification deliberately chosen and tested.
- Request schema validation, body size limits, timeouts and rate limits.
- Server-only provider/database credentials.
- Tenant/user ownership checks and negative tests.
- Idempotency and retry behaviour for writes, webhooks and queued jobs.
- CORS allowlist reviewed separately from authentication.
- Logs redact access tokens, email OTPs, payment data and private learner data.
- Replacement route tested in staging before production traffic moves.

## Important scope note

No Edge Function was changed, redeployed or disabled during this inventory. The next porting work should proceed in dependency order: shared auth/authorization primitives, queue claim semantics, quiz/learning data, then payments/webhooks and communication.
