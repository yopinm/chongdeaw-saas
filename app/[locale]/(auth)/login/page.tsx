"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function LoginPage() {
  const params = useParams();
  const locale = (params.locale as string) ?? "th";

  const channelId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const missingConfig = !channelId || !appUrl;

  const [clickError, setClickError] = useState<string | null>(null);

  function handleLineLogin() {
    if (missingConfig) {
      setClickError("ยังไม่พร้อม: กรุณา restart dev server เพื่อโหลด env vars ใหม่");
      return;
    }
    setClickError(null);
    const state = crypto.randomUUID();
    // Store state in cookie for server-side validation in callback
    document.cookie = `line_state=${state}; path=/; max-age=300; SameSite=Lax`;
    const callbackUrl = `${appUrl}/api/auth/callback`;
    const lineUrl = new URL("https://access.line.me/oauth2/v2.1/authorize");
    lineUrl.searchParams.set("response_type", "code");
    lineUrl.searchParams.set("client_id", channelId!);
    lineUrl.searchParams.set("redirect_uri", callbackUrl);
    lineUrl.searchParams.set("state", state);
    lineUrl.searchParams.set("scope", "profile openid");
    window.location.href = lineUrl.toString();
  }

  // Show error if redirected back from callback with ?error=
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const loginError = searchParams?.get("error");

  return (
    <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm">
      <div className="text-center">
        <div className="text-3xl font-bold text-orange-600">ChongDeaw</div>
        <p className="mt-2 text-sm text-gray-500">
          เข้าสู่ระบบเพื่อจัดการร้านของคุณ
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <button
          onClick={handleLineLogin}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#06C755] px-4 py-3 text-sm font-semibold text-white"
        >
          <span className="text-lg">💬</span>
          เข้าสู่ระบบด้วย LINE
        </button>

        {(missingConfig || clickError) && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-700">
            {clickError ?? (
              <>
                <strong>ยังไม่พร้อม:</strong> ต้องเพิ่ม{" "}
                <code>NEXT_PUBLIC_LINE_CHANNEL_ID</code> และ{" "}
                <code>NEXT_PUBLIC_APP_URL</code> ใน .env.local
              </>
            )}
          </div>
        )}

        {loginError && !missingConfig && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-700">
            เข้าสู่ระบบไม่สำเร็จ ({loginError}) — กรุณาลองใหม่
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        locale: {locale}
      </p>
    </div>
  );
}
