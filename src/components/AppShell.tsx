import type { ReactNode } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      {/* Desktop sidebar — nav items added in TASK-006 */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r bg-white p-4 md:flex">
        <div className="px-2 text-xl font-bold text-orange-600">ChongDeaw</div>
        <nav className="mt-8 flex-1 space-y-1"></nav>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1 overflow-auto pb-24 md:pb-0">
        <div className="mx-auto max-w-7xl p-4">{children}</div>
      </main>

      {/* Mobile bottom nav — nav items added in TASK-006 */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-white px-2 py-3 md:hidden"></nav>
    </div>
  );
}
