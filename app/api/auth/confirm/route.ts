import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// GET /api/auth/confirm?token_hash=...&next=/th
// Exchanges the magic-link token for a real server-side session (sets cookies).
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const token_hash = searchParams.get("token_hash");
  const next = searchParams.get("next") ?? "/th";
  const base = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;

  if (!token_hash) {
    return NextResponse.redirect(new URL("/th/login?error=missing_token", base));
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  const { error } = await supabase.auth.verifyOtp({ token_hash, type: "magiclink" });

  if (error) {
    console.error("[auth/confirm] verifyOtp failed", error);
    return NextResponse.redirect(new URL("/th/login?error=session_create_failed", base));
  }

  return NextResponse.redirect(new URL(next, base));
}
