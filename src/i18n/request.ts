import { getRequestConfig } from "next-intl/server";

const locales = ["th", "en"] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && locales.includes(requested as (typeof locales)[number])
      ? requested
      : "th";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
