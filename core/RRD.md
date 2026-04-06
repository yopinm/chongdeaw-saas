# RRD - ChongDeaw

## 1. CORE DOMAIN
ระบบนี้มี domain หลัก 6 ส่วน:
1. tenant
2. menu
3. order
4. payment
5. stock
6. customer/member

ทุก record ระดับธุรกิจต้องผูกกับ tenant/shop เสมอ

---

## 2. TENANT RULE
- ข้อมูลของแต่ละร้านต้องแยกกันชัดเจน
- query, mutation, report, stock, member ต้อง filter ตาม tenant/shop
- ห้ามมี flow ไหนดึงข้อมูลข้ามร้านโดยไม่ตั้งใจ

---

## 3. MENU LOGIC
### status ของเมนู
- available = พร้อมขาย
- sold_out = หมด

### rule
- ถ้าเมนูเป็น sold_out ลูกค้าห้ามสั่งได้
- ฝั่งร้านยังเห็นเมนูได้เพื่อกลับมาเปิดขายภายหลัง
- ราคาและสูตรต้องผูกกับเมนูนั้น

---

## 4. BOM / RECIPE LOGIC
- เมนูแต่ละรายการมี preset สูตรเริ่มต้นได้
- ร้านเลือก preset แล้วปรับแก้ได้
- สูตรที่ใช้จริงต้องเป็นสูตรล่าสุดของเมนู ณ เวลาที่สั่ง
- เมื่อสร้าง order item ต้องมีข้อมูลพอให้ใช้คำนวณสต๊อก

หมายเหตุ:
ถ้าจะรองรับ historical recipe accuracy ภายหลัง อาจต้อง snapshot recipe ตอนสร้าง order

---

## 5. CUSTOMER / MEMBER LOGIC
- ลูกค้าสามารถสั่งแบบไม่ต้องกรอกข้อมูลเต็มได้
- ระบบสมาชิกเป็นแบบอัตโนมัติ
- ถ้ามีตัวระบุลูกค้า ให้พยายามผูก order เข้ากับ member เดิม
- ถ้าไม่มีข้อมูลพอ ให้ระบบสร้าง customer/member identity แบบ auto

หลักการ:
- อย่า block การสั่งเพราะไม่มีชื่อหรือเบอร์
- แต่ต้องเก็บ key ที่ใช้ตามลูกค้าได้เท่าที่เป็นไปได้

---

## 6. ORDER FLOW
### create order
1. ลูกค้าเปิดหน้า order จาก QR
2. ระบบโหลดเมนูของ tenant นั้น
3. ลูกค้าเลือกเมนู
4. ระบบคำนวณยอดรวม
5. ลูกค้ายืนยัน order
6. ระบบ create order + order items
7. ระบบกำหนดสถานะเริ่มต้น
8. ระบบส่ง order เข้า queue
9. ระบบแสดงสถานะให้ทั้งฝั่งร้านและลูกค้า

### order status ที่แนะนำ
- pending = รับออเดอร์แล้ว รอทำ
- making = กำลังทำ
- done = ทำเสร็จแล้ว
- paid = จ่ายเงินแล้ว
- cancelled = ยกเลิก

ถ้าระบบปัจจุบันยังไม่มี paid แยก:
- อย่างน้อยต้องรู้ให้ได้ว่า done กับ paid ต่างกันหรือไม่
- ห้ามเอา report รายได้ไปนับสถานะผิด

---

## 7. QUEUE LOGIC
- คิวเรียงตามเวลา create order เป็นหลัก
- ร้านกับลูกค้าต้องเห็นสถานะเดียวกันของ order เดียวกัน
- การเปลี่ยนสถานะต้องสะท้อนไปทุกหน้าที่เกี่ยวข้อง
- ต้องป้องกันการกดซ้ำหรือ state กระโดดจาก optimistic UI

### queue transition
- pending -> making
- making -> done
- done -> paid หรือจบ flow ตาม implementation
- ทุก transition ต้อง validate สถานะก่อนหน้า

