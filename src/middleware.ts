import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  locales: ["th", "en"],
  defaultLocale: "th",
});

export default function middleware(request: NextRequest) {
  // 1. จัดการเรื่องภาษา (i18n)
  const response = intlMiddleware(request);

  // 2. ในอนาคตเราจะเพิ่ม Logic ตรวจสอบ store_id จาก JWT ที่นี่ [cite: 441]

  return response;
}

export const config = {
  // ดักจับทุก Path ยกเว้นไฟล์ Static และ API บางส่วน
  matcher: ["/", "/(th|en)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
