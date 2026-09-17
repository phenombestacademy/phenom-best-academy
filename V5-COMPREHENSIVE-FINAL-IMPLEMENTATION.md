# Phenom Best Academy V5 Comprehensive Final — implementation notes

This package is the final source tree for the requested V5 comprehensive upgrade.

## Included
- School administration UI at `/schools` with dashboard, students, classes, subjects, attendance, assignments/LMS, CBT, results, fees, HR/payroll and elections sections.
- Consolidated academic subject catalogue from early childhood/primary through secondary streams and university disciplines.
- Super Admin-only Academy administration at `/admin` and `/admin-control`; public navigation does not expose the admin entry.
- Super Admin role assignment is deliberately limited to user/parent/staff/admin. A second Super Admin cannot be created by the application role tool, and the database trigger blocks duplicate Super Admin rows.
- CMS content blocks, media uploads, announcements, payment settings, global colour/gradient/pattern/image branding controls.
- Phenom Calculator with basic/scientific modes, persistent local calculation history, multi-snapshot OCR/AI processing (up to 10), verbatim text extraction, English-learning prompts, limited translation workflow through the AI router, and barcode creation/browser barcode detection where supported.
- AI image processing uses server-side provider credentials only; provider secrets are never placed in browser code.

## Manual activation still required
1. Apply the final SQL migration to the configured Supabase project. The `\\i` lines are for psql-style execution; in Supabase SQL Editor, paste/run the relevant schema files in order instead.
2. Deploy the Edge Functions from `supabase/functions/`.
3. Configure server-side AI provider secrets and model names in Supabase Edge Function secrets.
4. Configure Google OAuth in Supabase/Auth and Google Cloud.
5. Configure Paystack/Flutterwave/Stripe/Interswitch merchant credentials and production webhooks where used.
6. Confirm the designated Super Admin profile exists. The application does not expose a public Super Admin registration path.
7. In Super Admin Studio, upload the Academy's desired media/logo/backgrounds and save branding settings.

## Important scope note
The application provides a database-backed CMS content-block layer, but permanent application copy that remains hard-coded in individual React routes is not magically rewritten by a CMS field. Editing those specific baseline strings still requires a code change unless that route is refactored to consume a CMS block. This package does not falsely claim that every literal string in the source tree is editable from the browser.

Payments, OAuth and AI providers are integration-ready but require the external account configuration above before they can be called live.

## 2026-09-17 production hardening additions
- Supabase migrations 013_v5_comprehensive_final, 014_community_calls_and_premium_grants, and 015_subject_catalog_seed are applied to project `hajrdejlamuiqjjhdnsv`.
- Super Admin invariant: the database permits only one `profiles.role = 'super_admin'`. School administrators remain school-scoped through `school_members.role = 'school_admin'` and cannot be assigned the Super Admin role by the role-management function.
- Premium service grants: Super Admin can grant an individual service by email; grants bind to a matching account when it is created and are included in `has_premium_access`. Super Admin itself is treated as unlimited by that entitlement function.
- Community: friend requests now create a protected direct conversation when accepted. Voice/video calls use browser WebRTC with transient Realtime signalling; call media is not written to Academy database/storage. A short consent plus full policy is included in the app.
- Calculator: full-screen mode and a hide/show on-screen keyboard control are included.

### External activation still required
The available connected Supabase/GitHub controls do not expose a secure secret-entry endpoint for provider credentials or Google Cloud OAuth client secrets. No payment/API secret was invented or exposed. The payment Edge Function is deployed and reads production secrets only from Supabase server-side environment variables. Google OAuth is wired through Supabase Auth but the Google Cloud client configuration must be supplied in the Supabase/Google provider settings. Configure Paystack, Flutterwave, Stripe and Interswitch production credentials and their provider-specific webhook endpoints before enabling them in the Super Admin Studio.

The current database contains **zero Auth users and zero profiles**, so there is not yet an existing account that can truthfully be confirmed as the designated Super Admin. The single-Super-Admin trigger is in place so the first designated account can be assigned deliberately; no school account is automatically made Super Admin.
