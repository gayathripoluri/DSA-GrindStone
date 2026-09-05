import type { Problem } from "@/lib/types";

export const twoSumII: Problem = {
  id: "two-sum-ii",
  title: "Two Sum II - Sorted Array",
  difficulty: "easy",
  patterns: ["two-pointers"],
  topics: ["array"],
  skills: ["pattern-recognition", "complexity", "implementation"],
  prerequisites: [],
  reviewWeight: 0.6,
  estimatedMinutes: 15,
  statement:
    "Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers that add up to a specific `target`. Return their indices (1-indexed) as `[index1, index2]` with `index1 < index2`. You may assume each input has exactly one solution, and you may not use the same element twice.",
  examples: [
    { input: "numbers = [2,7,11,15], target = 9", output: "[1,2]" },
    { input: "numbers = [2,3,4], target = 6", output: "[1,3]" },
    { input: "numbers = [-1,0], target = -1", output: "[1,2]" },
  ],
  constraints: [
    "2 <= numbers.length <= 3*10^4",
    "-1000 <= numbers[i] <= 1000",
    "numbers is sorted in non-decreasing order",
    "-1000 <= target <= 1000",
    "Exactly one valid answer exists.",
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSumSorted(vector<int>& numbers, int target) {
    // Your code here
    return {};
}

int main() {
    int n; cin >> n;
    vector<int> numbers(n);
    for (auto &x : numbers) cin >> x;
    int target; cin >> target;

    vector<int> result = twoSumSorted(numbers, target);
    for (size_t i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i + 1 < result.size()) cout << " ";
    }
    cout << endl;
    return 0;
}
`,
  visibleTests: [
    { input: "4\n2 7 11 15\n9", expected: "1 2" },
    { input: "3\n2 3 4\n6", expected: "1 3" },
  ],
  hiddenTests: [
    { input: "2\n-1 0\n-1", expected: "1 2", hidden: true },
    { input: "5\n1 2 3 4 4\n8", expected: "4 5", hidden: true },
    { input: "5\n1 3 5 8 13\n11", expected: "2 4", hidden: true },
  ],
  warmUp: {
    intro: "Before we start...",
    steps: [
      {
        prompt: "The array is already sorted. Given that, would you still use two nested loops to find the pair?",
        hint: "You could, but sorted order is a hint most people don't use right away.",
      },
      {
        prompt: "If the sum of the two ends is too big, which end would you move, and why?",
        hint: "Move the right pointer left — that decreases the sum, since the array is sorted.",
      },
      {
        prompt: "What's your stopping condition?",
        hint: "When the sum matches the target, or the two pointers meet.",
      },
    ],
  },
  note: {
    hook: "Sorted order means you already know which direction to move to get a bigger or smaller sum — no need to check every pair.",
    idea: "Start with one pointer at each end. Sum too small? Move the left pointer right. Too big? Move the right pointer left. Exactly right? You're done.",
    visualHint: "left=2, right=15, sum=17 too big → move right to 11. sum=13 still too big → move right to 7. sum=9 — found it.",
    aha: "Because the array is sorted, moving a pointer always changes the sum in a predictable direction — so you never waste a comparison.",
    pattern: "Sorted array, looking for a pair (or checking symmetry)? Think Two Pointers.",
    trap: "The answer here is 1-indexed — off-by-one errors are the most common bug in this exact problem.",
  },
  hints: [
    "The array being sorted is a big clue — what does that let you assume about moving toward one end vs. the other?",
    "Try one pointer at index 0, one at the last index.",
    "If numbers[left] + numbers[right] is too small, which pointer should move, and in which direction?",
    "Stop as soon as the sum matches the target, or the moment left is no longer less than right.",
  ],
  insightTemplate:
    "On a sorted array, two pointers moving inward find a pair in one O(n) pass — no hashing needed.",
  commonMistakes: [
    "Ignoring the sorted property entirely and falling back to the O(n²) or hash-map approach from the unsorted Two Sum.",
    "Returning 0-indexed positions instead of the required 1-indexed ones.",
    "Moving both pointers on the same step instead of one at a time, based on the comparison.",
  ],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  patternKeywords: [
    "two pointer",
    "two-pointer",
    "both ends",
    "left and right",
    "inward",
    "converge",
    "pointers",
  ],
};
