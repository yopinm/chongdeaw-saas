# TASK_QUEUE.md — Phase 1 Safe Mode Queue

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

## Phase 1 Tasks

- [DONE] TASK-001: ตรวจสอบ project root และยืนยันไฟล์/โฟลเดอร์ที่จำเป็นต่อ Phase 1 โดยไม่รื้อโครงเดิม
- [DONE] TASK-002: ตรวจสอบว่า Next.js + TypeScript + Tailwind setup ยังอยู่ในสภาพพร้อมใช้งาน
- [DONE] TASK-003: ยืนยันโครงสร้างเส้นทางหลักของ app และลดความสับสนระหว่าง `app/` กับ `src/` ตามของจริงในโปรเจกต์
- [DONE] TASK-004: จัดระเบียบ foundation folders ที่จำเป็น เช่น components, lib, services เฉพาะเท่าที่ Phase 1 ต้องใช้
- [DONE] TASK-005: สร้างหรือปรับ global layout shell แบบ mobile-first โดยไม่แตะ business UI เกินจำเป็น
- [DONE] TASK-006: เพิ่ม navigation shell สำหรับ Home, Queue, Revenue, CRM, Settings แบบ placeholder ก่อน
- [DONE] TASK-007: วาง baseline i18n สำหรับ TH/EN ให้สอดคล้องกับโครง route ปัจจุบัน
- [DONE] TASK-008: เพิ่ม language toggle ใน layout shell
- [DONE] TASK-009: ตั้งค่า Supabase client baseline แบบไม่ฝืนเชื่อม logic ที่ยังไม่พร้อม
- [DONE] TASK-010: ตรวจสอบ env wiring ที่จำเป็นและสรุปสิ่งที่ยังขาดอย่างปลอดภัย
- [DONE] TASK-011: scaffold login entry และ auth entry points
- [DONE] TASK-012: วาง LINE login integration point หรือ mock flow ให้ชัดเจนว่าอะไรยังไม่จริง
- [DONE] TASK-013: สร้าง tenant/profile/store contracts ฝั่งโค้ด
- [DONE] TASK-014: สรุป schema baseline สำหรับ stores และ profiles ในรูปแบบที่ต่อยอดได้
- [DONE] TASK-015: วางแนวทาง bind `store_id` เข้ากับ auth/session context
- [DONE] TASK-016: วาง request validation layer ที่ไม่เชื่อ frontend `store_id`
- [DONE] TASK-017: scaffold RLS baseline และบันทึก limitation ที่ยังไม่ bind claim จริง
- [DONE] TASK-018: ทบทวน security baseline เฉพาะ Phase 1
- [DONE] TASK-019: แก้ root route ให้ `localhost:3000` ไม่ 404 โดยไม่รื้อ locale/layout architecture
- [DONE] TASK-020: เพิ่ม mock Home UI ขั้นต่ำบน layout shell เดิม เพื่อให้มีจุดเข้าแอปสำหรับ UAT
- [DONE] TASK-020-routing: แก้ /th 404 โดยเพิ่ม generateStaticParams() ใน app/[locale]/layout.tsx
- [DONE] TASK-020-middleware: แก้ src/middleware.ts ให้ export createMiddleware โดยตรง (ไม่ผ่าน wrapper fn) และ matcher ให้ตรงกับ next-intl v4
- [DONE] TASK-020-i18n: แก้ src/i18n/request.ts ลบ notFound(); locale ที่ไม่ถูกต้องหรือขาดหาย fallback เป็น "th"
- [DONE] TASK-020-ui: ปรับ Home UI mobile-first: hero ใหญ่ขึ้น, menu cards เป็น vertical stack row layout, typography ชัดขึ้น, footer nav เล็กลง
- [DONE] TASK-020-ui2: Polish: tap feedback, การ์ด "สั่งกาแฟ" เป็น primary, เพิ่ม top spacing, footer nav เบาลง
- [TODO] TASK-021: ทบทวน auth entry points และ route callback/login/logout ให้พร้อมสำหรับ UAT Phase 1
- [TODO] TASK-022: เชื่อม Real LINE Auth + Supabase session แบบ safe mode
- [TODO] TASK-023: bind real session เข้ากับ TenantContext ฝั่ง server โดยไม่เชื่อ client `store_id`
- [TODO] TASK-024: inject `store_id` หรือ `active_store_id` เข้า JWT แบบ additive mode
- [TODO] TASK-025: เปิด RLS ทีละ table จาก low-risk ไป high-risk
- [TODO] TASK-026: รัน end-to-end tenant isolation UAT
- [TODO] TASK-027: อัปเดตเอกสาร core ให้ตรงกับสถานะ UAT จริง
- [TODO] TASK-028: เขียนสรุป readiness / pass-fail note ของ UAT Phase 1

## Execution Intent
ลำดับงานใหม่เน้น:
1. restore runtime entry
2. render mock home shell
3. align auth routes
4. start real integration UAT
5. enable RLS gradually
6. validate tenant isolation end-to-end
