"use client";

// Interactive first-person story: the spacecraft tells its own journey, chapter by chapter.
// Reading to the last chapter earns XP (lib/progress.ts → markStoryRead).
// "Ask me about this" sends a question about the chapter to the chatbot (components/Chatbot.tsx).

import { useEffect, useState } from "react";
import type { Rover } from "@/data/types";
import { useLang } from "@/lib/i18n";
import { markStoryRead } from "@/lib/progress";
import { CHAT_ASK_EVENT } from "./Chatbot";

export default function PersonaStory({ rover }: { rover: Rover }) {
  const { t, tx, lang } = useLang();
  const chapters = rover.persona;
  const [i, setI] = useState(0);
  // chapters the student has actually opened — the story XP needs all of them, not just a jump to the end
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const ch = chapters[i];
  const last = i === chapters.length - 1;
  const n = (v: number) => v.toLocaleString(lang === "ar" ? "ar-SA" : "en-US");

  useEffect(() => {
    if (visited.size === chapters.length) markStoryRead(rover.id);
  }, [visited, chapters.length, rover.id]);

  function go(next: number) {
    const k = Math.max(0, Math.min(chapters.length - 1, next));
    setI(k);
    setVisited((v) => (v.has(k) ? v : new Set(v).add(k)));
  }

  function ask() {
    const q =
      lang === "ar"
        ? `حدّثيني أكثر عن: «${tx(ch.title)}»`
        : `Tell me more about: "${tx(ch.title)}"`;
    window.dispatchEvent(new CustomEvent(CHAT_ASK_EVENT, { detail: { text: q } }));
  }

  return (
    <section className="mt-6" aria-labelledby="persona-title">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="persona-title" className="text-lg font-bold">
          🎙️ {t("myStory")}
        </h2>
        <span className="text-xs text-white/50">
          {t("chapter")} {n(i + 1)}/{n(chapters.length)}
        </span>
      </div>
      <p className="mt-1 text-xs text-white/50">{t("myStoryHint")}</p>

      {/* Chapter timeline */}
      <ol className="mt-3 flex gap-1" aria-label={t("myStory")}>
        {chapters.map((c, k) => (
          <li key={k} className="flex-1">
            <button
              onClick={() => go(k)}
              aria-label={`${t("chapter")} ${k + 1}: ${tx(c.title)}`}
              aria-current={k === i ? "step" : undefined}
              title={tx(c.title)}
              className="group block w-full py-2"
            >
              <span
                className="block h-1.5 rounded-full transition-all"
                style={{ background: k <= i ? rover.accent : "rgba(255,255,255,.15)", opacity: k === i ? 1 : k < i ? 0.6 : 1 }}
              />
            </button>
          </li>
        ))}
      </ol>

      {/* Chapter card */}
      <article
        key={i}
        className="glass fade-up relative mt-1 overflow-hidden rounded-3xl p-5"
        style={{ borderColor: rover.accent + "55" }}
        aria-live="polite"
        onKeyDown={(e) => {
          const fwd = lang === "ar" ? "ArrowLeft" : "ArrowRight";
          const back = lang === "ar" ? "ArrowRight" : "ArrowLeft";
          if (e.key === fwd) go(i + 1);
          if (e.key === back) go(i - 1);
        }}
        tabIndex={0}
      >
        <div
          className="pointer-events-none absolute -end-6 -top-6 text-[7rem] leading-none opacity-10 select-none"
          aria-hidden
        >
          {ch.icon}
        </div>
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl" style={{ background: rover.accent + "22" }} aria-hidden>
            {ch.icon}
          </span>
          <div className="min-w-0">
            <span className="inline-block rounded-full bg-white/10 px-2 py-0.5 font-mono text-[11px] text-white/70" dir="ltr">
              {ch.date}
            </span>
            <h3 className="mt-0.5 text-lg font-bold leading-snug" style={{ color: rover.accent }}>
              {tx(ch.title)}
            </h3>
          </div>
        </div>
        <p className="relative mt-3 leading-loose text-white/85">{tx(ch.text)}</p>

        <div className="relative mt-4 flex flex-wrap items-center justify-between gap-2">
          <button onClick={ask} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/75 hover:border-glow/60 hover:text-white">
            💬 {lang === "ar" ? "اسألني عن هذا" : "Ask me about this"}
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => go(i - 1)}
              disabled={i === 0}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold disabled:opacity-30"
            >
              <span className="inline-block rtl:rotate-180">←</span> {t("prev")}
            </button>
            {!last ? (
              <button
                onClick={() => go(i + 1)}
                className="rounded-xl px-4 py-2 text-sm font-bold text-space-950 transition hover:brightness-110"
                style={{ background: rover.accent }}
              >
                {t("next")} <span className="inline-block rtl:rotate-180">→</span>
              </button>
            ) : (
              <button onClick={() => go(0)} className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20">
                ↺ {t("restartStory")}
              </button>
            )}
          </div>
        </div>
        {last && <p className="relative mt-3 text-center text-sm font-semibold text-emerald-300">✓ {t("storyEnd")}</p>}
      </article>
    </section>
  );
}
