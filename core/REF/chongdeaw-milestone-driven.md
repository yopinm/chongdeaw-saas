# ChongDeaw · ชงเดี่ยว — SaaS Single Source of Truth
> **Milestone Edition v5.1** · อัปเดตล่าสุด: 2026-04-07  
> ใช้เป็น Single Source of Truth สำหรับ Claude Code + VS Code

---

## 🗺️ Project Overview

**ChongDeaw** คือ SaaS Platform สำหรับร้านกาแฟ Multi-tenant รองรับ 1,000+ ร้าน  
Stack: `Next.js 14` · `TypeScript` · `Tailwind CSS` · `Supabase (RLS)` · `Omise` · `Cloudflare` · `Vercel`

---

## 📊 Phase Progress

| Phase | ชื่อ | สถานะ | % |
|-------|------|--------|---|
| Phase 1A | Foundation + Auth + Tenant Isolation | 🔄 In Progress | ~70% |
| Phase 1B | Core App MVP (Order · Queue · Payment) | ⏳ Planned | 0% |
| Phase 2 | Billing + Infrastructure + Monitoring | ⏳ Planned | 0% |
| Phase 3 | Operations (Stock · BOM · Reports) | ⏳ Planned | 0% |
| Phase 4 | Pre-Launch Hardening | ⏳ Planned | 0% |
| Phase 5 | Launch & Go-to-Market | ⏳ Planned | 0% |
| Phase 6 | Scale & Growth | ⏳ Planned | 0% |

---

## 🧪 UAT Mode Legend

ทุก test case ในเอกสารนี้มี label บอกว่าทดสอบได้ที่ไหน

| Mode | ความหมาย | ต้องการอะไร |
|------|-----------|------------|
| ✅ LOCAL | รัน localhost ได้เลย | Node, Supabase local, ngrok |
| ⏳ STAGING | ต้องการ external service จริง | ngrok URL + Omise test key + LINE account |
| 🔴 LIVE | ทดสอบได้เฉพาะตอน go-live | โดเมนจริง + Omise live key + Cloudflare active |

> **หมายเหตุ**: ⏳ STAGING ทำได้ทันทีโดยไม่ต้องมีโดเมน — ใช้ ngrok/Cloudflare Tunnel เป็น public URL ชั่วคราว

---

## 🚨 Open Risks — ทั้งโปรเจกต์

| ความเสี่ยง | ระดับ | Phase | Action Required |
|------------|-------|-------|-----------------|
| RLS ยังไม่เปิดเต็มรูป | **สูง** | 1A | ห้ามเปิดรับร้านจริงหลายร้านจนกว่า Phase 1A Gate ผ่าน |
| LINE Auth ยังเป็น Deep Link โครง | **สูง** | 1A | ต้องทำ Flow จริงก่อนเข้า Phase 1B |
| PITR Restore ยังไม่ได้ทดสอบจริง | **สูง** | 2 | ต้องทดสอบก่อนผ่าน Phase 2 Gate |
| Cache Key ไม่รวม store_id → ข้อมูลข้ามร้าน | **สูง** | 1B | ตรวจ ISR + Edge Cache ทุก route |
| Soft Delete ลืม filter → ข้อมูลลบโผล่ | กลาง | 1A | audit query ทุก table ก่อน go-live |
| Race Condition Multi-staff Queue | กลาง | 1B | ทดสอบด้วย Playwright multi-context |
| Omise Live Key ลืม switch ตอน go-live | กลาง | 5 | Go-Live Checklist Phase 5 |
| Dunning cron ไม่ได้ทดสอบ timing จริง | กลาง | 2 | ใช้ pg_cron dev interval 1 นาที |
| P&L Price Fallback (price=null) | กลาง | 3 | Backfill price จาก final_price ก่อน Report |

---

## 🛠️ Dev Setup — Prerequisites

> ต้องติดตั้งก่อนจะรัน UAT ได้ครบ ทำครั้งเดียวตอนเริ่มต้น

### Tools ที่ต้องมี

| Tool | วัตถุประสงค์ | ติดตั้ง |
|------|-------------|---------|
| **ngrok** หรือ **Cloudflare Tunnel** | expose localhost เป็น HTTPS URL สำหรับ LINE callback + Omise webhook | `brew install ngrok` หรือ `npm i -g cloudflared` |
| **Playwright** | simulate multi-browser / multi-staff race condition | `npm i -D @playwright/test` |
| **Supabase CLI** | local DB + seed data + pg_cron local | `brew install supabase/tap/supabase` |
| **Omise Test Keys** | `pkey_test_*` / `skey_test_*` จาก Omise Dashboard | สมัครแล้ว ✅ |

### Config ที่ต้องทำก่อนรัน UAT

```bash
# 1. Start ngrok → copy HTTPS URL
ngrok http 3000
# ได้ URL เช่น https://abc123.ngrok.io

# 2. ตั้ง LINE OAuth callback ใน LINE Developers Console
#    Callback URL: https://abc123.ngrok.io/api/auth/callback/line

# 3. ตั้ง Omise Webhook endpoint ใน Omise Dashboard
#    Webhook URL: https://abc123.ngrok.io/api/webhooks/omise

# 4. อัพเดต .env.local
NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io
LINE_CALLBACK_URL=https://abc123.ngrok.io/api/auth/callback/line

# 5. Supabase local + seed
supabase start
supabase db reset  # รัน migrations + seed
```

