# Phenom LMS Cloudflare Background

Cloudflare Worker + Queues + R2 background processing for the Phenom LMS.

## Architecture

- **Vercel**: Phenom user-facing application.
- **Supabase**: PostgreSQL, Auth, RLS and transactional LMS records.
- **Cloudflare Workers**: background curriculum orchestration.
- **Cloudflare Queues**: durable curriculum job delivery, batching and retries.
- **Cloudflare R2**: large generated curriculum artefacts and future migrated assets.

Supabase remains the system of record. Do not delete existing curriculum jobs or disable the Supabase workers until Cloudflare processing has been deployed and verified.

## Current migration phase

The first Cloudflare phase moves **curriculum content-job orchestration** to Workers + Queues.

Supported content jobs:
- `topic_reconciliation`
- `full_resource_pack`
- `resource_expansion`

The Worker claims jobs atomically through the Supabase RPC `claim_curriculum_content_jobs`, publishes them to the Cloudflare content queue, processes them in a controlled consumer, and writes generated resource content to R2 as a secondary durable copy while retaining the existing Supabase content for application compatibility.

Asset-job processing is intentionally staged separately so the existing PDF/asset pipeline is not interrupted before the Cloudflare implementation is verified.

## Cloudflare resources

Wrangler is configured in `wrangler.jsonc` and is the source of truth for:
- Worker: `phenom-lms-background`
- Content queue: `phenom-lms-content`
- Content DLQ: `phenom-lms-content-dlq`
- R2 bucket: `phenom-lms-assets`
- Cron: every 2 minutes

Cloudflare's current Wrangler supports automatic provisioning of Queues and R2 resources when a deployment contains the bindings without pre-created resource IDs.

## Required secrets

Set these as Cloudflare Worker secrets or GitHub Actions repository secrets:

- `SUPABASE_SERVICE_ROLE_KEY`
- `AI_ROUTER_WORKER_TOKEN`

For the GitHub Actions deployment workflow, also set:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Never commit these values to Git.

## Deployment

From this directory:

```bash
npm install
npx wrangler deploy
```

Or use the manual GitHub Actions workflow:
`.github/workflows/deploy-phenom-lms-cloudflare.yml`.

## Verification sequence

1. Deploy Cloudflare Worker and verify `/health`.
2. Confirm the Queue and R2 resources exist.
3. Test with a controlled batch of curriculum jobs.
4. Confirm successful writes in Supabase and R2.
5. Only then disable the corresponding Supabase content worker.
6. Process the remaining queue gradually.
7. Migrate the asset worker and existing Supabase Storage objects to R2.
8. Archive/delete completed background-job rows only after their outputs are durably stored and application reads no longer depend on those rows.
9. Re-measure Supabase database size and run VACUUM/ANALYZE as appropriate.

## Important Fair Use note

Supabase's Fair Use database-size restriction is based on average daily database size over the billing period, so reducing the live database size does not necessarily remove the restriction immediately. The goal is to reduce the ongoing database footprint and stop the background queues from continuing to inflate it.
