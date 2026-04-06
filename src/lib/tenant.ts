// TASK-015 — store_id binding design
//
// RULE (RRD §4): store_id MUST be resolved from the authenticated server context.
//                It must NEVER be accepted from request body, URL params, or headers.
//
// CURRENT STATUS: Function structure is correct. Not fully operational yet.
// Prerequisite A: profiles table must exist in Supabase (run docs/Multi-tenant DB.sql first).
// Prerequisite B: Real auth session required — TASK-012 mock login does NOT create a Supabase session.
// Prerequisite C: JWT claim binding (store_id in user_metadata) comes in TASK-016+.
//
// Binding flow:
//   1. Create Supabase server client (session read from cookies — server-side only)
//   2. supabase.auth.getUser() — verifies JWT, returns trusted user.id
//   3. SELECT store_id, role FROM profiles WHERE id = user.id AND is_deleted = false
//   4. Return TenantContext { user_id, store_id, role }
//
// store_id is derived from step 3 (DB lookup by verified user.id).
// It is NOT taken from any parameter passed by the caller.

import { createSupabaseServerClient } from "@/src/lib/supabase";
import type { TenantContext, UserRole } from "@/src/types/index";

type ProfileRow = { store_id: string; role: string };

/**
 * Resolves the authenticated user's TenantContext from the server-side session.
 * Returns null if no valid session exists, or if no profile row is found.
 *
 * Use in: Server Components, Route Handlers, Server Actions.
 * Do NOT call from Client Components — use server-to-client prop passing instead.
 */
export async function getTenantContext(): Promise<TenantContext | null> {
  const supabase = await createSupabaseServerClient();

  // Step 1: verify JWT and get authenticated user — getUser() validates server-side
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null; // no valid session — caller should redirect to login
  }

  // Step 2: derive store_id from the profiles table — NOT from any request input
  const { data, error: profileError } = await supabase
    .from("profiles")
    .select("store_id, role")
    .eq("id", user.id)
    .eq("is_deleted", false)
    .single();

  if (profileError || !data) {
    return null; // authenticated but no profile row — treat as unauthorized
  }

  const profile = data as ProfileRow;

  return {
    user_id: user.id,
    store_id: profile.store_id, // from DB — never from client
    role: profile.role as UserRole,
  };
}

/**
 * Like getTenantContext() but throws if no valid context is found.
 * Use at server boundaries that require a valid tenant (API routes, server actions).
 *
 * TODO: replace the thrown error with a redirect to /{locale}/login
 * once auth flow is complete (TASK-012 real implementation).
 */
export async function requireTenantContext(): Promise<TenantContext> {
  const ctx = await getTenantContext();
  if (!ctx) {
    // STUB: real implementation will redirect to /{locale}/login
    throw new Error("UNAUTHORIZED: no valid tenant context");
  }
  return ctx;
}