### Dunning Dev Workaround

```sql
-- ใน dev: ย่อ interval pg_cron จาก 1 วัน → 1 นาที
-- เพื่อทดสอบ 7/3/0 วัน ได้ใน session เดียว
SELECT cron.schedule('dunning-check-dev', '* * * * *', 'SELECT run_dunning_check()');
-- หลังทดสอบเสร็จ reset กลับ
SELECT cron.unschedule('dunning-check-dev');
```

---

## 📋 Phase Details

---

### Phase 1A — Foundation + Auth + Tenant Isolation 🔄 In Progress

**เป้าหมาย**: วางโครงสร้าง Platform ที่แน่นหนา — Multi-tenant RLS จริง, LINE Auth จริง, i18n, Layout, Security Baseline  
**Definition of Done**: ร้าน A ไม่สามารถเข้าถึงข้อมูลร้าน B ได้เลยในทุก layer · JWT จริงมี store_id · LINE Login ทำงาน flow จริง

#### Deliverables

**✅ เสร็จแล้ว**
- [x] Next.js 14 App Router + TypeScript + Tailwind CSS *(TASK-001–004)*
- [x] Project structure: `src/app/[locale]` + `admin/control` แยกชัดเจน *(TASK-003)*
- [x] Global Layout shell — Mobile Header + Bottom Nav + Single Column *(TASK-005–006, TASK-020–024)*
- [x] i18n TH/EN ทั้งระบบ — next-intl + Dynamic Routing + fallback *(TASK-007–008, TASK-020-i18n)*
- [x] Supabase client baseline + env wiring *(TASK-009–010)*
- [x] Auth entry points scaffold + LINE mock flow *(TASK-011–012)*
- [x] Tenant/Store/Profile contracts (types + interfaces) *(TASK-013–014)*
- [x] Request validation layer — ไม่เชื่อ frontend `store_id` *(TASK-016)*
- [x] RLS baseline scaffold + limitation log *(TASK-017)*
- [x] Security baseline review Phase 1 *(TASK-018)*
- [x] Root route ไม่ 404 + Home UI ใช้งานได้ *(TASK-019–020)*

**🔲 ต้องทำต่อ**
- [ ] ngrok/Cloudflare Tunnel config สำหรับ LINE callback + dev environment *(ดู Dev Setup)*
- [ ] LINE Auth จริง — OAuth callback → Supabase session → store_id bind *(TASK-022)*
- [ ] Session → TenantContext bind ฝั่ง server (ไม่เชื่อ client store_id) *(TASK-023)*
- [ ] Inject `store_id` เข้า JWT claim (additive, ไม่รื้อของเดิม) *(TASK-024)*
- [ ] เปิด RLS ทีละ table — low-risk → high-risk *(TASK-025)*
- [ ] Audit query ทุก table: ตรวจว่ามี `AND is_deleted = false` ครบทุกจุด
- [ ] End-to-end Tenant Isolation test *(TASK-026)*
- [ ] audit_logs: Insert-only policy (ห้าม UPDATE/DELETE แม้แต่ ADMIN)
- [ ] Security Headers: HSTS, CSP, X-Frame-Options, CORP, COOP
- [ ] Rate Limit per store_id (Cloudflare / middleware)
- [ ] PWA baseline: next-pwa + offline cache shell
- [ ] Optimistic UI baseline: TanStack Query + Idempotency Key per session

#### 🔒 Hard Gate — ต้องผ่านทุกข้อก่อนเข้า Phase 1B

- [ ] LINE Auth ทำงาน flow จริง end-to-end (ไม่ใช่ mock)
- [ ] JWT ทุก request มี `store_id` ที่ถูกต้อง — ผ่าน automated test
- [ ] RLS เปิดครบทุก table หลัก + policy กัน `store_id` ผ่าน security review
- [ ] Tenant bind server-side: ไม่มีทางที่ client inject `store_id` เองได้
- [ ] ทุก query มี `AND is_deleted = false` — ผ่าน code review

#### 🧪 UAT Phase 1A

| # | Test Case | Mode | Expected | Pass |
|---|-----------|------|----------|------|
| 1A-U01 | Login ด้วย LINE จริง → redirect เข้าแอป | ⏳ STAGING | Session มี store_id ถูกต้อง | [ ] |
| 1A-U02 | Token ของร้าน A เรียก API ข้อมูลร้าน B | ✅ LOCAL | 403 Forbidden | [ ] |
| 1A-U03 | Request ไม่มี JWT → เรียก protected API | ✅ LOCAL | 401 Unauthorized | [ ] |
| 1A-U04 | Client ส่ง store_id ปลอมใน body | ✅ LOCAL | Server ใช้ store_id จาก JWT เท่านั้น | [ ] |
| 1A-U05 | เปิดแอปบน TH และ EN | ✅ LOCAL | ทุกหน้าแสดงภาษาถูก ไม่มี key หลุด | [ ] |
| 1A-U06 | Signup ใหม่ → store + profile สร้าง | ✅ LOCAL | Atomic < 30 วินาที ไม่มี orphan record | [ ] |
| 1A-U07 | พยายาม UPDATE/DELETE audit_log row | ✅ LOCAL | RLS policy block | [ ] |
| 1A-U08 | กด action ซ้ำ 3 ครั้ง idempotency key เดิม | ✅ LOCAL | ผลลัพธ์เดียว ไม่ duplicate | [ ] |
| 1A-U09 | ปิดเน็ต → เปิดแอป | ✅ LOCAL | เห็น offline shell ไม่ white screen | [ ] |
| 1A-U10 | Soft delete: ลบ product → query ทุกจุด | ✅ LOCAL | product ไม่โผล่ในทุก response | [ ] |
| 1A-U11 | Security headers scan (securityheaders.com) | 🔴 LIVE | ผ่าน Grade A+ | [ ] |

