import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const TEST_USERS = [
  { id: "00000001-0000-0000-0000-000000000001", email: "owner1@chongdeaw.test", store_id: "a1000000-0000-0000-0000-000000000001", role: "owner" },
  { id: "00000002-0000-0000-0000-000000000002", email: "owner2@chongdeaw.test", store_id: "a2000000-0000-0000-0000-000000000002", role: "owner" },
  { id: "00000003-0000-0000-0000-000000000003", email: "owner3@chongdeaw.test", store_id: "a3000000-0000-0000-0000-000000000003", role: "owner" },
  { id: "00000004-0000-0000-0000-000000000004", email: "staff1@chongdeaw.test",  store_id: "a1000000-0000-0000-0000-000000000001", role: "staff" },
];

export default async function globalSetup() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error("global-setup: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set");
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  for (const { id, email, store_id, role } of TEST_USERS) {
    await admin.auth.admin.deleteUser(id);

    const { error } = await admin.auth.admin.createUser({
      id,
      email,
      password: "password123",
      email_confirm: true,
      app_metadata: { store_id, role },
    });

    if (error) {
      throw new Error(`global-setup: failed to create ${email} — ${error.message}`);
    }
  }

  console.log("[global-setup] test users created ✓");
}
