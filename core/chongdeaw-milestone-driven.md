
All projects
ChongDeaw
SaaS system for coffee shot



How can I help you today?

สร้างไฟล์ markdown สำหรับโปรเจค
Last message 13 minutes ago
Merging SaaS architecture best practices into pillar framework
Last message 17 hours ago
Opus vs Claude 3.5 Sonnet comparison
Last message 17 hours ago
ถามเรื่อง SaaS
Last message 3 days ago
Instructions
Add instructions to tailor Claude’s responses

Files
1% of project capacity used

CHONGDEAW_PROJECT.md
474 lines

md



CHONGDEAW_PROJECT.md
21.84 KB •474 lines
•
Formatting may be inconsistent from source

# ChongDeaw · ชงเดี่ยว — SaaS Single Source of Truth
> **Milestone Edition v4.0** · อัปเดตล่าสุด: 2026-04-05  
> ใช้เป็น Single Source of Truth สำหรับ Claude Code + VS Code

---

## 🗺️ Project Overview

**ChongDeaw** คือ SaaS Platform สำหรับร้านกาแฟ Multi-tenant รองรับ 1,000+ ร้าน  
Stack: `Next.js 14` · `TypeScript` · `Tailwind CSS` · `Supabase (RLS)` · `Omise` · `Cloudflare` · `Vercel`

### Stage Progress

| Stage | ชื่อ | สถานะ | % |
|-------|------|--------|---|
| Stage 1 | SaaS Foundation & Architecture | ✅ Complete | 100% |
| Stage 2 | Billing + Infrastructure | 🔄 In Progress | 90% |
| Stage 3 | MVP Application Features | ⏳ Planned | 0% |
| Stage 4 | Pre-Launch Hardening | ⏳ Planned | 0% |
| Stage 5 | Launch & Go-to-Market | ⏳ Planned | 0% |
| Stage 6 | Scale & Growth | ⏳ Planned | 0% |

---

## ⚙️ Tech Stack & Architecture Decisions

```
Frontend       : Next.js 14 App Router + TypeScript + Tailwind CSS
Auth           : LINE OAuth Deep Link → Supabase Auth (JWT มี store_id ทุกใบ)
Database       : Supabase (PostgreSQL) · Pool Model + RLS · Soft Delete ทุก Table
Payments       : Omise · PromptPay 149.-/เดือน · Idempotent Webhook
Infra          : Vercel (CI/CD) · Cloudflare (WAF, DDoS, CDN)
i18n           : next-intl · TH/EN ทั้งระบบ
PWA            : next-pwa · IndexedDB · Background Sync API
State          : TanStack Query (React Query) · Optimistic UI · Idempotency Key
Realtime       : Supabase Realtime Channel
Monitoring     : Sentry/Datadog · Structured Logging (store_id, user_id, request_id)
```

### Directory Structure

```
src/
├── app/
│   ├── [locale]/           # Application Plane (Tenant App)
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   └── (store)/
│   └── admin/control/      # Control Plane (Onboarding, Billing, Metrics)
├── components/
├── lib/                    # DB, Utils, Schema
└── services/               # Auth, Business Logic
messages/
├── th.json
└── en.json
```

### AWS SaaS Architecture Patterns ที่ใช้

- **Control Plane vs Application Plane** — แยก `/admin/control` (Billing/Onboarding/Metrics) ออกจาก `/[locale]` (Tenant App)
- **Pool Model + RLS** — Shared DB, Row Level Security per `store_id`
- **SaaS Identity** — JWT ทุกใบต้องมี `store_id` เป็น Tenant Context
- **Single Deployment Pipeline** — ทุก Tenant รัน Software เวอร์ชันเดียวกัน ห้าม One-off Customization
- **Frictionless Onboarding** — Signup → ใช้งานได้ < 30 วินาที (Atomic DB Trigger)
- **Dunning Management** — แจ้งเตือน 7/3/0 วันก่อนหมดอายุ ลด Churn

---

## 🗄️ Database Schema

### Core Tables

