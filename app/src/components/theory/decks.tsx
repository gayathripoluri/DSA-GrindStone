import type { ComponentType } from "react";
import type { Pattern } from "@/lib/types";
import {
  ArrayScanVisual,
  LockersVisual,
  HashFunctionVisual,
  CollisionVisual,
  ChainingVisual,
  FastLookupVisual,
  ScanPairsVisual,
  TwoPointersStartVisual,
  TwoPointersMoveVisual,
  TwoPointersConvergeVisual,
  TwoPointersDoneVisual,
} from "./visuals";

// The seven-part note structure from the design plan (§17): Hook, Idea, Visual,
// Aha, Pattern, Trap, Tiny Recall. A deck can use a kind more than once (e.g.
// several "visual" slides walking through a mechanism step by step) — the
// kind drives the little kicker label shown above each slide, not a 1:1 count.
export type TheorySlideKind = "hook" | "idea" | "visual" | "aha" | "pattern" | "trap" | "recall";

export const KIND_LABEL: Record<TheorySlideKind, string> = {
  hook: "The Hook",
  idea: "The Idea",
  visual: "The Visual",
  aha: "The Aha",
  pattern: "The Pattern",
  trap: "The Trap",
  recall: "Tiny Recall",
};

export interface TheorySlide {
  kind: TheorySlideKind;
  title: string;
  /** Explanatory caption for most slides. For a "recall" slide, this is the
   * model answer, revealed only after the user writes their own. */
  caption: string;
  Visual?: ComponentType;
  /** Only used for kind "recall" — the question shown before the reveal. */
  recallPrompt?: string;
}

const hashMapDeck: TheorySlide[] = [
  {
    kind: "hook",
    title: "Have you seen this before?",
    caption:
      "You're scanning a list of numbers, and for each one you need to ask: \"have I already seen its partner?\" Re-checking everything you've passed, every single time, gets slow fast.",
    Visual: ArrayScanVisual,
  },
  {
    kind: "idea",
    title: "Meet the hash map",
    caption:
      "Think of a hash map as a wall of numbered lockers. Every value gets assigned to a locker instead of you having to search through all of them.",
    Visual: LockersVisual,
  },
  {
    kind: "visual",
    title: "The hash function",
    caption:
      "A hash function takes a value and instantly computes which locker it belongs in — no searching required.",
    Visual: HashFunctionVisual,
  },
  {
    kind: "visual",
    title: "What's a hash collision?",
    caption:
      "Sometimes two different values compute to the same locker. That's called a collision — and it's normal, not a bug.",
    Visual: CollisionVisual,
  },
  {
    kind: "visual",
    title: "Handling collisions",
    caption:
      "When that happens, the locker just keeps a short list of everything that landed there, so nothing gets lost or overwritten.",
    Visual: ChainingVisual,
  },
  {
    kind: "aha",
    title: "Why this makes lookup fast",
    caption:
      "That's why checking \"have I already seen this?\" takes one instant lookup — instead of rescanning everything you've seen so far.",
    Visual: FastLookupVisual,
  },
  {
    kind: "pattern",
    title: "When to reach for a hash map",
    caption:
      "Whenever you catch yourself thinking \"have I seen this before?\" or \"does this already exist?\" — that's your signal. Trading a little memory for instant lookup is almost always worth it.",
  },
  {
    kind: "trap",
    title: "The mistake almost everyone makes",
    caption:
      "Checking whether a value already exists BEFORE inserting the current one — insert first and you can accidentally match a value with itself. And a plain hash set only tracks membership; if you need counts too, you need a hash map instead.",
  },
  {
    kind: "recall",
    title: "Explain it back",
    recallPrompt:
      "In one sentence: what does a hash map let you do that a plain array scan doesn't?",
    caption:
      "It turns \"have I seen this?\" from an O(n) search into an O(1) lookup, by trading a bit of memory for speed.",
  },
];

const twoPointersDeck: TheorySlide[] = [
  {
    kind: "hook",
    title: "Do you really need to check every pair?",
    caption:
      "You have a sorted list and need to find two numbers that add up to a target — or check whether something reads the same forwards and backwards. Comparing every pair takes O(n²). There's a faster way once the data is sorted (or symmetric).",
    Visual: ScanPairsVisual,
  },
  {
    kind: "idea",
    title: "Meet the two pointers",
    caption:
      "Instead of comparing everything, place one pointer at the start and one at the end. Move them toward each other based on what you learn at each step.",
    Visual: TwoPointersStartVisual,
  },
  {
    kind: "visual",
    title: "Which way do you move?",
    caption:
      "If the sum is too small, move the left pointer right to get a bigger number. If it's too big, move the right pointer left to get a smaller one.",
    Visual: TwoPointersMoveVisual,
  },
  {
    kind: "visual",
    title: "They converge",
    caption:
      "Each step rules out one number that can no longer be part of the answer, so the pointers close in on it in a single pass.",
    Visual: TwoPointersConvergeVisual,
  },
  {
    kind: "aha",
    title: "Why this is O(n), not O(n²)",
    caption:
      "Each pointer only ever moves inward, never backtracks — so together they take at most n steps total, not n² comparisons.",
    Visual: TwoPointersDoneVisual,
  },
  {
    kind: "pattern",
    title: "When to reach for two pointers",
    caption:
      "Whenever the data is sorted, or you're comparing from both ends (like a palindrome), and you're tempted to check every pair — that's the signal. Two pointers turn it into one pass.",
  },
  {
    kind: "trap",
    title: "The mistake almost everyone makes",
    caption:
      "Moving both pointers on the same step without checking the condition first, or forgetting the stopping condition — when left and right meet or cross, stop; don't scan past it.",
  },
  {
    kind: "recall",
    title: "Explain it back",
    recallPrompt: "In one sentence: why do two pointers avoid needing nested loops?",
    caption:
      "Moving toward each other based on the comparison result rules out one end at every step, so you never re-check a pair you've already eliminated.",
  },
];

export const THEORY_DECKS: Partial<Record<Pattern, TheorySlide[]>> = {
  "hash-map": hashMapDeck,
  "two-pointers": twoPointersDeck,
};
