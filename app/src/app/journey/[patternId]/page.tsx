"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getJourney, DEFAULT_JOURNEY } from "@/lib/db";
import { getPatternMeta } from "@/data/patterns";
import { PROBLEMS_BY_PATTERN } from "@/data/problems";
import { THEORY_DECKS } from "@/components/theory/decks";
import type { JourneyState, Pattern } from "@/lib/types";
import { Button } from "@/components/ui/Button";

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: "text-success",
  medium: "text-accent",
  hard: "text-danger",
};

export default function PatternPage() {
  const { patternId } = useParams<{ patternId: string }>();
  const meta = getPatternMeta(patternId);
  const problems = PROBLEMS_BY_PATTERN[patternId as Pattern] ?? [];
  const hasDeck = !!THEORY_DECKS[patternId as Pattern];

  const [journey, setJourney] = useState<JourneyState>(DEFAULT_JOURNEY);
  useEffect(() => {
    getJourney().then(setJourney);
  }, []);

  if (!meta) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <h1 className="text-lg font-semibold text-text">Pattern not found</h1>
        <Link href="/journey" className="mt-6 text-sm text-accent underline decoration-dotted">
          Back to Journey
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/journey" className="text-sm text-text-dim hover:text-text">
        ← Journey
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-text">{meta.name}</h1>
      <p className="mt-2 text-sm text-text-dim">{meta.tagline}</p>

      {hasDeck && (
        <Link href={`/journey/${meta.id}/theory`}>
          <Button variant="secondary" className="mt-5">
            🧠 View Theory
          </Button>
        </Link>
      )}

      <div className="mt-10">
        <div className="text-xs font-semibold uppercase tracking-wide text-text-dim">
          Problems
        </div>

        {problems.length === 0 ? (
          <p className="mt-3 text-sm text-text-dim">No problems in this pattern yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {problems.map((problem) => {
              const solved = journey.solvedProblemIds.includes(problem.id);
              return (
                <Link
                  key={problem.id}
                  href={`/problem/${problem.id}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4 transition-colors hover:border-text-dim"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text">{problem.title}</span>
                      {solved && <span className="text-success text-sm">✓</span>}
                    </div>
                    <div className="mt-0.5 text-xs text-text-dim">
                      ~{problem.estimatedMinutes} min
                    </div>
                  </div>
                  <span className={`text-xs font-medium capitalize ${DIFFICULTY_COLOR[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