```sql
-- Tenant Master
stores (
  id UUID PRIMARY KEY,
  name_th TEXT, name_en TEXT,
  slug TEXT UNIQUE,
  subscription_status TEXT,   -- active | grace | suspended
  expired_at TIMESTAMPTZ,
  tenant_tier TEXT            -- basic | pro | enterprise
)

-- User Profiles
profiles (
  id UUID → auth.users,
  store_id UUID,
  role TEXT,                  -- OWNER | STAFF | ADMIN
  is_deleted BOOLEAN DEFAULT false
)

-- Menu
categories (id, store_id, name_th, name_en, is_deleted)
products (
  id, store_id, name_th, name_en,
  is_available BOOLEAN,       -- Toggle พร้อมขาย/หมด
  is_deleted BOOLEAN
)

-- Orders
orders (id, store_id, table_no, status, total_amount, created_at)
order_items (id, order_id, store_id, product_id, qty, unit_price)

-- Billing
subscriptions (
  id, store_id, status,
  current_period_end TIMESTAMPTZ,
  grace_until TIMESTAMPTZ
)
plan_features (plan_id, feature_key, is_enabled)  -- Feature Flag per Plan

-- Inventory & BOM
stock_items (id, store_id, name_th, name_en, unit, current_qty, min_qty, cost_per_unit)
stock_movements (id, store_id, stock_item_id, delta, type, order_id, created_at)
  -- type: purchase | deduction | adjust
bom_presets (id, name_th, name_en, description)
bom_items (id, store_id, product_id, stock_item_id, qty_per_unit, preset_id)

-- Members
members (id, store_id, line_user_id, display_name, total_orders, created_at)

-- Audit (IMMUTABLE — Insert Only, NO UPDATE/DELETE even ADMIN)
audit_logs (id, store_id, user_id, action, old_value, new_value, created_at)
purchase_plans (id, store_id, stock_item_id, planned_qty, planned_date, status)

-- Feature Flags (Stage 6)
feature_flags (flag_key, store_id, is_enabled)
```

### RLS Policy (ทุก Table)

```sql
-- ใช้กับทุก Table ที่มี store_id
CREATE POLICY tenant_isolation ON products
  USING (
    store_id = (auth.jwt()->'user_metadata'->>'store_id')::uuid
    AND is_deleted = false
  );
```

> ⚠️ **CRITICAL**: ต้อง Enable RLS ครบทุกตารางก่อนเปิดรับร้านจริงหลายร้าน

---

## 📋 Stage Details

---

### Stage 1 — SaaS Foundation ✅ 100%

**เป้าหมาย**: วางโครงสร้าง Platform ทั้งหมด — Multi-tenant, Auth, i18n, PWA, Security, Layout

#### Deliverables

- [x] Next.js 14 App Router + TypeScript + Tailwind CSS
- [x] Multi-tenant DB Schema + RLS (Supabase Pool Model)
- [x] LINE Auth Deep Link + Tenant Auto-Onboarding (DB Trigger: Atomic)
- [x] i18n TH/EN ทั้งระบบ (next-intl + Dynamic Routing)
- [x] Global SaaS Layout — iPad Sidebar / Mobile Bottom Nav / PC
- [x] Control Plane แยกจาก Application Plane อย่างชัดเจน
- [ ] PWA + Offline Cache (next-pwa, IndexedDB) + Background Sync
- [ ] Optimistic UI — TanStack Query + Idempotency Key per Session
- [ ] Security Headers A+: HSTS, CSP, X-Frame, Cloudflare WAF
- [ ] DDoS Protection: Rate Limit per store_id
- [ ] audit_logs: Insert-only (ห้าม UPDATE/DELETE แม้แต่ ADMIN)

#### Hard Gate ✅ (ต้องผ่านก่อนไป Stage 2)

- [x] RLS เปิดครบทุกตารางหลัก + Policy กัน store_id ผ่าน Security Review
- [x] JWT ทุก Request มี store_id ที่ถูกต้อง ผ่าน Test
- [x] LINE Auth Deep Link ทำงาน Flow จริง (ไม่ใช่แค่โครง)
- [x] Rule Compliance Audit: ทุกหน้าผ่าน Multi-tenant + i18n อย่างน้อย
- [x] UAT Checklist Stage 1 ผ่านทุกข้อ

---

### Stage 2 — Billing + Infrastructure 🔄 90%

**เป้าหมาย**: Subscription 149.-/เดือน + CI/CD Pipeline Production-grade

#### Deliverables

