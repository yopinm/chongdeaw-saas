// SCAFFOLD — no auth logic yet. LINE login wired in TASK-012.

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm">
      <div className="text-center">
        <div className="text-3xl font-bold text-orange-600">ChongDeaw</div>
        <p className="mt-2 text-sm text-gray-500">
          เข้าสู่ระบบเพื่อจัดการร้านของคุณ
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {/* LINE login placeholder — implementation in TASK-012 */}
        <button
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-2xl bg-[#06C755] px-4 py-3 text-sm font-semibold text-white opacity-50"
        >
          <span className="text-lg">💬</span>
          เข้าสู่ระบบด้วย LINE
        </button>

        <p className="text-center text-xs text-gray-400">
          LINE login — scaffold only, wired in TASK-012
        </p>
      </div>
    </div>
  );
}
