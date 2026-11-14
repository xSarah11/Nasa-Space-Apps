"use client";

// Small "+50 XP" toast shown anywhere on the site when the student earns XP.
import { useEffect, useState } from "react";
import { XP_EVENT } from "@/lib/xp";
import { useLang } from "@/lib/i18n";

export default function XpToast() {
  const { t, lang } = useLang();
  const [toast, setToast] = useState<{ id: number; xp: number } | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const on = (e: Event) => {
      const xp = (e as CustomEvent<{ xp: number }>).detail?.xp ?? 0;
      if (xp <= 0) return;
      setToast({ id: Date.now(), xp });
      clearTimeout(timer);
      timer = setTimeout(() => setToast(null), 2600);
    };
    window.addEventListener(XP_EVENT, on);
    return () => {
      window.removeEventListener(XP_EVENT, on);
      clearTimeout(timer);
    };
  }, []);

  if (!toast) return null;
  return (
    <div
      key={toast.id}
      role="status"
      className="fade-up pointer-events-none fixed left-1/2 top-20 z-[1200] -translate-x-1/2 rounded-full border border-amber-300/40 bg-space-900/95 px-4 py-2 text-sm font-bold text-amber-200 shadow-[0_0_30px_rgba(255,209,102,.35)]"
    >
      ✨ <span dir="ltr">+{toast.xp.toLocaleString(lang === "ar" ? "ar-SA" : "en-US")} XP</span> · {t("xpGained")}
    </div>
  );
}
