import type { ReactNode } from "react";
import Link from "next/link";
import LanguageToggle from "@/src/components/LanguageToggle";

const navItems = [
  { key: "home", label: "Home", labelTh: "หน้าหลัก", emoji: "🏠", href: "#" },
  { key: "queue", label: "Queue", labelTh: "คิว", emoji: "📋", href: "#" },
  { key: "revenue", label: "Revenue", labelTh: "รายได้", emoji: "💰", href: "#" },
  { key: "crm", label: "CRM", labelTh: "ลูกค้า", emoji: "👥", href: "#" },
  { key: "settings", label: "Settings", labelTh: "ตั้งค่า", emoji: "⚙️", href: "#" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r bg-white p-4 md:flex">
        <div className="px-2 text-xl font-bold text-orange-600">ChongDeaw</div>
        <nav className="mt-8 flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="flex items-center gap-3 rounded-lg p-3 text-gray-600 hover:bg-orange-50 hover:text-orange-700"
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t pt-3">
          <LanguageToggle />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top header */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-white px-4 py-3 md:hidden">
          <span className="text-lg font-bold text-orange-600">ChongDeaw</span>
          <LanguageToggle />
        </header>

        <main className="min-w-0 flex-1 overflow-auto pb-24 md:pb-0">
          <div className="mx-auto max-w-7xl p-4">{children}</div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-white px-2 py-3 md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-orange-600"
          >
            <span className="text-xl">{item.emoji}</span>
            <span className="text-[10px] font-medium">{item.labelTh}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
