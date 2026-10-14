# Cloudflare D1 migrations

This directory contains the migration-control foundation and an initial application-table catalogue for the Supabase exit.

## Migration files

- `0001_migration_control.sql` creates restartable migration-run records and record/object manifests.
- `0002_application_table_catalogue.sql` creates basic SQLite-compatible table/column scaffolds for all 171 public Supabase tables observed on 14 October 2026.
- The object manifest prevents a source object from being marked deleted before the destination has been verified.
- The record manifest records source/destination identifiers and hashes so data batches can be reconciled.

## Important limitation of 0002

The 171-table catalogue preserves table names, column names, basic SQLite affinities, primary keys, simple defaults and NOT NULL markers. It is not a complete PostgreSQL-to-SQLite conversion. The following remain to be ported and tested: foreign keys, unique/check/exclusion constraints, indexes, views, triggers, stored functions, generated expressions, extension dependencies, sequences, grants, RLS policies, auth schema references, and complex defaults. Some data types are represented using SQLite TEXT or REAL affinity. Do not treat this as production-ready until schema parity tests pass.

The row counts in SQL comments are an inventory snapshot only. No rows have been copied by these schema files.

## Provision resources

Review the account and existing resources first, then run `scripts/migration/provision-cloudflare-parity.sh` after authenticating with Wrangler. The script creates one D1 database, four mapped R2 buckets, one queue and one dead-letter queue. It does not transfer data and may report conflicts if resources already exist.

## Apply to a dedicated target D1 database

From the repository root, after confirming the Cloudflare account and target database name:

```sh
npx wrangler d1 execute phenom-best-lms --local --file=cloudflare/migrations/0001_migration_control.sql
npx wrangler d1 execute phenom-best-lms --local --file=cloudflare/migrations/0002_application_table_catalogue.sql
```

Only after local tests and schema review, and after the D1 database has been created in the correct Cloudflare account, apply remotely:

```sh
npx wrangler d1 execute phenom-best-lms --remote --file=cloudflare/migrations/0001_migration_control.sql
npx wrangler d1 execute phenom-best-lms --remote --file=cloudflare/migrations/0002_application_table_catalogue.sql
```

The repository does not contain a verified D1 database ID/binding. Do not invent one or point a Worker at a production resource before confirming the target account and database.

## Verification before any source deletion

1. Export and import data in bounded, resumable batches.
2. Query the manifests and reconcile expected row/object counts.
3. Verify SHA-256 and byte count for every object.
4. Verify record hashes and foreign-key relationships for each completed batch.
5. Test authentication, role permissions, tenant isolation and all critical LMS journeys.
6. Keep `source_deleted = 0` until a separately approved cleanup phase after cutover.
