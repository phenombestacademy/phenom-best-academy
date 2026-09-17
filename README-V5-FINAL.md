# Phenom Best Academy — V5 Final Integration

V5 is the complete World-Class Academy project with the V4 production activation integrated into the full application.

## Included
- Complete Academy public site and platform routes from the World-Class base.
- V4 Supabase integration for authentication/profile onboarding, subscriptions, payments, notifications, email subscription, CMS/branding and AI routing.
- Supabase Edge Functions for quiz generation/submission, payments, Flutterwave webhook, result comments, AI routing, admin directory, role delegation and admin email.
- Google OAuth flow through Supabase Auth. Google credentials remain in Supabase/Google configuration and are never embedded in source.
- Customer-facing AI features remain branded as Academy tools; provider names and provider credentials are server-side only.
- Subscription access is tied to the signed-in Supabase user and subscription records; plan/feature data lives in Supabase.

## Super Admin role delegation
- The private `/admin` and `/admin-learning` areas require the signed-in `super_admin` role.
- The Super Admin can delegate `admin`, `staff`, `parent` or `user` roles through the protected role-management control. The browser control cannot assign `super_admin`.
- The V4 activation SQL includes a database-level guard for at most one `super_admin`. Apply the activation SQL before relying on the control centre.

## Security
- Only the Supabase publishable/anon key belongs in browser configuration.
- Never commit service-role, payment, AI or email secrets.
- Keep all provider secrets in Supabase Edge Function secrets / hosting environment variables.

## Deployment
1. Use the complete V5 ZIP as the project source.
2. Install dependencies and run typecheck/build.
3. Apply the base schemas followed by activation V1 and activation V4 SQL as required by the existing project state.
4. Deploy/update the Edge Functions included in this project, including `manage-user-role`.
5. Configure Google OAuth in Supabase Auth and Google Cloud.
6. Configure payment, AI and Resend secrets server-side.
7. Set the production Site URL and redirect URLs.

See DEPLOYMENT-ACTIVATION-GUIDE-V4.md for the detailed provider checklist.

## Subscription activation note
Flutterwave's verified webhook now converts successful qualifying premium payment orders into active subscription records. Paystack, Stripe and Interswitch still require their respective production webhook/verification endpoints to be configured before they can automatically grant subscription entitlements.
