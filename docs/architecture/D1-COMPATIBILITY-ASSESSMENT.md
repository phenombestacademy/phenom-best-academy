# D1 Compatibility Assessment — Initial Findings

Captured from the live Supabase project on 11 October 2026. This assessment is intended to prevent an unsafe PostgreSQL-to-SQLite conversion. It is not a final architecture decision.

## Current source footprint

- Database including indexes: approximately 486 MB.
- 171 public base tables, 1,699 public columns, 215 declared foreign-key column relationships.
- 4 public views.
- 67 public SQL functions, 47 public trigger-event entries, 314 RLS policies.
- PostgreSQL extensions include `pg_cron`, `pg_net`, `pg_stat_statements`, `pgcrypto`, `plpgsql`, `supabase_vault` and `uuid-ossp`.

## Observed public column types

| PostgreSQL type | Columns | Suggested migration representation | Risk/validation |
|---|---:|---|---|
| `text` (`text`) | 658 | TEXT | Check constraints, defaults, operators and index semantics. |
| `uuid` (`uuid`) | 463 | TEXT (validate canonical UUID format) | SQLite does not have a native UUID type; preserve IDs as text and test all joins. |
| `timestamp with time zone` (`timestamptz`) | 237 | TEXT ISO-8601 UTC or INTEGER epoch, consistently chosen | Timezone semantics and ordering must remain consistent. |
| `boolean` (`bool`) | 102 | INTEGER 0/1 | Check constraints, defaults, operators and index semantics. |
| `integer` (`int4`) | 79 | INTEGER | Check constraints, defaults, operators and index semantics. |
| `jsonb` (`jsonb`) | 59 | TEXT containing validated JSON; query behaviour must be reviewed | SQLite JSON functions differ from PostgreSQL JSONB operators and indexes. |
| `numeric` (`numeric`) | 55 | INTEGER minor units or TEXT/REAL according to actual precision requirements | Avoid binary floating point for money or precision-sensitive values. |
| `date` (`date`) | 18 | TEXT ISO date | Check constraints, defaults, operators and index semantics. |
| `bigint` (`int8`) | 18 | INTEGER if safely within signed 64-bit range | Validate range and JavaScript number precision. |
| `ARRAY` (`_text`) | 5 | JSON TEXT or child table; inspect usage before choosing | Array operators and containment must be rewritten; do not silently stringify. |
| `time without time zone` (`time`) | 3 | TEXT ISO time | Check constraints, defaults, operators and index semantics. |
| `smallint` (`int2`) | 2 | INTEGER | Check constraints, defaults, operators and index semantics. |

## Features that do not port directly

1. **RLS (314 policies):** D1 has no PostgreSQL RLS. Every relevant read and write must be routed through authenticated server-side logic with equivalent role, tenant, school, parent/student and ownership checks.
2. **SQL functions (67):** inventory and dependency map first; translate each into a reviewed Worker service or compatible SQLite logic. Preserve transaction boundaries and return shapes expected by callers.
3. **Triggers (47):** classify each trigger by purpose. Recreate critical audit, timestamp, membership, notification and data-integrity effects explicitly and test them. Trigger-event counts can include more than one event per trigger.
4. **Views (4):** rewrite into explicit SQL views or protected API queries, preserving the source access rules. One view is student-question-facing and must not reveal answer keys or private fields.
5. **Extensions and scheduled jobs:** PostgreSQL extension behaviour cannot be assumed available. Move scheduled/background tasks to Cloudflare Cron/Queues/Workflows or another supported mechanism only after idempotency and retry rules are designed.
6. **Identity columns:** `analytics_events.id` and `audit_logs.id` use PostgreSQL identity generation. Choose a stable D1 key strategy and ensure inserts from the importer preserve source IDs without accidental sequence collisions.
7. **Foreign keys:** 215 declared relationships must be recreated where supported and verified in import order. Some constraints may require deferred or staged loading; the importer must not ignore failures.
8. **PostgreSQL-only SQL:** review `auth.uid()`, `SECURITY DEFINER`, PL/pgSQL, array operators, JSONB operators, generated UUID defaults, transaction isolation and advisory/locking logic. Do not run a mechanical search-and-replace migration.

## Table size and migration batch design

Largest source tables by PostgreSQL planner estimate and relation size:

| Table | Estimated rows | Total bytes (including indexes) | Primary key |
|---|---:|---:|---|
| `lms_curriculum_resource_packs` | 141,887 | 151,486,464 | id |
| `lms_curriculum_assets` | 76,612 | 63,356,928 | id |
| `lms_curriculum_library_items` | 63,768 | 48,234,496 | id |
| `lms_curriculum_asset_jobs` | 53,496 | 28,581,888 | id |
| `lms_curriculum_content_jobs` | 63,188 | 23,371,776 | id |
| `lms_curriculum_library_topic_links` | 52,062 | 20,307,968 | id |
| `lms_curriculum_topics` | 13,839 | 12,492,800 | id |
| `lms_curriculum_acquisition_items` | 8,406 | 8,347,648 | id |
| `lms_curriculum_requirement_mappings` | 5,858 | 4,128,768 | id |
| `lms_curriculum_quality_reviews` | 3,203 | 1,327,104 | id |
| `curriculum_subject_catalogue` | 1,383 | 483,328 | curriculum_id, subject_id, stage |
| `lms_curriculum_framework_components` | 337 | 335,872 | id |
| `lms_curriculum_external_resources` | 219 | 335,872 | id |
| `global_subject_catalogue` | 497 | 270,336 | id |
| `lms_curriculum_levels` | 464 | 196,608 | id |
| `lms_curriculum_sources` | 174 | 180,224 | id |
| `lms_tertiary_programme_catalogue` | 131 | 180,224 | id |
| `profiles` | 2 | 114,688 | id |
| `curriculum_catalogue` | 0 | 98,304 | id |
| `subscription_tool_entitlements` | 3 | 81,920 | id |
| `lms_canonical_curriculum_registry` | 0 | 81,920 | canonical_order |
| `academic_subject_catalog` | 45 | 81,920 | id |
| `lms_language_catalogue` | 216 | 73,728 | locale |
| `lms_cpd_sectors` | 0 | 65,536 | id |
| `lms_education_domains` | 0 | 65,536 | id |

Estimated rows are planner statistics, not exact row counts. The migration must obtain exact counts and checksums through a supported export, with pagination keyed by primary key rather than unstable offset-only paging.

Tables lacking a primary key (if any) must receive a documented stable composite cursor or an explicit source-side migration key before they can be imported resumably. Do not guess a key based only on column names.

## D1 go/no-go gates

D1 remains a candidate only if all of the following pass:

- Source schema fits D1 limits, including maximum row size and column count per table.
- All 171 tables' types, constraints, indexes, defaults, uniqueness rules and foreign-key behaviour are mapped.
- Data access can be safely moved from client-side Supabase calls to the server API.
- All 314 RLS policies have equivalent positive and negative authorization tests.
- All functions/triggers/views are classified and their effects preserved.
- Database growth, backups, restore time, request quotas, query duration and cost are acceptable.
- Full import, reconciliation and restore rehearsal pass on a staging copy.

If D1 fails a compatibility or operational gate, use a non-Supabase PostgreSQL database behind Cloudflare Workers/Hyperdrive rather than weaken integrity or security. This still meets the requirement to leave Supabase completely.

## Next engineering task

Build a versioned schema conversion and import pipeline only after the table-by-table mapping is reviewed. The importer must use stable keys, bounded batches, idempotent upserts, per-batch hashes, foreign-key checks and a dry-run mode. No production source data is to be deleted during migration.
