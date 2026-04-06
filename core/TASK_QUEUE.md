# TASK_QUEUE.md — Phase 1 Execution Queue

## Rules
- ทำทีละ 1 task
- 1 task ควรจบใน 1 commit
- ห้ามข้ามลำดับเอง
- ถ้า task ใหญ่เกิน ให้แตกย่อยแล้วอัปเดตไฟล์นี้

## Status Key
- TODO
- DOING
- DONE
- BLOCKED

## Phase 1 Tasks

- [TODO] TASK-001: ตรวจสอบและจัดโครงสร้าง project root ให้พร้อมสำหรับ Phase 1 โดยไม่รื้อของเดิมเกินจำเป็น
- [TODO] TASK-002: ตรวจสอบ/ยืนยัน Next.js + Tailwind + TypeScript setup ให้รันได้
- [TODO] TASK-003: จัดโครงสร้าง src/app, src/components, src/lib, src/services ให้สอดคล้องกับ SaaS foundation
- [TODO] TASK-004: สร้าง global layout shell แบบ mobile-first
- [TODO] TASK-005: สร้าง navigation shell สำหรับ Home, Queue, Revenue, CRM, Settings
- [TODO] TASK-006: ตั้งค่า i18n พื้นฐานสำหรับ TH/EN
- [TODO] TASK-007: เพิ่ม language toggle ใน layout shell
- [TODO] TASK-008: ตั้งค่า Supabase client ฝั่ง app
- [TODO] TASK-009: ตรวจสอบ environment variable wiring สำหรับ Supabase
- [TODO] TASK-010: สร้าง utility สำหรับ session/tenant context เบื้องต้น
- [TODO] TASK-011: scaffold auth flow สำหรับ login entry
- [TODO] TASK-012: scaffold LINE login integration point หรือ mock flow ชัดเจน
- [TODO] TASK-013: สร้าง profile/store model contract ฝั่งโค้ด
- [TODO] TASK-014: ออกแบบ schema หลักสำหรับ stores และ profiles
- [TODO] TASK-015: เตรียมแนวทางการ bind `store_id` เข้ากับ auth context
- [TODO] TASK-016: เตรียม request validation layer ที่ไม่เชื่อ frontend `store_id`
- [TODO] TASK-017: scaffold RLS baseline สำหรับ tenant tables
- [TODO] TASK-018: ทบทวน security baseline ที่จำเป็นใน Phase 1
- [TODO] TASK-019: ตั้งค่า PWA manifest และ baseline config
- [TODO] TASK-020: เพิ่ม offline shell/fallback เบื้องต้น
- [TODO] TASK-021: สร้าง dashboard placeholder page ที่ยึด layout ใหม่
- [TODO] TASK-022: ตรวจสอบ flow รวมของ layout + i18n + auth scaffold + supabase wiring
- [TODO] TASK-023: อัปเดตเอกสาร core ให้สะท้อนสิ่งที่ทำจริง
- [TODO] TASK-024: เตรียม readiness note เพื่อเข้าสู่ Phase 2
