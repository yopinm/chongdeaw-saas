# RRD.md — ChongDeaw Phase 1 Runtime & Rules Detail

## 1) Execution Intent
ไฟล์นี้ใช้กำหนดกติกาเชิง logic สำหรับการทำงาน Phase 1 เพื่อให้ Claude Code ไม่ตีความกว้างเกินไป

## 2) Runtime Boundaries
- ทำเฉพาะสิ่งที่อยู่ใน Phase 1
- ใช้ไฟล์ใน `core/` เป็น source of truth
- ห้าม scan ทั้ง repo ถ้า task ไม่จำเป็น
- หากต้องอ่านไฟล์โค้ด ให้เปิดเฉพาะไฟล์ที่เกี่ยวข้องกับ task ปัจจุบัน

## 3) Multi-Tenant Logic
- ทุก entity ฝั่ง application plane ต้องมี `store_id`
- `store_id` มาจาก authenticated context ไม่ใช่จาก input ที่ผู้ใช้ส่งมา
- request ที่ไม่มี `store_id` context ถือว่า invalid
- ห้าม fallback ไปใช้ค่า default store แบบเงียบ ๆ

## 4) Auth Flow
Target flow:
1. ผู้ใช้กด login
2. LINE auth flow เริ่มต้น
3. ระบบรับ callback / session
4. user profile ถูกผูกกับ store
5. runtime มี tenant context ผ่าน JWT/session

ข้อกำหนด:
- ถ้า LINE auth จริงยังไม่พร้อม สามารถ scaffold หรือ mock flow ได้ แต่ต้องแยกชัดเจนว่าเป็น mock
- session handling ต้องเตรียมพร้อมให้ต่อยอด JWT ที่มี `store_id`

## 5) RLS Logic
- ตารางที่มีข้อมูล tenant ต้องเปิด RLS
- Policy baseline ต้องยึด `store_id` ของ authenticated context
- ถ้ายังไม่สามารถ bind JWT claim จริงได้ใน task นั้น ให้ scaffold policy และ note limitation ใน SYSTEM_STATE

## 6) Request Validation Logic
- frontend ส่ง request
- backend/server action/api route ต้อง validate session/context
- backend เป็นชั้นตัดสิน tenant context เสมอ
- ห้ามใช้ `store_id` จาก query/body โดยตรงเป็น source of truth

## 7) i18n Logic
- default locale = `th`
- รองรับ `th` และ `en`
- มี toggle ให้เปลี่ยนภาษาได้จาก UI shell
- คำหลักของ navigation ต้องมีทั้งสองภาษา

## 8) Layout Logic
ต้องมี shell อย่างน้อย:
- Header / Top bar
- Main content area
- Mobile navigation หรือ bottom nav
- Desktop / tablet friendly navigation

เป้าหมายของ Phase 1 คือ “layout shell ใช้งานได้” ไม่ใช่ “ทุกหน้ามีข้อมูลจริง”

## 9) PWA Logic
- ติดตั้ง PWA baseline
- มี app manifest
- มี basic offline shell หรือ fallback หน้าอ่านได้
- ถ้ายังไม่ได้ sync จริง ให้ scaffold ไว้ก่อนและระบุใน state

## 10) Optimistic / Idempotency Principle
Phase 1 ยังไม่ต้องลงลึก business mutation แต่ต้องเตรียมแนวทาง:
- mutation สำคัญในอนาคตต้องรองรับ idempotency
- optimistic UI ให้เป็นแนวทาง ไม่ต้อง implement ทุกจุดใน Phase 1

## 11) Git Control Version Rules
- 1 task = 1 commit
- commit message format:
  - `feat(task-XXX): <short task name>`
  - `fix(task-XXX): <short task name>`
  - `chore(state): update system state`
- ก่อนเริ่ม auto run ต้องมี baseline commit
- หาก task ยังไม่เสร็จ ห้าม commit แบบหลอกว่าเสร็จ

## 12) Stop Conditions
Claude ต้องหยุดเมื่อ:
- เจอ critical error ที่แก้ไม่ได้ใน scope ปัจจุบัน
- token/context ใกล้เต็ม
- task ปัจจุบันต้อง scan repo กว้างเกินข้อกำหนด

เมื่อหยุด ต้อง:
- update `core/SYSTEM_STATE.md`
- ระบุ task ล่าสุด
- ระบุสิ่งที่เสร็จแล้ว
- ระบุสิ่งที่ค้าง
- ระบุ next safe step

## 13) Non-Goals
- ห้ามออกแบบ feature Phase 2+
- ห้ามแก้ naming หรือ refactor ใหญ่ถ้าไม่จำเป็นต่อ task
- ห้ามเปลี่ยน architecture หลักเอง
