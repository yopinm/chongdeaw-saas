import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["kira-unpenetrating-uncogently.ngrok-free.dev"],
};

export default withNextIntl(nextConfig);
