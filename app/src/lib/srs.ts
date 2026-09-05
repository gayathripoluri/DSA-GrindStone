import type { ReviewItem, Pattern } from "./types";

// Spaced repetition schedule per design plan section 30.
// Struggled: 7 -> 3 -> 7. Remembered easily: 7 -> 14 -> 30.
const BASE_INTERVALS = [1, 3, 7, 14, 30];

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function scheduleFirstReview(
  problemId: string,
  pattern: Pattern,
  from: Date = new Date()
): ReviewItem {
  return {
    problemId,
    pattern,
    dueDate: addDays(from, BASE_INTERVALS[0]),
    intervalDays: BASE_INTERVALS[0],
    easeStreak: 0,
  };
}

/**
 * performance: "easy" (remembered without struggle), "hard" (struggled but got there),
 * or "forgot" (needs to restart the ladder).
 */
export function nextReview(
  item: ReviewItem,
  performance: "easy" | "hard" | "forgot",
  from: Date = new Date()
): ReviewItem {
  let easeStreak = item.easeStreak;
  let intervalDays: number;

  if (performance === "forgot") {
    easeStreak = 0;
    intervalDays = BASE_INTERVALS[0];
  } else if (performance === "hard") {
    easeStreak = Math.max(0, easeStreak - 1);
    intervalDays = BASE_INTERVALS[Math.min(easeStreak, BASE_INTERVALS.length - 1)];
  } else {
    easeStreak = easeStreak + 1;
    intervalDays = BASE_INTERVALS[Math.min(easeStreak, BASE_INTERVALS.length - 1)];
  }

  return {
    ...item,
    intervalDays,
    dueDate: addDays(from, intervalDays),
    easeStreak,
    lastReviewedAt: from.toISOString(),
  };
}

/** Returns the streak count after today's session completes. */
export function computeNewStreak(
  currentStreak: number,
  lastActiveDate: string | null,
  today: Date = new Date()
): number {
  const todayStr = today.toISOString().slice(0, 10);
  if (lastActiveDate === todayStr) return currentStreak; // already counted today
  if (lastActiveDate === addDays(today, -1)) return currentStreak + 1; // continued streak
  return 1; // reset (first session, or a gap)
}
