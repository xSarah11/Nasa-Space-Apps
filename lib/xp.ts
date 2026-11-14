// Experience points (XP) for the leaderboard. Saved only in this browser (localStorage) — no accounts.
// Every award is logged with a timestamp so the leaderboard can show "this week" and "all time".

export const XP_KEY = "reliq-xp";
/** Fired on window whenever XP changes, so open pages (leaderboard, toast) update instantly. */
export const XP_EVENT = "reliq-xp";

export const XP_RULES = {
  /** each NEW correct answer (improving your best score in a mission) */
  correctAnswer: 50,
  /** finishing a mission for the first time */
  missionFirstFinish: 30,
  /** exploring a spacecraft part for the first time */
  part: 10,
  /** reading a spacecraft's first-person story to the end */
  story: 40,
} as const;

export type XpEvent = { t: number; xp: number; reason: string };
export type XpState = {
  name: string;
  avatar: string;
  events: XpEvent[];
  /** one-time rewards already given (e.g. "part:opportunity:solar") */
  claimed: string[];
};

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const empty = (): XpState => ({ name: "", avatar: "🧑‍🚀", events: [], claimed: [] });

export function loadXp(): XpState {
  try {
    const raw = localStorage.getItem(XP_KEY);
    if (!raw) return empty();
    const p = JSON.parse(raw) as Partial<XpState>;
    return {
      name: typeof p.name === "string" ? p.name.slice(0, 24) : "",
      avatar: typeof p.avatar === "string" ? p.avatar : "🧑‍🚀",
      events: Array.isArray(p.events) ? p.events.filter((e) => e && typeof e.xp === "number" && typeof e.t === "number") : [],
      claimed: Array.isArray(p.claimed) ? p.claimed.filter((c) => typeof c === "string") : [],
    };
  } catch {
    return empty();
  }
}

function save(s: XpState) {
  try {
    // keep the log small: merge events older than ~2 weeks into one entry
    const cutoff = Date.now() - 2 * WEEK_MS;
    const old = s.events.filter((e) => e.t < cutoff);
    if (old.length > 1) {
      const sum = old.reduce((a, e) => a + e.xp, 0);
      s.events = [{ t: old[old.length - 1].t, xp: sum, reason: "archive" }, ...s.events.filter((e) => e.t >= cutoff)];
    }
    localStorage.setItem(XP_KEY, JSON.stringify(s));
  } catch {
    /* storage blocked — ignore */
  }
}

function notify(xp: number, reason: string) {
  try {
    window.dispatchEvent(new CustomEvent(XP_EVENT, { detail: { xp, reason } }));
  } catch {
    /* not in a browser */
  }
}

/** Add XP (positive only). Returns the XP actually added. */
export function awardXp(xp: number, reason: string): number {
  if (!(xp > 0)) return 0;
  const s = loadXp();
  s.events.push({ t: Date.now(), xp, reason });
  save(s);
  notify(xp, reason);
  return xp;
}

/** Add XP only the first time `key` is seen. Returns the XP added (0 if already claimed). */
export function awardOnce(key: string, xp: number, reason: string): number {
  const s = loadXp();
  if (s.claimed.includes(key)) return 0;
  s.claimed.push(key);
  s.events.push({ t: Date.now(), xp, reason });
  save(s);
  notify(xp, reason);
  return xp;
}

export function setProfile(name: string, avatar: string) {
  const s = loadXp();
  s.name = name.trim().slice(0, 24);
  s.avatar = avatar;
  save(s);
  notify(0, "profile");
}

export function xpTotals(s: XpState, now = Date.now()) {
  const all = s.events.reduce((a, e) => a + e.xp, 0);
  const weekly = s.events.filter((e) => now - e.t < WEEK_MS && e.reason !== "archive").reduce((a, e) => a + e.xp, 0);
  return { all, weekly };
}
