import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import AvailabilityToggle from "./AvailabilityToggle";

// Public customer-facing menu page.
// Uses service role to bypass RLS — we filter by store_id ourselves.
const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

type Props = { params: Promise<{ slug: string }> };

export default async function MenuPage({ params }: Props) {
  const { slug } = await params;

  // 1. Resolve store by slug — slug is public, store_id is internal
  const { data: store } = await admin
    .from("stores")
    .select("id, name")
    .eq("slug", slug)
    .eq("is_deleted", false)
    .single();

  if (!store) notFound();

  const storeId = store.id;

  // 2. Fetch categories for this store
  const { data: categories } = await admin
    .from("categories")
    .select("id, name_th, name_en")
    .eq("store_id", storeId)
    .eq("is_deleted", false)
    .order("created_at");

  // 3. Fetch all products for this store (including unavailable — staff sees all)
  const { data: products } = await admin
    .from("products")
    .select("id, category_id, name_th, name_en, price, is_available")
    .eq("store_id", storeId)
    .eq("is_deleted", false)
    .order("created_at");

  const categoryList = categories ?? [];
  const productList = products ?? [];

  // Group products by category
  const productsByCategory = categoryList.map((cat) => ({
    ...cat,
    products: productList.filter((p) => p.category_id === cat.id),
  }));

  // Products without a category
  const uncategorised = productList.filter(
    (p) => !categoryList.some((c) => c.id === p.category_id),
  );

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-gray-900">{store.name}</h1>

      {productsByCategory.map((cat) => (
        <section key={cat.id}>
          <h2 className="text-base font-bold text-gray-700 mb-3 border-b pb-1">
            {cat.name_th}
          </h2>
          <div className="flex flex-col gap-3">
            {cat.products.map((product) => (
              <div
                key={product.id}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 shadow-sm ${
                  product.is_available
                    ? "border-gray-200 bg-white"
                    : "border-gray-100 bg-gray-50 opacity-60"
                }`}
              >
                <div>
                  <p className="font-semibold text-gray-900">{product.name_th}</p>
                  {product.name_en && (
                    <p className="text-xs text-gray-400">{product.name_en}</p>
                  )}
                  <p className="mt-0.5 text-sm font-bold text-orange-600">
                    ฿{Number(product.price).toFixed(0)}
                  </p>
                </div>
                <AvailabilityToggle
                  productId={product.id}
                  slug={slug}
                  initialValue={product.is_available}
                />
              </div>
            ))}
          </div>
        </section>
      ))}

      {uncategorised.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-gray-700 mb-3 border-b pb-1">
            อื่น ๆ
          </h2>
          <div className="flex flex-col gap-3">
            {uncategorised.map((product) => (
              <div
                key={product.id}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 shadow-sm ${
                  product.is_available
                    ? "border-gray-200 bg-white"
                    : "border-gray-100 bg-gray-50 opacity-60"
                }`}
              >
                <div>
                  <p className="font-semibold text-gray-900">{product.name_th}</p>
                  <p className="mt-0.5 text-sm font-bold text-orange-600">
                    ฿{Number(product.price).toFixed(0)}
                  </p>
                </div>
                <AvailabilityToggle
                  productId={product.id}
                  slug={slug}
                  initialValue={product.is_available}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {productList.length === 0 && (
        <p className="text-center text-gray-400 py-12">ยังไม่มีสินค้า</p>
      )}
    </div>
  );
}
