import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/src/lib/supabase";

// GET /api/auth/me — verify JWT claims (dev only, remove before prod)
export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user_id: user.id,
    email: user.email,
    user_metadata: user.user_metadata,
  });
}
