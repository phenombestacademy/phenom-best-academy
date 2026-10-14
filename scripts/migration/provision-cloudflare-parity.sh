#!/usr/bin/env bash
set -euo pipefail

# Provision the Cloudflare resource layer for the Phenom Best Academy Supabase exit.
# Requires Node.js/npm and an authenticated Cloudflare session: npx wrangler login.
# Run from the repository root. No source data is copied and no production service
# is disabled by this script.
#
# IMPORTANT: Existing resources may already exist in the target Cloudflare account.
# Check the account and list resources first. If a create command reports that a
# resource exists, inspect it and reuse it only after confirming ownership/config.

echo "Target: Cloudflare account currently selected by Wrangler"
npx wrangler whoami

echo "Creating dedicated D1 target database..."
npx wrangler d1 create phenom-best-lms

echo "Creating R2 buckets mapped to the four source Supabase Storage buckets..."
npx wrangler r2 bucket create phenom-media
npx wrangler r2 bucket create phenom-curriculum-assets
npx wrangler r2 bucket create phenom-profile-avatars
npx wrangler r2 bucket create phenom-school-cbt-media

echo "Creating job queue and dead-letter queue..."
npx wrangler queues create phenom-best-lms-jobs
npx wrangler queues create phenom-best-lms-jobs-dlq

cat <<'EOF'

Provisioning commands submitted. Capture the D1 database_id printed by Wrangler
and add it to the dedicated migration Worker configuration as a D1 binding.

Next, validate locally before remote execution:
  npx wrangler d1 execute phenom-best-lms --local --file=cloudflare/migrations/0001_migration_control.sql
  npx wrangler d1 execute phenom-best-lms --local --file=cloudflare/migrations/0002_application_table_catalogue.sql

This schema catalogue is an initial structural scaffold, not a complete conversion:
PostgreSQL constraints, foreign keys, indexes, RLS policies, functions, triggers,
views, auth, and complex defaults still require reviewed conversions and tests.
Do not deploy this as a production backend or start copying learner data until
those gates pass. This script does not upload/copy any Supabase data or objects.
EOF
