# Phenom Best Academy — V5 Comprehensive Replacement Manifest

This package is the complete replacement project. Upload its contents to the repository root so the repository matches this package.

## Repository root structure
```text
.env.example
.gitignore
.prettierrc
DEPLOYMENT-ACTIVATION-GUIDE-V4.md
README-ACTIVATION-PATCH-V4.md
README-V5-FINAL.md
README.md
docs/PROGRAMME-CATALOGUE-AND-RECOGNITION.md
eslint.config.mjs
package.json
public/apple-touch-icon.png
public/brand/academy-logo-primary.png
public/brand/founder.jpg
public/brand/logo-clear.png
public/brand/logo-full-clear.png
public/brand/logo-name.png
public/brand/logo-on-dark.png
public/brand/logo-tight.png
public/brand/logo.png
public/brand/mark-clear.png
public/brand/mark.png
public/favicon.svg
public/icon-192.png
public/icon-512.png
public/og.jpg
public/site.webmanifest
src/components/brand-mark.tsx
src/components/branded-learning-sheet.tsx
src/components/branded-question.tsx
src/components/page-hero.tsx
src/components/service-icon.tsx
src/components/site-shell.tsx
src/lib/academy.ts
src/lib/ai.ts
src/lib/cms.ts
src/lib/currency.ts
src/lib/enquiries.ts
src/lib/error-component.tsx
src/lib/learning.ts
src/lib/moderation.ts
src/lib/notifications.ts
src/lib/platform.ts
src/lib/quiz.ts
src/lib/resources.ts
src/lib/school.ts
src/lib/utils.ts
src/routeTree.gen.ts
src/router.tsx
src/routes/__root.tsx
src/routes/about.tsx
src/routes/account.tsx
src/routes/admin-control.tsx
src/routes/admin-learning.tsx
src/routes/admin.tsx
src/routes/careers.tsx
src/routes/chat.tsx
src/routes/community.tsx
src/routes/contact.tsx
src/routes/cpd.tsx
src/routes/enquire.tsx
src/routes/index.tsx
src/routes/leadership.tsx
src/routes/learning.tsx
src/routes/legal.tsx
src/routes/media.tsx
src/routes/parent.tsx
src/routes/path.tsx
src/routes/payments.tsx
src/routes/platform.tsx
src/routes/programmes.tsx
src/routes/school-results.tsx
src/routes/schools.tsx
src/routes/subscriptions.tsx
src/routes/support.tsx
src/routes/tools.tsx
src/styles.css
supabase-schema-platform.sql
supabase-schema-school-results.sql
supabase-schema.sql
supabase/supabase-schema-activation-v1.sql
supabase/supabase-schema-activation-v4.sql
tsconfig.json
vite.config.ts
```

## Upload rule
1. Remove old files from the existing GitHub directories without deleting the directory structure if you prefer to keep it.
2. Upload the files from this package into the same repository root paths.
3. Overwrite matching old files.
4. Remove obsolete old files that are not present in this package.
5. Do not upload `.git`, `node_modules`, `dist`, `.env`, or other secret files.

## Included Edge Functions
- ai-router
- admin-directory
- create-payment
- flutterwave-webhook
- generate-quiz
- generate-result-comment
- send-admin-email
- submit-quiz

## Validation note
The package was structurally checked for required V5 files, empty files, and missing local source imports. A full dependency install/build could not be completed in the working environment because package installation timed out; therefore this package is not represented as a completed production build test.


## Final hardening additions
- `supabase/functions/manage-user-role/index.ts`: Super Admin-only role delegation for user/parent/staff/admin; Super Admin cannot be reassigned from the browser.
- `/admin-learning` now requires the signed-in Super Admin role before exposing catalogue editing controls.
