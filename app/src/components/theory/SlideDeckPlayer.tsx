"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { KIND_LABEL, type TheorySlide } from "./decks";

export function SlideDeckPlayer({
  slides,
  onDone,
  doneLabel = "Continue →",
  skipLabel,
  kicker = "Theory",
}: {
  slides: TheorySlide[];
  onDone: () => void;
  doneLabel?: string;
  /** Show a manual skip-ahead link with this label; omit to hide it. */
  skipLabel?: string;
  kicker?: string;
}) {
  const [index, setIndex] = useState(0);
  const [recallAnswer, setRecallAnswer] = useState("");
  const [recallRevealed, setRecallRevealed] = useState(false);

  const slide = slides[index];
  const isLast = index === slides.length - 1;

  function goNext() {
    setRecallAnswer("");
    setRecallRevealed(false);
    if (isLast) onDone();
    else setIndex((i) => i + 1);
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-12 text-center">
      <div className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-text-dim">
        {kicker}
      </div>

      <div className="flex w-full flex-col items-center rounded-2xl border border-border bg-surface p-8">
        <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">
          {KIND_LABEL[slide.kind]}
        </div>

        {slide.Visual && (
          <div className="mt-4 flex min-h-[160px] w-full items-center justify-center">
            <slide.Visual />
          </div>
        )}

        <h2 className="mt-4 text-lg font-semibold text-text">{slide.title}</h2>

        {slide.kind === "recall" ? (
          <div className="mt-4 w-full text-left">
            <p className="text-sm text-text-dim">{slide.recallPrompt}</p>
            <textarea
              value={recallAnswer}
              onChange={(e) => setRecallAnswer(e.target.value)}
              placeholder="Type it in your own words..."
              rows={2}
              className="mt-3 w-full resize-none rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
            />
            {!recallRevealed ? (
              <button
                onClick={() => setRecallRevealed(true)}
                className="mt-2 text-xs text-text-dim underline decoration-dotted hover:text-text"
              >
                Reveal the idea
              </button>
            ) : (
              <div className="mt-3 rounded-lg bg-surface-2 p-3 text-sm leading-relaxed text-text">
                {slide.caption}
              </div>
            )}
          </div>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-text-dim">{slide.caption}</p>
        )}
      </div>

      <div className="mt-5 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-accent" : "bg-border"}`}
          />
        ))}
      </div>

      <div className="mt-6 flex w-full items-center justify-between">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="text-sm text-text-dim underline decoration-dotted hover:text-text disabled:opacity-0"
        >
          Back
        </button>

        <div className="flex items-center gap-4">
          {skipLabel && (
            <button
              onClick={onDone}
              className="text-xs text-text-dim underline decoration-dotted hover:text-text"
            >
              {skipLabel}
            </button>
          )}
          <Button onClick={goNext}>{isLast ? doneLabel : "Next →"}</Button>
        </div>
      </div>
    </div>
  );
}
