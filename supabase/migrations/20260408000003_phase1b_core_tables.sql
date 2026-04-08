-- =============================================================================
-- TASK-1B-001 — Phase 1B Core Tables
-- Prerequisites: 20260407000000, 20260407000001, 20260407000002
-- Tables: categories, products, orders, order_items, members,
--         subscriptions, stock_items
-- JWT pattern: app_metadata (ตาม migration 20260407000002)
-- =============================================================================

-- ─── 1. categories ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id   UUID        NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name_th    TEXT        NOT NULL,
  name_en    TEXT,
  is_deleted BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_tenant_access" ON categories
FOR ALL
USING (
  store_id = (auth.jwt() -> 'app_metadata' ->> 'store_id')::uuid
  AND is_deleted = false
)
WITH CHECK (
  store_id = (auth.jwt() -> 'app_metadata' ->> 'store_id')::uuid
);

-- ─── 2. products ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id     UUID        NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  category_id  UUID        REFERENCES categories(id),
  name_th      TEXT        NOT NULL,
  name_en      TEXT,
  price        NUMERIC     NOT NULL DEFAULT 0,
  is_available BOOLEAN     NOT NULL DEFAULT true,
  is_deleted   BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_tenant_access" ON products
FOR ALL
USING (
  store_id = (auth.jwt() -> 'app_metadata' ->> 'store_id')::uuid
  AND is_deleted = false
)
WITH CHECK (
  store_id = (auth.jwt() -> 'app_metadata' ->> 'store_id')::uuid
);

-- ─── 3. orders ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id       UUID        NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  table_no       INTEGER,
  status         TEXT        NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','brewing','done','paid','cancelled')),
  total_amount   NUMERIC     NOT NULL DEFAULT 0,
  payment_method TEXT        CHECK (payment_method IN ('cash','promptpay')),
  is_deleted     BOOLEAN     NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_tenant_access" ON orders
FOR ALL
USING (
  store_id = (auth.jwt() -> 'app_metadata' ->> 'store_id')::uuid
  AND is_deleted = false
)
WITH CHECK (
  store_id = (auth.jwt() -> 'app_metadata' ->> 'store_id')::uuid
);

-- ─── 4. order_items ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id         TEXT        PRIMARY KEY,
  order_id   UUID        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  store_id   UUID        NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id UUID        NOT NULL REFERENCES products(id),
  qty        INTEGER     NOT NULL DEFAULT 1,
  unit_price NUMERIC     NOT NULL,
  is_deleted BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_tenant_access" ON order_items
FOR ALL
USING (
  store_id = (auth.jwt() -> 'app_metadata' ->> 'store_id')::uuid
  AND is_deleted = false
)
WITH CHECK (
  store_id = (auth.jwt() -> 'app_metadata' ->> 'store_id')::uuid
);

-- ─── 5. members ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS members (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id     UUID        NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  line_user_id TEXT,
  display_name TEXT,
  total_orders INTEGER     NOT NULL DEFAULT 0,
  is_deleted   BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members_tenant_access" ON members
FOR ALL
USING (
  store_id = (auth.jwt() -> 'app_metadata' ->> 'store_id')::uuid
  AND is_deleted = false
)
WITH CHECK (
  store_id = (auth.jwt() -> 'app_metadata' ->> 'store_id')::uuid
);

-- ─── 6. subscriptions ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id                 TEXT        PRIMARY KEY,
  store_id           UUID        NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  status             TEXT        NOT NULL DEFAULT 'active'
                       CHECK (status IN ('active','grace','suspended','locked')),
  current_period_end TIMESTAMPTZ,
  grace_until        TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_tenant_access" ON subscriptions
FOR ALL
USING (
  store_id = (auth.jwt() -> 'app_metadata' ->> 'store_id')::uuid
)
WITH CHECK (
  store_id = (auth.jwt() -> 'app_metadata' ->> 'store_id')::uuid
);

-- ─── 7. stock_items ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stock_items (
  id            TEXT        PRIMARY KEY,
  store_id      UUID        NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name_th       TEXT        NOT NULL,
  name_en       TEXT,
  unit          TEXT        NOT NULL,
  current_qty   NUMERIC     NOT NULL DEFAULT 0,
  min_qty       NUMERIC     NOT NULL DEFAULT 0,
  cost_per_unit NUMERIC     NOT NULL DEFAULT 0,
  is_deleted    BOOLEAN     NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stock_items_tenant_access" ON stock_items
FOR ALL
USING (
  store_id = (auth.jwt() -> 'app_metadata' ->> 'store_id')::uuid
  AND is_deleted = false
)
WITH CHECK (
  store_id = (auth.jwt() -> 'app_metadata' ->> 'store_id')::uuid
);
