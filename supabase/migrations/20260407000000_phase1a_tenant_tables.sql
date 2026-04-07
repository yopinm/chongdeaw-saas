-- =============================================================================
-- TASK-1A-023 — Phase 1A Tenant Tables
-- Run this manually in: Supabase Dashboard → SQL Editor
-- =============================================================================

-- ─── 1. stores ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stores (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT        NOT NULL,
  slug                TEXT        UNIQUE NOT NULL,
  owner_id            UUID        NOT NULL REFERENCES auth.users(id),
  line_channel_id     TEXT,
  locale              TEXT        NOT NULL DEFAULT 'th'
                        CHECK (locale IN ('th', 'en')),
  subscription_status TEXT        NOT NULL DEFAULT 'trial'
                        CHECK (subscription_status IN ('active', 'trial', 'inactive')),
  tenant_tier         TEXT        NOT NULL DEFAULT 'basic'
                        CHECK (tenant_tier IN ('basic', 'pro')),
  is_deleted          BOOLEAN     NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 2. profiles ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id      UUID        NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  line_user_id  TEXT        NOT NULL,
  display_name  TEXT        NOT NULL,
  picture_url   TEXT,
  role          TEXT        NOT NULL DEFAULT 'staff'
                  CHECK (role IN ('owner', 'staff')),
  is_deleted    BOOLEAN     NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, line_user_id)
);

-- ─── 3. RLS — enable (no data access until policies exist) ──────────────────
ALTER TABLE stores   ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ─── 4. Minimal policy — user can read their own profile row ─────────────────
-- Required for getTenantContext() (src/lib/tenant.ts) to work.
-- Full tenant isolation policies come in TASK-1A-025.
DROP POLICY IF EXISTS "profiles_self_rw" ON profiles;
CREATE POLICY "profiles_self_rw" ON profiles
FOR ALL
USING     (id = auth.uid())
WITH CHECK (id = auth.uid());

-- stores: no anon policy yet — all writes use service_role key (bypasses RLS).
