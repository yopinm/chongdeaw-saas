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
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 flex flex-col gap-4 pt-2">
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

        {/* Merged stats card */}
        <div className="mt-5 rounded-2xl bg-white/15 px-4 py-4 backdrop-blur-sm">
          <div className="mb-3 text-xs font-semibold text-orange-100">
            📊 ภาพรวมวันนี้
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-orange-100">{t("summary.todayOrders")}</span>
              <span className="text-xl font-bold">18</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-orange-100">{t("summary.queueNow")}</span>
              <span className="text-xl font-bold">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-orange-100">{t("summary.salesToday")}</span>
              <span className="text-xl font-bold">฿2,480</span>
            </div>
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

        <div className="flex flex-col gap-3">
          {homeMenus.map((menu, i) => {
            const isPrimary = i === 0;
            return (
              <Link
                key={menu.key}
                href={menu.href}
                className={`group flex items-center gap-4 rounded-2xl px-4 py-4 shadow-sm transition-all duration-150 active:scale-[0.97] active:shadow-inner ${
                  isPrimary
                    ? "border-2 border-orange-400 bg-orange-50 hover:bg-orange-100 hover:shadow-md"
                    : "border border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/40 hover:shadow-md"
                }`}
              >
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ${
                    isPrimary ? "bg-orange-500/15" : "bg-orange-50"
                  }`}
                >
                  {menu.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-base font-bold ${
                        isPrimary
                          ? "text-orange-700"
                          : "text-gray-900 group-hover:text-orange-600"
                      }`}
                    >
                      {t(`menu.${menu.key}.title`)}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        isPrimary
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {menu.badge}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm leading-snug text-gray-500">
                    {t(`menu.${menu.key}.desc`)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}
