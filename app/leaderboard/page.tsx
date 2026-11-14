import type { Metadata } from "next";
import LeaderboardView from "@/components/LeaderboardView";

export const metadata: Metadata = {
  title: "Leaderboard | ReliQ — لوحة الصدارة",
  description: "Top space explorers on ReliQ: earn XP by solving missions, exploring spacecraft parts and reading their stories.",
};

// The board itself is a client component: it reads the student's own XP from localStorage
// and updates live when XP is earned anywhere on the site.
export default function Page() {
  return <LeaderboardView />;
}
