// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex min-h-screen flex-col md:flex-row bg-gray-50">
        {/* [iPad/Desktop] Sidebar */}
        <aside className="hidden md:flex w-64 flex-col bg-white border-r sticky top-0 h-screen p-4">
          <div className="text-xl font-bold text-orange-600 px-2">
            ChongDeaw
          </div>
          <nav className="mt-8 flex-1 space-y-1">
            <div className="p-3 bg-orange-50 text-orange-700 rounded-lg font-medium">
              Dashboard
            </div>
            <div className="p-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              Orders
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 overflow-auto pb-24 md:pb-0">
          <div className="max-w-7xl mx-auto p-4">{children}</div>
        </main>

        {/* [Mobile] Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-3 flex justify-between items-center z-50">
          <div className="flex flex-col items-center text-orange-600">
            <span className="text-xl">🏠</span>
            <span className="text-[10px] font-medium">Home</span>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <span className="text-xl">📋</span>
            <span className="text-[10px] font-medium">Orders</span>
          </div>
        </nav>
      </div>
    </NextIntlClientProvider>
  );
}