---

### Phase 1B — Core App MVP (Order · Queue · Payment) ⏳ Planned

**เป้าหมาย**: ร้านกาแฟใช้งานได้จริงครั้งแรก — ลูกค้าสั่งได้, Staff รับออเดอร์ได้, จ่ายเงินได้  
**Dependency**: Phase 1A Hard Gate ผ่านครบก่อน  
**Definition of Done**: ลูกค้าสแกน QR → สั่ง → Staff รับ → ทำเสร็จ → จ่ายเงิน flow ทำงานได้

#### Customer Flow
```
สแกน QR โต๊ะ → เลือกเมนู (พร้อมขาย/หมด) → กดสั่ง
→ ดูสถานะคิว Realtime → QR จ่าย หรือ เงินสด → จบ
```

#### Owner / Staff Flow
```
เห็น Order ใหม่ → กดรับ (Brewing) → ทำเสร็จ กดเสร็จ (Done)
→ คิวอัพเดต Realtime ทั้งลูกค้าและ Staff → จบ
```

#### Deliverables

**Setup & Data**
- [x] Seed Data script: สร้าง 3 ร้านทดสอบ + เมนู 10 รายการ + stock + orders 50 ใบ
  - ใช้สำหรับทดสอบ P&L, Best Seller, Stock movement ได้ทันที
  - `supabase/seed.sql` — รัน `supabase db reset` แล้วได้ข้อมูลพร้อมเลย
- [x] Playwright setup: multi-context config สำหรับ simulate 2 Staff พร้อมกัน

**Menu & Ordering**
- [ ] เมนูหน้าร้านต่อ store (`/[slug]/menu`) + Availability Toggle Realtime (`is_available`)
  - **Cache Key ต้องรวม `store_id`** — ป้องกันเมนูร้าน A โผล่ที่ร้าน B
  - ISR 60s + Edge Cache · LCP < 1.5s
- [ ] สแกน QR โต๊ะ → bind `table_no` เข้า order อัตโนมัติ
- [ ] สร้าง Order + Order Items (Atomic) — ถ้า insert ไม่ครบ → rollback ทั้งหมด
- [ ] ระบบสมาชิกอัตโนมัติ: LINE scan ครั้งแรก → auto-register member (ไม่ต้องกรอกฟอร์ม)

**Queue & Realtime**
- [ ] Queue Display — Supabase Realtime Channel `orders:store_id=eq.{id}`
  - Status flow: `pending` → `brewing` → `done`
  - รอ > 10 นาที → highlight แดงอัตโนมัติ
- [ ] Staff Order Management: Order Card พร้อมปุ่ม Accept / Done (iPad + Mobile)
- [ ] Multi-staff safe: 2 Staff กด status พร้อมกัน → ไม่ conflict (ทดสอบด้วย Playwright)
- [ ] LINE Notify แยก Token ต่อ `store_id` — ส่งแจ้งเตือน order ใหม่

**Payment**
- [ ] PromptPay QR (Omise **test key**, source API, timeout 15 นาที) + เงินสด
- [ ] Realtime status update เมื่อ Omise webhook ยืนยันการชำระ (ngrok รับ webhook)
- [ ] Partial Failure UX: QR หมดเวลา → Fallback เงินสด gracefully
- [ ] Webhook Idempotency: fire ซ้ำ → process แค่ครั้งเดียว

**Offline & Resilience**
- [ ] Offline Sync: Action ที่ทำตอน offline → sync เมื่อกลับมา online
- [ ] Idempotent Sync: sync action เดิม 2 ครั้ง → ผลเดิม ไม่ duplicate
- [ ] Graceful degradation: Realtime ตัด → fallback polling 10s

#### 🔒 Hard Gate — ต้องผ่านทุกข้อก่อนเข้า Phase 2

- [ ] Order Atomic: ถ้า insert order_items ล้มเหลว → order ไม่สร้าง
- [ ] Realtime Queue: Staff 2 คนเปิดพร้อมกัน → state sync ตรงกัน ไม่ conflict
- [ ] Webhook fire ซ้ำ → update แค่ 1 ครั้ง (idempotency key)
- [ ] Cache: เมนูร้าน A ไม่โผล่ที่ร้าน B ผ่าน ISR + Edge Cache
- [ ] LCP < 1.5s บน 3G (Lighthouse audit on menu page)
- [ ] ทุก API route Phase 1B ผ่าน tenant isolation: ร้าน A เรียกข้อมูลร้าน B → 403

