# NOW.md — ChongDeaw · Claude reads this every session
> อัพเดตทุก task · ไม่ต้องอ่านไฟล์อื่นถ้าไม่จำเป็น

---

## ▶️ Next Task
**debug store_create_failed** — stores upsert ล้มเหลวใน /api/auth/callback · ต้อง resolve ก่อน TASK-1A-026

## ✅ Last Done
**TASK-1A-022 ✅ TASK-1A-023 partial** — LINE Auth flow ทำงานได้ · fix email case bug + hydration mismatch · RLS migration พร้อม
`commit: fix(auth): lowercase lineEmail to match Supabase storage, fix hydration mismatch on login page`

## 📍 Current Phase
**Phase 1A** — Auth real integration (In Progress ~85%)

Next phase gate ที่ต้องผ่านก่อนเข้า **Phase 1B**:
- [x] LINE Auth flow จริง (ไม่ใช่ mock)
- [x] JWT มี store_id จาก server
- [ ] RLS เปิดครบทุก table หลัก
- [ ] Tenant isolation UAT ผ่าน
- [ ] ทุก query มี `AND is_deleted = false`

## 🚨 Blocker
`store_create_failed` — stores/profiles upsert ใน /api/auth/callback ล้มเหลว
ต้องดู error จริงจาก terminal log ก่อน แล้วค่อยแก้

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
