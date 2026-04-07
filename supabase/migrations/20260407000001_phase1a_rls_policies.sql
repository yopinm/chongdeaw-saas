-- =============================================================================
-- TASK-1A-025 — RLS Policies (Phase 1A)
-- Run this manually in: Supabase Dashboard → SQL Editor
--
-- Prerequisites (all must be true before running):
--   ✅ stores + profiles tables exist (migration 20260407000000)
--   ✅ profiles_self_rw policy already added (migration 20260407000000)
--   ✅ Real LINE Auth session works (TASK-1A-022)
--   ✅ store_id in JWT user_metadata (TASK-1A-024)
--
-- WARNING: Run AFTER logout+login so JWT contains store_id.
--          Verify via GET /api/auth/me before running.
-- =============================================================================

-- ─── stores: owner can manage their own store ────────────────────────────────
CREATE POLICY "stores_owner_access" ON stores
FOR ALL
USING     (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- ─── profiles: tenant isolation via JWT store_id ─────────────────────────────
-- profiles_self_rw already exists from migration 20260407000000.
-- This policy adds multi-tenant isolation on top.
CREATE POLICY "profiles_tenant_isolation" ON profiles
FOR ALL
USING (
  store_id = (auth.jwt() -> 'user_metadata' ->> 'store_id')::uuid
  AND is_deleted = false
);
