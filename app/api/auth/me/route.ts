import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/src/lib/supabase";

// GET /api/auth/me — verify JWT claims (dev only, remove before prod)
export async function GET(req: NextRequest) {
  console.log("[auth/me] incoming cookies:", req.cookies.getAll().map((c) => c.name));
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user_id: user.id,
    email: user.email,
    store_id: user.app_metadata?.store_id ?? null,
    role: user.app_metadata?.role ?? null,
  });
}
