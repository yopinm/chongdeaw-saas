-- =============================================================================
-- TASK-1A-025 — Tenant Isolation RLS Policies
-- Supersedes 20260407000001: fixes owner_id→app_metadata, user_metadata→app_metadata
--
-- Run in: Supabase Dashboard → SQL Editor
-- Prerequisites:
--   ✅ stores + profiles tables exist
--   ✅ app_metadata.store_id injected in JWT (TASK-1A-024)
-- =============================================================================

-- ─── stores: SELECT only own store via JWT app_metadata ──────────────────────
-- Writes (INSERT/UPDATE) happen via service_role key (bypasses RLS).
DROP POLICY IF EXISTS "stores_owner_access"  ON stores;
DROP POLICY IF EXISTS "stores_tenant_access" ON stores;

CREATE POLICY "stores_tenant_access" ON stores
FOR SELECT
USING (
  id = (auth.jwt() -> 'app_metadata' ->> 'store_id')::uuid
);

-- ─── profiles: full access within own store only ─────────────────────────────
DROP POLICY IF EXISTS "profiles_self_rw"          ON profiles;
DROP POLICY IF EXISTS "profiles_tenant_isolation" ON profiles;
DROP POLICY IF EXISTS "profiles_tenant_access"    ON profiles;

CREATE POLICY "profiles_tenant_access" ON profiles
FOR ALL
USING (
  store_id = (auth.jwt() -> 'app_metadata' ->> 'store_id')::uuid
)
WITH CHECK (
  store_id = (auth.jwt() -> 'app_metadata' ->> 'store_id')::uuid
);
