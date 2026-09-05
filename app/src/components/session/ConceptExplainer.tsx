"use client";

import { useEffect } from "react";
import type { Problem } from "@/lib/types";
import { THEORY_DECKS } from "@/components/theory/decks";
import { SlideDeckPlayer } from "@/components/theory/SlideDeckPlayer";

export function ConceptExplainer({
  problem,
  onComplete,
}: {
  problem: Problem;
  onComplete: () => void;
}) {
  const deck = THEORY_DECKS[problem.patterns[0]];

  useEffect(() => {
    // No authored slide deck for this pattern yet — don't block the session on it.
    if (!deck) onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck]);

  if (!deck) return null;

  return (
    <SlideDeckPlayer
      slides={deck}
      onDone={onComplete}
      skipLabel="Skip intro"
      kicker="Quick concept"
    />
  );
}