#### 🧪 UAT Phase 1B

| # | Test Case | Mode | Expected | Pass |
|---|-----------|------|----------|------|
| 1B-U01 | สแกน QR โต๊ะ 3 → เมนูโหลด → กดสั่ง | ✅ LOCAL | Order สร้างพร้อม table_no=3 | [ ] |
| 1B-U02 | Staff กด Accept → ลูกค้าเห็น "กำลังชง" | ✅ LOCAL | Realtime sync < 2 วิ | [ ] |
| 1B-U03 | Staff 2 คนกด Done พร้อมกัน (Playwright) | ✅ LOCAL | สถานะ Done ครั้งเดียว ไม่ duplicate | [ ] |
| 1B-U04 | จ่าย PromptPay (test) → ngrok Webhook → paid | ⏳ STAGING | Realtime อัพเดต order เป็น paid | [ ] |
| 1B-U05 | Webhook fire ซ้ำ 2 ครั้ง | ⏳ STAGING | order paid ครั้งเดียว | [ ] |
| 1B-U06 | QR timeout → กดจ่ายเงินสดแทน | ⏳ STAGING | Flow ต่อได้ ไม่ error | [ ] |
| 1B-U07 | Toggle เมนู "หมด" → reload | ✅ LOCAL | ลูกค้าเห็น unavailable < 60s | [ ] |
| 1B-U08 | Cache: warm ร้าน A → เรียก URL ร้าน B | ✅ LOCAL | เห็นเมนูร้าน B เท่านั้น ไม่ปนร้าน A | [ ] |
| 1B-U09 | สแกน LINE ครั้งแรก (ngrok) | ⏳ STAGING | member สร้างอัตโนมัติ ไม่ต้องกรอก | [ ] |
| 1B-U10 | ปิดเน็ต → กดสั่ง → เปิดเน็ต | ✅ LOCAL | Order sync ถูก ไม่ duplicate | [ ] |
| 1B-U11 | ร้าน A เรียก order ของร้าน B ผ่าน API | ✅ LOCAL | 403 Forbidden | [ ] |
| 1B-U12 | Order insert ล้มกลางทาง (simulate DB error) | ✅ LOCAL | Rollback ทั้งหมด ไม่มี orphan order | [ ] |
| 1B-U13 | Lighthouse audit หน้า menu บน 3G | ✅ LOCAL | LCP < 1.5s | [ ] |

---

### Phase 2 — Billing + Infrastructure + Monitoring ⏳ Planned

**เป้าหมาย**: Subscription 149.-/เดือน + CI/CD Production-grade + Observability  
**Dependency**: Phase 1B Hard Gate ผ่านครบ

#### Deliverables

**Billing**
- [ ] Omise PromptPay 149.-/เดือน — Gen QR ผ่าน Omise Source API (**test key**)
- [ ] Subscription Lifecycle Auto: `active` → `grace` (3 วัน) → `suspended` → `locked`
- [ ] Idempotent Webhook + HMAC Signature Verification + Dead Letter Queue
- [ ] Dunning: LINE Notify + Email แจ้งเตือน 7 / 3 / 0 วันก่อนหมดอายุ
  - Dev workaround: ใช้ pg_cron interval 1 นาที *(ดู Dev Setup)*
- [ ] Billing Dashboard: Invoice PDF, ประวัติการชำระ, ปุ่มต่ออายุล่วงหน้า
- [ ] Dynamic QR Code per Store & Table (`[ngrok-url]/[slug]/table/[n]` ใน dev)

**Infrastructure**
- [ ] Vercel CI/CD: GitHub → Auto-deploy · Branch Strategy `main / develop / feature/*`
- [ ] Cloudflare WAF + Rate Limit per `store_id` *(ต้องรอโดเมนจริง)*
- [ ] Rollback: เก็บ 3 previous deployments · กลับ version ได้ < 5 นาที
- [ ] PITR Backup: ทดสอบ Restore จริง (RTO < 1 ชั่วโมง, RPO < 15 นาที)
- [ ] Noisy Neighbor Detection: throttle tenant ที่ใช้ resource เกิน

**Monitoring**
- [ ] Tenant-aware error tracking: Sentry/Datadog + `store_id` context
- [ ] Structured logging: ทุก log มี `store_id`, `user_id`, `request_id`
- [ ] Smoke Test หลัง deploy: `/api/health` + Tenant Isolation check auto
- [ ] Error spike → alert on-call ได้จริง

#### 🔒 Hard Gate — ต้องผ่านทุกข้อก่อนเข้า Phase 3

- [ ] ชำระ 149.- บน test mode → subscription `active` ถูกต้อง
- [ ] Webhook fire ซ้ำ → extend แค่ 1 ครั้ง
- [ ] Dunning timing: pg_cron dev interval ทดสอบสำเร็จ
- [ ] CI/CD auto-deploy ทำงานได้บน staging
- [ ] Smoke test ผ่านหลัง deploy (health + tenant isolation)
- [ ] PITR Restore ทดสอบสำเร็จ
- [ ] Error spike → alert ถึง on-call ได้จริง

#### 🧪 UAT Phase 2

