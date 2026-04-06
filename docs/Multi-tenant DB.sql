-- =============================================================================
-- ChongDeaw SaaS — Schema Baseline (Phase 1 Reference)
-- =============================================================================
-- STATUS : NOT YET EXECUTED in Supabase
-- Aligns  : src/types/index.ts contracts (TASK-013)
-- RLS     : ENABLE declared here; policies deferred to TASK-017
-- Next    : Run this DDL manually in Supabase SQL editor when ready,
--           or convert to a migration file before executing
-- =============================================================================

-- ─── 1. stores — one row = one tenant (coffee shop) ────────────────────────
--
-- TypeScript contract: src/types/index.ts → Store
-- Extra DB fields (not in TS type yet): slug, subscription_status, tenant_tier
--   These are SaaS operational fields; add to TS type before using in code.

CREATE TABLE stores (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT        NOT NULL,
  slug                TEXT        UNIQUE NOT NULL,       -- URL-safe id, e.g. "chongdeaw-lad-phrao"
  owner_id            UUID        NOT NULL REFERENCES auth.users(id),
  line_channel_id     TEXT,                              -- nullable until store configures LINE
  locale              TEXT        NOT NULL DEFAULT 'th'
                        CHECK (locale IN ('th', 'en')),
  subscription_status TEXT        NOT NULL DEFAULT 'active'
                        CHECK (subscription_status IN ('active', 'trial', 'inactive')),
  tenant_tier         TEXT        NOT NULL DEFAULT 'basic'
                        CHECK (tenant_tier IN ('basic', 'pro')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 2. profiles — one row = one user in one store ──────────────────────────
--
-- TypeScript contract: src/types/index.ts → Profile
-- Extra DB field (not in TS type yet): is_deleted (soft-delete flag)

CREATE TABLE profiles (
  id            UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id      UUID        NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  line_user_id  TEXT        NOT NULL,                    -- LINE userId
  display_name  TEXT        NOT NULL,                    -- LINE displayName
  picture_url   TEXT,                                    -- LINE pictureUrl (nullable)
  role          TEXT        NOT NULL DEFAULT 'staff'
                  CHECK (role IN ('owner', 'staff')),    -- lowercase, matches TS UserRole
  is_deleted    BOOLEAN     NOT NULL DEFAULT false,      -- soft delete
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (store_id, line_user_id)                        -- one LINE user per store
);

-- ─── 3. Row Level Security ───────────────────────────────────────────────────
-- Enabling RLS is safe and non-destructive — no data access until policies exist.
-- Policies are defined in TASK-017 after store_id/JWT binding is in place.

ALTER TABLE stores   ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- TASK-017 will add policies such as:
--
--   CREATE POLICY "profiles_tenant_isolation" ON profiles
--   FOR ALL USING (
--     store_id = (auth.jwt() -> 'user_metadata' ->> 'store_id')::uuid
--     AND is_deleted = false
--   );
--
--   CREATE POLICY "stores_owner_access" ON stores
--   FOR ALL USING (
--     owner_id = auth.uid()
--   );
