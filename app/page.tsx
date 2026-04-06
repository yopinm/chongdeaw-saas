import { redirect } from "next/navigation";

// Root entry point — redirects to default locale.
// next-intl middleware also redirects / → /th, but this page
// acts as a safe fallback so / never returns 404.
export default function RootPage() {
  redirect("/th");
}