| # | Test Case | Mode | Expected | Pass |
|---|-----------|------|----------|------|
| 2-U01 | ชำระ 149.- (Omise test key) → subscription | ⏳ STAGING | status = `active` ทันที | [ ] |
| 2-U02 | Webhook fire 2 ครั้ง | ⏳ STAGING | extend แค่ 1 ครั้ง | [ ] |
| 2-U03 | หมดอายุ → ยัง login ได้ภายใน 3 วัน | ✅ LOCAL | status = `grace` | [ ] |
| 2-U04 | หลัง grace ไม่ต่ออายุ | ✅ LOCAL | locked screen, status = `suspended` | [ ] |
| 2-U05 | Dunning dev: pg_cron 1 นาที simulate 7 วัน | ✅ LOCAL | ได้รับ LINE notify ถูก store | [ ] |
| 2-U06 | HMAC: webhook ส่ง signature ผิด | ⏳ STAGING | reject 401 ไม่ process | [ ] |
| 2-U07 | Push code → GitHub main → deploy | ⏳ STAGING | Auto-deploy < 5 นาที | [ ] |
| 2-U08 | Rollback 1 version | ⏳ STAGING | สำเร็จ < 5 นาที | [ ] |
| 2-U09 | PITR Restore snapshot 1 ชม.ก่อน | ⏳ STAGING | ข้อมูลครบ ไม่ missing | [ ] |
| 2-U10 | Simulate error spike | ⏳ STAGING | On-call ได้รับ alert | [ ] |
| 2-U11 | Smoke test หลัง deploy | ⏳ STAGING | 200 OK + tenant isolation pass | [ ] |
| 2-U12 | Cloudflare WAF: Rate limit per store_id | 🔴 LIVE | เกิน limit → 429 | [ ] |

---

### Phase 3 — Operations (Stock · BOM · Reports) ⏳ Planned

**เป้าหมาย**: ระบบหลังร้าน — ตัดสต็อกอัตโนมัติ, BOM, รายงาน P&L  
**Dependency**: Phase 2 Hard Gate ผ่านครบ

#### Deliverables

**Inventory & BOM**
- [ ] Stock Schema: `stock_items`, `stock_movements` (ผูก `order_id` ทุกครั้ง), `purchase_plans`
- [ ] Seed Data อัพเดต: เพิ่ม stock_items + BOM preset สำหรับร้านทดสอบทั้ง 3
- [ ] BOM per Menu: Fork จาก Preset, แก้สูตรได้เอง, Cost per Cup
- [ ] Auto Stock Deduction (Atomic Transaction):
  - Order Confirmed → BOM lookup → Deduct ทุก item พร้อมกัน
  - Stock ไม่พอ → ไม่ Deduct เลย + Alert + Auto-toggle เมนู "หมด"
- [ ] Low Stock Alert: `current_qty < min_qty` → แจ้งเจ้าของทาง LINE
- [ ] Purchase Plan: บันทึกแผนสั่งซื้อวัตถุดิบล่วงหน้า

**Staff Operations**
- [ ] LINE Notify: `pg_notify` message queue ต่อ `store_id`
- [ ] Bluetooth 58mm Thermal Printing (Web Bluetooth API, ไม่ต้อง Driver)
  - Graceful degradation: Printer ไม่เชื่อมต่อ → แสดงบนหน้าจอแทน
- [ ] Audit Log Retention: 90 วัน online → archive cold storage

**Reporting & Analytics**
- [ ] P&L Dashboard: รายรับ/รายจ่าย/กำไรขั้นต้น แยก วัน/สัปดาห์/เดือน
  - ต้องมี seed data ก่อนทดสอบ — *(ดู Seed Data task ใน Phase 1B)*
- [ ] Best Seller + Peak Hour Graph + Member Analytics
- [ ] Export CSV + Export PDF Summary (แชร์ LINE ได้ 1 คลิก)

#### 🔒 Hard Gate — ต้องผ่านทุกข้อก่อนเข้า Phase 4

- [ ] BOM Atomic: Stock ไม่พอ → ไม่ Deduct เลย (all or nothing)
- [ ] Auto Deduction trigger ถูกต้องทุก order type
- [ ] P&L คำนวณถูกต้อง — `unit_price` ต้องไม่เป็น null (backfill ก่อน)
- [ ] Export CSV/PDF: ตัวเลขตรงกับ Dashboard 100%

#### 🧪 UAT Phase 3

| # | Test Case | Mode | Expected | Pass |
|---|-----------|------|----------|------|
| 3-U01 | สั่ง Latte → BOM deduct นม 200ml + espresso 2 shot | ✅ LOCAL | stock_movements insert ถูก | [ ] |
| 3-U02 | Stock นม 100ml, Latte ต้องการ 200ml → สั่ง | ✅ LOCAL | ไม่ deduct + alert + toggle หมด | [ ] |
| 3-U03 | Deduct บางรายการล้มเหลว (simulate) | ✅ LOCAL | Rollback ทั้งหมด | [ ] |
| 3-U04 | `current_qty` < `min_qty` | ⏳ STAGING | เจ้าของได้รับ LINE ถูก store เท่านั้น | [ ] |
| 3-U05 | P&L วันนี้: ยอดขาย - ต้นทุน BOM | ✅ LOCAL | ตรงกับ order sum จริง (seed data) | [ ] |
| 3-U06 | P&L: unit_price = null → ระบบรับมือได้ | ✅ LOCAL | ไม่ crash, แสดง warning | [ ] |
| 3-U07 | Export CSV → เปิดใน Excel | ✅ LOCAL | ตัวเลขตรง encoding ถูก | [ ] |
| 3-U08 | Printer ไม่เชื่อมต่อ → กด print | ✅ LOCAL | แสดง order บนจอแทน ไม่ crash | [ ] |
| 3-U09 | Audit log 91 วัน (simulate) | ✅ LOCAL | online ≤ 90 วัน ส่วนเกิน archive | [ ] |
| 3-U10 | ร้าน A เรียก stock ร้าน B | ✅ LOCAL | 403 Forbidden | [ ] |

