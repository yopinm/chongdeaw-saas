-- 1. สร้างตารางร้านค้า (Stores) [cite: 381]
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_th TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- เช่น chongdeaw-branch-1 [cite: 381]
  subscription_status TEXT DEFAULT 'active',
  tenant_tier TEXT DEFAULT 'basic',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. สร้างตารางโปรไฟล์ (Profiles) เชื่อมกับระบบ Login [cite: 381]
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id),
  role TEXT CHECK (role IN ('OWNER', 'STAFF', 'ADMIN')) DEFAULT 'OWNER',
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. เปิดใช้งาน Row Level Security (RLS) [cite: 388, 394]
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. นโยบายแยกข้อมูลร้าน (Tenant Isolation Policy) [cite: 389, 103]
-- ผู้ใช้จะเห็นข้อมูลเฉพาะของร้านตัวเองที่มี store_id ตรงกับใน Token เท่านั้น [cite: 389]
CREATE POLICY "tenant_isolation_policy" ON profiles
FOR ALL USING (
  store_id = (auth.jwt() -> 'user_metadata' ->> 'store_id')::uuid 
  AND is_deleted = false
);