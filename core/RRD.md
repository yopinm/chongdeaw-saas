# RRD.md — ChongDeaw Phase 1 Safe Mode Runtime Rules

## 1) Intent
ไฟล์นี้กำหนดกติกาการทำงานแบบ safe mode เพื่อให้ Claude Code เดินงานทีละก้าว ลดความเสี่ยงงานค้างกลางทาง และ resume ต่อได้ง่าย

## 2) Core Operating Model
- one task at a time
- one commit per task
- one state update per task
- stop early when risk rises

## 3) Repository Reading Rule
- เปิดอ่านเฉพาะไฟล์ที่เกี่ยวข้องกับ task ปัจจุบัน
- ห้าม scan ทั้ง repo เพื่อ “ทำความเข้าใจรวม” ถ้าไม่จำเป็น
- ถ้าต้องดูหลายไฟล์ ให้เริ่มจากไฟล์ control ใน `core/` ก่อนเสมอ

## 4) Multi-Tenant Rule
- ทุก entity ของ tenant app ต้องรองรับ `store_id`
- `store_id` ต้องมาจาก authenticated context
- request ที่ไม่มี tenant context ต้องถือว่า invalid
- ห้ามใช้ค่า default store แบบเงียบ ๆ

## 5) Auth Rule
Target direction:
1. login entry
2. LINE integration point หรือ mock
3. session/auth context
4. profile/store linkage

Safe mode rule:
- ถ้ายังไม่พร้อมทำ flow จริง ให้ scaffold แบบชัดเจนก่อน
- ห้ามแอบอ้างว่า LINE login เสร็จสมบูรณ์ ถ้ายังเป็น mock

## 6) Validation Rule
หลังทำแต่ละ task ให้เลือก validation ที่เล็กที่สุดแต่มีประโยชน์จริง เช่น:
- import path ถูก
- file structure ถูก
- route shell ยังสมเหตุสมผล
- config พื้นฐานไม่ขัดกัน

ถ้าการตรวจแบบเต็มหนักเกินไป ให้บันทึก limitation ไว้ใน `core/SYSTEM_STATE.md`

## 7) Git Rule
- ก่อนเริ่ม task ต้องมี working tree ที่เข้าใจสถานะได้
- หลังเสร็จ task ต้อง commit ทันที
- ถ้า task ยังไม่เสร็จ ห้าม mark done
- ถ้าค้างครึ่งทาง ให้บันทึกเป็น PARTIAL ใน state

Commit format:
- `feat(task-XXX): <short description>`
- `fix(task-XXX): <short description>`
- `chore(task-XXX): <short description>`

## 8) State Rule
`core/SYSTEM_STATE.md` ต้องสะท้อนความจริงเสมอ:
- task ล่าสุดคืออะไร
- เสร็จหรือยัง
- validation อะไรที่รันแล้ว
- blocker คืออะไร
- next safe step คืออะไร

## 9) Task Queue Rule
`core/TASK_QUEUE.md` เป็นตัวควบคุมลำดับงาน
- ห้ามข้าม task เอง
- ถ้า task ใหญ่เกิน ต้องแตกเป็น subtask ก่อนทำต่อ
- ถ้าพบว่า task ปัจจุบันไม่พร้อมทำ ให้ mark BLOCKED พร้อมเหตุผล

## 10) Stop Conditions
ต้องหยุดเมื่อ:
- token/context ใกล้เต็ม
- เจอ blocker ที่ต้องอ่าน repo กว้างเกินไป
- validation บอกว่าความเสี่ยงสูง
- มีการแก้ไฟล์เกิน scope ที่ควรเป็น

เมื่อหยุด ต้องเขียน:
- current task status = DONE / PARTIAL / BLOCKED
- changed files
- latest commit หรือยังไม่มี commit
- next safe step

## 11) Safe Resume Logic
เมื่อกลับมารันใหม่:
1. อ่าน `core/SYSTEM_STATE.md`
2. ตรวจว่าล่าสุด commit แล้วหรือยัง
3. ถ้า task ล่าสุดเป็น PARTIAL ให้ปิดงานหรือย้อนกลับก่อน
4. เริ่มจาก `Next Task` เท่านั้น

## 12) Non-Goals
- ไม่ทำ feature business ของ Phase ถัดไป
- ไม่ทำ refactor ใหญ่เพื่อความสวยงาม
- ไม่แก้หลายระบบพร้อมกัน
- ไม่พยายาม “ฉลาดเกินเอกสาร”
