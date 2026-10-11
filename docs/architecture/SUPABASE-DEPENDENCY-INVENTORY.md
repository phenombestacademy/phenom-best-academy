# Supabase Dependency Inventory — Initial Code and Runtime Audit

This is an initial migration inventory, not a declaration that every dependency has been discovered. Expand it as route-by-route and SQL-function review continues.

## Browser application dependencies

| Source | Current Supabase responsibilities | Replacement requirement |
|---|---|---|
| `src/lib/cms.ts` | Creates the browser Supabase client; has a hard-coded fallback project URL and publishable/anon key; reads/writes site settings, payment provider settings and media records; uploads media to Storage using TUS; local browser fallbacks exist for some settings/media. | Replace with a same-origin Cloudflare API client and authorised R2 upload/download flows. Remove the hard-coded fallback and Supabase package after all callers are migrated. |
| `src/lib/platform.ts` | Auth sessions, Google OAuth, email OTP, password sign-in/reset/update, profile creation/read/update, preferred and learning locales, parent/child links, subscription reads and school-membership activation RPC. | Replace Auth with a maintained Cloudflare-compatible auth implementation; preserve stable user IDs; implement role/tenant checks server-side. |
| `src/lib/ai.ts` | Invokes the `ai-router` Edge Function. | Move AI routing to a Worker endpoint with server-side secrets, rate limits and audit controls. |
| `src/lib/quiz.ts` | Invokes `generate-quiz` and `submit-quiz`; reads generated questions. Includes a local fallback path that is not a replacement for persistent authoritative attempts. | Port quiz generation/submission, grading, attempt policy and result persistence to the API. |
| `src/lib/school.ts` | Reads school membership/dashboard data; invokes school creation RPC, quiz functions and result-comment function. | Port school-scoped reads/writes and the underlying business rules; preserve tenant boundaries. |
| `src/lib/learning.ts` | Reads/writes `learning_programmes`; also keeps a local programme catalogue fallback. | Port the authoritative programme catalogue and publishing workflow; retain local fallback only where explicitly intended. |
| `src/lib/notifications.ts` | Reads/writes announcements, subscribes emails through an RPC and reads/marks user notifications. | Port announcements, opt-in validation, notification privacy and delivery. |
| `src/routes/chat.tsx` | Direct table access for conversations/messages/friend requests and classmate lookup RPC; Supabase Realtime broadcast/signalling; WebRTC voice/video; ephemeral file transfer in the browser. | Port conversation/member authorization and classmate lookup to the API; replace Realtime signalling with an intentionally designed Durable Object/WebSocket service; retain the existing no-recording/ephemeral privacy intent. |
| `src/routes/community.tsx` | Profiles and friend requests, call-consent records, Realtime call broadcasts and WebRTC calls. | Port user directory privacy, friend-request policy, consent/version records and authenticated signalling. |
| `src/routes/signin.tsx`, `src/routes/account.tsx` | Direct auth and identity lookup RPCs, OTP/password recovery and profile onboarding. | Port end-to-end identity journeys, including recovery and OAuth callback handling; test against migrated account IDs. |
| Admin and school routes | Additional direct data access and RPCs for CMS, users, school operations, learning content, results, subscriptions and payments. | Complete per-route mapping before deleting the client library; never infer authorization from UI visibility. |

## Direct source-code mapping pass

A read-only pass over 62 TypeScript/TSX files under `src/lib`, `src/routes` and `src/components` identified these additional direct dependencies. The route list is not a substitute for runtime tests; helper-mediated access is attributed to the library that performs it.

### Component-level data access

- `src/components/curriculum-browser.tsx`: `lms_curriculum_levels`, `curriculum_subject_catalogue`, `lms_curriculum_topics`.
- `src/components/tertiary-programme-browser.tsx`: `lms_tertiary_programme_catalogue`.
- `src/components/site-shell.tsx`: auth-state/session events.

### Route-level data access

- `src/routes/admin-control.tsx`: `profiles`, `safety_alerts`, `moderation_reports`, `payment_orders`, `service_enquiries`, `premium_service_grants`.
- `src/routes/admin.tsx`: `cms_content_blocks`; Edge Functions `send-admin-email`, `admin-directory`, `manage-user-role`.
- `src/routes/chat.tsx`: `conversation_members`, `conversations`, `friend_requests`, `profiles`, `messages`, `conversation_member_restrictions`; RPC `get_classmates`; Realtime channels.
- `src/routes/community.tsx`: `profiles`, `friend_requests`, `service_consents`; Realtime channels.
- `src/routes/account.tsx`: RPC `lookup_phenom_profile` plus Auth flows.
- `src/routes/signin.tsx`: RPC `lookup_auth_email_by_phenom_user_id`.
- `src/routes/parent.tsx`: RPC `parent_child_summary`.
- `src/routes/payments.tsx`: Edge Function `create-payment`.
- `src/routes/tools.tsx`: RPC `has_premium_access`; Edge Function `ai-router`.
- `src/routes/schools.tsx`: direct access to `schools`, `media`, `school_members`, `profiles`, `student_school_records`, `class_members`, `student_guardians`, `school_classes`, `academic_subject_catalog`, `school_curricula`, `school_subjects`, `student_attendance`, `school_assignment_tasks`, `school_cbt_exams`, `school_cbt_exam_questions`, `school_cbt_exam_media`, `school_cbt_question_resources`, `school_cbt_exam_assignments`, `student_result_entries`, `school_result_publications`, `school_fee_payments`, `staff_records`, `payroll_runs` and `school_elections`. It also calls RPCs `promote_student`, `is_class_teacher_for`, `list_school_lms_assessment_sources`, `get_student_assignment_items`, `submit_school_assignment`, `get_teacher_assignment_items`, `update_school_assignment_item`, `create_school_assignment_from_lms_quiz`, `super_admin_delete_result_entry`, and Edge Functions `school-member-invite` and `send-result-release`. Storage use includes `school-cbt-media` and `media`.

