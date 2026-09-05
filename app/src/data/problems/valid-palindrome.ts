import type { Problem } from "@/lib/types";

export const validPalindrome: Problem = {
  id: "valid-palindrome",
  title: "Valid Palindrome",
  difficulty: "easy",
  patterns: ["two-pointers"],
  topics: ["string"],
  skills: ["pattern-recognition", "complexity", "implementation"],
  prerequisites: [],
  reviewWeight: 0.6,
  estimatedMinutes: 15,
  statement:
    "Given a string `s`, return `true` if it is a palindrome after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, and `false` otherwise.",
  examples: [
    { input: 's = "A man, a plan, a canal: Panama"', output: "true" },
    { input: 's = "race a car"', output: "false" },
    { input: 's = " "', output: "true", explanation: "No alphanumeric characters, so it's vacuously a palindrome." },
  ],
  constraints: ["1 <= s.length <= 2*10^5", "s consists of printable ASCII characters"],
  starterCode: `#include <bits/stdc++.h>
using namespace std;

bool isPalindrome(string s) {
    // Your code here
    return false;
}

int main() {
    string s;
    getline(cin, s);
    cout << (isPalindrome(s) ? "true" : "false") << endl;
    return 0;
}
`,
  visibleTests: [
    { input: "A man, a plan, a canal: Panama", expected: "true" },
    { input: "race a car", expected: "false" },
  ],
  hiddenTests: [
    { input: " ", expected: "true", hidden: true },
    { input: "0P", expected: "false", hidden: true },
    { input: "Was it a car or a cat I saw?", expected: "true", hidden: true },
  ],
  warmUp: {
    intro: "Before we start...",
    steps: [
      {
        prompt: "You have a string. How would you check if it reads the same forwards and backwards?",
        hint: "Most people reverse the string and compare, or step through both directions at once.",
      },
      {
        prompt:
          "Now the string has punctuation and mixed case, like \"A man, a plan, a canal: Panama\". Would comparing raw characters work?",
        hint: "No — you need to skip non-alphanumeric characters and ignore case as you compare.",
      },
      {
        prompt: "How would you compare from both ends without building a whole cleaned-up copy of the string first?",
        hint: "Two pointers — one at the start, one at the end, skipping non-alphanumeric characters as they move inward.",
      },
    ],
  },
  note: {
    hook: "You don't need to build a cleaned copy of the string to check if it's a palindrome — you can check it in place.",
    idea: "Walk from both ends toward the middle. Skip characters that aren't letters or digits. Compare the rest, ignoring case.",
    visualHint: "left → 'a','m','a','n'... right ← 'a','m','a','n','a'... skip the commas, spaces, and colons as you go.",
    aha: "As long as every pair you compare matches, and the pointers meet in the middle, it's a palindrome — one pass, no extra copy.",
    pattern: "When you're comparing from both ends toward the middle, think Two Pointers.",
    trap: "Forgetting to skip non-alphanumeric characters on BOTH sides independently — if only one pointer skips, you'll compare the wrong characters.",
  },
  hints: [
    "Think about what 'compare from both ends' looks like without creating a new string first.",
    "Two pointers: one starting at index 0, one at the last index.",
    "Move a pointer inward whenever it's sitting on a non-alphanumeric character — do this for both pointers independently, before comparing.",
    "Compare the two characters case-insensitively. If they ever differ, it's not a palindrome. If the pointers meet or cross, it is.",
  ],
  insightTemplate:
    "Two pointers moving inward from both ends let you check a palindrome in one pass, without building a cleaned copy of the string.",
  commonMistakes: [
    "Building a fully cleaned/reversed copy of the string first — works, but costs extra space that two pointers avoid.",
    "Only skipping non-alphanumeric characters on one side.",
    "Forgetting to case-fold before comparing.",
  ],
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)",
  patternKeywords: [
    "two pointer",
    "two-pointer",
    "both ends",
    "left and right",
    "start and end",
    "inward",
    "converge",
  ],
};
