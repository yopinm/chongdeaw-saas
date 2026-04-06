import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`../../src/messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
        <aside className="hidden h-screen w-64 flex-col border-r bg-white p-4 md:flex">
          <div className="px-2 text-xl font-bold text-orange-600">
            ChongDeaw
          </div>
          <nav className="mt-8 flex-1 space-y-1">
            <div className="rounded-lg bg-orange-50 p-3 font-medium text-orange-700">
              Dashboard
            </div>
            <div className="rounded-lg p-3 text-gray-600 hover:bg-gray-50">
              Orders
            </div>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-auto pb-24 md:pb-0">
          <div className="mx-auto max-w-7xl p-4">{children}</div>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t bg-white px-6 py-3 md:hidden">
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
