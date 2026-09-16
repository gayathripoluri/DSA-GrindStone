import type { Pattern } from "@/lib/types";

export interface PatternMeta {
  id: Pattern;
  name: string;
  tagline: string;
  hasTheory: boolean;
}

// Ordered roughly per the design plan's suggested progression (§14): foundations
// first, deeper structures later. Patterns without authored theory/problems yet
// show as "coming soon" rather than being hidden — the user always sees the
// whole path, just not every step is walkable yet (design plan §14: "you don't
// need to understand the entire curriculum, just your next step").
export const PATTERNS: PatternMeta[] = [
  {
    id: "hash-map",
    name: "Hash Maps",
    tagline: "Remember what you've seen, so you never have to search for it again.",
    hasTheory: true,
  },
  {
    id: "two-pointers",
    name: "Two Pointers",
    tagline: "Walk from both ends toward the middle instead of comparing everything.",
    hasTheory: true,
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    tagline: "Grow and shrink a range instead of re-scanning from scratch.",
    hasTheory: true,
  },
  {
    id: "binary-search",
    name: "Binary Search",
    tagline: "If it's sorted, you can throw away half the possibilities every step.",
    hasTheory: false,
  },
  {
    id: "recursion",
    name: "Recursion",
    tagline: "Solve the small version, trust it, and let it build the big answer.",
    hasTheory: false,
  },
  {
    id: "stack",
    name: "Stacks",
    tagline: "The last thing you saw is the first thing you need back.",
    hasTheory: false,
  },
  {
    id: "queue",
    name: "Queues",
    tagline: "First in, first out — process things in the order they arrived.",
    hasTheory: false,
  },
  {
    id: "tree",
    name: "Trees",
    tagline: "Branch, recurse, and let the structure guide the search.",
    hasTheory: false,
  },
  {
    id: "graph",
    name: "Graphs",
    tagline: "Model connections, then explore them systematically.",
    hasTheory: false,
  },
  {
    id: "dp",
    name: "Dynamic Programming",
    tagline: "Never solve the same subproblem twice.",
    hasTheory: false,
  },
];

export function getPatternMeta(id: string): PatternMeta | undefined {
  return PATTERNS.find((p) => p.id === id);
}