- [x] Omise PromptPay 149.-/เดือน — Gen QR ผ่าน Omise Source API
- [x] Subscription Lifecycle Auto (Active → Grace 3 วัน → Suspended → Locked)
- [x] Idempotent Webhook + HMAC Signature Verification + Dead Letter Queue
- [x] Dunning: LINE Notify + Email แจ้งเตือน 7/3/0 วันก่อนหมดอายุ
- [x] Cloudflare WAF + Rate Limit per store_id
- [x] Vercel CI/CD: GitHub → Auto-deploy, Branch Strategy (main/develop/feature/*)
- [x] Dynamic QR Code per Store & Table (domain.com/[slug]/table/[n])
- [x] Billing Dashboard: Invoice PDF, ประวัติการชำระ, ปุ่มต่ออายุล่วงหน้า
- [ ] Tenant-aware Monitoring: Sentry/Datadog + store_id context + Alert
- [ ] PITR Backup ทดสอบ Restore จริง (RTO < 1 ชั่วโมง, RPO < 15 นาที)
- [ ] Rollback: เก็บ 3 previous deployments, กลับ Version ได้ < 5 นาที
- [ ] Smoke Test หลัง Deploy: /api/health + Tenant Isolation Test
- [ ] Noisy Neighbor Detection: Throttle Tenant ที่ใช้ Resource เกิน

#### Hard Gate (ต้องผ่านก่อนไป Stage 3)

- [ ] ชำระ 149.- บน test mode → Active status ถูกต้อง
- [ ] Webhook Idempotency: Fire 2 ครั้ง → Extend แค่ 1 ครั้ง
- [ ] CI/CD Auto-deploy ทำงานได้จริงบน Staging
- [ ] Smoke Test หลัง Deploy ผ่าน (Health + Tenant Isolation)
- [ ] PITR Backup: ทดสอบ Restore สำเร็จ
- [ ] Monitoring: Error Spike → Alert ถึง On-call ได้จริง

#### ⚠️ Known Risks (Stage 2)

| ความเสี่ยง | ระดับ | Action |
|------------|-------|--------|
| Omise Production key ต้องรอโดเมนจริง | กลาง | ทดสอบ test mode ได้ก่อน |
| PITR Restore ยังไม่ได้ทดสอบจริง | **สูง** | ต้องทดสอบก่อนผ่าน Gate |
| LINE Auth ยังเป็น Deep Link โครง | กลาง | ต้องทำ Flow จริงก่อน |

---

### Stage 3 — MVP Application Features ⏳ 0%

**เป้าหมาย**: ฟีเจอร์แอปจริงของร้านกาแฟ — Order, Queue, Stock, BOM, Report

#### Customer Flow
```
สแกน QR → เลือกเมนู (พร้อมขาย/หมด) → กดสั่ง
→ ดูสถานะคิว Realtime → QR จ่าย หรือ เงินสด → จบ
```

#### Owner/Staff Flow
```
รับออเดอร์ → กดรับ → คิวบอกสถานะ Realtime
→ ทำเสร็จ กดเสร็จ → ระบบตัดสต็อก Auto → จบ
```

#### Deliverables

**Menu & Order Portal**
- [ ] เมนูหน้าร้าน + Availability Toggle Realtime (is_available)
  - ISR Cache 60s + Edge Caching, Cache Key ต้องรวม store_id
  - LCP < 1.5s, FID < 100ms, CLS < 0.1
- [ ] Queue Display Realtime — Supabase Channel `orders:store_id=xxx`
  - Status: Pending → Brewing → Done
  - รอ > 10 นาที → Highlight แดงอัตโนมัติ
  - Multi-staff Sync: 2 คนเปิดพร้อมกัน ไม่ Conflict
- [ ] Payment: PromptPay QR (Omise, timeout 15 นาที) + เงินสด
  - Realtime update เมื่อชำระแล้ว
  - Partial Failure UX: ล้มเหลว → Fallback เงินสด
- [ ] ระบบสมาชิกอัตโนมัติ: สแกน QR ครั้งแรก → Auto-register (ไม่ต้องกรอกฟอร์ม)

**Operations & Staff Dashboard**
- [ ] Staff Order Management: Order Card Status (iPad/Mobile)
- [ ] LINE Notify แยก Token ต่อ store_id + pg_notify Message Queue
- [ ] Bluetooth 58mm Thermal Printing (Web Bluetooth API, ไม่ต้อง Driver)
  - Graceful Degradation: Printer ไม่เชื่อมต่อ → แสดงบนหน้าจอแทน
- [ ] Offline Sync + Idempotent Sync (Action เดิม Sync 2 ครั้ง → ผลเดิม)
- [ ] Audit Log Retention: 90 วัน Online → Archive Cold Storage

**Inventory & BOM**
- [ ] Stock Schema: stock_items, stock_movements (ผูก order_id ทุกครั้ง), purchase_plans
- [ ] BOM per Menu: Fork จาก Preset, แก้สูตรได้เอง, Cost per Cup
- [ ] Auto Stock Deduction (Atomic Transaction):
  - Order Confirmed → BOM → Deduct ทุก Item พร้อมกัน
  - Stock ไม่พอ → ไม่ Deduct เลย + Alert + Auto-toggle เมนู "หมด"
- [ ] Low Stock Alert: current_qty < min_qty → แจ้งเจ้าของ

**Reporting & Analytics**
- [ ] P&L Dashboard: รายรับ/รายจ่าย/กำไรขั้นต้น แยก วัน/สัปดาห์/เดือน
- [ ] Best Seller + Peak Hour Graph + Member Analytics
- [ ] Export CSV + Export PDF Summary (แชร์ LINE ได้ 1 คลิก)

#### Hard Gate (ต้องผ่านก่อนไป Stage 4)

- [ ] UAT App ทุกข้อใน Stage 3 ผ่าน
- [ ] BOM Atomic Transaction: ถ้า Stock ไม่พอ → ไม่ Deduct เลย
- [ ] Auto Stock Deduction Trigger ทำงานถูกต้องทุก Order Type
- [ ] Offline Sync Idempotent: ผลลัพธ์เดิมแม้ Sync ซ้ำ
- [ ] Multi-staff Realtime: ไม่มี Race Condition เมื่อกด Status พร้อมกัน
- [ ] P&L คำนวณถูกต้อง ตรงกับ Order + Stock Movement จริง
- [ ] LCP < 1.5s บน 3G (Lighthouse Audit)

#### ⚠️ Known Risks (Stage 3)

| ความเสี่ยง | ระดับ | Action |
|------------|-------|--------|
| Race Condition Multi-staff Queue | กลาง | ทดสอบ 2 คนกด Status พร้อมกัน |
| P&L Price Fallback (price=null) | กลาง | Backfill price จาก final_price ก่อน |

---

### Stage 4 — Pre-Launch Hardening ⏳ 0%

**เป้าหมาย**: Security Full Audit + Performance Test + UAT ร้านจริง — ห้าม Skip

#### Deliverables

- [ ] Cross-tenant Test: ร้าน A Access Resource ร้าน B → 403 ทุกกรณี
- [ ] JWT Leakage Test: Token Tenant A ใช้กับ Tenant B ไม่ได้
- [ ] API Key/Secret ไม่โผล่ฝั่ง Client Bundle (ตรวจ build output)
- [ ] Security Score A+ (securityheaders.com): HSTS, CSP, X-Frame, CORP, COOP, SRI
- [ ] Lighthouse บน 3G: LCP < 1.5s, FID < 100ms, CLS < 0.1
- [ ] Load Test Peak: Simulate 200 Concurrent Orders ต่อร้าน
- [ ] PITR Restore Test: ทดสอบ Restore จาก Backup สำเร็จ (RTO < 1 ชั่วโมง)
- [ ] UAT ร้านจริง 2–3 ร้าน บน Staging — รัน Checklist Stage 1–3 ทุกข้อ
- [ ] UX Polish: ผู้ใช้ที่ไม่เก่งเทคทำตามคู่มือสั้นได้
- [ ] Smoke Test ทุก Flow บน Staging Environment

#### Hard Gate (ต้องผ่านก่อนไป Stage 5)

- [ ] Security Score A+ ผ่าน
- [ ] Cross-tenant Test ผ่านทุกกรณี
- [ ] PITR Restore Test ผ่าน
- [ ] LCP < 1.5s บน 3G
- [ ] UAT ร้านจริงอย่างน้อย 2 ร้าน ผ่านทุกข้อ
- [ ] Critical Bug = 0
- [ ] Rollback ทดสอบสำเร็จ < 5 นาที

---

### Stage 5 — Launch & Go-to-Market ⏳ 0%

**เป้าหมาย**: เปิดขายจริง — Landing Page, Onboarding, Support พร้อม

#### Deliverables

- [ ] Landing Page: Features / Pricing Card 149.-/เดือน / CTA "ทดลองใช้ฟรี"
- [ ] QR/Barcode บน Landing → Sign-up Flow (UAT Scan จากมือถือจริง)
- [ ] Analytics: เก็บ Lead + ติดตาม Conversion Rate
- [ ] Frictionless Onboarding: LINE Login → Auto-provision < 30 วินาที
- [ ] Onboarding Checklist UI: Guide เจ้าของร้านใหม่ (เพิ่มเมนู → ตั้ง QR → ทดสอบสั่ง)
- [ ] Time-to-Value Metric: Signup → ออเดอร์แรก < 10 นาที
- [ ] Health Check: 24 ชม. หลัง Signup → Alert ถ้ายังไม่มีเมนูหรือออเดอร์
- [ ] LINE OA + Rich Menu อัตโนมัติหลังสมัคร
- [ ] FAQ + Quick Start Guide + วิดีโอสั้น < 2 นาที
- [ ] Support Channel: LINE / Chat พร้อมทีมตอบ
- [ ] บันทึก "วันเปิดขาย" + Rollback Plan Document

#### Hard Gate (ต้องผ่านก่อนไป Stage 6)

- [ ] Onboarding Flow: Signup → ออเดอร์แรก < 10 นาที (วัดได้จริง)
- [ ] Smoke Test ทุก Flow บน Production Domain ผ่าน
- [ ] Support Channel พร้อม: ตอบ LINE ได้ภายใน 1 ชั่วโมง
- [ ] Rollback Plan Document + Test แล้ว
- [ ] บันทึก "วันเปิดขาย" อย่างเป็นทางการ

---

### Stage 6 — Scale & Growth ⏳ 0%

**เป้าหมาย**: SaaS Analytics, Feature Flag, Tiered Pricing, Migration Path

#### Deliverables

- [ ] SaaS Business Dashboard: MRR, Churn Rate, New Tenant Growth, Feature Adoption
- [ ] Churn Risk Alert: Tenant ไม่มี Activity 7 วัน → Re-engagement Notification
- [ ] Feature Flag System: Toggle per Store/Plan ไม่ต้อง Redeploy
  - Beta Testing: เปิดกับ 10 ร้านก่อน → วัดผล → Rollout ทั้งหมด
- [ ] Tiered Pricing: Basic 149.-/Pro/Enterprise + Feature Flag ต่อ Plan
- [ ] Pool → Silo Migration Runbook (Enterprise Tenant, ไม่มี Downtime)
- [ ] Multi-branch (Phase 7+)
- [ ] CRM + Partner Program (Phase 7+)

---

## 🚨 Open Risks — ทั้งโปรเจกต์

| ความเสี่ยง | ระดับ | Stage | Action Required |
|------------|-------|-------|-----------------|
| RLS ยังไม่เปิดเต็มรูป | **สูง** | 1 | ห้ามเปิดรับร้านจริงหลายร้านจนกว่า Stage 1 Gate ผ่าน |
| PITR Restore ยังไม่ได้ทดสอบจริง | **สูง** | 2 | ต้องทดสอบก่อนผ่าน Stage 2 Gate |
| LINE Auth ยังเป็น Deep Link โครง | กลาง | 1 | ต้องทำ Flow จริงก่อนเปิด Stage 2 |
| Omise Production ต้องรอโดเมนจริง | กลาง | 2 | ทดสอบ test mode ได้ก่อน |
| Race Condition Multi-staff Queue | กลาง | 3 | ต้องทดสอบ 2 คนกด Status พร้อมกัน |
| P&L Price Fallback (price=null) | กลาง | 3 | Backfill price จาก final_price ก่อน Report |

---

## ✅ Master Checklist

### Stage 1 — Foundation
- [x] RLS: ร้าน A เข้าข้อมูลร้าน B ไม่ได้
- [x] LINE Deep Link: Login → เด้งเข้าแอป LINE
- [x] i18n: TH/EN 100% ทุกหน้า
- [x] Global Layout iPad/Mobile/PC
- [x] JWT มี store_id ทุก Request
- [x] Onboarding Atomic < 30 วินาที
- [ ] PWA + Offline + Auto Sync
- [ ] Optimistic UI: กดซ้ำ 5 ครั้ง → Order เดียว
- [ ] Security A+: HSTS, CSP, SSL ครบ
- [ ] Audit Log Immutable: ไม่มีใครลบได้

### Stage 2 — Billing + Infrastructure
- [ ] 149.- PromptPay → Active Auto
- [ ] Dunning: แจ้งเตือน 7/3/0 วัน
- [ ] Webhook Idempotency: ซ้ำ → Extend แค่ 1 ครั้ง
- [x] CI/CD: Push → Auto-deploy
- [ ] Rollback < 5 นาที
- [ ] PITR Restore Test ผ่าน
- [ ] Monitoring: Error → Alert On-call

### Stage 3 — MVP App
- [ ] Toggle พร้อมขาย/หมด Realtime
- [ ] Queue Display: เจ้าของ+ลูกค้า Sync
- [ ] QR Pay + เงินสด ทำงานถูกต้อง
- [ ] Auto Member: สแกน → สมาชิกทันที
- [ ] BOM Atomic Deduction
- [ ] Low Stock → Toggle เมนู Auto
- [ ] P&L + Export CSV ถูกต้อง
- [ ] Idempotent Offline Sync
- [ ] LCP < 1.5s บน 3G

### Stage 4 — Hardening
- [ ] Cross-tenant Test: ผ่านทุกกรณี
- [ ] Security A+ (securityheaders.com)
- [ ] UAT ร้านจริง 2 ร้าน ผ่านทุกข้อ
- [ ] Critical Bug = 0

### Stage 5 — Launch
- [ ] Onboarding < 10 นาที จริง
- [ ] Smoke บน Production ผ่าน
- [ ] Support Channel พร้อม

### Stage 6 — Scale
- [ ] MRR + Churn Dashboard ถูกต้อง
- [ ] Feature Flag ไม่ต้อง Redeploy
- [ ] Silo Migration ไม่มี Downtime

---

## 📌 Coding Rules & Constraints (สำหรับ Claude Code)

1. **ห้าม One-off Customization** ต่อ Tenant — ทุก Tenant ใช้ Codebase เดียวกันเสมอ
2. **JWT ทุกใบต้องมี `store_id`** — ใช้เป็น Downstream Authorization ทุก Service
3. **RLS คือ Tenant Isolation** — ไม่ใช่แค่ Login แล้วปลอดภัย ต้องแยกต่างหาก
4. **Audit Log = Insert Only** — ห้าม UPDATE/DELETE แม้แต่ ADMIN
5. **Soft Delete (`is_deleted`)** — ห้าม Hard Delete ข้อมูล Production
6. **Idempotency Key ต่อ Session** — กด Action ซ้ำ N ครั้ง ได้ผลเดียว
7. **Cache Key ต้องรวม `store_id`** — ป้องกันเมนู/ข้อมูลข้ามร้าน
8. **Atomic Transaction สำหรับ BOM Deduction** — ถ้า Stock ไม่พอ → ไม่ Deduct เลย
9. **Structured Log ทุกตัวต้องมี `store_id`, `user_id`, `request_id`**
10. **LINE Notify แยก Token ต่อ `store_id`** — ข้ามร้านไม่ได้
11. **Zero Trust** — API Key / Secret ไม่โผล่ฝั่ง Client เด็ดขาด
12. **ห้าม Version Drift** — Single Deployment Pipeline เท่านั้น

---

## 🔗 Environment & Keys (Placeholder)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Omise
OMISE_PUBLIC_KEY=
OMISE_SECRET_KEY=
OMISE_WEBHOOK_SECRET=

# LINE
LINE_CHANNEL_ID=
LINE_CHANNEL_SECRET=
LINE_NOTIFY_TOKEN=

# Cloudflare
CLOUDFLARE_ZONE_ID=
CLOUDFLARE_API_TOKEN=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_DOMAIN=
```

---

*ChongDeaw SaaS v4.0 · Milestone Edition · Single Source of Truth*  
*AWS SaaS Architecture Fundamentals Integrated · อัปเดตล่าสุด: 2026-04-05*