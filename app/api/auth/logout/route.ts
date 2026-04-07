import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/src/lib/supabase";

// POST /api/auth/logout — clear Supabase session and redirect to login
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  const locale = req.headers.get("x-locale") ?? "th";
  const base = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;
  return NextResponse.redirect(new URL(`/${locale}/login`, base));
}