---

### Phase 4 — Pre-Launch Hardening ⏳ Planned

**เป้าหมาย**: Security Full Audit + Performance + UAT ร้านจริง — ห้าม Skip  
**Dependency**: Phase 3 Hard Gate ผ่านครบ

#### Deliverables

- [ ] Cross-tenant penetration test: ร้าน A access resource ร้าน B → 403 ทุกกรณี
- [ ] JWT Leakage test: token Tenant A ใช้กับ Tenant B ไม่ได้
- [ ] API Key/Secret ไม่โผล่ฝั่ง Client bundle (ตรวจ build output)
- [ ] Security Score A+ (securityheaders.com): HSTS, CSP, X-Frame, CORP, COOP, SRI
- [ ] Lighthouse 3G audit ทุก page หลัก: LCP < 1.5s, FID < 100ms, CLS < 0.1
- [ ] Load Test Peak: simulate 200 concurrent orders ต่อร้าน (k6 / Artillery)
- [ ] PITR Restore Test ซ้ำบน production-like environment
- [ ] UAT ร้านจริง 2–3 ร้าน บน staging — รัน checklist Phase 1A→3 ทุกข้อ
- [ ] UX Polish: เจ้าของร้านที่ไม่เก่งเทคทำตามคู่มือสั้นได้
- [ ] Rollback test: rollback เสร็จใน < 5 นาที

#### 🔒 Hard Gate — ต้องผ่านทุกข้อก่อนเข้า Phase 5

- [ ] Security Score A+ ผ่าน
- [ ] Cross-tenant test ผ่านทุกกรณี
- [ ] PITR Restore ผ่าน
- [ ] LCP < 1.5s บน 3G ทุก page หลัก
- [ ] UAT ร้านจริงอย่างน้อย 2 ร้าน ผ่านทุกข้อ
- [ ] Critical Bug = 0
- [ ] Rollback สำเร็จ < 5 นาที

#### 🧪 UAT Phase 4

| # | Test Case | Mode | Expected | Pass |
|---|-----------|------|----------|------|
| 4-U01 | Pentest: ร้าน A เรียก orders ร้าน B ทุก endpoint | ⏳ STAGING | 403 ทุกกรณี | [ ] |
| 4-U02 | Scan build output หา API key/secret | ✅ LOCAL | ไม่พบใน client bundle | [ ] |
| 4-U03 | securityheaders.com scan | 🔴 LIVE | Grade A+ | [ ] |
| 4-U04 | Lighthouse 3G: หน้า menu, queue, dashboard | ✅ LOCAL | LCP < 1.5s ทุกหน้า | [ ] |
| 4-U05 | Load: 200 concurrent orders ต่อร้าน (k6) | ⏳ STAGING | ไม่ 500, p95 < 2s | [ ] |
| 4-U06 | UAT ร้านจริง #1: flow ครบ Phase 1A→3 | ⏳ STAGING | ผ่านทุกข้อ | [ ] |
| 4-U07 | UAT ร้านจริง #2: flow ครบ Phase 1A→3 | ⏳ STAGING | ผ่านทุกข้อ | [ ] |
| 4-U08 | เจ้าของร้านใหม่ติดตั้ง + ใช้งานตามคู่มือสั้น | ⏳ STAGING | ไม่ต้องโทรถาม support | [ ] |
| 4-U09 | Rollback 1 version ย้อนหลัง | ⏳ STAGING | สำเร็จ < 5 นาที data ครบ | [ ] |

---

### Phase 5 — Launch & Go-to-Market ⏳ Planned

**เป้าหมาย**: เปิดขายจริง — Landing Page, Onboarding, Support พร้อม  
**Dependency**: Phase 4 Hard Gate ผ่านครบ

#### Deliverables

- [ ] Landing Page: Features / Pricing Card 149.-/เดือน / CTA "ทดลองใช้ฟรี"
- [ ] QR Signup Flow: สแกน QR บน Landing → LINE Login → auto-provision (UAT บนมือถือจริง)
- [ ] Frictionless Onboarding: Signup → ใช้งานได้ < 30 วินาที
- [ ] Onboarding Checklist UI: guide เจ้าของร้านใหม่ (เพิ่มเมนู → ตั้ง QR → ทดสอบสั่ง)
- [ ] Time-to-Value Metric: Signup → ออเดอร์แรก < 10 นาที (วัดได้จริง)
- [ ] Health Check: 24 ชม. หลัง signup → alert ถ้ายังไม่มีเมนูหรือออเดอร์
- [ ] LINE OA + Rich Menu อัตโนมัติหลังสมัคร
- [ ] Analytics: เก็บ Lead + ติดตาม Conversion Rate
- [ ] FAQ + Quick Start Guide + วิดีโอสั้น < 2 นาที
- [ ] Support Channel: LINE / Chat พร้อมทีมตอบภายใน 1 ชั่วโมง
- [ ] **Switch Omise key: Test → Live** (ดู Go-Live Checklist ด้านล่าง)
- [ ] Rollback Plan Document พร้อม + ทดสอบแล้ว
- [ ] บันทึก "วันเปิดขาย" อย่างเป็นทางการ

