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
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Mobile top header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-white px-4 py-3 md:hidden">
        <span className="text-lg font-bold text-orange-600">ChongDeaw</span>
        <LanguageToggle />
      </header>

      <main className="min-w-0 flex-1 overflow-auto pb-24 md:pb-0">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-gray-100 bg-white/95 px-2 py-1.5 backdrop-blur-sm md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="flex flex-col items-center gap-0.5 text-gray-400/80 transition-colors hover:text-orange-500 active:text-orange-600"
          >
            <span className="text-lg">{item.emoji}</span>
            <span className="text-[9px] font-medium tracking-wide">{item.labelTh}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
