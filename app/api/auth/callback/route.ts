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

  // Upsert auth user — try create first, fall back to lookup if email already exists
  let userId: string;

  const { data: newUser, error: createErr } = await admin.auth.admin.createUser({
    email: lineEmail,
    email_confirm: true,
    user_metadata: {
      line_user_id: lineProfile.userId,
      display_name: lineProfile.displayName,
      picture_url: lineProfile.pictureUrl,
    },
  });

  console.log("[auth/callback] createUser result:", newUser?.user?.id ?? "null");
  if (createErr) console.error("[auth/callback] createUser ERROR:", JSON.stringify(createErr));

  if (newUser?.user) {
    userId = newUser.user.id;
  } else {
    // Email already exists — look up the existing user
    const { data: list, error: listErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
    console.log("[auth/callback] listUsers count:", list?.users?.length ?? 0, "error:", listErr?.message ?? "none");
    const found = list?.users.find((u) => u.email === lineEmail);
    console.log("[auth/callback] found existing user:", found?.id ?? "NOT FOUND");
    if (!found) {
      console.error("[auth/callback] cannot find or create user for", lineEmail);
      return makeRedirect(req, "/th/login?error=user_create_failed");
    }
    userId = found.id;
  }

  // 3b. Upsert store + profile (TASK-1A-023)
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("store_id, role")
    .eq("id", userId)
    .eq("is_deleted", false)
    .maybeSingle();

  let storeId: string;
  let userRole = "owner";

  if (!existingProfile) {
    // First login: create store then profile
    const slug = `store-${lineProfile.userId.slice(1, 13).toLowerCase()}`;
    const { data: newStore, error: storeErr } = await admin
      .from("stores")
      .insert({ name: lineProfile.displayName, slug, owner_id: userId, locale: "th" })
      .select("id")
      .single();

    if (storeErr || !newStore) {
      console.error("[auth/callback] store create failed", storeErr);
      return makeRedirect(req, "/th/login?error=store_create_failed");
    }

    const { error: profileErr } = await admin.from("profiles").insert({
      id: userId,
      store_id: newStore.id,
      line_user_id: lineProfile.userId,
      display_name: lineProfile.displayName,
      picture_url: lineProfile.pictureUrl ?? null,
      role: "owner",
    });

    if (profileErr) {
      console.error("[auth/callback] profile create failed", profileErr);
      return makeRedirect(req, "/th/login?error=profile_create_failed");
    }

    storeId = newStore.id;
  } else {
    // Subsequent login: refresh display name + picture
    await admin
      .from("profiles")
      .update({ display_name: lineProfile.displayName, picture_url: lineProfile.pictureUrl ?? null })
      .eq("id", userId);

    storeId = existingProfile.store_id;
    userRole = existingProfile.role;
  }

  // 3c. Inject store_id + role into JWT user_metadata (TASK-1A-024)
  // Must happen before generateLink so the issued token carries these claims.
  await admin.auth.admin.updateUserById(userId, {
    user_metadata: {
      line_user_id: lineProfile.userId,
      display_name: lineProfile.displayName,
      picture_url: lineProfile.pictureUrl ?? null,
      store_id: storeId,
      role: userRole,
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

  // 5. Redirect to our own confirm route — verifyOtp server-side to set session cookies
  const confirmUrl = new URL(`${appUrl}/api/auth/confirm`);
  confirmUrl.searchParams.set("token_hash", linkData.properties.hashed_token);
  confirmUrl.searchParams.set("next", "/th");

  const res = NextResponse.redirect(confirmUrl);
  res.cookies.delete("line_state");
  return res;
}
