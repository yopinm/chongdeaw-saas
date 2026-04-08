// scripts/seed-cloud.ts
// Seed stores, profiles, categories, products into cloud Supabase.
// Run: npx tsx scripts/seed-cloud.ts
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

async function upsert(table: string, rows: object[]) {
  const { error } = await admin.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`[${table}] ${error.message}`);
  console.log(`[${table}] ${rows.length} rows upserted ✓`);
}

async function main() {
  await upsert("stores", [
    { id: "a1000000-0000-0000-0000-000000000001", name_th: "ชงเดี่ยว สาขา 1", slug: "chongdeaw-1", subscription_status: "active", tenant_tier: "basic", is_deleted: false },
    { id: "a2000000-0000-0000-0000-000000000002", name_th: "คาเฟ่มุมน้ำ",     slug: "mum-nam",     subscription_status: "active", tenant_tier: "basic", is_deleted: false },
    { id: "a3000000-0000-0000-0000-000000000003", name_th: "ร้านกาแฟทดสอบ",  slug: "test-coffee", subscription_status: "trial",  tenant_tier: "basic", is_deleted: false },
  ]);

  // profiles skipped — cloud schema differs (no display_name/line_user_id)

  await upsert("categories", [
    { id: "c1100000-0000-0000-0000-000000000001", store_id: "a1000000-0000-0000-0000-000000000001", name_th: "กาแฟร้อน",    name_en: "Hot Coffee",  is_deleted: false },
    { id: "c1200000-0000-0000-0000-000000000002", store_id: "a1000000-0000-0000-0000-000000000001", name_th: "กาแฟเย็น",    name_en: "Iced Coffee", is_deleted: false },
    { id: "c2100000-0000-0000-0000-000000000003", store_id: "a2000000-0000-0000-0000-000000000002", name_th: "กาแฟ",        name_en: "Coffee",      is_deleted: false },
    { id: "c2200000-0000-0000-0000-000000000004", store_id: "a2000000-0000-0000-0000-000000000002", name_th: "ชา",          name_en: "Tea",         is_deleted: false },
    { id: "c3100000-0000-0000-0000-000000000005", store_id: "a3000000-0000-0000-0000-000000000003", name_th: "เครื่องดื่ม", name_en: "Drinks",      is_deleted: false },
  ]);

  await upsert("products", [
    { id: "bb010100-0000-0000-0000-000000000001", store_id: "a1000000-0000-0000-0000-000000000001", category_id: "c1100000-0000-0000-0000-000000000001", name_th: "อเมริกาโน่ร้อน",  name_en: "Hot Americano",    price: 55, is_available: true,  is_deleted: false },
    { id: "bb010200-0000-0000-0000-000000000002", store_id: "a1000000-0000-0000-0000-000000000001", category_id: "c1100000-0000-0000-0000-000000000001", name_th: "ลาเต้ร้อน",       name_en: "Hot Latte",        price: 65, is_available: true,  is_deleted: false },
    { id: "bb010300-0000-0000-0000-000000000003", store_id: "a1000000-0000-0000-0000-000000000001", category_id: "c1100000-0000-0000-0000-000000000001", name_th: "คาปูชิโน่",       name_en: "Cappuccino",       price: 65, is_available: true,  is_deleted: false },
    { id: "bb010400-0000-0000-0000-000000000004", store_id: "a1000000-0000-0000-0000-000000000001", category_id: "c1100000-0000-0000-0000-000000000001", name_th: "มอคค่าร้อน",      name_en: "Hot Mocha",        price: 70, is_available: true,  is_deleted: false },
    { id: "bb010500-0000-0000-0000-000000000005", store_id: "a1000000-0000-0000-0000-000000000001", category_id: "c1200000-0000-0000-0000-000000000002", name_th: "อเมริกาโน่เย็น",  name_en: "Iced Americano",   price: 60, is_available: true,  is_deleted: false },
    { id: "bb010600-0000-0000-0000-000000000006", store_id: "a1000000-0000-0000-0000-000000000001", category_id: "c1200000-0000-0000-0000-000000000002", name_th: "ลาเต้เย็น",       name_en: "Iced Latte",       price: 70, is_available: true,  is_deleted: false },
    { id: "bb010700-0000-0000-0000-000000000007", store_id: "a1000000-0000-0000-0000-000000000001", category_id: "c1200000-0000-0000-0000-000000000002", name_th: "มอคค่าเย็น",      name_en: "Iced Mocha",       price: 75, is_available: true,  is_deleted: false },
    { id: "bb010800-0000-0000-0000-000000000008", store_id: "a1000000-0000-0000-0000-000000000001", category_id: "c1200000-0000-0000-0000-000000000002", name_th: "กาแฟเย็นหวานน้อย",name_en: "Less Sweet Iced",  price: 60, is_available: true,  is_deleted: false },
    { id: "bb010900-0000-0000-0000-000000000009", store_id: "a1000000-0000-0000-0000-000000000001", category_id: "c1200000-0000-0000-0000-000000000002", name_th: "ช็อกโกแลตเย็น",   name_en: "Iced Chocolate",   price: 75, is_available: false, is_deleted: false },
    { id: "bb011000-0000-0000-0000-000000000010", store_id: "a1000000-0000-0000-0000-000000000001", category_id: "c1200000-0000-0000-0000-000000000002", name_th: "มัทฉะลาเต้เย็น",  name_en: "Iced Matcha Latte",price: 80, is_available: true,  is_deleted: false },
    { id: "bb020100-0000-0000-0000-000000000011", store_id: "a2000000-0000-0000-0000-000000000002", category_id: "c2100000-0000-0000-0000-000000000003", name_th: "เอสเพรสโซ",        name_en: "Espresso",         price: 45, is_available: true,  is_deleted: false },
    { id: "bb020200-0000-0000-0000-000000000012", store_id: "a2000000-0000-0000-0000-000000000002", category_id: "c2100000-0000-0000-0000-000000000003", name_th: "ดับเบิ้ลเอสเพรสโซ",name_en: "Double Espresso",  price: 60, is_available: true,  is_deleted: false },
    { id: "bb020300-0000-0000-0000-000000000013", store_id: "a2000000-0000-0000-0000-000000000002", category_id: "c2100000-0000-0000-0000-000000000003", name_th: "ลาเต้",            name_en: "Latte",            price: 65, is_available: true,  is_deleted: false },
    { id: "bb020400-0000-0000-0000-000000000014", store_id: "a2000000-0000-0000-0000-000000000002", category_id: "c2100000-0000-0000-0000-000000000003", name_th: "แฟลตไวท์",         name_en: "Flat White",       price: 70, is_available: true,  is_deleted: false },
    { id: "bb020500-0000-0000-0000-000000000015", store_id: "a2000000-0000-0000-0000-000000000002", category_id: "c2100000-0000-0000-0000-000000000003", name_th: "โคลด์บริว",        name_en: "Cold Brew",        price: 75, is_available: true,  is_deleted: false },
    { id: "bb020600-0000-0000-0000-000000000016", store_id: "a2000000-0000-0000-0000-000000000002", category_id: "c2200000-0000-0000-0000-000000000004", name_th: "ชาไทยร้อน",        name_en: "Hot Thai Tea",     price: 55, is_available: true,  is_deleted: false },
    { id: "bb020700-0000-0000-0000-000000000017", store_id: "a2000000-0000-0000-0000-000000000002", category_id: "c2200000-0000-0000-0000-000000000004", name_th: "ชาไทยเย็น",        name_en: "Iced Thai Tea",    price: 60, is_available: true,  is_deleted: false },
    { id: "bb020800-0000-0000-0000-000000000018", store_id: "a2000000-0000-0000-0000-000000000002", category_id: "c2200000-0000-0000-0000-000000000004", name_th: "ชามะนาวเย็น",      name_en: "Iced Lemon Tea",   price: 55, is_available: true,  is_deleted: false },
    { id: "bb020900-0000-0000-0000-000000000019", store_id: "a2000000-0000-0000-0000-000000000002", category_id: "c2200000-0000-0000-0000-000000000004", name_th: "ชาเขียวร้อน",      name_en: "Hot Green Tea",    price: 50, is_available: false, is_deleted: false },
    { id: "bb021000-0000-0000-0000-000000000020", store_id: "a2000000-0000-0000-0000-000000000002", category_id: "c2200000-0000-0000-0000-000000000004", name_th: "ชานมไข่มุก",       name_en: "Bubble Milk Tea",  price: 75, is_available: true,  is_deleted: false },
    { id: "bb030100-0000-0000-0000-000000000021", store_id: "a3000000-0000-0000-0000-000000000003", category_id: "c3100000-0000-0000-0000-000000000005", name_th: "กาแฟดำร้อน",      name_en: "Hot Black Coffee", price: 40, is_available: true,  is_deleted: false },
    { id: "bb030200-0000-0000-0000-000000000022", store_id: "a3000000-0000-0000-0000-000000000003", category_id: "c3100000-0000-0000-0000-000000000005", name_th: "กาแฟดำเย็น",      name_en: "Iced Black Coffee",price: 45, is_available: true,  is_deleted: false },
    { id: "bb030300-0000-0000-0000-000000000023", store_id: "a3000000-0000-0000-0000-000000000003", category_id: "c3100000-0000-0000-0000-000000000005", name_th: "กาแฟนมร้อน",      name_en: "Hot Milk Coffee",  price: 50, is_available: true,  is_deleted: false },
    { id: "bb030400-0000-0000-0000-000000000024", store_id: "a3000000-0000-0000-0000-000000000003", category_id: "c3100000-0000-0000-0000-000000000005", name_th: "กาแฟนมเย็น",      name_en: "Iced Milk Coffee", price: 55, is_available: true,  is_deleted: false },
    { id: "bb030500-0000-0000-0000-000000000025", store_id: "a3000000-0000-0000-0000-000000000003", category_id: "c3100000-0000-0000-0000-000000000005", name_th: "โอเลี้ยง",         name_en: "Thai Iced Coffee", price: 45, is_available: true,  is_deleted: false },
    { id: "bb030600-0000-0000-0000-000000000026", store_id: "a3000000-0000-0000-0000-000000000003", category_id: "c3100000-0000-0000-0000-000000000005", name_th: "ช็อกโกแลตร้อน",   name_en: "Hot Chocolate",    price: 60, is_available: true,  is_deleted: false },
    { id: "bb030700-0000-0000-0000-000000000027", store_id: "a3000000-0000-0000-0000-000000000003", category_id: "c3100000-0000-0000-0000-000000000005", name_th: "นมสดร้อน",         name_en: "Hot Fresh Milk",   price: 45, is_available: true,  is_deleted: false },
    { id: "bb030800-0000-0000-0000-000000000028", store_id: "a3000000-0000-0000-0000-000000000003", category_id: "c3100000-0000-0000-0000-000000000005", name_th: "นมสดเย็น",         name_en: "Iced Fresh Milk",  price: 45, is_available: true,  is_deleted: false },
    { id: "bb030900-0000-0000-0000-000000000029", store_id: "a3000000-0000-0000-0000-000000000003", category_id: "c3100000-0000-0000-0000-000000000005", name_th: "โกโก้เย็น",        name_en: "Iced Cocoa",       price: 55, is_available: true,  is_deleted: false },
    { id: "bb031000-0000-0000-0000-000000000030", store_id: "a3000000-0000-0000-0000-000000000003", category_id: "c3100000-0000-0000-0000-000000000005", name_th: "เลมอนโซดา",        name_en: "Lemon Soda",       price: 50, is_available: false, is_deleted: false },
  ]);

  console.log("seed-cloud done ✓");
}

main().catch((e) => { console.error(e); process.exit(1); });
