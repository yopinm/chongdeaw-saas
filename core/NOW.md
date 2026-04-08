# NOW.md — ChongDeaw · Claude reads this every session
> อัพเดตทุก task · ไม่ต้องอ่านไฟล์อื่นถ้าไม่จำเป็น

---

## ▶️ Next Task
**TASK-1B-003** — เมนูหน้าร้าน `/[slug]/menu` + Availability Toggle Realtime (`is_available`)
- Cache Key ต้องรวม `store_id` — ป้องกัน ISR cache ข้ามร้าน

## ✅ Last Done
**TASK-1B-002 ✅ — Playwright multi-context** — test ผ่าน: 2 owners tenant isolation confirmed
`commit: fix(task-1b-002): destructure store_id+role in globalSetup loop + set app_metadata`

## 📍 Current Phase
**Phase 1B** — Core Features (Starting)

Phase 1A Gate ✅ ผ่านครบทุกข้อ:
- [x] LINE Auth flow จริง (ไม่ใช่ mock)
- [x] JWT มี store_id จาก server
- [x] RLS เปิดครบทุก table หลัก
- [x] Tenant isolation UAT ผ่าน
- [x] ทุก query มี `AND is_deleted = false`

## 🚨 Blocker
_(ไม่มี blocker ปัจจุบัน)_

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
