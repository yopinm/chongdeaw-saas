import { useTranslations } from "next-intl";

export default function Index() {
  const t = useTranslations("Common");
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-3xl font-bold text-orange-600">{t("title")}</h1>
      <p className="mt-2 text-gray-500">{t("welcome")}</p>

      {/* ทดสอบ Responsive Shell */}
      <div className="mt-8 p-4 bg-white shadow rounded-lg md:block hidden">
        เห็นข้อความนี้เฉพาะบน iPad/Desktop (Sidebar Active)
      </div>
    </div>
  );
}
