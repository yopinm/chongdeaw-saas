# PRD.md — ChongDeaw Phase 1 (Safe Mode Foundation)

## 1) Purpose
สร้างฐานระบบ SaaS สำหรับร้านกาแฟแบบ multi-tenant ให้พร้อมต่อยอด โดยเน้นความปลอดภัยของข้อมูล, ความเสถียรของโครงสร้าง, และการทำงานร่วมกับ Claude Code แบบควบคุมได้

## 2) Phase Goal
Phase 1 มีเป้าหมายเพื่อสร้าง “ฐานระบบที่รันได้และไม่พังง่าย” ก่อนเริ่มฟีเจอร์ธุรกิจจริง

## 3) In Scope
- Next.js App Router + TypeScript + Tailwind
- โครงสร้างโฟลเดอร์สำหรับ SaaS foundation
- Global layout shell แบบ mobile-first
- Navigation shell
- TH/EN i18n baseline
- Supabase client wiring
- auth scaffold / LINE login integration point หรือ mock ที่ชัดเจน
- tenant foundation ด้วย `store_id`
- baseline schema สำหรับ `stores` และ `profiles`
- baseline RLS concept / scaffold
- PWA manifest และ offline shell ระดับพื้นฐาน
- เอกสารควบคุมงานใน `core/`
- Git control version แบบ 1 task = 1 commit

## 4) Out of Scope
- booking flow จริง
- queue rotation
- CRM logic
- stock logic
- payment production flow
- analytics ธุรกิจจริง
- refactor ใหญ่ทั้งระบบ

## 5) Success Criteria
- โปรเจกต์ยังรันได้หลังจากแต่ละ task สำคัญ
- Claude Code ทำงานตาม task queue ได้โดยไม่มั่วข้าม scope
- มี tenant foundation ที่ชัดเจน
- i18n TH/EN มี baseline ใช้งานได้
- layout shell ใช้งานได้บน mobile/desktop
- มี baseline commit history ที่ rollback ได้ง่าย
- สามารถ resume งานต่อจาก `core/SYSTEM_STATE.md` ได้

## 6) Product Rules
- ทุก task ต้องเล็กพอให้ commit ได้ภายในรอบเดียว
- ถ้าความเสี่ยงสูง ให้หยุดก่อน ไม่ฝืนทำหลายเรื่องพร้อมกัน
- ห้ามแก้ไฟล์นอก task โดยไม่มีเหตุผลจำเป็น
- ห้ามนับงานว่าเสร็จ ถ้ายังไม่ update state และยังไม่ commit
- ห้ามใช้ frontend `store_id` เป็น source of truth

## 7) Deliverables
- app structure ที่รองรับ SaaS foundation
- layout shell
- i18n baseline
- auth scaffold
- supabase wiring
- tenant/store/profile contracts
- RLS scaffold/baseline note
- PWA baseline
- `core/PRD.md`
- `core/RRD.md`
- `core/SYSTEM_STATE.md`
- `core/TASK_QUEUE.md`
- `core/CLAUDE.md`

## 8) Definition of Done for Phase 1
- foundation พร้อมต่อยอดไป Phase 2
- โครงสร้างไม่สับสน
- เอกสาร core สะท้อนสถานะจริง
- มี commit history ที่ย้อนกลับได้ตลอดสาย
