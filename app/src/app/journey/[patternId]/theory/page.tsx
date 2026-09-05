"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getPatternMeta } from "@/data/patterns";
import { THEORY_DECKS } from "@/components/theory/decks";
import { SlideDeckPlayer } from "@/components/theory/SlideDeckPlayer";
import type { Pattern } from "@/lib/types";

export default function PatternTheoryPage() {
  const { patternId } = useParams<{ patternId: string }>();
  const router = useRouter();
  const meta = getPatternMeta(patternId);
  const deck = THEORY_DECKS[patternId as Pattern];

  if (!meta || !deck) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <h1 className="text-lg font-semibold text-text">No theory here yet</h1>
        <Link
          href={`/journey/${patternId}`}
          className="mt-6 text-sm text-accent underline decoration-dotted"
        >
          Back
        </Link>
      </main>
    );
  }

  return (
    <SlideDeckPlayer
      slides={deck}
      onDone={() => router.push(`/journey/${meta.id}`)}
      doneLabel="Done"
      kicker={meta.name}
    />
  );
}
