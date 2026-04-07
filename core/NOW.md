# NOW.md — ChongDeaw · Claude reads this every session
> อัพเดตทุก task · ไม่ต้องอ่านไฟล์อื่นถ้าไม่จำเป็น

---

## ▶️ Next Task
**TASK-1A-023** — bind real session เข้ากับ TenantContext ฝั่ง server — ไม่เชื่อ client `store_id`

## ✅ Last Done
**TASK-1A-022** — LINE Auth ทำงานได้จริง end-to-end ✅ · fix disabled button + add allowedDevOrigins สำหรับ ngrok
`commit: fix(task-1a-022): add allowedDevOrigins for ngrok dev`

## 📍 Current Phase
**Phase 1A** — Auth real integration (In Progress ~80%)

Next phase gate ที่ต้องผ่านก่อนเข้า **Phase 1B**:
- [x] LINE Auth flow จริง (ไม่ใช่ mock)
- [ ] JWT มี store_id จาก server
- [ ] RLS เปิดครบทุก table หลัก
- [ ] Tenant isolation UAT ผ่าน
- [ ] ทุก query มี `AND is_deleted = false`

## 🚨 Blocker
None

## 🔧 Dev Setup (พร้อมแล้ว ✅)
- ngrok: `https://kira-unpenetrating-uncogently.ngrok-free.dev` → localhost:3000 ✅
- Next.js dev server: รันอยู่ที่ localhost:3000 ✅
- `.env.local`: ครบทุก key (LINE_CHANNEL_ID, LINE_CHANNEL_SECRET, NEXT_PUBLIC_LINE_CHANNEL_ID, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_APP_URL) ✅
- Omise test key: พร้อมแล้ว ✅
- Playwright: `npm i -D @playwright/test` (ใช้ Phase 1B)
- Supabase CLI: `supabase start` สำหรับ local DB

## 📂 Read More If Needed
| ต้องการอะไร | อ่านไฟล์ไหน |
|------------|------------|
| Task list ทั้งหมด | `core/TASK_QUEUE.md` |
| UAT checklist / Hard Gate | `core/REF/chongdeaw-milestone-driven.md` |
| Execution rules | `core/REF/CLAUDE.md` |
| Scope / In-Out | `core/REF/PRD.md` |
| Safe mode rules | `core/REF/RRD.md` |

---

## 📋 How to Update This File (1 task = 1 edit)
```
1. เปลี่ยน "Next Task" → task ถัดไป
2. เปลี่ยน "Last Done" → task ที่เพิ่งเสร็จ + commit message
3. อัพเดต Phase Gate checklist ถ้ามี item ผ่าน
4. รวม commit นี้เข้ากับ code commit เลย (ไม่แยก commit)
```
