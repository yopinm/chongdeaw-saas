// TASK-016 — request validation layer
//
// RULE (RRD §4 / PRD §6): store_id must NEVER be trusted from client input.
// All server handlers must derive store_id exclusively via getTenantContext().
//
// This module provides two enforcement tools:
//   assertNoClientStoreId() — hard reject: throws if store_id found in input
//   stripClientStoreId()    — soft strip: removes store_id silently
//
// === Usage pattern for Route Handlers =======================================
//
//   import { requireTenantContext } from "@/src/lib/tenant";
//   import { assertNoClientStoreId } from "@/src/lib/validate";
//
//   export async function POST(req: Request) {
//     const ctx = await requireTenantContext();   // store_id from DB session
//     const body = await req.json();
//     assertNoClientStoreId(body);               // explicit guard
//     // use ctx.store_id — never body.store_id
//   }
//
// ============================================================================

// ─── Types ──────────────────────────────────────────────────────────────────

/** Strips store_id from any object type at the TypeScript level. */
export type WithoutStoreId<T> = Omit<T, "store_id">;

// ─── Hard reject ────────────────────────────────────────────────────────────

/**
 * Throws a security error if the input object contains a store_id key.
 * Call on every client-provided body in server Route Handlers and Server Actions.
 *
 * @param input  - parsed request body or any untrusted object
 * @param source - label for the error message (defaults to "request body")
 */
export function assertNoClientStoreId(
  input: unknown,
  source = "request body",
): void {
  if (typeof input === "object" && input !== null && "store_id" in input) {
    throw new Error(
      `SECURITY: ${source} must not contain store_id. ` +
        "Resolve store_id via requireTenantContext() — never accept it from the client.",
    );
  }
}

// ─── Soft strip ─────────────────────────────────────────────────────────────

/**
 * Returns a new object with store_id removed.
 * Use when the caller might innocently include store_id and you want to ignore it
 * rather than reject the request outright.
 *
 * Prefer assertNoClientStoreId() at API boundaries; use this for internal
 * data-shaping where strict rejection is not required.
 */
export function stripClientStoreId<T extends Record<string, unknown>>(
  input: T,
): WithoutStoreId<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { store_id: _discarded, ...safe } = input;
  return safe as WithoutStoreId<T>;
}
