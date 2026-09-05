import type { Problem } from "@/lib/types";

export const validAnagram: Problem = {
  id: "valid-anagram",
  title: "Valid Anagram",
  difficulty: "easy",
  patterns: ["hash-map"],
  topics: ["string"],
  skills: ["pattern-recognition", "complexity", "implementation"],
  prerequisites: [],
  reviewWeight: 0.6,
  estimatedMinutes: 15,
  statement:
    "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise. An anagram uses all the original letters of `s` exactly once, rearranged.",
  examples: [
    { input: "s = \"anagram\", t = \"nagaram\"", output: "true" },
    { input: "s = \"rat\", t = \"car\"", output: "false" },
  ],
  constraints: [
    "1 <= s.length, t.length <= 5*10^4",
    "s and t consist of lowercase English letters only",
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

bool isAnagram(string s, string t) {
    // Your code here
    return false;
}

int main() {
    string s, t;
    cin >> s >> t;

    cout << (isAnagram(s, t) ? "true" : "false") << endl;
    return 0;
}
`,
  visibleTests: [
    { input: "anagram\nnagaram", expected: "true" },
    { input: "rat\ncar", expected: "false" },
  ],
  hiddenTests: [
    { input: "a\nab", expected: "false", hidden: true },
    { input: "aabbcc\nabcabc", expected: "true", hidden: true },
    { input: "aacc\nccac", expected: "false", hidden: true },
  ],
  warmUp: {
    intro: "Before we start...",
    steps: [
      {
        prompt: "You have two words. How would you check if one is just a rearrangement of the other's letters?",
        hint: "Most people think of sorting both strings and comparing them.",
      },
      {
        prompt: "Sorting works, but costs O(n log n). Could you check it in a single pass instead, without sorting?",
        hint: "Count how many times each letter appears in each word.",
      },
      {
        prompt: "What would you use to count letter frequencies quickly?",
        hint: "A hash map from letter to count — or since it's just lowercase letters, a fixed 26-slot array.",
      },
    ],
  },
  note: {
    hook: "Two words are anagrams exactly when they're built from the same letters, the same number of times each.",
    idea: "Count how many times each letter appears in the first word, then subtract one for each matching letter as you scan the second word.",
    visualHint: "\"anagram\" → a:3 n:1 g:1 r:1 m:1. Scan \"nagaram\" and subtract 1 per letter — if every count lands back at zero, and the lengths matched, it's an anagram.",
    aha: "You never need to sort anything — counting letters once and comparing counts is enough.",
    pattern: "When order doesn't matter but frequency does, think Hash Map (or a fixed-size count array for a small alphabet).",
    trap: "Forgetting to check the lengths first — two words of different lengths can never be anagrams, no matter what the letter counts say.",
  },
  hints: [
    "Think about what actually makes two words anagrams — it isn't their order.",
    "What if you counted how many times each letter appears in the first word?",
    "A hash map from character to count works — or since it's lowercase English letters only, even a 26-slot array.",
    "Increase counts for the first word, decrease for the second — if everything cancels to zero (and lengths matched), they're anagrams.",
  ],
  insightTemplate:
    "Anagrams share the same letter counts — count once, compare once, no sorting needed.",
  commonMistakes: [
    "Sorting both strings (O(n log n)) when counting letters (O(n)) is enough.",
    "Skipping the early length check — different lengths can never be anagrams.",
    "Reaching for a hash map when a fixed 26-element array is simpler and faster for lowercase-only input.",
  ],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  patternKeywords: [
    "hash",
    "map",
    "count",
    "frequency",
    "counts",
    "26-slot",
    "26 slot",
    "dictionary",
    "dict",
    "table",
  ],
};
