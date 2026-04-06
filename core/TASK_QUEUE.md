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
- [TODO] TASK-010: ตรวจสอบ env wiring ที่จำเป็นและสรุปสิ่งที่ยังขาดอย่างปลอดภัย
- [TODO] TASK-011: scaffold login entry และ auth entry points
- [TODO] TASK-012: วาง LINE login integration point หรือ mock flow ให้ชัดเจนว่าอะไรยังไม่จริง
- [TODO] TASK-013: สร้าง tenant/profile/store contracts ฝั่งโค้ด
- [TODO] TASK-014: สรุป schema baseline สำหรับ stores และ profiles ในรูปแบบที่ต่อยอดได้
- [TODO] TASK-015: วางแนวทาง bind `store_id` เข้ากับ auth/session context
- [TODO] TASK-016: วาง request validation layer ที่ไม่เชื่อ frontend `store_id`
- [TODO] TASK-017: scaffold RLS baseline และบันทึก limitation ที่ยังไม่ bind claim จริง
- [TODO] TASK-018: ทบทวน security baseline เฉพาะ Phase 1
- [TODO] TASK-019: ตั้งค่า PWA manifest และ config ขั้นพื้นฐาน
- [TODO] TASK-020: เพิ่ม offline shell หรือ fallback อย่างปลอดภัย
- [TODO] TASK-021: สร้าง dashboard placeholder ที่เกาะ layout ใหม่
- [TODO] TASK-022: ทบทวน integration ระหว่าง layout, i18n, auth scaffold, supabase wiring แบบเบา ๆ
- [TODO] TASK-023: อัปเดตเอกสาร core ให้ตรงกับสิ่งที่ทำจริง
- [TODO] TASK-024: เขียน readiness note ก่อนขยับสู่ Phase 2
