"use client";

import { Button } from "@/components/ui/Button";
import type { InsightCard, Problem } from "@/lib/types";

export function InsightReveal({
  problem,
  insight,
  streak,
  nextReviewLabel,
  onDone,
}: {
  problem: Problem;
  insight: InsightCard;
  streak: number;
  nextReviewLabel: string;
  onDone: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-full rounded-3xl border border-border bg-surface p-8">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-text-dim">
          🧠 Today&rsquo;s Insight
        </div>
        <p className="mt-4 text-lg leading-relaxed text-text">&ldquo;{insight.text}&rdquo;</p>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-dim">
          <span className="rounded-full border border-border px-2.5 py-1">
            {insight.pattern.replace("-", " ")}
          </span>
          <span className="rounded-full border border-border px-2.5 py-1">
            {insight.complexityTime} time
          </span>
          <span className="rounded-full border border-border px-2.5 py-1">
            {insight.complexitySpace} space
          </span>
        </div>

        <div className="mt-6 text-sm text-text-dim">Review {nextReviewLabel}</div>
      </div>

      <div className="mt-8 space-y-1 text-sm text-text-dim">
        <div>+1 Pattern · +1 Problem</div>
        <div>🔥 Streak continues — {streak} {streak === 1 ? "day" : "days"}</div>
      </div>

      <Button onClick={onDone} className="mt-10">
        Remember this →
      </Button>

      <p className="mt-6 text-xs text-text-dim">See you tomorrow, {problem.title} is logged.</p>
    </div>
  );
}
