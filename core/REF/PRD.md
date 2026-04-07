# PRD.md — ChongDeaw Phase 1A + 1B (Safe Mode Foundation)
> อัปเดตล่าสุด: 2026-04-07 · Synced with chongdeaw-milestone-driven.md v5.1

## 1) Purpose
สร้างฐานระบบ SaaS สำหรับร้านกาแฟแบบ multi-tenant ให้พร้อมต่อยอด โดยเน้น:
- ความปลอดภัยของข้อมูล (tenant isolation จริง)
- ความเสถียรของโครงสร้าง (ไม่พังง่าย)
- การทำงานร่วมกับ Claude Code แบบควบคุมได้ (safe mode)

## 2) Phase Goals

### Phase 1A — Foundation + Auth + Tenant Isolation
เป้าหมาย: สร้าง "ฐานระบบที่ปลอดภัยและรันได้" ก่อนเริ่มฟีเจอร์ธุรกิจจริง

Definition of Done:
- ร้าน A ไม่สามารถเข้าถึงข้อมูลร้าน B ได้เลยในทุก layer
- LINE Auth ทำงาน flow จริง (ไม่ใช่ mock)
- JWT ทุก request มี `store_id` ที่ถูกต้อง

### Phase 1B — Core App MVP (Order · Queue · Payment)
เป้าหมาย: ร้านกาแฟใช้งานได้จริงครั้งแรก บน local + ngrok

Definition of Done:
- ลูกค้าสแกน QR → สั่ง → Staff รับ → ทำเสร็จ → จ่ายเงิน ทำงานได้ครบ
- Tenant isolation ผ่านทุก route ใหม่
- Webhook idempotent

## 3) In Scope

### Phase 1A (ทำอยู่)
- ✅ Next.js App Router + TypeScript + Tailwind (เสร็จแล้ว)
- ✅ โครงสร้างโฟลเดอร์ SaaS foundation (เสร็จแล้ว)
- ✅ Global layout shell mobile-first (เสร็จแล้ว)
- ✅ Navigation shell placeholder (เสร็จแล้ว)
- ✅ TH/EN i18n baseline (เสร็จแล้ว)
- ✅ Supabase client wiring (เสร็จแล้ว)
- ✅ Auth scaffold + LINE mock flow (เสร็จแล้ว)
- ✅ Tenant foundation (store_id, TenantContext, validation) (เสร็จแล้ว)
- ✅ Schema baseline (stores + profiles) (เสร็จแล้ว)
- ✅ RLS scaffold + baseline note (เสร็จแล้ว)
- 🔲 **Real LINE Auth** + OAuth callback จริง (ngrok)
- 🔲 **Real JWT store_id claim** injection
- 🔲 **RLS execution** ครบทุก table
- 🔲 **Tenant isolation UAT** end-to-end
- 🔲 Soft delete audit (is_deleted = false ทุก query)
- 🔲 PWA manifest + offline shell baseline
- 🔲 Security headers baseline (HSTS, CSP, X-Frame)
- 🔲 Rate limit per store_id (middleware)
- 🔲 Optimistic UI baseline (TanStack Query + Idempotency Key)

### Phase 1B (รอ Phase 1A Gate ผ่านก่อน)
- 🔲 Seed Data script (3 ร้าน + เมนู + stock + orders)
- 🔲 Playwright multi-context setup
- 🔲 เมนูหน้าร้าน `/[slug]/menu` + ISR Cache per store_id
- 🔲 QR โต๊ะ → bind table_no → Order
- 🔲 Order + Order Items (Atomic transaction)
- 🔲 Queue Display Realtime (Supabase Channel per store_id)
- 🔲 Staff Order Management (Accept/Done)
- 🔲 Multi-staff safe state (Playwright test)
- 🔲 LINE Notify per store_id
- 🔲 PromptPay QR (Omise test key) + เงินสด
- 🔲 Omise Webhook → ngrok → realtime update
- 🔲 Webhook Idempotency
- 🔲 Partial Failure UX (QR timeout → fallback เงินสด)
- 🔲 Auto-register member (LINE scan ครั้งแรก)
- 🔲 Offline Sync + Idempotent Sync
- 🔲 Graceful degradation (Realtime → fallback polling)

## 4) Out of Scope (Phase 1A + 1B)
- Billing / Subscription (Phase 2)
- Stock / BOM / P&L Reports (Phase 3)
- Security A+ audit / Load test (Phase 4)
- Landing page / Go-to-market (Phase 5)
- Feature flags / Tiered pricing (Phase 6)
- Cloudflare WAF (ต้องรอโดเมนจริง — Phase 2+)
- Omise Live key (ต้องรอโดเมนจริง — Phase 5)
- Refactor ใหญ่ทั้งระบบ
- Multi-branch support

## 5) Success Criteria

### Phase 1A
- โปรเจกต์รันได้หลังทุก task สำคัญ
- LINE Auth ทำงาน flow จริง (ไม่ใช่ mock)
- JWT มี store_id จาก server เท่านั้น
- RLS เปิดครบทุก table หลัก
- ร้าน A เข้าข้อมูลร้าน B ไม่ได้เลย
- Soft delete filter ทุก query

### Phase 1B
- QR → Order → Queue → Payment flow ทำงานได้ครบ
- Webhook idempotent (fire ซ้ำ → process ครั้งเดียว)
- Realtime ไม่ conflict เมื่อ 2 Staff ใช้งานพร้อมกัน
- Cache per store_id ไม่ข้ามร้าน
- LCP < 1.5s บน 3G

## 6) Product Rules
- ทุก task ต้องเล็กพอให้ commit ได้ภายในรอบเดียว
- ถ้าความเสี่ยงสูง → หยุดก่อน ไม่ฝืน
- ห้ามแก้ไฟล์นอก task โดยไม่มีเหตุผล
- ห้ามนับงานว่าเสร็จถ้ายังไม่ update state และยังไม่ commit
- ห้ามใช้ frontend `store_id` เป็น source of truth
- **ห้ามเริ่ม Phase 1B ก่อน Phase 1A Hard Gate ผ่านครบ**

## 7) Deliverables

### Phase 1A
- Real LINE Auth + session + store_id JWT
- RLS ครบทุก table หลัก
- Tenant isolation test ผ่าน
- Security headers baseline
- UAT Phase 1A pass note

### Phase 1B
- Order/Queue/Payment flow working
- Seed data script
- Playwright race condition test
- Omise webhook (test mode)
- UAT Phase 1B pass note

## 8) Definition of Done

### Phase 1A Done
- LINE Auth flow จริง end-to-end
- JWT store_id ถูกต้องทุก request
- RLS เปิดครบ + tenant isolation test ผ่าน
- Soft delete filter ทุก query
- เอกสาร core สะท้อนสถานะจริง

### Phase 1B Done
- QR → Order → Queue → Payment ทำงานได้ครบ
- Webhook idempotent
- Cache per store_id ถูกต้อง
- Realtime ไม่ conflict
- LCP < 1.5s
- UAT 1B ผ่านทุกข้อ

## 9) Hard Gate Summary
| Gate | ต้องผ่านก่อน | รายละเอียด |
|------|-------------|-----------|
| Phase 1A → 1B | LINE Auth จริง + RLS ครบ + JWT store_id + tenant isolation UAT | ดู milestone v5.1 Phase 1A Hard Gate |
| Phase 1B → 2 | Order Atomic + Realtime + Webhook idempotent + Cache per store_id | ดู milestone v5.1 Phase 1B Hard Gate |
