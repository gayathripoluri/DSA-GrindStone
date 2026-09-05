"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Problem } from "@/lib/types";

export function MissionCard({
  problem,
  streak,
  whyThisProblem,
  onStart,
  resumeAvailable,
  onResume,
}: {
  problem: Problem;
  streak: number;
  whyThisProblem: string;
  onStart: () => void;
  resumeAvailable: boolean;
  onResume: () => void;
}) {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-16 text-center">
      <div className="mb-8 flex w-full items-center justify-between text-sm text-text-dim">
        <span className="font-semibold tracking-wide text-text">GRINDSTONE</span>
        <span>🔥 {streak}</span>
      </div>

      <h1 className="mb-8 text-2xl font-semibold">Today&rsquo;s Grind</h1>

      <div className="w-full rounded-3xl border border-border bg-surface p-10">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-text-dim">
          Today&rsquo;s Challenge
        </div>
        <div className="mt-4 text-2xl font-semibold text-text">{problem.title}</div>
        <div className="mt-1 text-sm text-accent">
          {problem.patterns.map((p) => p.replace("-", " ")).join(", ")}
        </div>
        <div className="mt-1 text-sm text-text-dim">~{problem.estimatedMinutes} minutes</div>

        <div className="mx-auto mt-6 max-w-[200px] space-y-1.5 text-left text-sm text-text-dim">
          <div>○ Warm-up</div>
          <div>○ Interview</div>
          <div>○ Code</div>
        </div>

        {resumeAvailable ? (
          <Button className="mt-8 w-full" onClick={onResume}>
            Continue →
          </Button>
        ) : (
          <Button className="mt-8 w-full" onClick={onStart}>
            Start Mission →
          </Button>
        )}
      </div>

      <div className="mt-10 w-full text-left">
        <div className="text-xs font-semibold uppercase tracking-wide text-text-dim">
          Why this problem?
        </div>
        <p className="mt-2 text-sm leading-relaxed text-text-dim">{whyThisProblem}</p>
      </div>

      <Link
        href="/journey"
        className="mt-8 text-sm text-text-dim underline decoration-dotted hover:text-text"
      >
        Or choose your own problem →
      </Link>
    </main>
  );
}