---

## 8. PAYMENT LOGIC
### payment methods
- qr
- cash

### flow
1. order ถูกสร้าง
2. ลูกค้าเลือกวิธีจ่าย
3. ระบบแสดง QR หรือบันทึกว่าเป็นเงินสด
4. เมื่อชำระสำเร็จ ให้ update payment state
5. order final state ต้องสอดคล้องกับ payment state

### rule สำคัญ
- ห้ามถือว่า done = paid เสมอ เว้นแต่ระบบกำหนดแบบนั้นชัดเจน
- report รายได้ควรนับจาก order/payment ที่ชำระสำเร็จแล้ว
- ถ้า QR ยังไม่จ่ายสำเร็จ ต้องมีสถานะค้างที่ตรวจสอบได้

---

## 9. STOCK LOGIC
### trigger
- เมื่อ order ได้รับการยืนยันแล้ว ระบบต้องเตรียมตัดสต๊อก
- จุดที่ตัดจริงต้องกำหนดให้ชัดใน implementation ว่าตัดตอน create, done หรือ paid

### recommended rule
- ถ้าต้องการกัน oversell ให้ reserve ตอน create/pending
- ถ้าต้องการง่ายและตรงบัญชี ให้ตัดจริงตอน paid หรือ done ตาม policy
- แต่ทั้งระบบต้องใช้ policy เดียวกัน

### stock requirements
- ดูยอดใช้รายวัน
- สรุปเพื่อวางแผนซื้อรายวัน / รายสัปดาห์ / รายเดือน
- สูตรเมนูต้องเชื่อมกับการใช้วัตถุดิบ

---

## 10. REPORT LOGIC
### revenue
- ควรนับเฉพาะ order ที่จ่ายสำเร็จ

### expense
- มาจากข้อมูลรายจ่ายที่ระบบรองรับ

### stock planning
- อิงจาก usage history และ current stock

### top menu
- นับจากจำนวนขายหรือยอดขาย ตาม metric ที่เลือก

---

## 11. OFFLINE / SYNC LOGIC
- เมื่อ offline ให้เก็บ action ลง local queue
- เมื่อ online ให้ sync ขึ้น cloud ตามลำดับ
- ทุก action ต้องมี idempotency หรือวิธีกันกดซ้ำ
- optimistic UI ต้อง rollback ได้เมื่อ sync fail

---

## 12. AUTH LOGIC
- ใช้ Line Authentication แบบ Deep Link
- หลัง login ต้อง resolve tenant/shop ให้ถูกต้อง
- session และ role ต้องผูกกับ tenant

---

## 13. LANGUAGE LOGIC
- รองรับ TH/EN ทั้งระบบ
- key UI ต้องไม่ hardcode ถ้าระบบมี i18n structure แล้ว
- status ที่เก็บใน database ควรเก็บเป็นค่าคงที่ภาษาเดียว แล้วค่อย map ไปแสดงผล

---

## 14. PLATFORM LOGIC
- หน้าจอหน้าร้านต้องใช้บนมือถือ/แท็บเล็ตได้ง่าย
- queue screen ต้องอ่านง่ายจากระยะไกล
- dashboard/backoffice ต้องใช้บน PC ได้ดี

---

## 15. VALIDATION CHECKLIST BEFORE MERGE
ถ้าแก้งานเกี่ยวกับ order/queue/payment/stock/report ต้องเช็คอย่างน้อย:
1. tenant isolation ยังอยู่ไหม
2. เมนูหมดแล้วยังสั่งได้ไหม
3. order สร้างซ้ำจากการกดซ้ำหรือไม่
4. queue status ตรงทั้งฝั่งร้านและลูกค้าไหม
5. payment state กับ order state ตรงกันไหม
6. stock ถูกตัดซ้ำหรือไม่
7. report นับยอดจากสถานะถูกหรือไม่
