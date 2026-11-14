"use client";

// Leaderboard: top-3 podium + sortable table (weekly / all time).
// Other students are demo data; the current student's XP comes from localStorage (lib/xp.ts)
// and the board re-ranks live whenever XP is earned on the site.
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import type { Text } from "@/data/types";
import { rovers } from "@/data/rovers";
import { loadXp, setProfile, xpTotals, XP_EVENT, XP_KEY, XP_RULES } from "@/lib/xp";
import { loadProgress, vehiclesExplored } from "@/lib/progress";
import type { UIKey } from "@/lib/i18n";

type Row = { id: string; name: Text; avatar: string; vehicles: number; weekly: number; all: number; me?: boolean };
type Mode = "weekly" | "all";

// Demo classmates (ready to show immediately). Vehicles explored is out of 2: Surveyor 3 and Opportunity.
const MOCK: Row[] = [
  { id: "m1", name: { ar: "ريم", en: "Reem" }, avatar: "👩‍🚀", vehicles: 2, weekly: 260, all: 1340 },
  { id: "m2", name: { ar: "عبدالله", en: "Abdullah" }, avatar: "🚀", vehicles: 2, weekly: 410, all: 1215 },
  { id: "m3", name: { ar: "لين", en: "Leen" }, avatar: "🌙", vehicles: 2, weekly: 150, all: 1080 },
  { id: "m4", name: { ar: "فيصل", en: "Faisal" }, avatar: "🛰️", vehicles: 2, weekly: 340, all: 940 },
  { id: "m5", name: { ar: "جود", en: "Joud" }, avatar: "🪐", vehicles: 2, weekly: 90, all: 860 },
  { id: "m6", name: { ar: "يوسف", en: "Yousef" }, avatar: "🔭", vehicles: 1, weekly: 220, all: 640 },
  { id: "m7", name: { ar: "دانة", en: "Dana" }, avatar: "☄️", vehicles: 2, weekly: 0, all: 590 },
  { id: "m8", name: { ar: "مازن", en: "Mazen" }, avatar: "👨‍🚀", vehicles: 1, weekly: 180, all: 470 },
  { id: "m9", name: { ar: "سارة", en: "Sara" }, avatar: "🌌", vehicles: 1, weekly: 60, all: 380 },
  { id: "m10", name: { ar: "تركي", en: "Turki" }, avatar: "🌕", vehicles: 1, weekly: 130, all: 290 },
  { id: "m11", name: { ar: "نورة", en: "Noura" }, avatar: "🔴", vehicles: 1, weekly: 40, all: 160 },
];

const AVATARS = ["🧑‍🚀", "👩‍🚀", "👨‍🚀", "🚀", "🛰️", "🌙", "🔴", "🪐", "☄️", "🔭", "🌌", "👽"];
const MEDALS = [
  { color: "#ffd166", glow: "rgba(255,209,102,.35)", icon: "🥇", label: "lbGold", title: "lbTitle1", height: "h-28 sm:h-36" },
  { color: "#cfd8e3", glow: "rgba(207,216,227,.25)", icon: "🥈", label: "lbSilver", title: "lbTitle2", height: "h-20 sm:h-28" },
  { color: "#e0a36b", glow: "rgba(224,163,107,.25)", icon: "🥉", label: "lbBronze", title: "lbTitle3", height: "h-14 sm:h-20" },
] as const;

function levelTitle(xp: number): UIKey {
  if (xp >= 800) return "lbLevelScientist";
  if (xp >= 300) return "lbLevelPilot";
  return "lbLevelCadet";
}

