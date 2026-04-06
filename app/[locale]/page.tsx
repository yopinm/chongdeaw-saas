import Link from "next/link";
import { useTranslations } from "next-intl";

const homeMenus = [
  { key: "order", emoji: "☕", href: "#", badge: "เริ่มขาย" },
  { key: "queue", emoji: "📋", href: "#", badge: "ดูคิว" },
  { key: "revenue", emoji: "💰", href: "#", badge: "สรุปวันนี้" },
  { key: "stock", emoji: "📦", href: "#", badge: "สต๊อก" },
  { key: "customers", emoji: "👥", href: "#", badge: "CRM" },
  { key: "settings", emoji: "⚙️", href: "#", badge: "ระบบ" },
];

export default function Index() {
  const t = useTranslations("Home");

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-orange-500 to-amber-400 p-6 text-white shadow-sm">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-orange-100">{t("greeting")}</p>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-orange-100 uppercase tracking-wide">
            MOCK UI
          </span>
        </div>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-1.5 text-sm font-medium text-orange-100 leading-relaxed">
          {t("subtitle")}
        </p>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/15 px-3 py-3 backdrop-blur-sm">
            <div className="text-[11px] font-medium text-orange-100 leading-snug">
              {t("summary.todayOrders")}
            </div>
            <div className="mt-1.5 text-2xl font-bold leading-none">18</div>
          </div>
          <div className="rounded-2xl bg-white/15 px-3 py-3 backdrop-blur-sm">
            <div className="text-[11px] font-medium text-orange-100 leading-snug">
              {t("summary.queueNow")}
            </div>
            <div className="mt-1.5 text-2xl font-bold leading-none">5</div>
          </div>
          <div className="rounded-2xl bg-white/15 px-3 py-3 backdrop-blur-sm">
            <div className="text-[11px] font-medium text-orange-100 leading-snug">
              {t("summary.salesToday")}
            </div>
            <div className="mt-1.5 text-xl font-bold leading-none">฿2,480</div>
          </div>
        </div>
      </section>

      {/* Quick menu */}
      <section>
        <div className="mb-3">
          <h2 className="text-lg font-bold text-gray-900">
            {t("quickMenuTitle")}
          </h2>
          <p className="text-sm text-gray-500">{t("quickMenuSubtitle")}</p>
        </div>

        <div className="flex flex-col gap-3 md:grid md:grid-cols-2 xl:grid-cols-3">
          {homeMenus.map((menu) => (
            <Link
              key={menu.key}
              href={menu.href}
              className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
                {menu.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-orange-600">
                    {t(`menu.${menu.key}.title`)}
                  </h3>
                  <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-500">
                    {menu.badge}
                  </span>
                </div>
                <p className="mt-0.5 text-sm leading-snug text-gray-500">
                  {t(`menu.${menu.key}.desc`)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Info panels */}
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {t("panels.queue.title")}
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-sm text-gray-600">{t("panels.queue.waiting")}</span>
              <span className="text-lg font-bold text-gray-900">5</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-sm text-gray-600">{t("panels.queue.brewing")}</span>
              <span className="text-lg font-bold text-gray-900">2</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {t("panels.revenue.title")}
          </div>
          <div className="mt-3 space-y-2">
            <div className="rounded-xl bg-emerald-50 px-4 py-3">
              <div className="text-sm text-emerald-700">{t("panels.revenue.total")}</div>
              <div className="mt-1 text-2xl font-bold text-emerald-900">฿2,480</div>
            </div>
            <div className="text-sm text-gray-400">{t("panels.revenue.note")}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:col-span-2 xl:col-span-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {t("panels.stock.title")}
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-3">
              <span className="text-sm text-red-700">เมล็ดกาแฟ House Blend</span>
              <span className="text-sm font-bold text-red-900">ต่ำ</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3">
              <span className="text-sm text-amber-700">นมสด</span>
              <span className="text-sm font-bold text-amber-900">ใกล้หมด</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
