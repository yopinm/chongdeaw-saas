import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// LINE OAuth callback handler
// Required env vars (add to .env.local before UAT):
//   LINE_CHANNEL_ID, LINE_CHANNEL_SECRET
//   NEXT_PUBLIC_APP_URL
//   SUPABASE_SERVICE_ROLE_KEY

function makeRedirect(req: NextRequest, path: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;
  return NextResponse.redirect(new URL(path, base));
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const lineError = searchParams.get("error");

  // User denied LINE login
  if (lineError) {
    return makeRedirect(req, "/th/login?error=line_denied");
  }

  // CSRF state validation
  const cookieState = req.cookies.get("line_state")?.value;
  if (!state || !cookieState || state !== cookieState) {
    return makeRedirect(req, "/th/login?error=invalid_state");
  }

  if (!code) {
    return makeRedirect(req, "/th/login?error=no_code");
  }

  const channelId = process.env.LINE_CHANNEL_ID;
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!channelId || !channelSecret || !appUrl) {
    return NextResponse.json(
      { error: "LINE credentials not configured", missing: "LINE_CHANNEL_ID / LINE_CHANNEL_SECRET / NEXT_PUBLIC_APP_URL" },
      { status: 503 },
    );
  }

  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: "Supabase service role key not configured", missing: "SUPABASE_SERVICE_ROLE_KEY" },
      { status: 503 },
    );
  }

  // 1. Exchange LINE code for access token
  const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${appUrl}/api/auth/callback`,
      client_id: channelId,
      client_secret: channelSecret,
    }),
  });

  if (!tokenRes.ok) {
    console.error("[auth/callback] LINE token exchange failed", await tokenRes.text());
    return makeRedirect(req, "/th/login?error=token_exchange_failed");
  }

  const { access_token } = (await tokenRes.json()) as { access_token: string };

  // 2. Fetch LINE profile
  const profileRes = await fetch("https://api.line.me/v2/profile", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!profileRes.ok) {
    console.error("[auth/callback] LINE profile fetch failed");
    return makeRedirect(req, "/th/login?error=profile_fetch_failed");
  }

  const lineProfile = (await profileRes.json()) as {
    userId: string;
    displayName: string;
    pictureUrl?: string;
  };

  // 3. Upsert Supabase user via admin client
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  // Use a deterministic email derived from LINE userId (never shown to user)
  const lineEmail = `line_${lineProfile.userId}@line.user`;

  // Upsert auth user
  const { data: existingUser } = await admin.auth.admin.listUsers();
  const found = existingUser?.users.find((u) => u.email === lineEmail);

  let userId: string;

  if (found) {
    userId = found.id;
  } else {
    const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
      email: lineEmail,
      email_confirm: true,
      user_metadata: {
        line_user_id: lineProfile.userId,
        display_name: lineProfile.displayName,
        picture_url: lineProfile.pictureUrl,
      },
    });
    if (createErr || !newUser.user) {
      console.error("[auth/callback] createUser failed", createErr);
      return makeRedirect(req, "/th/login?error=user_create_failed");
    }
    userId = newUser.user.id;
  }

  // Update LINE metadata on every login
  await admin.auth.admin.updateUserById(userId, {
    user_metadata: {
      line_user_id: lineProfile.userId,
      display_name: lineProfile.displayName,
      picture_url: lineProfile.pictureUrl,
    },
  });

  // 4. Generate magic-link token to create a real session
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: lineEmail,
  });

  if (linkErr || !linkData?.properties?.hashed_token) {
    console.error("[auth/callback] generateLink failed", linkErr);
    return makeRedirect(req, "/th/login?error=session_create_failed");
  }

  // 5. Redirect to the magic-link confirm URL to establish a real cookie session
  const confirmUrl = new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/verify`);
  confirmUrl.searchParams.set("token", linkData.properties.hashed_token);
  confirmUrl.searchParams.set("type", "magiclink");
  confirmUrl.searchParams.set("redirect_to", `${appUrl}/th`);

  const res = NextResponse.redirect(confirmUrl);
  res.cookies.delete("line_state");
  return res;
}
