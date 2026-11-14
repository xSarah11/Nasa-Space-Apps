"use client";

// Floating chat widget: the student talks with the spacecraft itself (first-person persona).
// Answers come from /api/chat, which only uses facts in data/nasa_knowledge.json (NASA NSSDCA + NASA Science).
// Arabic (RTL) and English; suggested questions; other components can open it with a question via CHAT_ASK_EVENT.

import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { getRover, getRoversByPlanet } from "@/data/rovers";
import type { PlanetId } from "@/data/types";

type Msg = { role: "user" | "assistant"; text: string };

/** window event: open the chat and ask `detail.text` */
export const CHAT_ASK_EVENT = "reliq-chat-ask";

const SUGGESTIONS: Record<string, { ar: string[]; en: string[] }> = {
  "surveyor-3": {
    ar: ["حدّثيني عن مهمة هبوطك", "ما أبرز اكتشافاتك؟", "كيف اختبرتِ تربة القمر؟", "ماذا أخذ منكِ رواد أبولو ١٢؟", "كيف كانت كاميرتك تعمل؟"],
    en: ["Tell me about your landing", "What were your biggest discoveries?", "How did you test the Moon's soil?", "What did the Apollo 12 crew take from you?", "How did your camera work?"],
  },
  opportunity: {
    ar: ["حدّثيني عن مهمة هبوطك", "ما أبرز اكتشافاتك؟", "ما هو «التوت الأزرق»؟", "ماذا وجدتِ في فوهة إنديفور؟", "كيف انتهت رحلتك؟"],
    en: ["Tell me about your landing", "What were your biggest discoveries?", "What are the 'blueberries'?", "What did you find at Endeavour crater?", "How did your journey end?"],
  },
  general: {
    ar: ["ما الفرق بين سيرفيور ٣ وأوبورتيونيتي؟", "كم تبلغ جاذبية القمر؟", "مِمّ يتكون غلاف المريخ الجوي؟"],
    en: ["How are Surveyor 3 and Opportunity different?", "How strong is the Moon's gravity?", "What is Mars' atmosphere made of?"],
  },
};

const ERRORS: Record<string, { ar: string; en: string }> = {
  NO_KEY: {
    ar: "المساعد غير مفعّل بعد: أضف ANTHROPIC_API_KEY في ملف ‎.env.local ثم أعد تشغيل الخادم.",
    en: "Assistant not configured yet: add ANTHROPIC_API_KEY to .env.local and restart the server.",
  },
  DEMO: {
    ar: "هذه نسخة عرض: المحادثة تعمل في النسخة الكاملة بعد إضافة مفتاح Claude API.",
    en: "Demo version: chat works in the full version once a Claude API key is added.",
  },
  RATE_LIMIT: { ar: "أسئلة كثيرة بسرعة! انتظر دقيقة ثم حاول.", en: "Too many questions too fast! Wait a minute and try again." },
};

/** Tiny formatter: **bold** only (answers are plain text otherwise). */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) => (p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>))}
    </>
  );
}

