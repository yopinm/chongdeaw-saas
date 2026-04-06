-- =============================================================================
-- ChongDeaw SaaS — RLS Policy Baseline (Phase 1)
-- =============================================================================
-- STATUS  : NOT YET EXECUTED — read the prerequisite checklist before running
-- Depends : docs/Multi-tenant DB.sql must be executed first (tables + ENABLE RLS)
--
-- WARNING : RLS with no permissive policies = total lockout for all non-service_role
--           queries. Do NOT run these policies until every checklist item is met.
-- =============================================================================
--
-- PREREQUISITE CHECKLIST
-- All items must be true before running any policy here:
--
--   [ ] 1. docs/Multi-tenant DB.sql executed — stores + profiles tables exist,
--          ENABLE ROW LEVEL SECURITY already applied to both tables.
--
--   [ ] 2. Real Supabase auth session works — TASK-012 mock login does NOT create
--          a Supabase session. The LINE OAuth callback (app/api/auth/callback)
--          must be implemented and creating real sessions.
--
--   [ ] 3. store_id written to JWT user_metadata at login time.
--          The profiles_tenant_isolation policy reads:
--            auth.jwt() -> 'user_metadata' ->> 'store_id'
--          This value must be set when the Supabase session is created.
--          It is NOT set yet — getTenantContext() in src/lib/tenant.ts
--          currently uses a DB lookup fallback, not a JWT claim.
--
--   [ ] 4. getTenantContext() returning real data (not returning null due to
--          missing session or missing profiles row).
--
--   [ ] 5. Tested on a separate dev/staging Supabase project before production.
--
-- =============================================================================
-- CURRENT LIMITATIONS (Phase 1)
-- =============================================================================
--
--   A. Mock auth (TASK-012): clicking the login button redirects without
--      creating a Supabase session. auth.uid() and auth.jwt() return nothing.
--      → All RLS policies that check auth.uid() or auth.jwt() will deny access.
--
--   B. JWT claim not bound: store_id is not yet written into user_metadata
--      when a session is created. The LINE OAuth callback (app/api/auth/callback)
--      must upsert the profile and then set user_metadata.store_id via
--      supabase.auth.admin.updateUserById() or a Supabase Auth hook.
--      → profiles_tenant_isolation policy cannot function until this is done.
--
--   C. No service_role usage defined yet: admin operations (onboarding a new
--      store, creating first profile) bypass RLS using SUPABASE_SERVICE_ROLE_KEY.
--      This key is not yet in .env.local (see TASK-010 audit).
--      → SUPABASE_SERVICE_ROLE_KEY must be added before any admin writes.
--
-- =============================================================================

-- ─── stores policies ─────────────────────────────────────────────────────────
--
-- Policy: the authenticated owner can read and manage their own store.
-- auth.uid() must match stores.owner_id.
-- Limitation B applies — requires real Supabase session.

CREATE POLICY "stores_owner_access" ON stores
FOR ALL
USING     (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- ─── profiles policies ───────────────────────────────────────────────────────
--
-- Policy 1: tenant isolation — a user can only see profile rows in their store.
-- Reads store_id from JWT user_metadata (set at login time — Limitation B).
-- Also filters out soft-deleted rows.

CREATE POLICY "profiles_tenant_isolation" ON profiles
FOR ALL
USING (
  store_id = (auth.jwt() -> 'user_metadata' ->> 'store_id')::uuid
  AND is_deleted = false
);

-- Policy 2: self-access — a user can read and update their own profile row.
-- Provides a fallback path when user_metadata.store_id is not yet set.
-- Limitation B applies — requires real Supabase session.

CREATE POLICY "profiles_self_rw" ON profiles
FOR ALL
USING     (id = auth.uid())
WITH CHECK (id = auth.uid());

-- ─── Phase 2 expansion pattern ───────────────────────────────────────────────
--
-- Every new business table (orders, queue_items, revenue_records, etc.)
-- will need these two policy patterns:
--
-- 1. Tenant isolation (copy for each table that has store_id):
--
--    CREATE POLICY "{table}_tenant_isolation" ON {table}
--    FOR ALL
--    USING (
--      store_id = (auth.jwt() -> 'user_metadata' ->> 'store_id')::uuid
--    );
--
-- 2. Role-gated writes (staff read, owner mutates):
--
--    CREATE POLICY "{table}_owner_write" ON {table}
--    FOR INSERT, UPDATE, DELETE
--    USING (
--      (auth.jwt() -> 'user_metadata' ->> 'role') = 'owner'
--    );
