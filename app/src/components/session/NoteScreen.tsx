"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Problem } from "@/lib/types";

const NUMBERS = [2, 7, 11, 15];
const TARGET = 9;

export function NoteScreen({
  problem,
  onComplete,
}: {
  problem: Problem;
  onComplete: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);

  const needed = picked !== null ? TARGET - picked : null;
  const correct = needed !== null && guess.trim() === String(needed);

  // Two Sum gets the bespoke "click a number" interaction, built around its
  // exact example. Other problems don't have a matching interactive widget
  // authored yet, so they get a straight recap of the note fields instead —
  // still data-driven, just not a bespoke mini-game.
  const isTwoSum = problem.id === "two-sum";

  return (
    <div className="mx-auto flex max-w-xl flex-col px-6 py-12">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-text-dim">
        🧠 The Trick
      </div>
      <p className="text-lg leading-relaxed text-text">{problem.note.hook}</p>

      {isTwoSum ? (
        <>
          <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
            <div className="mb-4 text-sm text-text-dim">
              Click a number, then tell me what value it needs to reach the target.
            </div>
            <div className="flex items-center gap-3">
              {NUMBERS.map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setPicked(n);
                    setRevealed(false);
                    setGuess("");
                  }}
                  className={`h-14 w-14 rounded-xl border text-lg font-semibold transition-colors ${
                    picked === n
                      ? "border-accent bg-accent text-[#0b0c0f]"
                      : "border-border bg-surface-2 text-text hover:border-text-dim"
                  }`}
                >
                  {n}
                </button>
              ))}
              <div className="ml-4 text-sm text-text-dim">Target = {TARGET}</div>
            </div>

            {picked !== null && (
              <div className="mt-6 flex items-center gap-3">
                <span className="text-sm text-text-dim">
                  We picked {picked}. What would we need?
                </span>
                <input
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setRevealed(true)}
                  className="w-20 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-text focus:border-accent focus:outline-none"
                />
                <Button variant="secondary" onClick={() => setRevealed(true)}>
                  Check
                </Button>
              </div>
            )}

            {revealed && (
              <div className="mt-4 text-sm">
                {correct ? (
                  <span className="text-success">Exactly. {picked} → needs → {needed}</span>
                ) : (
                  <span className="text-text-dim">
                    Close — {picked} needs {needed} to reach {TARGET}.
                  </span>
                )}
              </div>
            )}
          </div>

          {revealed && <NoteRecap problem={problem} onComplete={onComplete} />}
        </>
      ) : (
        <div className="mt-8">
          <NoteRecap problem={problem} onComplete={onComplete} />
        </div>
      )}
    </div>
  );
}

function NoteRecap({ problem, onComplete }: { problem: Problem; onComplete: () => void }) {
  return (
    <div className="space-y-5 text-sm">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-text-dim">The Idea</div>
        <p className="mt-1 leading-relaxed text-text">{problem.note.idea}</p>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-text-dim">The Aha</div>
        <p className="mt-1 leading-relaxed text-text">{problem.note.aha}</p>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-text-dim">
          The Pattern
        </div>
        <p className="mt-1 leading-relaxed text-text">{problem.note.pattern}</p>
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-text-dim">The Trap</div>
        <p className="mt-1 leading-relaxed text-danger">{problem.note.trap}</p>
      </div>

      <Button onClick={onComplete} className="mt-4 w-full">
        I&rsquo;ve got it →
      </Button>
    </div>
  );
}
