import type { JourneyState, ReviewItem } from "@/lib/types";
import { PATTERNS } from "@/data/patterns";
import { ALL_PROBLEMS, PROBLEMS, PROBLEMS_BY_PATTERN } from "@/data/problems";

export interface AchievementContext {
  journey: JourneyState;
  reviews: ReviewItem[];
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  isUnlocked: (ctx: AchievementContext) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-blood",
    icon: "🩸",
    title: "First Blood",
    description: "Solve your first problem.",
    isUnlocked: (ctx) => ctx.journey.totalSolved >= 1,
  },
  {
    id: "boss-slayer",
    icon: "⚔️",
    title: "Boss Slayer",
    description: "Beat a Hard-difficulty problem.",
    isUnlocked: (ctx) =>
      ctx.journey.solvedProblemIds.some((id) => PROBLEMS[id]?.difficulty === "hard"),
  },
  {
    id: "topic-cleared",
    icon: "🚩",
    title: "Topic Cleared",
    description: "Fully clear any one topic.",
    isUnlocked: (ctx) =>
      PATTERNS.some((pattern) => {
        const problems = PROBLEMS_BY_PATTERN[pattern.id];
        return (
          !!problems &&
          problems.length > 0 &&
          problems.every((p) => ctx.journey.solvedProblemIds.includes(p.id))
        );
      }),
  },
  {
    id: "on-a-roll",
    icon: "🔥",
    title: "On a Roll",
    description: "Hit a 3-day streak.",
    isUnlocked: (ctx) => ctx.journey.bestStreak >= 3,
  },
  {
    id: "week-warrior",
    icon: "🏆",
    title: "Week Warrior",
    description: "Hit a 7-day streak.",
    isUnlocked: (ctx) => ctx.journey.bestStreak >= 7,
  },
  {
    id: "rewired",
    icon: "🧠",
    title: "Rewired",
    description: "Complete your first spaced review.",
    isUnlocked: (ctx) => ctx.reviews.some((r) => !!r.lastReviewedAt),
  },
  {
    id: "halfway-there",
    icon: "⛰️",
    title: "Halfway There",
    description: "Solve half the roadmap.",
    isUnlocked: (ctx) =>
      ALL_PROBLEMS.length > 0 &&
      ctx.journey.solvedProblemIds.length >= Math.ceil(ALL_PROBLEMS.length / 2),
  },
  {
    id: "interview-ready",
    icon: "🎯",
    title: "Interview Ready",
    description: "Clear every problem on the roadmap.",
    isUnlocked: (ctx) =>
      ALL_PROBLEMS.length > 0 && ctx.journey.solvedProblemIds.length >= ALL_PROBLEMS.length,
  },
];
