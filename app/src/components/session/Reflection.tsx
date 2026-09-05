"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Problem } from "@/lib/types";

export function Reflection({
  problem,
  onComplete,
}: {
  problem: Problem;
  onComplete: (answer: string) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!answer.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "reflection", problemId: problem.id, answer }),
      });
      const data = await res.json();
      setFeedback(data.reply ?? problem.insightTemplate);
    } catch {
      setFeedback(problem.insightTemplate);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col px-6 py-16">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-text-dim">
        One last thing
      </div>
      <h2 className="mt-3 text-xl font-semibold text-text">What was the key idea?</h2>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="In your own words..."
        rows={3}
        disabled={!!feedback}
        className="mt-6 w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none disabled:opacity-60"
      />

      {feedback && (
        <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4 text-sm leading-relaxed text-text">
          {feedback}
        </div>
      )}

      {!feedback ? (
        <Button onClick={submit} disabled={loading || !answer.trim()} className="mt-6 self-end">
          {loading ? "…" : "Submit"}
        </Button>
      ) : (
        <Button onClick={() => onComplete(answer)} className="mt-6 self-end">
          Continue →
        </Button>
      )}
    </div>
  );
}
