# SYSTEM STATE - ChongDeaw

## CURRENT DOCUMENT STATUS
- CLAUDE.md = ใช้เป็น rule กลางของ AI
- PRD.md = สรุป requirement ให้สั้นและอ่านง่าย
- RRD.md = ล็อก flow และ logic สำคัญ
- SYSTEM_STATE.md = ใช้บันทึกสถานะล่าสุดของระบบ

---

## CURRENT ASSUMPTIONS
- โปรเจคนี้เป็น SaaS ร้านกาแฟ / เครื่องดื่ม
- มีทั้งฝั่งร้านและฝั่งลูกค้า
- ลูกค้าสั่งผ่าน QR ได้
- ระบบต้องมี queue, payment, stock, report, member
- สถาปัตยกรรมหลักคือ Next.js + Supabase + Vercel + Cloudflare + Omise

---

## WHAT TO UPDATE IN THIS FILE LATER
ให้อัปเดตไฟล์นี้เมื่อมีการเปลี่ยนแปลงสำคัญ เช่น:
- feature ไหน done แล้ว
- feature ไหนยังพัง
- logic ไหนเปลี่ยน
- bug สำคัญที่ยังค้าง
- schema ไหนเพิ่งเปลี่ยน
- route หรือ status ไหนเปลี่ยน

ตัวอย่าง format:
- Order flow: working
- Queue sync: bug on customer screen
- Stock deduction: need verify duplicate cut
- Report revenue: counting done instead of paid

---

## CURRENT OPEN QUESTIONS
- จุดที่ตัดสต๊อกจริงควรเป็น create, done หรือ paid
- order final state ในระบบจริงใช้ done แทน paid หรือแยกกัน
- ระบบสมาชิก auto ใช้ key อะไรเป็นตัวรวมลูกค้า
- queue voice preset จะเก็บเป็น config ระดับ tenant หรือ global preset

---

## CHANGE LOG TEMPLATE
### YYYY-MM-DD
- Changed:
- Impact:
- Need test:
