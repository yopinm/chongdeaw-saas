"use client";
// MOCK FLOW — LINE OAuth is not connected yet.
// Real flow requires LINE_CHANNEL_ID + LINE_CHANNEL_SECRET in .env.local (see TASK-010 audit).
// Clicking the button simulates a login and redirects to home with no real session.
// Real implementation: TASK-015+ (after store_id / session binding is designed).

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) ?? "th";
  const [loading, setLoading] = useState(false);

  function handleMockLogin() {
    setLoading(true);
    // MOCK: simulates auth delay then redirects home — no session is created
    // Real flow: build LINE OAuth URL → redirect → receive callback at /api/auth/callback
    setTimeout(() => router.push(`/${locale}`), 800);
  }

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
          onClick={handleMockLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#06C755] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          <span className="text-lg">💬</span>
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบด้วย LINE"}
        </button>

        <div className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700">
          <strong>MOCK MODE</strong> — ยังไม่ต่อ LINE OAuth จริง
          <br />
          กดปุ่มจะ redirect ตรงไปหน้าหลัก (ไม่มี session จริง)
        </div>
      </div>
    </div>
  );
}
