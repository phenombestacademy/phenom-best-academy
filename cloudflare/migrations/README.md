# Cloudflare D1 migrations

This directory contains the migration-control foundation for the Supabase exit.

## Current migration

- `0001_migration_control.sql` creates restartable migration-run records and record/object manifests.
- The object manifest prevents a source object from being marked deleted before the destination has been verified.
- The record manifest records source/destination identifiers and hashes so data batches can be reconciled.

## Apply only after provisioning a dedicated target D1 database

From this directory, after the D1 database has been created in the correct Cloudflare account and its name/ID confirmed:

```sh
npx wrangler d1 execute <TARGET_D1_DATABASE_NAME> --remote --file=./migrations/0001_migration_control.sql
```

For local development, use the same command with `--local` first. Do not apply to a production database until the account, database name and environment have been checked.

The current repository does not yet contain a real D1 database ID or binding. Do not add a fabricated ID to `wrangler.jsonc`. The live migration manifest in the source Supabase project is empty; this D1 manifest is not proof of migrated data until a real migration run writes and verifies entries.

## Verification before any source deletion

1. Query the manifest and reconcile the expected record/object counts.
2. Verify SHA-256 and byte count for every object.
3. Verify record hashes and foreign-key relationships for each completed batch.
4. Keep `source_deleted = 0` until a separately approved cleanup phase after cutover.