export default function Chatbot({ roverId, planetId }: { roverId?: string; planetId?: PlanetId }) {
  const { lang, t, tx } = useLang();
  const vehicle = roverId ? getRover(roverId) : planetId ? getRoversByPlanet(planetId)[0] : undefined;
  const name = vehicle ? tx(vehicle.name) : null;
  const accent = vehicle?.accent ?? "#5ee7ff";
  const suggestions = SUGGESTIONS[vehicle?.id ?? "general"] ?? SUGGESTIONS.general;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = useRef(false);
  const history = useRef<Msg[]>([]);
  useEffect(() => {
    history.current = messages;
  }, [messages]);

  const title = name ? (lang === "ar" ? `تحدّث مع ${name}` : `Talk to ${name}`) : t("chatTitle");
  const welcome = name
    ? lang === "ar"
      ? `مرحبًا! أنا ${name} 👋 اسألني عن رحلتي وأجزائي ومغامراتي — سأجيبك من سجلات ناسا المعتمدة فقط.`
      : `Hi! I'm ${name} 👋 Ask me about my journey, my parts and my adventures — I'll answer only from approved NASA records.`
    : t("chatWelcome");

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const q = text.trim().slice(0, 500);
      if (!q || busy.current) return;
      const next: Msg[] = [...history.current, { role: "user", text: q }];
      setMessages(next);
      setInput("");
      setError(null);
      if (process.env.NEXT_PUBLIC_DEMO === "1") {
        setError(ERRORS.DEMO[lang]);
        return;
      }
      busy.current = true;
      setLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang, vehicleId: vehicle?.id, planetId: planetId ?? vehicle?.planet, messages: next.slice(-12) }),
        });
        const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
        if (!res.ok || !data.reply) {
          const known = data.error && ERRORS[data.error];
          setError(known ? known[lang] : t("chatError"));
          return;
        }
        setMessages((m) => [...m, { role: "assistant", text: data.reply! }]);
      } catch {
        setError(t("chatError"));
      } finally {
        busy.current = false;
        setLoading(false);
      }
    },
    [lang, planetId, t, vehicle?.id, vehicle?.planet],
  );

  // Other parts of the page (e.g. the persona story) can open the chat with a question.
  useEffect(() => {
    const onAsk = (e: Event) => {
      const text = (e as CustomEvent<{ text?: string }>).detail?.text;
      setOpen(true);
      if (text) send(text);
    };
    window.addEventListener(CHAT_ASK_EVENT, onAsk);
    return () => window.removeEventListener(CHAT_ASK_EVENT, onAsk);
  }, [send]);

  function reset() {
    setMessages([]);
    setError(null);
  }

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="group fixed bottom-5 end-5 z-[1100] flex items-center gap-2 rounded-full border border-white/15 bg-space-900/90 py-2 ps-2 pe-4 font-bold text-white shadow-[0_0_30px_rgba(94,231,255,.35)] backdrop-blur transition hover:scale-105"
        style={{ boxShadow: `0 0 30px ${accent}55` }}
        aria-expanded={open}
        aria-controls="reliq-chat"
        aria-label={open ? t("chatClose") : name ? t("talkToRover") : t("chatOpen")}
      >
        <span className="relative grid h-10 w-10 place-items-center rounded-full text-xl text-space-950" style={{ background: accent }}>
          {open ? "✕" : vehicle?.planet === "moon" ? "🌕" : vehicle?.planet === "mars" ? "🔴" : "🤖"}
          {!open && <span className="absolute -end-0.5 -top-0.5 h-3 w-3 animate-ping rounded-full bg-emerald-300" aria-hidden />}
        </span>
        <span className="hidden text-sm sm:inline">{open ? t("chatClose") : name ? t("talkToRover") : t("chatOpen")}</span>
      </button>

      {open && (
        <div
          id="reliq-chat"
          role="dialog"
          aria-label={title}
          className="fade-up fixed inset-x-3 bottom-20 z-[1100] flex h-[72vh] max-h-[600px] flex-col overflow-hidden rounded-3xl border border-white/15 bg-space-900/95 shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:end-5 sm:w-[400px]"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3" style={{ background: `linear-gradient(90deg, ${accent}33, rgba(167,139,250,.15))` }}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-xl" style={{ background: accent + "33", border: `1px solid ${accent}88` }} aria-hidden>
              🛰️
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate font-bold">{title}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden />
                {t("chatRoleNote")}
              </div>
            </div>
            {messages.length > 0 && (
              <button onClick={reset} className="rounded-lg px-2 py-1 text-lg text-white/60 hover:bg-white/10 hover:text-white" aria-label={t("chatReset")} title={t("chatReset")}>
                ↻
              </button>
            )}
            <button onClick={() => setOpen(false)} className="rounded-lg px-2 py-1 text-white/60 hover:bg-white/10 hover:text-white" aria-label={t("chatClose")}>
              ✕
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="thin-scroll flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            <Bubble role="assistant" text={welcome} accent={accent} />
            {messages.length === 0 && (
              <div>
                <div className="mb-2 text-xs text-white/50">{t("chatSuggestions")}</div>
                <div className="grid gap-2">
                  {suggestions[lang].map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-xl border border-white/15 bg-white/[.03] px-3 py-2 text-start text-sm text-white/85 transition hover:border-glow/60 hover:bg-glow/10"
                    >
                      ✨ {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} text={m.text} accent={accent} />
            ))}
            {loading && (
              <div className="flex gap-1 px-2" aria-label={t("loading")}>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2 w-2 animate-bounce rounded-full" style={{ background: accent, animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            )}
            {error && <div className="rounded-xl bg-rose-500/15 p-3 text-sm text-rose-200">{error}</div>}
          </div>

          {/* Quick prompts while chatting */}
          {messages.length > 0 && (
            <div className="thin-scroll flex gap-2 overflow-x-auto border-t border-white/5 px-3 pt-2 pb-1">
              {suggestions[lang].map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  disabled={loading}
                  className="shrink-0 rounded-full border border-white/15 px-3 py-1 text-xs text-white/75 hover:border-glow/60 hover:text-white disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              dir="auto"
              placeholder={t("chatPlaceholder")}
              aria-label={t("chatPlaceholder")}
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/40 focus:border-glow/60"
            />
            <button type="submit" disabled={loading || !input.trim()} className="rounded-xl px-4 py-2 text-sm font-bold text-space-950 disabled:opacity-40" style={{ background: accent }}>
              {t("send")}
            </button>
          </form>
          <div className="pb-2 text-center text-[10px] text-white/35">{t("chatSources")}</div>
        </div>
      )}
    </>
  );
}

function Bubble({ role, text, accent }: Msg & { accent: string }) {
  const user = role === "user";
  return (
    <div className={`flex ${user ? "justify-end" : "justify-start"}`}>
      <div
        dir="auto"
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${user ? "rounded-ee-sm text-space-950" : "rounded-es-sm bg-white/10 text-white/90"}`}
        style={user ? { background: accent } : undefined}
      >
        <Rich text={text} />
      </div>
    </div>
  );
}
