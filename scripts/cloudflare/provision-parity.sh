#!/usr/bin/env bash
set -euo pipefail

# Provisions the Cloudflare resource skeleton for Phenom Best Academy LMS.
# Run only after: npx wrangler login
# This creates resources; it does NOT copy Supabase data or port application logic.
# D1 schema migration is a separate, reviewed step.

ACCOUNT_NOTE="Use the Cloudflare account intended for Phenom Best Academy."
echo "$ACCOUNT_NOTE"

npx wrangler d1 create phenom-best-lms
npx wrangler r2 bucket create phenom-best-media
npx wrangler r2 bucket create phenom-best-curriculum-assets
npx wrangler r2 bucket create phenom-best-profile-avatars
npx wrangler r2 bucket create phenom-best-school-cbt-media
npx wrangler queues create phenom-best-lms-jobs
npx wrangler queues create phenom-best-lms-jobs-dlq

cat <<'EOF'

Resource skeleton requested:
- 1 D1 database, intended to contain the 171 public-table definitions in
  cloudflare/d1/migrations/0001_supabase_table_catalogue.sql
- 4 R2 buckets corresponding to the 4 Supabase Storage buckets
- 1 Cloudflare Queue and 1 dead-letter queue
- 18 Supabase Edge Function replacements still require implementation as Worker
  routes/handlers and security/contract tests; they are not created by this script.
- 67 PostgreSQL functions, 29 triggers and 314 RLS policies need conversion to
  tested D1 SQL/application logic. They are not safely interchangeable 1:1.

After the commands complete, copy the generated D1 database_id from Wrangler output
into wrangler.jsonc and add D1/R2/Queue bindings before running migrations or deploy.
Do not delete or disable Supabase until data and behaviour are reconciled and cutover
acceptance tests pass.
EOF
