import type { Problem } from "@/lib/types";

export const containsDuplicate: Problem = {
  id: "contains-duplicate",
  title: "Contains Duplicate",
  difficulty: "easy",
  patterns: ["hash-map"],
  topics: ["array"],
  skills: ["pattern-recognition", "complexity", "implementation"],
  prerequisites: [],
  reviewWeight: 0.6,
  estimatedMinutes: 15,
  statement:
    "Given an integer array `nums`, return `true` if any value appears at least twice, and `false` if every element is distinct.",
  examples: [
    { input: "nums = [1,2,3,1]", output: "true" },
    { input: "nums = [1,2,3,4]", output: "false" },
    { input: "nums = [1,1,1,3,3,4,3,2,4,2]", output: "true" },
  ],
  constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

bool containsDuplicate(vector<int>& nums) {
    // Your code here
    return false;
}

int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for (auto &x : nums) cin >> x;

    cout << (containsDuplicate(nums) ? "true" : "false") << endl;
    return 0;
}
`,
  visibleTests: [
    { input: "4\n1 2 3 1", expected: "true" },
    { input: "4\n1 2 3 4", expected: "false" },
  ],
  hiddenTests: [
    { input: "10\n1 1 1 3 3 4 3 2 4 2", expected: "true", hidden: true },
    { input: "1\n7", expected: "false", hidden: true },
    { input: "5\n-1 -2 -3 -2 -5", expected: "true", hidden: true },
  ],
  warmUp: {
    intro: "Before we start...",
    steps: [
      {
        prompt: "You have a list of numbers. How would you check if any value shows up more than once?",
        hint: "Most people start by comparing every pair (nested loops).",
      },
      {
        prompt: "Now imagine the list has 100,000 numbers. Would comparing every pair still be fast enough?",
        hint: "O(n^2) comparisons is too slow at that scale.",
      },
      {
        prompt: "What could you keep track of as you scan, so you instantly know if you've seen a number before?",
        hint: "A hash set — store every number you've seen, and check membership in O(1).",
      },
    ],
  },
  note: {
    hook: "Sometimes the fastest way to catch a repeat is to remember everything you've already passed.",
    idea: "Walk through the array once. For each number, ask: is this already in my 'seen' collection?",
    visualHint: "Scan left to right, adding each number to a set. The moment you're about to add a number that's already there, you've found your duplicate.",
    aha: "You don't need to compare every pair — you just need to remember what you've already seen.",
    pattern: "When you need to detect whether something has occurred before, think Hash Set.",
    trap: "A set only tracks distinct values. If the question changes to 'how many times does each value repeat', you need a hash map (value → count), not a set.",
  },
  hints: [
    "Think about what you'd need to remember as you scan through the numbers once.",
    "A hash set lets you check 'have I seen this?' in O(1). What would you insert, and when would you check?",
    "For each number, check membership first — if it's already in the set, you've found your duplicate.",
    "If you finish scanning without ever finding a repeat, the answer is false.",
  ],
  insightTemplate:
    "A hash set lets you check 'have I seen this before?' in O(1), turning an O(n^2) comparison into a single O(n) pass.",
  commonMistakes: [
    "Comparing every pair of elements (O(n^2)) instead of using a hash set (O(n)).",
    "Sorting first also works, but costs O(n log n) — a hash set is faster when you don't need the array sorted afterward.",
    "Confusing a hash set (membership only) with a hash map (also tracks counts) when the question asks 'how many duplicates'.",
  ],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  patternKeywords: [
    "hash",
    "set",
    "map",
    "dictionary",
    "dict",
    "table",
    "lookup",
    "already seen",
    "seen before",
    "seen so far",
    "keep track",
    "track",
  ],
};
