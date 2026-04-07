# CLAUDE.md — ChongDeaw Safe Mode Execution Rules
> อัปเดตล่าสุด: 2026-04-07 · v5.1

## Mission
You are Claude Code working on ChongDeaw SaaS.
Complete tasks one at a time. Safe over fast. Small scope. Reversible changes.

---

## ⚡ Start Every Session With This Only
```
Read core/NOW.md → find Next Task → start immediately
```
**อย่าอ่านไฟล์อื่นก่อน** ถ้า NOW.md ไม่พอค่อยดู "Read More If Needed" ใน NOW.md

---

## Execution Cycle (ทำซ้ำทุก task)
1. `core/NOW.md` → Next Task คืออะไร
2. อ่านเฉพาะไฟล์ที่ task นั้นต้องการ
3. เปลี่ยนไฟล์ที่เล็กที่สุดเท่าที่ทำได้
4. Validate แบบเบาที่สุดที่มีประโยชน์
5. อัพเดต `core/NOW.md` (Next Task + Last Done)
6. `git add <changed files> core/NOW.md`
7. `git commit -m "feat(task-1a-021): description"`
8. หยุด — ประเมินก่อนทำ task ถัดไป

---

## File Structure
```
core/
├── NOW.md              ← อ่านทุก session · อัพเดตทุก task
├── TASK_QUEUE.md       ← อ่านเมื่อต้องการ task list
└── REF/                ← read-only reference
    ├── CLAUDE.md       ← (ไฟล์นี้) อ่านครั้งแรกครั้งเดียว
    ├── PRD.md          ← อ่านเมื่อ scope ไม่ชัด
    ├── RRD.md          ← อ่านเมื่อ rules ไม่ชัด
    └── chongdeaw-milestone-driven.md ← อ่านเมื่อต้อง UAT/Gate
```

**กติกา REF/**
- ไม่แก้ไฟล์ใน REF/ ระหว่างทำ task
- แก้ได้เฉพาะตอน restructure phase หรือ milestone update

---

## Phase Boundary — ห้ามข้าม
| จาก | ไป | ต้องผ่าน |
|-----|-----|---------|
| 1A | 1B | LINE Auth จริง + JWT store_id + RLS ครบ + isolation UAT |
| 1B | 2 | Order Atomic + Realtime + Webhook idempotent + Cache per store_id |

ดู Hard Gate ละเอียดใน `core/REF/chongdeaw-milestone-driven.md`

---

## Scope Control
- ❌ อย่า scan repo ทั้งหมดถ้าไม่จำเป็น
- ❌ อย่า refactor ไฟล์นอก task
- ❌ อย่าแตะ Phase 1B+ ก่อน Phase 1A Gate ผ่าน
- ❌ อย่าใช้ Omise live key ใน dev/staging เด็ดขาด
- ❌ อย่าเชื่อ store_id จาก client ไม่ว่ากรณีใด

---

## Commit Format
```
feat(task-1a-021): short description
fix(task-1b-005): short description
chore(task-1a-029): short description
```
- 1 task = 1 commit
- รวม `core/NOW.md` เข้ากับ code commit เลย (ไม่แยก commit)
- ห้าม mark DONE ก่อน commit

---

## UAT Mode
| Label | ความหมาย |
|-------|-----------|
| ✅ LOCAL | รัน localhost ได้เลย |
| ⏳ STAGING | ต้องการ ngrok + LINE + Omise test |
| 🔴 LIVE | ต้องการโดเมนจริง + Omise live key |

---

## Stop When
- context/token ใกล้เต็ม
- เจอ blocker ที่ต้อง scan repo กว้าง
- มีการแก้ไฟล์เกิน scope
- task ต้อง cross phase boundary

เมื่อหยุด → อัพเดต `core/NOW.md` บอก status + next safe step

---

## Suggested Start Command
```
Run in SAFE MODE.
Read core/NOW.md only.
Current phase: 1A.
One task, one commit.
Do not cross into Phase 1B until Phase 1A Hard Gate passes.
```
