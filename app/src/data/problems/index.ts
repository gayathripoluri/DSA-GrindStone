import type { Pattern, Problem } from "@/lib/types";
import { twoSum } from "./two-sum";
import { containsDuplicate } from "./contains-duplicate";
import { validAnagram } from "./valid-anagram";
import { validPalindrome } from "./valid-palindrome";
import { twoSumII } from "./two-sum-ii";

export const PROBLEMS: Record<string, Problem> = {
  [twoSum.id]: twoSum,
  [containsDuplicate.id]: containsDuplicate,
  [validAnagram.id]: validAnagram,
  [validPalindrome.id]: validPalindrome,
  [twoSumII.id]: twoSumII,
};

export const ALL_PROBLEMS: Problem[] = Object.values(PROBLEMS);

export const PROBLEMS_BY_PATTERN: Partial<Record<Pattern, Problem[]>> = {};
for (const problem of ALL_PROBLEMS) {
  for (const pattern of problem.patterns) {
    (PROBLEMS_BY_PATTERN[pattern] ??= []).push(problem);
  }
}
