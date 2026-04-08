# TASK_QUEUE.md — ChongDeaw Safe Mode Task Queue
> อัปเดตล่าสุด: 2026-04-07 · Synced with chongdeaw-milestone-driven.md v5.1

## Rules
- ทำทีละ 1 task
- 1 task = 1 commit
- ถ้า task ใหญ่เกิน ให้แตกก่อนแล้วค่อยทำ
- ห้ามข้ามลำดับเอง
- ถ้า task ค้าง ให้ mark เป็น PARTIAL หรือ BLOCKED ใน state ก่อน

## Status Key
- TODO
- DOING
- DONE
- BLOCKED

---

## ✅ Phase 1A — Foundation + Auth + Tenant Isolation

> เป้าหมาย: Multi-tenant RLS จริง · LINE Auth จริง · i18n · Layout · Security Baseline

### Layout & Structure (DONE)
- [DONE] TASK-001: ตรวจสอบ project root และยืนยันไฟล์/โฟลเดอร์ที่จำเป็น โดยไม่รื้อโครงเดิม
- [DONE] TASK-002: ตรวจสอบว่า Next.js + TypeScript + Tailwind setup ยังอยู่ในสภาพพร้อมใช้งาน
- [DONE] TASK-003: ยืนยันโครงสร้างเส้นทางหลักของ app และลดความสับสนระหว่าง `app/` กับ `src/`
- [DONE] TASK-004: จัดระเบียบ foundation folders — components, lib, services เฉพาะที่ Phase 1A ต้องใช้
- [DONE] TASK-005: สร้าง global layout shell แบบ mobile-first
- [DONE] TASK-006: เพิ่ม navigation shell — Home, Queue, Revenue, CRM, Settings (placeholder)
- [DONE] TASK-007: วาง baseline i18n TH/EN ให้สอดคล้องกับโครง route ปัจจุบัน
- [DONE] TASK-008: เพิ่ม language toggle ใน layout shell
- [DONE] TASK-019: แก้ root route ให้ `localhost:3000` ไม่ 404
- [DONE] TASK-020: เพิ่ม mock Home UI ขั้นต่ำบน layout shell
- [DONE] TASK-020-routing: แก้ /th 404 — เพิ่ม generateStaticParams() ใน app/[locale]/layout.tsx
- [DONE] TASK-020-middleware: แก้ src/middleware.ts ให้ export createMiddleware โดยตรง (next-intl v4)
- [DONE] TASK-020-i18n: แก้ src/i18n/request.ts — ลบ notFound(); fallback เป็น "th"
- [DONE] TASK-020-ui: ปรับ Home UI mobile-first layout
- [DONE] TASK-020-ui2: Polish Home UI — tap feedback, primary card, footer nav
- [DONE] TASK-021-ui: Force single column layout ทุก breakpoint
- [DONE] TASK-021-ui2: Center layout + รวม stat cards เป็น card เดียว
- [DONE] TASK-022-home-layout: ลบ AppShell ออกจาก [locale]/layout.tsx — Home standalone
- [DONE] TASK-023-layout: ลบ sidebar ออกจาก AppShell globally
- [DONE] TASK-024-ui: ลด content width max-w-4xl → max-w-2xl

### Supabase & Env (DONE)
- [DONE] TASK-009: ตั้งค่า Supabase client baseline
- [DONE] TASK-010: ตรวจสอบ env wiring และสรุปสิ่งที่ยังขาด

### Auth Scaffold (DONE)
- [DONE] TASK-011: scaffold login entry และ auth entry points
- [DONE] TASK-012: วาง LINE login integration point / mock flow (ชัดว่ายังไม่จริง)

### Tenant Foundation (DONE)
- [DONE] TASK-013: สร้าง tenant/profile/store contracts ฝั่งโค้ด
- [DONE] TASK-014: สรุป schema baseline สำหรับ stores และ profiles
- [DONE] TASK-015: วางแนวทาง bind `store_id` เข้ากับ auth/session context
- [DONE] TASK-016: วาง request validation layer — ไม่เชื่อ frontend `store_id`
- [DONE] TASK-017: scaffold RLS baseline และบันทึก limitation
- [DONE] TASK-018: ทบทวน security baseline Phase 1A

### Auth Real Integration (TODO ← NEXT)
- [DONE] TASK-1A-021: ทบทวน auth entry points และ route callback/login/logout ให้พร้อม UAT
- [DONE] TASK-1A-022: เชื่อม Real LINE Auth + Supabase session (ngrok callback)
- [TODO] TASK-1A-023: bind real session เข้ากับ TenantContext ฝั่ง server — ไม่เชื่อ client `store_id`
- [TODO] TASK-1A-024: inject `store_id` เข้า JWT claim (additive mode)
- [TODO] TASK-1A-025: เปิด RLS ทีละ table — low-risk → high-risk
- [TODO] TASK-1A-026: audit query ทุก table — ตรวจ `AND is_deleted = false` ครบทุกจุด
- [TODO] TASK-1A-027: รัน end-to-end tenant isolation UAT (UAT 1A-U01 → 1A-U11)
- [TODO] TASK-1A-028: เขียนสรุป Phase 1A readiness / pass-fail note
- [TODO] TASK-1A-029: อัปเดตเอกสาร core ให้ตรงกับสถานะ UAT Phase 1A จริง

