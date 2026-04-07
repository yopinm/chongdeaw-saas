# NOW.md — ChongDeaw · Claude reads this every session
> อัพเดตทุก task · ไม่ต้องอ่านไฟล์อื่นถ้าไม่จำเป็น

---

## ▶️ Next Task
**TASK-1A-022** — เพิ่ม env vars จริง (LINE_CHANNEL_ID + SERVICE_ROLE_KEY) + ทดสอบ LINE login flow จริงด้วย ngrok

## ✅ Last Done
**TASK-1A-021** — Auth entry points พร้อม UAT: login redirects ไป LINE จริง, callback exchange token + upsert Supabase user + session via magic-link, logout route สร้างแล้ว
`commit: feat(task-1a-021): implement real LINE OAuth login/callback/logout`

## 📍 Current Phase
**Phase 1A** — Auth real integration (In Progress ~70%)

Next phase gate ที่ต้องผ่านก่อนเข้า **Phase 1B**:
- [ ] LINE Auth flow จริง (ไม่ใช่ mock)
- [ ] JWT มี store_id จาก server
- [ ] RLS เปิดครบทุก table หลัก
- [ ] Tenant isolation UAT ผ่าน
- [ ] ทุก query มี `AND is_deleted = false`

## 🚨 Blocker
None

## 🔧 Dev Setup (ต้องมีก่อน UAT)
- ngrok: `ngrok http 3000` → copy URL → ตั้ง LINE callback + Omise webhook
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
