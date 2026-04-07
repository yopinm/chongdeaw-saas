# RRD.md — ChongDeaw Safe Mode Runtime Rules
> อัปเดตล่าสุด: 2026-04-07 · Synced with chongdeaw-milestone-driven.md v5.1

## 1) Intent
ไฟล์นี้กำหนดกติกาการทำงานแบบ safe mode เพื่อให้ Claude Code เดินงานทีละก้าว ลดความเสี่ยงงานค้างกลางทาง และ resume ต่อได้ง่าย

## 2) Core Operating Model
- one task at a time
- one commit per task
- one state update per task
- stop early when risk rises
- never cross phase boundary without Hard Gate passing

## 3) Repository Reading Rule
- เปิดอ่านเฉพาะไฟล์ที่เกี่ยวข้องกับ task ปัจจุบัน
- ห้าม scan ทั้ง repo เพื่อ "ทำความเข้าใจรวม" ถ้าไม่จำเป็น
- อ่านไฟล์ใน `core/` ก่อนเสมอ ตามลำดับใน CLAUDE.md

## 4) Phase Boundary Rule
ห้ามเริ่ม task ของ Phase ถัดไปจนกว่า Hard Gate ของ Phase ปัจจุบันจะผ่านครบ

| จาก | ไป | Hard Gate |
|-----|-----|-----------|
| Phase 1A | Phase 1B | LINE Auth จริง + RLS ครบ + JWT store_id + tenant isolation UAT ผ่าน |
| Phase 1B | Phase 2 | Order Atomic + Realtime + Webhook idempotent + Cache per store_id ผ่าน |
| Phase 2 | Phase 3 | Billing lifecycle + CI/CD + PITR Restore + Monitoring ผ่าน |

ดู Hard Gate ละเอียดใน `core/chongdeaw-milestone-driven.md`

## 5) Multi-Tenant Rule
- ทุก entity ของ tenant app ต้องรองรับ `store_id`
- `store_id` ต้องมาจาก **server-side authenticated context เท่านั้น**
- request ที่ไม่มี tenant context ต้องถือว่า invalid
- ห้ามใช้ค่า default store แบบเงียบ ๆ
- **Cache Key ต้องรวม `store_id`** เสมอ — ป้องกัน ISR/Edge Cache ข้ามร้าน
- ทุก query ต้องมี `AND is_deleted = false` — ห้ามลืม soft delete filter

## 6) Auth Rule
Target direction:
1. LINE OAuth callback จริง (ผ่าน ngrok ใน dev)
2. Supabase session ผูกกับ LINE user
3. store_id inject เข้า JWT claim (server-side only)
4. TenantContext bind ฝั่ง server

Safe mode rule:
- ถ้ายังไม่พร้อมทำ flow จริง ให้ scaffold แบบชัดเจนก่อน
- ห้ามแอบอ้างว่า LINE login เสร็จสมบูรณ์ถ้ายังเป็น mock
- ห้ามเชื่อ store_id จาก client ไม่ว่ากรณีใด

## 7) Dev Environment Rule (ngrok)
สำหรับ LINE Auth และ Omise Webhook ใน dev:
- ใช้ ngrok หรือ Cloudflare Tunnel expose localhost:3000 เป็น HTTPS
- URL ชั่วคราวนี้ใช้แทน production domain ได้ในทุก UAT ที่ mark ⏳ STAGING
- อย่า hardcode ngrok URL ใน code — ให้ใช้ env var `NEXT_PUBLIC_APP_URL`
- ทุกครั้งที่ ngrok restart URL จะเปลี่ยน → อัพเดต LINE Console + Omise Dashboard + `.env.local`

## 8) UAT Mode Rule
ทุก test case ใน `core/chongdeaw-milestone-driven.md` มี mode label:

| Mode | กติกา |
|------|-------|
| ✅ LOCAL | รันได้บน localhost ทันที ไม่ต้องรอ external |
| ⏳ STAGING | ต้องการ ngrok + Omise test key + LINE account จริง |
| 🔴 LIVE | ต้องการโดเมนจริง + Omise live key — ทำได้เฉพาะ Phase 5+ |

