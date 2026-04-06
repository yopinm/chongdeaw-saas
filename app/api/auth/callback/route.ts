// STUB — LINE OAuth callback handler
// Status: NOT IMPLEMENTED. Real wiring deferred to TASK-015+.
//
// === Real flow (when LINE keys are ready) ===
// 1. LINE redirects here with ?code=...&state=...
// 2. Exchange `code` for LINE access token via LINE Token API
// 3. Fetch LINE user profile (userId, displayName, pictureUrl)
// 4. Upsert user row in Supabase `profiles` table
// 5. Create Supabase session (set auth cookie via @supabase/ssr)
// 6. Redirect to /{locale} with session active
//
// === Required env vars (see TASK-010 audit) ===
// - LINE_CHANNEL_ID         (missing — add to .env.local before real wiring)
// - LINE_CHANNEL_SECRET     (missing — add to .env.local before real wiring)
// - NEXT_PUBLIC_SUPABASE_URL        (present)
// - NEXT_PUBLIC_SUPABASE_ANON_KEY   (present)
//
// === Registered callback URL in LINE Developers Console ===
// Must match exactly: https://{your-domain}/api/auth/callback

import { NextResponse } from "next/server";

export async function GET() {
  // Real implementation deferred — see comment above
  return NextResponse.json(
    {
      error: "LINE OAuth callback not yet implemented",
      status: "STUB",
      hint: "Add LINE_CHANNEL_ID + LINE_CHANNEL_SECRET to .env.local first",
    },
    { status: 501 },
  );
}
