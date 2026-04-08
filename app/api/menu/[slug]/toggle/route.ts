import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/src/lib/supabase";

// POST /api/menu/[slug]/toggle
// Body: { productId: string, isAvailable: boolean }
// Requires: authenticated staff session whose store_id matches the slug's store.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { productId, isAvailable } = await req.json();

  if (!productId || typeof isAvailable !== "boolean") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  // 1. Verify session — get store_id from JWT app_metadata (server-only, client cannot spoof)
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();

  if (authErr || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const sessionStoreId: string | undefined = user.app_metadata?.store_id;
  if (!sessionStoreId) {
    return NextResponse.json({ error: "no store_id in session" }, { status: 403 });
  }

  // 2. Resolve slug → store_id to verify the staff owns this store
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data: store } = await admin
    .from("stores")
    .select("id")
    .eq("slug", slug)
    .eq("is_deleted", false)
    .single();

  if (!store) {
    return NextResponse.json({ error: "store not found" }, { status: 404 });
  }

  if (store.id !== sessionStoreId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // 3. Update is_available — only for products belonging to this store
  const { error: updateErr } = await admin
    .from("products")
    .update({ is_available: isAvailable })
    .eq("id", productId)
    .eq("store_id", sessionStoreId)   // double-check tenant isolation
    .eq("is_deleted", false);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, productId, isAvailable });
}