กติกา:
- UAT ที่ mark ✅ LOCAL ต้องรันก่อนเสมอ ก่อนพึ่ง external service
- อย่า block งานด้วย ⏳ STAGING tasks ถ้า ✅ LOCAL tasks ยังไม่ผ่าน
- ❌ ห้ามรัน 🔴 LIVE tests บน local หรือ staging

## 9) Validation Rule
หลังทำแต่ละ task ให้เลือก validation ที่เล็กที่สุดแต่มีประโยชน์จริง:
- auth task → verify callback path, session shape, store_id source
- RLS task → verify policy SQL, table coverage list
- JWT task → verify claim inject server-side, ไม่มี client override
- UI task → build pass, route exists, import clean
- UAT task → record pass/fail ทุก row ใน UAT table

ถ้าตรวจแบบเต็มหนักเกินไป → บันทึก limitation ใน `core/SYSTEM_STATE.md`

## 10) Git Rule
- ก่อนเริ่ม task ต้องมี working tree ที่เข้าใจสถานะได้
- หลังเสร็จ task ต้อง commit ทันที
- ถ้า task ยังไม่เสร็จ ห้าม mark DONE
- ถ้าค้างครึ่งทาง ให้บันทึกเป็น PARTIAL ใน state

Commit format:
- `feat(task-1a-021): <short description>`
- `fix(task-1b-005): <short description>`
- `chore(task-1a-029): <short description>`

Task ID format ใหม่: `task-{phase}-{number}` เช่น `task-1a-021`, `task-1b-003`

## 11) State Rule
`core/SYSTEM_STATE.md` ต้องสะท้อนความจริงเสมอ:
- phase ปัจจุบันคืออะไร (1A / 1B / 2 / ...)
- task ล่าสุดคืออะไร
- เสร็จหรือยัง
- validation อะไรที่รันแล้ว
- blocker คืออะไร
- next safe step คืออะไร

## 12) Task Queue Rule
`core/TASK_QUEUE.md` เป็นตัวควบคุมลำดับงาน:
- ห้ามข้าม task เอง
- ถ้า task ใหญ่เกิน → แตกเป็น subtask ก่อน
- ถ้า task ปัจจุบันไม่พร้อม → mark BLOCKED พร้อมเหตุผล
- Phase 1B tasks ทั้งหมดต้อง BLOCKED จนกว่า Phase 1A Hard Gate ผ่าน

## 13) Stop Conditions
ต้องหยุดเมื่อ:
- token/context ใกล้เต็ม
- เจอ blocker ที่ต้องอ่าน repo กว้างเกินไป
- validation บอกว่าความเสี่ยงสูง
- มีการแก้ไฟล์เกิน scope ที่ควรเป็น
- พบว่า task ปัจจุบันต้อง cross phase boundary

เมื่อหยุด ต้องเขียน:
- current task status = DONE / PARTIAL / BLOCKED
- changed files
- latest commit
- next safe step

## 14) Safe Resume Logic
เมื่อกลับมารันใหม่:
1. อ่าน `core/SYSTEM_STATE.md`
2. ตรวจ last commit
3. ถ้า task ล่าสุดเป็น PARTIAL → ปิดงานหรือย้อนกลับก่อน
4. เริ่มจาก `Next Task` เท่านั้น
5. อ่าน `core/chongdeaw-milestone-driven.md` ถ้าต้องการ context phase/UAT

## 15) Non-Goals
- ไม่ทำ feature ของ Phase ถัดไปก่อน Hard Gate ผ่าน
- ไม่ทำ refactor ใหญ่เพื่อความสวยงาม
- ไม่แก้หลายระบบพร้อมกัน
- ไม่พยายาม "ฉลาดเกินเอกสาร"
- ไม่ใช้ Omise live key ใน dev/staging เด็ดขาด
