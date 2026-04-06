"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

export default function LanguageToggle() {
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale as string;
  const otherLocale = locale === "th" ? "en" : "th";
  const otherPath = `/${otherLocale}${pathname.slice(`/${locale}`.length)}`;

  return (
    <Link
      href={otherPath}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-orange-50 hover:text-orange-700"
    >
      <span>{otherLocale === "en" ? "🇺🇸 EN" : "🇹🇭 TH"}</span>
    </Link>
  );
}
