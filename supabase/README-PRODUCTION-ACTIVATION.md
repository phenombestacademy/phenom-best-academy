# Production activation status

## Already applied/deployed
- Supabase migrations through `026_teacher_lms_and_cbt_permissions`.
- Existing V5 Edge Functions plus `manage-user-role`, `send-result-release`, and the generic `payment-webhook` (11 active functions total).
- `ai-router` and `create-payment` are refreshed.
- Database protections include school tenant boundaries, class/subject teacher scope, class-teacher attendance, result publication gates, immutable result entries, sensitive-record controls, premium grants and single-Super-Admin enforcement.

## Secrets you must supply securely
Never put these in GitHub, the ZIP, browser code or a chat message. Add them in Supabase Dashboard → Edge Functions → Secrets.

AI (only the provider(s) you actually use):
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`

Payments: use the production/live credentials supplied by each provider and their webhook signing secret(s):
- `FLW_SECRET_KEY`, `FLW_SECRET_HASH`
- `PAYSTACK_SECRET_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `INTERSWITCH_ACCESS_TOKEN`, `INTERSWITCH_MERCHANT_CODE`, `INTERSWITCH_PAY_ITEM_ID`, `INTERSWITCH_WEBHOOK_SECRET`

Result-release email: \`RESEND_API_KEY\`, \`ACADEMY_FROM_EMAIL\`.

## Google OAuth
1. In Google Cloud Console create/configure an OAuth Web client.
2. Add the Supabase Auth callback URL: `https://hajrdejlamuiqjjhdnsv.supabase.co/auth/v1/callback`.
3. In Supabase Auth → Providers → Google, enable Google and enter the Google Client ID and Client Secret.
4. Add your production website domain to the allowed redirect URLs/site URL in Supabase Auth.
5. Test a new account and confirm the profile/onboarding flow.

## Payment webhooks
- Flutterwave continues to use the deployed `flutterwave-webhook` function.
- Paystack, Stripe and Interswitch can use the deployed `payment-webhook` endpoint with `?provider=paystack`, `?provider=stripe`, or `?provider=interswitch`.
- Use the exact webhook signing/verification method and production endpoint settings required by the provider account.

## Super Admin
The database currently has no Auth users, so no email can yet be confirmed as the designated Super Admin. After creating your own account, provide the exact email address so the account can be explicitly promoted/verified as the one Super Admin. The database trigger prevents a second Super Admin.

## Result release
Schools keep results private while entry is in progress. Publication creates release-notification rows. The `send-result-release` function sends those notifications once the Resend secrets are configured.

## Community privacy
Text messages are normal communication records. Images/documents/shared videos are designed for ephemeral transfer and are not written to Academy media storage. Calls use WebRTC and are not recorded by the Academy.

## App stores / desktop
The website already has PWA metadata. Android APK, iOS app and Windows packaging should be built from the same application after the production web build is stable; store accounts, certificates/signing keys and store submissions are separate external steps.


## Do not expose secrets
If support staff, contractors or clients need help, give them role-limited access and never share Supabase secret keys, provider secret keys, webhook signing secrets, OAuth client secrets or database credentials.

## V5.2 privacy details
- Class teacher assignment is explicit on `school_classes.class_teacher_id`.
- Subject teaching is controlled by `class_subjects.teacher_id`.
- Students' sensitive health/guardian/contact data is separated from the ordinary student record and is restricted to school administration/Super Admin, with optional class-teacher access controlled by the school.
- Class teachers can record attendance; school administrators can view attendance but cannot enter or edit it.
- Result entries are inserted by the assigned subject teacher and locked against ordinary update/delete. Super Admin is the correction path.
- Class teachers can see the final-assessment components of their class while remaining unable to edit subjects they do not teach.
- Result publication is the visibility gate for students/parents; publication queues release emails.

## V5.5 global localisation and curriculum activation

V5.5 expands the UI locale catalogue and the verified curriculum reference catalogue. Configure at least one server-side AI provider secret (`OPENAI_API_KEY` or `GEMINI_API_KEY`) in Supabase Edge Function secrets for non-English UI translation. Do not place provider keys in GitHub, React source, or public environment variables.
