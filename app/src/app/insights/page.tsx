"use client";

import { useEffect, useState } from "react";
import { getAllInsights } from "@/lib/db";
import type { InsightCard } from "@/lib/types";

export default function InsightsPage() {
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getAllInsights().then((data) => {
      setInsights(data);
      setLoaded(true);
    });
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-text">Insights</h1>
      <p className="mt-1 text-sm text-text-dim">Your personal DSA knowledge base.</p>

      {loaded && insights.length === 0 && (
        <p className="mt-8 text-sm text-text-dim">
          No insights yet. Finish today&rsquo;s grind and one will show up here.
        </p>
      )}

      <div className="mt-8 space-y-4">
        {insights.map((card) => (
          <div key={card.id} className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-sm leading-relaxed text-text">&ldquo;{card.text}&rdquo;</p>
            <div className="mt-4 flex gap-2 text-xs text-text-dim">
              <span className="rounded-full border border-border px-2.5 py-1">
                {card.pattern.replace("-", " ")}
              </span>
              <span className="rounded-full border border-border px-2.5 py-1">
                {card.complexityTime} time
              </span>
              <span className="rounded-full border border-border px-2.5 py-1">
                {card.complexitySpace} space
              </span>
            </div>
            <div className="mt-3 text-xs text-text-dim">
              {new Date(card.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
