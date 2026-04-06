// Phase 1 type contracts — TypeScript only
// No DB migration here. Schema baseline → TASK-014. RLS + session binding → TASK-015+.
//
// Multi-tenant rule (RRD §4):
//   - Every entity that belongs to a tenant must carry store_id
//   - store_id must be resolved from authenticated server context
//   - Never trust store_id from request body or frontend

// ─── Shared ────────────────────────────────────────────────────────────────

export type UserRole = "owner" | "staff";

export type Locale = "th" | "en";

// ─── Store (one per tenant) ─────────────────────────────────────────────────
// Represents a coffee shop. Each store is one tenant.

export type Store = {
  id: string;                  // UUID — primary key
  name: string;                // display name of the shop
  owner_id: string;            // Supabase auth.users.id of the owner
  line_channel_id: string | null; // LINE Messaging API channel for this store
  locale: Locale;              // default locale for this store
  created_at: string;          // ISO 8601
};

export type StoreInsert = Omit<Store, "id" | "created_at">;

// ─── Profile (one per user per store) ──────────────────────────────────────
// Links a Supabase auth user to their LINE identity and store membership.

export type Profile = {
  id: string;                  // mirrors Supabase auth.users.id
  store_id: string;            // tenant link — resolved from JWT, not from body
  line_user_id: string;        // LINE userId
  display_name: string;        // LINE displayName
  picture_url: string | null;  // LINE pictureUrl
  role: UserRole;
  created_at: string;          // ISO 8601
};

export type ProfileInsert = Omit<Profile, "id" | "created_at">;

// ─── TenantContext ──────────────────────────────────────────────────────────
// Resolved inside server context after JWT/session verification.
// Passed to service functions — never constructed from client input.

export type TenantContext = {
  user_id: string;   // Supabase auth.users.id
  store_id: string;  // resolved from auth claim, not from request
  role: UserRole;
};
