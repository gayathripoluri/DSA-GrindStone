"use client";

import { useEffect, useState } from "react";
import { getDueReviews, getAllReviews, upsertReview } from "@/lib/db";
import { nextReview } from "@/lib/srs";
import { PROBLEMS } from "@/data/problems";
import type { ReviewItem } from "@/lib/types";
import { Button } from "@/components/ui/Button";

function ReviewCard({ item, onDone }: { item: ReviewItem; onDone: (item: ReviewItem) => void }) {
  const [revealed, setRevealed] = useState(false);
  const problem = PROBLEMS[item.problemId];
  if (!problem) return null;

  async function rate(performance: "easy" | "hard" | "forgot") {
    const updated = nextReview(item, performance);
    await upsertReview(updated);
    onDone(updated);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-text-dim">
        {problem.title}
      </div>
      <p className="mt-3 text-sm text-text">What pattern did we use, and why did it work?</p>

      {!revealed ? (
        <Button variant="secondary" className="mt-4" onClick={() => setRevealed(true)}>
          Show answer
        </Button>
      ) : (
        <>
          <div className="mt-4 rounded-xl bg-surface-2 p-4 text-sm text-text-dim">
            {problem.insightTemplate} ({problem.timeComplexity} time, {problem.spaceComplexity}{" "}
            space)
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" onClick={() => rate("forgot")}>
              Forgot
            </Button>
            <Button variant="secondary" onClick={() => rate("hard")}>
              Hard
            </Button>
            <Button onClick={() => rate("easy")}>Easy</Button>
          </div>
        </>
      )}
    </div>
  );
}

export default function ReviewsPage() {
  const [due, setDue] = useState<ReviewItem[]>([]);
  const [upcoming, setUpcoming] = useState<ReviewItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    const [dueItems, all] = await Promise.all([getDueReviews(), getAllReviews()]);
    const dueIds = new Set(dueItems.map((i) => i.problemId));
    setDue(dueItems);
    setUpcoming(
      all
        .filter((i) => !dueIds.has(i.problemId))
        .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1))
    );
    setLoaded(true);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-text">Reviews</h1>

      <div className="mt-8">
        <div className="text-xs font-semibold uppercase tracking-wide text-text-dim">
          Due Today
        </div>
        {loaded && due.length === 0 && (
          <p className="mt-3 text-sm text-text-dim">Nothing due. Come back tomorrow.</p>
        )}
        <div className="mt-4 space-y-4">
          {due.map((item) => (
            <ReviewCard key={item.problemId} item={item} onDone={refresh} />
          ))}
        </div>
      </div>

      {upcoming.length > 0 && (
        <div className="mt-10">
          <div className="text-xs font-semibold uppercase tracking-wide text-text-dim">
            Upcoming
          </div>
          <div className="mt-4 space-y-2">
            {upcoming.map((item) => {
              const problem = PROBLEMS[item.problemId];
              return (
                <div
                  key={item.problemId}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-sm"
                >
                  <span className="text-text">{problem?.title ?? item.problemId}</span>
                  <span className="text-text-dim">{item.dueDate}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
