import type { Problem } from "@/lib/types";

export const longestSubstringWithoutRepeating: Problem = {
  id: "longest-substring-without-repeating",
  title: "Longest Substring Without Repeating Characters",
  difficulty: "medium",
  patterns: ["sliding-window"],
  topics: ["string"],
  skills: ["pattern-recognition", "complexity", "implementation"],
  prerequisites: [],
  reviewWeight: 0.8,
  estimatedMinutes: 20,
  statement: "Given a string `s`, find the length of the longest substring without repeating characters.",
  examples: [
    { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with length 3.' },
    { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b", with length 1.' },
    { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke", with length 3.' },
  ],
  constraints: ["0 <= s.length <= 5*10^4", "s consists of English letters, digits, symbols and spaces."],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

int lengthOfLongestSubstring(string s) {
    // Your code here
    return 0;
}

int main() {
    string s;
    getline(cin, s);
    cout << lengthOfLongestSubstring(s) << endl;
    return 0;
}
`,
  visibleTests: [
    { input: "abcabcbb\n", expected: "3" },
    { input: "pwwkew\n", expected: "3" },
  ],
  hiddenTests: [
    { input: "bbbbb\n", expected: "1", hidden: true },
    { input: "\n", expected: "0", hidden: true },
    { input: "abba\n", expected: "2", hidden: true },
  ],
  warmUp: {
    intro: "Before we start...",
    steps: [
      {
        prompt:
          'You need the longest run of characters in a string with no repeats, like "abcabcbb". How would you check every possible substring?',
        hint: "Most people check every substring and every character within it — that's O(n^2) or worse.",
      },
      {
        prompt: "Now imagine the string is 50,000 characters long. Would checking every substring still be fast enough?",
        hint: "Checking every substring is far too slow at that scale.",
      },
      {
        prompt:
          "If you're growing a window from the left and hit a character you've already seen inside it, what should happen to the window instead of starting over completely?",
        hint: "Shrink the window from the left just enough to drop the repeated character, don't restart from scratch.",
      },
    ],
  },
  note: {
    hook: "You don't need to re-scan from the start every time you hit a repeated character — most of the window you already built is still valid.",
    idea: "Grow the window from the right one character at a time. If the new character already exists inside the window, shrink from the left until it doesn't.",
    visualHint: '"abca" — window grows to [a,b,c], then hits \'a\' again. Shrink left past the first \'a\'; window becomes [b,c,a], still no repeats.',
    aha: "Because both pointers only ever move forward, the whole string is scanned in one pass — O(n), not O(n^2).",
    pattern:
      "Looking for the longest/shortest run in a string or array that satisfies some condition (no repeats, sum <= target, etc.)? Think Sliding Window — this time the width isn't fixed, it grows and shrinks.",
    trap: "Restarting the window from scratch after a repeat, instead of just shrinking past the earlier occurrence — that turns an O(n) solution back into something much slower.",
  },
  hints: [
    "Think about what you can keep from the old window instead of throwing all of it away when you hit a repeat.",
    "Keep a set (or a map from character to its last index) of what's currently inside the window.",
    "When you see a character already in the window, move the left edge forward until that duplicate is no longer inside.",
    "Track the maximum window length as you go — the answer isn't necessarily the final window.",
  ],
  insightTemplate:
    "A variable-size sliding window grows on the right and shrinks on the left only as far as needed, scanning the string in one O(n) pass.",
  commonMistakes: [
    "Restarting the window from scratch on a repeat instead of shrinking past just the duplicate.",
    "Moving the left pointer backward when a stale duplicate index is before the current left edge.",
    "Forgetting to update the answer inside the loop, not just at the end.",
  ],
  timeComplexity: "O(n)",
  spaceComplexity: "O(min(n, charset size))",
  patternKeywords: [
    "sliding window",
    "window",
    "shrink",
    "grow",
    "left pointer",
    "expand",
    "substring",
    "duplicate",
  ],
};
