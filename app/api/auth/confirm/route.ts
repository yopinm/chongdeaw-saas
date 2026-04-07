import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

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

  // Create response first — cookies must be set on this object directly
  const response = NextResponse.redirect(new URL(next, base));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: otpData, error } = await supabase.auth.verifyOtp({ token_hash, type: "magiclink" });

  console.log("[auth/confirm] verifyOtp result:", error ? `ERROR: ${error.message}` : "OK");
  console.log("[auth/confirm] session user:", otpData?.user?.id ?? "none");
  console.log("[auth/confirm] cookies being set:", response.cookies.getAll().map((c) => c.name));

  if (error) {
    console.error("[auth/confirm] verifyOtp failed", error);
    return NextResponse.redirect(new URL("/th/login?error=session_create_failed", base));
  }

  return response;
}