### Phase 1A Hard Gate (ต้องผ่านก่อนเข้า Phase 1B)
- [ ] LINE Auth flow จริง end-to-end
- [ ] JWT ทุก request มี `store_id` ถูกต้อง — ผ่าน automated test
- [ ] RLS เปิดครบทุก table หลัก
- [ ] Tenant bind server-side: client inject `store_id` เองไม่ได้
- [ ] ทุก query มี `AND is_deleted = false` — ผ่าน code review

---

## ⏳ Phase 1B — Core App MVP (Order · Queue · Payment)

> เป้าหมาย: ร้านสั่งได้ · Staff รับออเดอร์ได้ · จ่ายเงินได้ · ทดสอบได้บน local + ngrok
> Dependency: Phase 1A Hard Gate ผ่านครบก่อน

- [DONE] TASK-1B-001: Setup Seed Data script — 3 ร้าน + เมนู 10 รายการ + stock + 50 orders (`supabase/seed.sql`)
- [DONE] TASK-1B-002: Setup Playwright multi-context สำหรับ simulate 2 Staff พร้อมกัน
- [TODO] TASK-1B-003: เมนูหน้าร้าน `/[slug]/menu` + Availability Toggle Realtime (`is_available`)
  - Cache Key ต้องรวม `store_id` — ป้องกัน ISR cache ข้ามร้าน
- [TODO] TASK-1B-004: QR โต๊ะ → bind `table_no` เข้า order อัตโนมัติ
- [TODO] TASK-1B-005: สร้าง Order + Order Items (Atomic transaction)
- [TODO] TASK-1B-006: Queue Display — Supabase Realtime Channel `orders:store_id=eq.{id}`
  - Status: pending → brewing → done · รอ > 10 นาที → highlight แดง
- [TODO] TASK-1B-007: Staff Order Management — Order Card + Accept/Done button (iPad + Mobile)
- [TODO] TASK-1B-008: Multi-staff safe state — ทดสอบด้วย Playwright (ไม่ conflict, ไม่ duplicate)
- [TODO] TASK-1B-009: LINE Notify แยก Token ต่อ `store_id`
- [TODO] TASK-1B-010: PromptPay QR (Omise test key, timeout 15 นาที) + เงินสด
- [TODO] TASK-1B-011: Omise Webhook → ngrok → realtime update order status
- [TODO] TASK-1B-012: Webhook Idempotency — fire ซ้ำ → process ครั้งเดียว
- [TODO] TASK-1B-013: Partial Failure UX — QR timeout → fallback เงินสด
- [TODO] TASK-1B-014: ระบบสมาชิกอัตโนมัติ — LINE scan ครั้งแรก → auto-register
- [TODO] TASK-1B-015: Offline Sync + Idempotent Sync
- [TODO] TASK-1B-016: Graceful degradation — Realtime ตัด → fallback polling 10s
- [TODO] TASK-1B-017: รัน UAT Phase 1B (UAT 1B-U01 → 1B-U13)
- [TODO] TASK-1B-018: อัปเดตเอกสาร core หลังผ่าน Phase 1B

### Phase 1B Hard Gate (ต้องผ่านก่อนเข้า Phase 2)
- [ ] Order Atomic: insert ล้มเหลว → rollback ทั้งหมด
- [ ] Realtime Queue: 2 Staff sync ตรงกัน ไม่ conflict
- [ ] Webhook fire ซ้ำ → update แค่ 1 ครั้ง
- [ ] Cache: เมนูร้าน A ไม่โผล่ร้าน B
- [ ] LCP < 1.5s บน 3G (Lighthouse)
- [ ] ทุก API Phase 1B: ร้าน A เรียกข้อมูลร้าน B → 403

---

## ⏳ Phase 2 — Billing + Infrastructure + Monitoring

> Dependency: Phase 1B Hard Gate ผ่านครบ · ดู milestone v5.1 สำหรับ task ละเอียด

- [TODO] TASK-2-001: Omise PromptPay 149.- subscription (test key)
- [TODO] TASK-2-002: Subscription Lifecycle Auto (active → grace → suspended → locked)
- [TODO] TASK-2-003: Idempotent Webhook + HMAC + Dead Letter Queue
- [TODO] TASK-2-004: Dunning LINE Notify 7/3/0 วัน + pg_cron dev workaround
- [TODO] TASK-2-005: Billing Dashboard (Invoice PDF, ประวัติ, ต่ออายุล่วงหน้า)
- [TODO] TASK-2-006: Vercel CI/CD + Branch Strategy
- [TODO] TASK-2-007: Rollback — เก็บ 3 versions, กลับได้ < 5 นาที
- [TODO] TASK-2-008: PITR Backup + Restore test (RTO < 1h, RPO < 15m)
- [TODO] TASK-2-009: Sentry/Datadog + store_id context + alert on-call
- [TODO] TASK-2-010: Smoke Test post-deploy automation
- [TODO] TASK-2-011: รัน UAT Phase 2

---

## ⏳ Phase 3, 4, 5, 6

> ดู chongdeaw-milestone-driven.md v5.1 สำหรับ task และ UAT ละเอียด
> จะ expand เป็น task queue เมื่อถึง phase นั้น

---

## Execution Intent (อัพเดต)
1. ✅ restore runtime entry
2. ✅ render mock home shell
3. 🔄 real LINE Auth + session + store_id bind (Phase 1A — NEXT)
4. ⏳ RLS full + tenant isolation UAT
5. ⏳ Core app: Order/Queue/Payment (Phase 1B)
6. ⏳ Billing + Infra (Phase 2)
