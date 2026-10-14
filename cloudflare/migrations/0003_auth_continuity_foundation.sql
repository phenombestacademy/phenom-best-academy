-- Cloudflare-native authentication continuity foundation.
-- This migration creates server-only D1 storage structures; it does not import users,
-- enable login routes, or disable Supabase Auth. Deploy only behind authenticated Worker
-- code after security tests. Never store plaintext passwords or raw session/reset tokens.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS app_users (
  id TEXT PRIMARY KEY,
  legacy_supabase_user_id TEXT UNIQUE,
  email TEXT,
  email_normalized TEXT UNIQUE,
  phone TEXT,
  display_name TEXT,
  password_hash TEXT,
  password_hash_scheme TEXT,
  email_verified_at TEXT,
  phone_verified_at TEXT,
  account_status TEXT NOT NULL DEFAULT 'active'
    CHECK (account_status IN ('active', 'pending_verification', 'locked', 'disabled')),
  auth_provider TEXT NOT NULL DEFAULT 'password',
  legacy_auth_metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  last_sign_in_at TEXT,
  CHECK (email IS NULL OR length(email) <= 320),
  CHECK (email_normalized IS NULL OR email_normalized = lower(trim(email_normalized))),
  CHECK (password_hash IS NULL OR length(password_hash) <= 512)
);

CREATE INDEX IF NOT EXISTS idx_app_users_status
  ON app_users(account_status);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  expires_at TEXT NOT NULL,
  last_seen_at TEXT,
  revoked_at TEXT,
  user_agent_hash TEXT,
  ip_prefix_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_active
  ON auth_sessions(user_id, expires_at, revoked_at);

CREATE TABLE IF NOT EXISTS auth_one_time_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  purpose TEXT NOT NULL CHECK (purpose IN ('email_verification', 'password_reset', 'sign_in')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0)
);

CREATE INDEX IF NOT EXISTS idx_auth_one_time_tokens_user_purpose
  ON auth_one_time_tokens(user_id, purpose, expires_at, consumed_at);

CREATE TABLE IF NOT EXISTS auth_security_events (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES app_users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('success', 'failure', 'blocked')),
  occurred_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  request_id TEXT,
  metadata_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_auth_security_events_user_time
  ON auth_security_events(user_id, occurred_at);