#### 🚀 Go-Live Day Checklist

> รัน checklist นี้ตามลำดับในวันเปิดขายจริง — ห้ามข้ามข้อ

- [ ] **DNS**: point domain → Vercel IP ถูกต้อง · TTL propagate แล้ว
- [ ] **SSL**: certificate active · HTTPS ทุก route ไม่มี redirect loop
- [ ] **Cloudflare**: zone active · WAF rules enable · Rate limit per store_id on
- [ ] **Omise**: switch `OMISE_PUBLIC_KEY` + `OMISE_SECRET_KEY` → Live key · verify ใน dashboard
- [ ] **Omise Webhook**: อัพเดต webhook URL ใน Omise dashboard → production domain จริง
- [ ] **LINE OAuth**: อัพเดต callback URL → production domain จริง
- [ ] **LINE Notify**: verify token ทุก store ยังใช้งานได้
- [ ] **Env vars**: ตรวจ production env ใน Vercel ว่าไม่มี test key หลงเหลือ
- [ ] **Smoke test**: รัน UAT 5-U04 บน production domain
- [ ] **PITR**: verify backup ล่าสุดไม่เกิน 15 นาที
- [ ] **Monitoring**: Sentry/Datadog dashboard เปิด · alert rules active
- [ ] **Support**: LINE OA พร้อม · ทีมพร้อมตอบ
- [ ] **บันทึกวันเปิดขาย** + screenshot dashboard เป็น baseline

#### 🔒 Hard Gate — ต้องผ่านทุกข้อก่อนเข้า Phase 6

- [ ] Go-Live Checklist ผ่านครบทุกข้อ
- [ ] Signup → ออเดอร์แรก < 10 นาที (วัดได้จริงบน production)
- [ ] Smoke test ทุก flow บน production domain ผ่าน
- [ ] Support channel พร้อม: ตอบ LINE ได้ภายใน 1 ชั่วโมง
- [ ] Omise Live key active · ไม่มี test key ใน production

#### 🧪 UAT Phase 5

| # | Test Case | Mode | Expected | Pass |
|---|-----------|------|----------|------|
| 5-U01 | Omise test key: Gen QR 149.- → webhook | ⏳ STAGING | subscription active | [ ] |
| 5-U02 | สแกน QR บน landing page → signup flow | 🔴 LIVE | ทำงานบนมือถือจริง ไม่ติด | [ ] |
| 5-U03 | Signup → เพิ่มเมนู → ตั้ง QR → ออเดอร์แรก | 🔴 LIVE | < 10 นาที | [ ] |
| 5-U04 | 24 ชม. หลัง signup ไม่มีเมนู | 🔴 LIVE | ได้รับ LINE แจ้งเตือน | [ ] |
| 5-U05 | Smoke test production: ทุก flow หลัก | 🔴 LIVE | ไม่มี 5xx | [ ] |
| 5-U06 | Omise Live key: ชำระจริง 1.- (test transaction) | 🔴 LIVE | เงินเข้าจริง · webhook ถูก | [ ] |
| 5-U07 | ส่งข้อความ LINE support | 🔴 LIVE | ได้รับตอบ < 1 ชั่วโมง | [ ] |

---

### Phase 6 — Scale & Growth ⏳ Planned

**เป้าหมาย**: SaaS Analytics, Feature Flag, Tiered Pricing, Migration Path  
**Dependency**: Phase 5 Hard Gate ผ่านครบ

#### Deliverables

- [ ] SaaS Business Dashboard: MRR, Churn Rate, New Tenant Growth, Feature Adoption
- [ ] Churn Risk Alert: Tenant ไม่มี activity 7 วัน → re-engagement notification
- [ ] Feature Flag System: toggle per store/plan ไม่ต้อง redeploy
  - Beta Testing: เปิดกับ 10 ร้านก่อน → วัดผล → rollout ทั้งหมด
- [ ] Tiered Pricing: Basic 149.- / Pro / Enterprise + Feature Flag ต่อ Plan
- [ ] Pool → Silo Migration Runbook (Enterprise Tenant, ไม่มี Downtime)
- [ ] Multi-branch support (Phase 7+)
- [ ] CRM + Partner Program (Phase 7+)

#### 🔒 Hard Gate

- [ ] MRR + Churn คำนวณถูกต้อง ตรวจสอบได้
- [ ] Feature Flag toggle ไม่ต้อง redeploy
- [ ] Silo Migration runbook ผ่าน dry-run ไม่มี downtime

#### 🧪 UAT Phase 6

