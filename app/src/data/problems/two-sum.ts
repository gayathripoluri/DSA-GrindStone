import type { Problem } from "@/lib/types";

export const twoSum: Problem = {
  id: "two-sum",
  title: "Two Sum",
  difficulty: "easy",
  patterns: ["hash-map"],
  topics: ["array"],
  skills: ["pattern-recognition", "complexity", "implementation"],
  prerequisites: [],
  reviewWeight: 0.8,
  estimatedMinutes: 20,
  statement:
    "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. You may assume each input has exactly one solution, and you may not use the same element twice.",
  examples: [
    { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] == 9" },
    { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    { input: "nums = [3,3], target = 6", output: "[0,1]" },
  ],
  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "Only one valid answer exists.",
  ],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    return {};
}

int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for (auto &x : nums) cin >> x;
    int target; cin >> target;

    vector<int> result = twoSum(nums, target);
    for (size_t i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i + 1 < result.size()) cout << " ";
    }
    cout << endl;
    return 0;
}
`,
  visibleTests: [
    { input: "4\n2 7 11 15\n9", expected: "0 1" },
    { input: "3\n3 2 4\n6", expected: "1 2" },
  ],
  hiddenTests: [
    { input: "2\n3 3\n6", expected: "0 1", hidden: true },
    { input: "5\n-1 -2 -3 -4 -5\n-8", expected: "2 4", hidden: true },
    { input: "6\n0 4 3 0 8 1\n0", expected: "0 3", hidden: true },
  ],
  warmUp: {
    intro: "Before we start...",
    steps: [
      {
        prompt:
          "You have: 2  7  11  15 — target = 9. How would you find the pair that adds up to it?",
        hint: "Most people start with two nested loops (brute force).",
      },
      {
        prompt:
          "That works. Now imagine the array has 100,000 numbers. Would you still use two loops?",
        hint: "Nested loops are O(n^2) — too slow at that scale.",
      },
      {
        prompt: "What would you store while scanning the array once, to avoid looking back through it every time?",
        hint: "Something that gives fast lookup of numbers you've already seen — a hash map.",
      },
    ],
  },
  note: {
    hook: "Sometimes the fastest way to find something is to remember where you've already seen it.",
    idea: "Walk through the array once. For each number, ask: have I already seen the value that would complete the pair?",
    visualHint: "2 --needs--> 7. When you see 2, remember it. When you reach 7, check: did I already see (9 - 7) = 2? Yes.",
    aha: "You don't need to search the whole array again — you just need to remember what you've passed.",
    pattern: "When you repeatedly need to check whether something exists, think Hash Map.",
    trap: "Forgetting to check for the complement BEFORE inserting the current number — otherwise a number could pair with itself.",
  },
  hints: [
    "Think about what information you wish you had already seen as you scan the array.",
    "What could you store while scanning the array — something that lets you look something up quickly?",
    "A hash map gives you O(1) average lookup. What would you use as the key, and what as the value?",
    "For each number x, check if (target - x) is already a key in your map before inserting x itself.",
  ],
  insightTemplate:
    "A hashmap lets us remember what we've already seen, so we don't have to search again.",
  commonMistakes: [
    "Using nested loops (O(n^2)) instead of a hash map (O(n)).",
    "Checking for the complement after inserting the current number, which can incorrectly match a number with itself.",
    "Not handling duplicate values correctly.",
  ],
  timeComplexity: "O(n)",
  spaceComplexity: "O(n)",
  patternKeywords: [
    "hash",
    "map",
    "dictionary",
    "dict",
    "set",
    "table",
    "lookup",
    "cache",
    "remember what",
    "already seen",
    "seen so far",
    "store what",
    "store the",
    "keep track",
  ],
};
