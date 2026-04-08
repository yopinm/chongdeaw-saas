import { Page } from "@playwright/test";

/**
 * Login via test-only API route (no LINE OAuth).
 * Sets session cookies on the page's browser context.
 */
export async function loginAs(page: Page, email: string, password = "password123") {
  const res = await page.request.post("/api/test/login", {
    data: { email, password },
  });
  if (!res.ok()) {
    throw new Error(`loginAs(${email}) failed ${res.status()}: ${await res.text()}`);
  }
}
