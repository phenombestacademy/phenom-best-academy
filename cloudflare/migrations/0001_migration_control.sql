-- Cloudflare D1 migration-control foundation.
-- This migration is intentionally independent of application tables and can be
-- applied before data transfer. It records restartable batches and verifies
-- objects/records before any source deletion is considered.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS migration_runs (
  id TEXT PRIMARY KEY,
  source_system TEXT NOT NULL DEFAULT 'supabase',
  entity_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'running', 'paused', 'failed', 'verified', 'complete')),
  cursor TEXT,
  records_seen INTEGER NOT NULL DEFAULT 0 CHECK (records_seen >= 0),
  records_written INTEGER NOT NULL DEFAULT 0 CHECK (records_written >= 0),
  records_verified INTEGER NOT NULL DEFAULT 0 CHECK (records_verified >= 0),
  last_error TEXT,
  started_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_migration_runs_status
  ON migration_runs(status, entity_type);

CREATE TABLE IF NOT EXISTS migration_object_manifest (
  source_system TEXT NOT NULL DEFAULT 'supabase',
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  destination_key TEXT NOT NULL,
  sha256 TEXT,
  byte_count INTEGER NOT NULL DEFAULT 0 CHECK (byte_count >= 0),
  verified INTEGER NOT NULL DEFAULT 0 CHECK (verified IN (0, 1)),
  source_deleted INTEGER NOT NULL DEFAULT 0 CHECK (source_deleted IN (0, 1)),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  verified_at TEXT,
  PRIMARY KEY (source_system, source_type, source_id),
  UNIQUE (destination_key),
  CHECK (source_deleted = 0 OR verified = 1)
);

CREATE INDEX IF NOT EXISTS idx_migration_object_manifest_pending
  ON migration_object_manifest(source_type, verified, source_deleted);

CREATE TABLE IF NOT EXISTS migration_record_manifest (
  source_system TEXT NOT NULL DEFAULT 'supabase',
  source_table TEXT NOT NULL,
  source_id TEXT NOT NULL,
  destination_table TEXT NOT NULL,
  destination_id TEXT NOT NULL,
  source_hash TEXT,
  destination_hash TEXT,
  verified INTEGER NOT NULL DEFAULT 0 CHECK (verified IN (0, 1)),
  migrated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  verified_at TEXT,
  PRIMARY KEY (source_system, source_table, source_id),
  CHECK (verified = 0 OR (source_hash IS NOT NULL AND destination_hash IS NOT NULL AND source_hash = destination_hash))
);

CREATE INDEX IF NOT EXISTS idx_migration_record_manifest_pending
  ON migration_record_manifest(source_table, verified);
