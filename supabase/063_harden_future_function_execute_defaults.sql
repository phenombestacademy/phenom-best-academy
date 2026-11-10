-- Require explicit EXECUTE grants for future functions created by postgres.
-- This affects future functions only; existing RPC permissions remain unchanged.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON FUNCTIONS FROM anon, authenticated, service_role;

-- Remove PostgreSQL's global default PUBLIC EXECUTE grant for future postgres-owned functions.
-- Callers must be granted explicitly in the same migration that creates each function.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
