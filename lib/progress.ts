// Student progress is saved only in this browser (no accounts, no personal data).
// Progress also feeds the leaderboard XP (see lib/xp.ts).

import { awardOnce, awardXp, XP_RULES } from "./xp";

const KEY = "reliq-progress";

export type Progress = {
  missions: Record<string, { best: number; total: number }>;
  partsSeen: Record<string, string[]>;
  /** vehicles whose first-person story was read to the end */
  storyRead: string[];
};

const empty: Progress = { missions: {}, partsSeen: {}, storyRead: [] };

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(empty);
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      missions: parsed.missions ?? {},
      partsSeen: parsed.partsSeen ?? {},
      storyRead: Array.isArray(parsed.storyRead) ? parsed.storyRead : [],
    };
  } catch {
    return structuredClone(empty);
  }
}

function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage full or blocked — ignore */
  }
}

/** Saves the best score and awards XP only for improvement (no farming by replaying). */
export function saveMissionScore(roverId: string, score: number, total: number) {
  const p = loadProgress();
  const prev = p.missions[roverId]?.best ?? 0;
  p.missions[roverId] = { best: Math.max(prev, score), total };
  save(p);
  if (score > prev) awardXp((score - prev) * XP_RULES.correctAnswer, `mission:${roverId}`);
  awardOnce(`mission:${roverId}`, XP_RULES.missionFirstFinish, `mission-finish:${roverId}`);
}

export function markPartSeen(roverId: string, partId: string) {
  const p = loadProgress();
  const list = new Set(p.partsSeen[roverId] ?? []);
  list.add(partId);
  p.partsSeen[roverId] = [...list];
  save(p);
  awardOnce(`part:${roverId}:${partId}`, XP_RULES.part, `part:${roverId}`);
  return p.partsSeen[roverId];
}

export function markStoryRead(roverId: string) {
  const p = loadProgress();
  if (!p.storyRead.includes(roverId)) {
    p.storyRead.push(roverId);
    save(p);
  }
  awardOnce(`story:${roverId}`, XP_RULES.story, `story:${roverId}`);
}

/** How many different spacecraft the student has explored (opened a part, read the story or played the mission). */
export function vehiclesExplored(p: Progress) {
  const ids = new Set<string>([
    ...Object.keys(p.missions),
    ...Object.entries(p.partsSeen)
      .filter(([, v]) => v.length > 0)
      .map(([k]) => k),
    ...p.storyRead,
  ]);
  return ids.size;
}
