"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { planets } from "@/data/planets";
import { useLang } from "@/lib/i18n";

// Shown on every page (it lives in app/layout.tsx). The Data Hub link lives here, not in the top bar,
// so the header stays focused on exploring.
export default function Footer() {
  const { t, tx } = useLang();
  const path = usePathname();
  const onData = path === "/data";

  return (
    <footer className="relative mt-10 border-t border-white/10 bg-space-950/60 backdrop-blur">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm sm:grid-cols-[1.2fr_1fr_1.4fr]">
        {/* Brand */}
        <div>
          <div className="text-lg font-bold tracking-wide" dir="ltr">
            Reli<span className="text-glow">Q</span>
          </div>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-white/50">{t("brandTagline")}</p>
        </div>

        {/* Explore */}
        <nav aria-label={t("footerExplore")}>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">{t("footerExplore")}</h2>
          <ul className="space-y-1.5">
            {planets.map((p) => (
              <li key={p.id}>
                <Link href={`/explore/${p.id}`} className="text-white/65 transition hover:text-white">
                  {tx(p.name)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/leaderboard" className="text-white/65 transition hover:text-white">
                {t("leaderboard")}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Data Hub */}
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">{t("footerData")}</h2>
          <Link
            href="/data"
            aria-current={onData ? "page" : undefined}
            className={`group flex items-center gap-3 rounded-2xl border p-3 transition ${
              onData ? "border-glow/50 bg-glow/10" : "border-white/10 bg-white/[.03] hover:border-glow/40 hover:bg-glow/5"
            }`}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-glow/15 text-xl" aria-hidden>
              🛰️
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-white/90">
                {t("dataHub")} <span className="inline-block text-glow transition group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5">→</span>
              </span>
              <span className="block text-xs text-white/50">{t("footerDataText")}</span>
            </span>
          </Link>
        </div>
      </div>

      <div className="border-t border-white/5 py-4 text-center text-xs text-white/40">
        <span dir="ltr">ReliQ © 2026</span> · {t("footer")}
      </div>
    </footer>
  );
}
