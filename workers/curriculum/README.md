# Phenom Best Academy — Cloudflare Curriculum Worker

This worker is the heavy-duty background-processing layer for curriculum generation.

## Responsibilities

- Consume curriculum jobs through Cloudflare Queues.
- Batch and retry background work outside the public Vercel request path.
- Read/write the existing Supabase LMS tables.
- Call configured AI providers directly instead of routing every generation through a continuously-polling Supabase Edge Function.
- Preserve Supabase as the system of record.

## Required Cloudflare bindings/secrets

Queue binding:
- CURRICULUM_QUEUE → phenom-curriculum-content

Secrets:
- SUPABASE_SERVICE_ROLE_KEY
- OPENAI_API_KEY (optional)
- OPENAI_MODEL (optional)
- GEMINI_API_KEY (optional)
- GEMINI_MODEL (optional)
- AZURE_OPENAI_API_KEY (optional)
- AZURE_OPENAI_ENDPOINT (optional)
- AZURE_OPENAI_DEPLOYMENT (optional)
- AZURE_OPENAI_API_VERSION (optional)

## Important

Do not commit provider keys or the Supabase service-role key to GitHub.

The current Supabase curriculum cron workers remain disabled while this worker is introduced and verified.

Cloudflare Queues should be connected with a dead-letter queue and bounded batch/retry settings before production processing is enabled.