| # | Test Case | Mode | Expected | Pass |
|---|-----------|------|----------|------|
| 6-U01 | MRR dashboard: ร้านจ่ายใหม่ 3 ร้าน | 🔴 LIVE | ตัวเลข MRR อัพเดตถูก | [ ] |
| 6-U02 | Tenant ไม่ active 7 วัน | 🔴 LIVE | ได้รับ re-engagement notification | [ ] |
| 6-U03 | Toggle Feature Flag | 🔴 LIVE | เปิด/ปิดทันที ไม่มี downtime ไม่ต้อง deploy | [ ] |
| 6-U04 | Silo migration dry-run: 1 tenant ย้าย | 🔴 LIVE | ข้อมูลครบ ไม่มี downtime | [ ] |

---

## 📚 Reference

> ส่วนนี้เป็นข้อมูลอ้างอิงสำหรับ Developer — ไม่ใช่ action item ในแต่ละ phase

---

### ⚙️ Tech Stack & Architecture Decisions

```
Dev            : Control version and Git Ignore important files
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

### AWS SaaS Architecture Patterns ที่ใช้

- **Control Plane vs Application Plane** — แยก `/admin/control` (Billing/Onboarding/Metrics) ออกจาก `/[locale]` (Tenant App)
- **Pool Model + RLS** — Shared DB, Row Level Security per `store_id`
- **SaaS Identity** — JWT ทุกใบต้องมี `store_id` เป็น Tenant Context
- **Single Deployment Pipeline** — ทุก Tenant รัน Software เวอร์ชันเดียวกัน ห้าม One-off Customization
- **Frictionless Onboarding** — Signup → ใช้งานได้ < 30 วินาที (Atomic DB Trigger)
- **Dunning Management** — แจ้งเตือน 7/3/0 วันก่อนหมดอายุ ลด Churn

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

---

### 🗄️ Database Schema

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
  is_available BOOLEAN,
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
plan_features (plan_id, feature_key, is_enabled)

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

-- Feature Flags (Phase 6)
feature_flags (flag_key, store_id, is_enabled)
```

### RLS Policy Pattern

```sql
CREATE POLICY tenant_isolation ON products
  USING (
    store_id = (auth.jwt()->'user_metadata'->>'store_id')::uuid
    AND is_deleted = false
  );
```

> ⚠️ **CRITICAL**: ต้อง Enable RLS ครบทุกตารางก่อนเปิดรับร้านจริงหลายร้าน

---

### 📌 Coding Rules & Constraints

1. **ห้าม One-off Customization** ต่อ Tenant — ทุก Tenant ใช้ Codebase เดียวกันเสมอ
2. **JWT ทุกใบต้องมี `store_id`** — ใช้เป็น Downstream Authorization ทุก Service
3. **RLS คือ Tenant Isolation** — ไม่ใช่แค่ Login แล้วปลอดภัย ต้องแยกต่างหาก
4. **Audit Log = Insert Only** — ห้าม UPDATE/DELETE แม้แต่ ADMIN
5. **Soft Delete (`is_deleted`)** — ห้าม Hard Delete ข้อมูล Production · ทุก query ต้องมี `AND is_deleted = false`
6. **Idempotency Key ต่อ Session** — กด Action ซ้ำ N ครั้ง ได้ผลเดียว
7. **Cache Key ต้องรวม `store_id`** — ป้องกันเมนู/ข้อมูลข้ามร้าน
8. **Atomic Transaction สำหรับ BOM Deduction** — ถ้า Stock ไม่พอ → ไม่ Deduct เลย
9. **Structured Log ทุกตัวต้องมี `store_id`, `user_id`, `request_id`**
10. **LINE Notify แยก Token ต่อ `store_id`** — ข้ามร้านไม่ได้
11. **Zero Trust** — API Key / Secret ไม่โผล่ฝั่ง Client เด็ดขาด
12. **ห้าม Version Drift** — Single Deployment Pipeline เท่านั้น
13. **Omise Key Discipline** — `test key` ใน dev/staging เท่านั้น · `live key` ใน production เท่านั้น · ห้ามสลับกัน

---

### 🔗 Environment & Keys (Placeholder)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Omise — ใช้ test key ใน dev/staging เสมอ
OMISE_PUBLIC_KEY=pkey_test_...
OMISE_SECRET_KEY=skey_test_...
OMISE_WEBHOOK_SECRET=

# LINE
LINE_CHANNEL_ID=
LINE_CHANNEL_SECRET=
LINE_NOTIFY_TOKEN=
LINE_CALLBACK_URL=https://[ngrok-or-domain]/api/auth/callback/line

# Cloudflare
CLOUDFLARE_ZONE_ID=
CLOUDFLARE_API_TOKEN=

# App
NEXT_PUBLIC_APP_URL=https://[ngrok-or-domain]
NEXT_PUBLIC_APP_DOMAIN=
```

---

*ChongDeaw SaaS v5.1 · Milestone Edition · Single Source of Truth*  
*Added: Dev Setup · UAT Mode Labels · Seed Data · ngrok config · Dunning workaround · Playwright · Omise key switch · Cache UAT · Soft Delete UAT · Go-Live Checklist*  
*อัปเดตล่าสุด: 2026-04-07 · Synced with TASK_QUEUE.md (TASK-001 → TASK-024 DONE)*