### Additional RPC names discovered

`subscribe_email`, `lookup_phenom_profile`, `activate_school_membership_for_current_user`, `create_school_for_current_user_v2`, `get_classmates`, `lookup_auth_email_by_phenom_user_id`, `parent_child_summary`, `has_premium_access`, `promote_student`, `is_class_teacher_for`, `list_school_lms_assessment_sources`, `get_student_assignment_items`, `submit_school_assignment`, `get_teacher_assignment_items`, `update_school_assignment_item`, `create_school_assignment_from_lms_quiz`, `super_admin_delete_result_entry`.

The final mapping must de-duplicate these against the full live SQL-function register and capture every RPC invoked indirectly by helpers, triggers, other SQL functions and Edge Functions.

## Deployed Edge Functions observed

The connected project reported 19 active functions:

- `admin-directory`
- `ai-router`
- `create-payment`
- `curriculum-asset-worker`
- `curriculum-content-worker`
- `curriculum-ingest`
- `curriculum-iqa-worker`
- `flutterwave-webhook`
- `generate-quiz`
- `generate-result-comment`
- `manage-user-role`
- `payment-webhook`
- `phenom-library-upload`
- `school-member-invite`
- `send-admin-email`
- `send-result-release`
- `send-welcome-email`
- `submit-quiz`
- `translate-ui`

Webhook functions must retain provider signature verification, replay/idempotency controls and safe retry behaviour. JWT verification settings differ by function; each endpoint must be reviewed individually before recreating its route. No function should be made public simply because the replacement URL is different.

## Storage

| Supabase bucket | Objects observed | Migration handling |
|---|---:|---|
| `phenom-curriculum-assets` | 53,128 | Batch copy to R2; preserve logical keys/references; verify SHA-256 and byte count. |
| `media` | 2 | Copy and verify; preserve publication metadata. |
| `profile-avatars` | 0 | Create equivalent private/public policy only if needed; no objects to transfer in current inventory. |
| `school-cbt-media` | 0 | Confirm intended access policy and whether the feature is used before enabling it in R2. |

The application also uses Storage for browser-uploaded CMS media and profile avatars. R2 object keys should not be treated as public URLs by default. Use signed or Worker-authorised access where content is private.

## Cloudflare worker dependencies already present

- `cloudflare/src/index.ts` still calls the Supabase REST API for curriculum content jobs and topics, and calls the Supabase `ai-router` function. Its R2 write is a secondary copy, not a full backend migration.
- `cloudflare/wrangler.jsonc` declares a content queue, dead-letter queue and R2 bucket, but the cron trigger list is empty. Do not assume those resources have been deployed or bound.
- `workers/curriculum` is a separate implementation area. Review its responsibilities before combining workers to avoid duplicate consumers or conflicting job claims.
- The live `public.cloudflare_migration_manifest` currently contains zero rows, so it does not prove that any object or record has already been migrated.

## Database responsibilities requiring explicit conversion

The live project inventory reported 171 public tables, 67 public SQL functions, 47 public triggers and 314 RLS policies. The migration must inventory and classify every function, trigger and policy by feature, then replace it with one of:

1. a supported D1/SQLite constraint, index or trigger;
2. reviewed Cloudflare Worker business logic and parameterised SQL;
3. an intentional architecture change with a documented security/test rationale.

Do not mechanically translate `auth.uid()`, `SECURITY DEFINER`, PostgreSQL JSON/array behaviour, RPCs or RLS expressions. D1 does not provide PostgreSQL RLS, so every data-access route must enforce the equivalent user, school, student, parent, teacher and admin scope on the server.

## Required next inventory pass

- List every browser table/RPC/function/storage/realtime reference across all routes and components.
- Extract table columns, keys, constraints, indexes, functions, triggers and policies from the live schema.
- Record dependencies for every SQL function and trigger, including which tables and Edge Functions call them.
- Classify each table as core identity, school operations, curriculum/library, communication, commerce, analytics/audit or temporary job state.
- Record exact counts and stable primary keys for each data table before export.
- Verify the actual Cloudflare account has the intended D1, R2, Queues and Worker resources before a migration run.
