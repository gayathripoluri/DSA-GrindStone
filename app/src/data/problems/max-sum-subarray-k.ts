import type { Problem } from "@/lib/types";

export const maxSumSubarrayK: Problem = {
  id: "max-sum-subarray-k",
  title: "Maximum Sum Subarray of Size K",
  difficulty: "easy",
  patterns: ["sliding-window"],
  topics: ["array"],
  skills: ["pattern-recognition", "complexity", "implementation"],
  prerequisites: [],
  reviewWeight: 0.7,
  estimatedMinutes: 15,
  statement:
    "Given an array of positive integers `nums` and an integer `k`, find the maximum sum of any contiguous subarray of size exactly `k`.",
  examples: [
    {
      input: "nums = [2,1,5,1,3,2], k = 3",
      output: "9",
      explanation: "The subarray [5,1,3] has the maximum sum, 9.",
    },
    { input: "nums = [2,3,4,1,5], k = 2", output: "7", explanation: "[3,4] sums to 7." },
  ],
  constraints: ["1 <= k <= nums.length <= 10^5", "1 <= nums[i] <= 10^4"],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

int maxSumSubarray(vector<int>& nums, int k) {
    // Your code here
    return 0;
}

int main() {
    int n; cin >> n;
    vector<int> nums(n);
    for (auto &x : nums) cin >> x;
    int k; cin >> k;

    cout << maxSumSubarray(nums, k) << endl;
    return 0;
}
`,
  visibleTests: [
    { input: "6\n2 1 5 1 3 2\n3", expected: "9" },
    { input: "5\n2 3 4 1 5\n2", expected: "7" },
  ],
  hiddenTests: [
    { input: "4\n1 1 1 1\n2", expected: "2", hidden: true },
    { input: "7\n4 2 1 7 8 1 2\n3", expected: "16", hidden: true },
    { input: "3\n1 2 3\n3", expected: "6", hidden: true },
  ],
  warmUp: {
    intro: "Before we start...",
    steps: [
      {
        prompt:
          "You have [2,1,5,1,3,2] and need the max sum of any 3 consecutive numbers. How would you check every possible window?",
        hint: "Most people recompute the sum of each 3-element window from scratch — that's a nested loop, O(n*k).",
      },
      {
        prompt:
          "Now imagine the array has 100,000 numbers and k is large. Would recomputing each window's sum from scratch still be fast enough?",
        hint: "Recomputing every window from scratch is too slow at that scale — O(n*k).",
      },
      {
        prompt: "When you slide the window one step to the right, what actually changes between the old sum and the new sum?",
        hint: "Only two elements change: one leaves the window on the left, one enters on the right — everything else stays the same.",
      },
    ],
  },
  note: {
    hook: "Recomputing the sum of every window from scratch redoes almost all the same work you just did one step ago.",
    idea: "Keep a running sum for the current window. When you slide it forward by one, subtract the element that just left and add the element that just entered.",
    visualHint: "[2,1,5] sum=8. Slide right: subtract 2, add 1 → sum=8-2+1=7 for [1,5,1]. No need to re-add 1 and 5.",
    aha: "Each slide is O(1) instead of O(k), so scanning the whole array costs O(n) total instead of O(n*k).",
    pattern: "Fixed-size window sliding across an array, where you only care about a running aggregate (sum, count, etc.)? Think Sliding Window.",
    trap: "Recomputing the sum from scratch on every slide instead of adjusting it incrementally — that silently turns an O(n) solution back into O(n*k).",
  },
  hints: [
    "Think about what stays the same between one window and the next — do you really need to re-add every element?",
    "Keep a running sum. What do you subtract and what do you add when the window moves one step to the right?",
    "Compute the sum of the first k elements once. Then for each new window, subtract nums[i-k] and add nums[i].",
    "Track the maximum sum seen so far as you slide, don't wait until the end to compare.",
  ],
  insightTemplate:
    "A sliding window keeps a running sum and adjusts it by one element at each step, turning O(n*k) into O(n).",
  commonMistakes: [
    "Recomputing the window sum from scratch at every position instead of adjusting it incrementally.",
    "Off-by-one errors on which index leaves and which enters the window.",
    "Not handling the case where k equals the array length.",
  ],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  patternKeywords: [
    "sliding window",
    "window",
    "running sum",
    "subtract",
    "add the",
    "slide",
    "fixed size",
    "fixed-size",
  ],
};
