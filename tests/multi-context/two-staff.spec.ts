import { test, expect } from "@playwright/test";
import { loginAs } from "../helpers/auth";

test("tenant isolation: two owners get their own store_id", async ({ browser }) => {
  const ctx1 = await browser.newContext();
  const ctx2 = await browser.newContext();

  try {
    const page1 = await ctx1.newPage();
    const page2 = await ctx2.newPage();

    // Login as separate store owners (different tenants)
    await loginAs(page1, "owner1@chongdeaw.test");
    await loginAs(page2, "owner2@chongdeaw.test");

    // Fetch /api/auth/me from each isolated context simultaneously
    const [me1, me2] = await Promise.all([
      page1.request.get("/api/auth/me").then((r) => r.json()),
      page2.request.get("/api/auth/me").then((r) => r.json()),
    ]);

    // Both must be authenticated
    expect(me1.authenticated).toBe(true);
    expect(me2.authenticated).toBe(true);

    // Each must see their own store
    expect(me1.store_id).toBe("a1000000-0000-0000-0000-000000000001");
    expect(me2.store_id).toBe("a2000000-0000-0000-0000-000000000002");

    // Stores must be different (cross-tenant leak check)
    expect(me1.store_id).not.toBe(me2.store_id);
  } finally {
    await ctx1.close();
    await ctx2.close();
  }
});
