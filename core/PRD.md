# PRD.md — ChongDeaw Phase 1 (SaaS Foundation)

## 1) Purpose
สร้างฐานระบบ SaaS สำหรับร้านกาแฟแบบ multi-tenant ให้พร้อมต่อยอดไปยังฟีเจอร์ธุรกิจใน Phase ถัดไป โดยเน้นความถูกต้องของ tenant isolation, authentication, layout, i18n, PWA และความปลอดภัยเป็นหลัก

## 2) Phase Scope
Phase 1 ทำเฉพาะโครงสร้างพื้นฐานของแพลตฟอร์ม

### In Scope
- Next.js 14 App Router + TypeScript + Tailwind CSS
- โครงสร้างโฟลเดอร์ที่ชัดเจนสำหรับ SaaS
- Supabase client + environment wiring
- Authentication flow สำหรับ LINE login (mock flow ได้ก่อน ถ้ายังไม่ได้เชื่อมจริง)
- โครงสร้าง multi-tenant ด้วย `store_id`
- ฐานตารางหลัก `stores`, `profiles`
- RLS enable + baseline policies
- Global SaaS layout แบบ mobile-first
- Navigation shell สำหรับหน้า Home / Queue / Revenue / CRM / Settings
- i18n TH/EN พร้อม toggle
- PWA shell ขั้นพื้นฐาน
- Security baseline ที่จำเป็นสำหรับการเริ่มระบบ
- Git control version ที่ทำงานร่วมกับ Claude Code

### Out of Scope
- Booking system
- Queue rotation logic
- CRM logic
- Stock logic
- Billing / Omise production flow
- Reporting business metrics จริง

## 3) Business Goal
- ให้ระบบเริ่มใช้งานเป็น SaaS foundation ได้อย่างปลอดภัย
- ลดความเสี่ยงข้อมูลข้ามร้าน
- เตรียมโครงสร้างให้ Phase 2+ ต่อได้โดยไม่ต้องรื้อฐาน

## 4) Success Criteria
- ผู้ใช้สามารถเข้า flow auth ได้
- ระบบมี tenant context ชัดเจนผ่าน `store_id`
- table หลักรองรับ RLS
- UI shell ใช้งานได้ทั้งมือถือและ desktop
- ภาษา TH/EN สลับได้
- โปรเจกต์มี commit history ที่ย้อนได้ทุก task
- Claude Code ทำงานต่อเนื่องตาม task queue ได้โดยไม่ต้อง scan ทั้งโปรเจกต์

## 5) Product Rules
- ทุก request เชื่อถือ frontend ไม่ได้ในเรื่อง `store_id`
- ทุก task ต้องเล็กพอให้ทำจบใน 1 commit
- ห้ามข้าม task queue เอง
- ห้ามแก้ business feature นอก scope ของ Phase 1
- ห้าม refactor ทั้ง repo โดยไม่มีเหตุผลจำเป็น

## 6) Deliverables
- Project structure พร้อมรัน
- `core/PRD.md`
- `core/RRD.md`
- `core/SYSTEM_STATE.md`
- `core/TASK_QUEUE.md`
- `core/CLAUDE.md`
- baseline commit ก่อนเริ่ม auto loop

## 7) Definition of Done (Phase 1)
- App รันได้
- มี layout shell
- i18n toggle ทำงาน
- Supabase client พร้อม
- auth scaffold พร้อม
- `stores` และ `profiles` schema พร้อม
- RLS baseline พร้อม
- PWA shell พร้อม
- Git workflow ใช้งานได้จริงกับ Claude Code
