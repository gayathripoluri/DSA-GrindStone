"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getJourney, getAllReviews, DEFAULT_JOURNEY } from "@/lib/db";
import { PATTERNS } from "@/data/patterns";
import { PROBLEMS_BY_PATTERN } from "@/data/problems";
import { BadgeCase } from "@/components/journey/BadgeCase";
import type { JourneyState, ReviewItem } from "@/lib/types";

export default function JourneyPage() {
  const [journey, setJourney] = useState<JourneyState>(DEFAULT_JOURNEY);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([getJourney(), getAllReviews()]).then(([j, r]) => {
      setJourney(j);
      setReviews(r);
      setLoaded(true);
    });
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-text">Your Journey</h1>

      {loaded && (
        <>
          <div className="mt-8 flex gap-8">
            <div>
              <div className="text-3xl font-semibold text-accent">🔥 {journey.streak}</div>
              <div className="text-xs text-text-dim">day streak</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-text">{journey.totalSolved}</div>
              <div className="text-xs text-text-dim">problems solved</div>
            </div>
          </div>

          <div className="mt-10">
            <div className="text-xs font-semibold uppercase tracking-wide text-text-dim">
              The Path
            </div>
            <p className="mt-2 text-sm text-text-dim">
              You don&rsquo;t need the whole curriculum — just your next step.
            </p>

            <div className="mt-4 space-y-2">
              {PATTERNS.map((pattern) => {
                const mastery = journey.patternMastery[pattern.id] ?? 0;
                const problemCount = PROBLEMS_BY_PATTERN[pattern.id]?.length ?? 0;
                const available = pattern.hasTheory && problemCount > 0;

                const content = (
                  <div
                    className={`rounded-2xl border p-5 transition-colors ${
                      available
                        ? "border-border bg-surface hover:border-text-dim"
                        : "border-border/50 bg-surface/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${available ? "text-text" : "text-text-dim"}`}>
                        {pattern.name}
                      </span>
                      {available ? (
                        <span className="text-xs text-text-dim">
                          {problemCount} {problemCount === 1 ? "problem" : "problems"}
                        </span>
                      ) : (
                        <span className="text-xs text-text-dim">Coming soon</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-text-dim">{pattern.tagline}</p>
                    {available && (
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${Math.round(mastery * 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                );

                return available ? (
                  <Link key={pattern.id} href={`/journey/${pattern.id}`}>
                    {content}
                  </Link>
                ) : (
                  <div key={pattern.id}>{content}</div>
                );
              })}
            </div>
          </div>

          <BadgeCase ctx={{ journey, reviews }} />
        </>
      )}
    </main>
  );
}
