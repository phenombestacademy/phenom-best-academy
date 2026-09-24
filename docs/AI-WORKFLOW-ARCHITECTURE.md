# Phenom AI Workflow Architecture & Audit

## Canonical rule

All Phenom AI-capable application workflows must use the central `ai-router` Edge Function (Phenom Best Core) for model/provider access.

Direct calls from application workflows to external model APIs are not permitted. Provider credentials remain in Supabase Edge Function secrets and are used only by `ai-router`.

## Audited live workflows — 24 September 2026

| Workflow | Live function | Central router | Background/queue | Status |
|---|---|---:|---:|---|
| User AI / general intelligence | `ai-router` | Canonical | N/A | PASS |
| Quiz/question generation | `generate-quiz` | Yes | On-demand | PASS |
| Result comments | `generate-result-comment` | Yes | On-demand | PASS |
| Curriculum topic reconciliation | `curriculum-content-worker` | Yes | Cron/queue | PASS |
| Curriculum full resource packs | `curriculum-content-worker` | Yes | Cron/queue | PASS |
| Curriculum resource expansion | `curriculum-content-worker` | Yes | Cron/queue | PASS |
| Curriculum IQA | `curriculum-iqa-worker` | Yes | Cron/queue | PASS |
| UI translation | `translate-ui` | Yes — migrated during this audit | On-demand | PASS |
| Curriculum ingestion | `curriculum-ingest` | Not AI; source retrieval/verified commit only | On-demand | N/A |
| Curriculum asset generation | `curriculum-asset-worker` | Not AI; renders stored resource records | Cron/queue | N/A |

## Important audit finding fixed

`translate-ui` was the one major AI workflow found to bypass the central router. It previously called multiple translation providers directly.

It has now been redeployed as version 9 and sends translation generation through `ai-router`. Provider-specific credentials are therefore no longer required by the translation workflow.

## Background processing

The curriculum workers remain queue-driven and cron-triggered. The current production schedule includes:

- curriculum asset worker — every second
- curriculum content worker — every minute
- curriculum IQA worker — every minute

The content worker now handles:

- `topic_reconciliation`
- `full_resource_pack`
- `resource_expansion`

The worker was verified by a live invocation after deployment: topic-reconciliation jobs moved from 2,329 queued to 2,326 queued and 4 completed, demonstrating that the new central-router path is executing successfully.

## AI provider boundary

The only component permitted to contact model providers is:

`supabase/functions/ai-router`

Current routing supports configured OpenAI, Gemini and Azure OpenAI providers, with Gemini currently providing the verified live provider response.

## Reliability rule

No workflow should depend on a user keeping the website open. Large work belongs in the persistent queue and background workers. Individual Edge Function requests still have platform execution limits, so long-running work must be split into retryable jobs rather than relying on an infinite request.

## Future-development rule

Before adding an AI feature:

1. Create/identify its workflow boundary.
2. Route model access through `ai-router`.
3. Give the request a workflow identifier.
4. Persist large work as a queue/job.
5. Make processing idempotent.
6. Add independent QA where the output becomes canonical educational content.
7. Do not expose provider credentials to browser code.
8. Do not mark generated material complete until the required QA gate passes.