export default function LeaderboardView() {
  const { t, tx, lang } = useLang();
  const [mode, setMode] = useState<Mode>("weekly");
  const [me, setMe] = useState<Row | null>(null);
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftAvatar, setDraftAvatar] = useState("🧑‍🚀");

  const refresh = useCallback(() => {
    const s = loadXp();
    const totals = xpTotals(s);
    setMe({
      id: "me",
      me: true,
      name: { ar: s.name, en: s.name },
      avatar: s.avatar,
      vehicles: vehiclesExplored(loadProgress()),
      weekly: totals.weekly,
      all: totals.all,
    });
    setDraftName(s.name);
    setDraftAvatar(s.avatar);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage after mount
    refresh();
    const onStorage = (e: StorageEvent) => (e.key === XP_KEY || e.key === "reliq-progress") && refresh();
    window.addEventListener(XP_EVENT, refresh);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(XP_EVENT, refresh);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  const ranked = useMemo(() => {
    const rows = me ? [...MOCK, me] : [...MOCK];
    // Higher XP first; on a tie, the current student goes first (encouraging!), then alphabetical.
    return rows.sort((a, b) => b[mode] - a[mode] || (a.me ? -1 : b.me ? 1 : 0) || a.name.en.localeCompare(b.name.en));
  }, [me, mode]);

  const myRank = ranked.findIndex((r) => r.me) + 1;
  const n = (v: number) => v.toLocaleString(lang === "ar" ? "ar-SA" : "en-US");
  const displayName = (r: Row) => (r.me ? tx(r.name) || t("lbYou") : tx(r.name));

  function saveProfile() {
    setProfile(draftName, draftAvatar);
    setEditing(false);
  }

  const top3 = ranked.slice(0, 3);
  // Visual podium order: 2nd · 1st · 3rd (flips automatically in RTL)
  const podium = [top3[1], top3[0], top3[2]].map((r, i) => ({ r, place: [1, 0, 2][i] }));

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16">
      {/* Hero */}
      <section className="fade-up pt-12 pb-6 text-center">
        <span className="inline-block rounded-full border border-glow/30 bg-glow/10 px-3 py-1 text-xs font-semibold text-glow">🏆 {t("leaderboard")}</span>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">
          <span className="text-gradient">{t("lbTitle")}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-white/65">{t("lbText")}</p>
      </section>

      {/* Filter */}
      <div className="mb-6 flex justify-center">
        <div role="group" aria-label={t("leaderboard")} className="inline-flex rounded-full border border-white/15 bg-white/5 p-1 text-sm">
          {(["weekly", "all"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`rounded-full px-4 py-1.5 font-semibold transition ${mode === m ? "bg-glow text-space-950" : "text-white/65 hover:text-white"}`}
            >
              {m === "weekly" ? t("lbWeekly") : t("lbAll")}
            </button>
          ))}
        </div>
      </div>

      {/* Podium */}
      <section aria-label="Top 3" className="grid grid-cols-3 items-end gap-2 sm:gap-4">
        {podium.map(({ r, place }) => {
          if (!r) return <div key={place} />;
          const m = MEDALS[place];
          return (
            <div key={r.id} className="fade-up flex flex-col items-center" style={{ animationDelay: `${0.1 + place * 0.12}s` }}>
              <div
                className={`glass relative w-full rounded-3xl p-3 text-center sm:p-5 ${r.me ? "ring-2 ring-glow" : ""}`}
                style={{ borderColor: m.color + "66", boxShadow: `0 0 40px ${m.glow}` }}
              >
                <div className="text-2xl sm:text-3xl" aria-label={t(m.label)} title={t(m.label)}>
                  {m.icon}
                </div>
                <div
                  className="mx-auto mt-2 grid h-14 w-14 place-items-center rounded-full text-3xl sm:h-20 sm:w-20 sm:text-5xl"
                  style={{ background: `radial-gradient(circle at 35% 30%, ${m.color}55, transparent 70%)`, border: `2px solid ${m.color}` }}
                  aria-hidden
                >
                  {r.avatar}
                </div>
                <div className="mt-2 truncate font-bold sm:text-lg">{displayName(r)}</div>
                <div className="mt-0.5 text-[11px] font-semibold sm:text-xs" style={{ color: m.color }}>
                  {t(m.title)}
                </div>
                <div className="mt-2 text-sm font-extrabold sm:text-base" dir="ltr">
                  {n(r[mode])} <span className="text-xs font-semibold text-white/50">XP</span>
                </div>
              </div>
              <div
                className={`mt-2 w-full rounded-t-2xl ${m.height} grid place-items-start justify-center pt-2 text-2xl font-extrabold`}
                style={{ background: `linear-gradient(180deg, ${m.color}40, ${m.color}08)`, color: m.color }}
                aria-hidden
              >
                {place + 1}
              </div>
            </div>
          );
        })}
      </section>

      {/* Your card */}
      {me && (
        <section className="glass mt-8 flex flex-col gap-4 rounded-3xl p-4 sm:flex-row sm:items-center sm:p-5" aria-label={t("lbYourRank")}>
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-glow/15 text-3xl" aria-hidden>
              {me.avatar}
            </div>
            <div>
              <div className="text-xs text-white/50">{t("lbYourRank")}</div>
              <div className="text-2xl font-extrabold">
                #{n(myRank)} <span className="text-base font-semibold text-white/60">· {displayName(me)}</span>
              </div>
              <div className="text-xs text-white/55" dir="ltr">
                {n(me[mode])} XP
              </div>
            </div>
          </div>

          <div className="flex-1 sm:text-end">
            {editing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveProfile();
                }}
                className="flex flex-col gap-2 sm:items-end"
              >
                <label className="text-xs text-white/60" htmlFor="lb-name">
                  {t("lbYourName")}
                </label>
                <div className="flex gap-2">
                  <input
                    id="lb-name"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    maxLength={24}
                    placeholder={t("lbYou")}
                    className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-glow/60 sm:w-48"
                  />
                  <button type="submit" className="rounded-xl bg-glow px-4 py-2 text-sm font-bold text-space-950">
                    {t("lbSave")}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 sm:justify-end">
                  {AVATARS.map((a) => (
                    <button
                      type="button"
                      key={a}
                      onClick={() => setDraftAvatar(a)}
                      aria-pressed={draftAvatar === a}
                      className={`grid h-9 w-9 place-items-center rounded-lg text-xl transition ${draftAvatar === a ? "bg-glow/25 ring-2 ring-glow" : "bg-white/5 hover:bg-white/10"}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </form>
            ) : (
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <button onClick={() => setEditing(true)} className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold hover:border-glow/60">
                  ✏️ {t("lbEdit")}
                </button>
                <Link href={`/rover/${rovers[0].id}`} className="rounded-xl bg-glow px-4 py-2 text-sm font-bold text-space-950 hover:brightness-110">
                  {t("lbStart")} 🚀
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Table */}
      <section className="glass mt-6 overflow-hidden rounded-3xl">
        <table className="w-full text-sm">
          <caption className="sr-only">
            {t("lbTitle")} — {mode === "weekly" ? t("lbWeekly") : t("lbAll")}
          </caption>
          <thead className="bg-white/5 text-xs text-white/55">
            <tr>
              <th scope="col" className="w-14 px-3 py-3 text-center font-semibold">
                {t("lbRank")}
              </th>
              <th scope="col" className="px-3 py-3 text-start font-semibold">
                {t("lbStudent")}
              </th>
              <th scope="col" className="hidden px-3 py-3 text-center font-semibold sm:table-cell">
                {t("lbVehicles")}
              </th>
              <th scope="col" className="px-3 py-3 text-end font-semibold">
                {t("lbXp")} <span className="text-white/35">({mode === "weekly" ? t("lbWeekly") : t("lbAll")})</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r, i) => {
              const rank = i + 1;
              const medal = rank <= 3 ? MEDALS[rank - 1] : null;
              return (
                <tr
                  key={r.id}
                  aria-current={r.me ? "true" : undefined}
                  className={`border-t border-white/5 transition ${r.me ? "bg-glow/10" : "hover:bg-white/[.03]"}`}
                >
                  <td className="px-3 py-3 text-center font-extrabold" style={medal ? { color: medal.color } : undefined}>
                    {medal ? medal.icon : n(rank)}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 text-xl" aria-hidden>
                        {r.avatar}
                      </span>
                      <div className="min-w-0">
                        <div className={`truncate font-semibold ${r.me ? "text-glow" : ""}`}>
                          {displayName(r)}
                          {r.me && <span className="ms-2 rounded-full bg-glow/20 px-2 py-0.5 text-[10px] text-glow">{t("lbYou")}</span>}
                        </div>
                        <div className="text-[11px] text-white/45">
                          {medal ? t(medal.title) : t(levelTitle(r.all))}
                          <span className="sm:hidden">
                            {" "}
                            · 🛰️ {n(r.vehicles)}/{n(rovers.length)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-3 py-3 text-center sm:table-cell">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs">
                      🛰️ {n(r.vehicles)}/{n(rovers.length)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-end font-bold" dir="ltr">
                    {n(r[mode])}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* How to earn */}
      <section className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="glass rounded-3xl p-5">
          <h2 className="mb-3 font-bold">✨ {t("lbHowTitle")}</h2>
          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            {[
              ["🎯", t("lbHowMission"), XP_RULES.correctAnswer],
              ["🏁", t("lbHowMissionDone"), XP_RULES.missionFirstFinish],
              ["🔧", t("lbHowPart"), XP_RULES.part],
              ["📖", t("lbHowStory"), XP_RULES.story],
            ].map(([icon, label, xp]) => (
              <li key={String(label)} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2">
                <span>
                  {icon} {label}
                </span>
                <span className="font-bold text-amber-200" dir="ltr">
                  +{n(Number(xp))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <p className="mt-3 text-center text-xs text-white/40">{t("lbDemo")}</p>
    </div>
  );
}
