"use client";

import { useState } from "react";

type Props = {
  productId: string;
  slug: string;
  initialValue: boolean;
};

export default function AvailabilityToggle({ productId, slug, initialValue }: Props) {
  const [available, setAvailable] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const next = !available;

    const res = await fetch(`/api/menu/${slug}/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, isAvailable: next }),
    });

    if (res.ok) {
      setAvailable(next);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      aria-label={available ? "ปิดการขาย" : "เปิดการขาย"}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
        available ? "bg-orange-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          available ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
