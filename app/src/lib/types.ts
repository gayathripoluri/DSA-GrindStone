export type Difficulty = "easy" | "medium" | "hard";

export type Pattern =
  | "hash-map"
  | "two-pointers"
  | "sliding-window"
  | "binary-search"
  | "recursion"
  | "stack"
  | "queue"
  | "tree"
  | "graph"
  | "dp";

export interface TestCase {
  input: string;
  expected: string;
  hidden?: boolean;
}

export interface WarmUpStep {
  prompt: string;
  // If the user's answer matches (loosely) one of these, system responds with `onMatch`,
  // otherwise falls back to `onMiss`. Matching is done by the AI, these are just guidance.
  hint: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  patterns: Pattern[];
  topics: string[];
  skills: string[];
  prerequisites: string[];
  reviewWeight: number;
  estimatedMinutes: number;
  statement: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: string;
  visibleTests: TestCase[];
  hiddenTests: TestCase[];
  warmUp: {
    intro: string;
    steps: WarmUpStep[];
  };
  note: {
    hook: string;
    idea: string;
    visualHint: string;
    aha: string;
    pattern: string;
    trap: string;
  };
  hints: string[]; // escalating hint ladder, level 1..n
  insightTemplate: string; // one-line insight shown on completion
  commonMistakes: string[];
  timeComplexity: string;
  spaceComplexity: string;
  // Words/phrases that count as "arrived at the target pattern" if they show up
  // anywhere in the warm-up transcript. If none appear, the user gets routed
  // through a visual concept explainer before the note (see ConceptExplainer).
  patternKeywords: string[];
}

export type SessionStage =
  | "warmup"
  | "concept"
  | "note"
  | "interview"
  | "coding"
  | "solved"
  | "reflection"
  | "complete";

export interface InterviewTurn {
  role: "interviewer" | "user";
  text: string;
}

export interface SessionState {
  sessionId: string;
  problemId: string;
  stage: SessionStage;
  startedAt: string;
  updatedAt: string;
  warmup: {
    completed: boolean;
    transcript: { prompt: string; answer: string }[];
  };
  interview: {
    completed: boolean;
    hintsUsed: number;
    transcript: InterviewTurn[];
    readyToCode: boolean;
  };
  coding: {
    code: string;
    attempts: number;
    testsPassed: number;
    testsFailed: number;
    lastRunOutput?: string;
    solved: boolean;
  };
  reflection: {
    completed: boolean;
    answer?: string;
  };
}

export interface ReviewItem {
  problemId: string;
  pattern: Pattern;
  dueDate: string; // ISO date
  intervalDays: number;
  easeStreak: number; // consecutive "easy" recalls, drives interval growth
  lastReviewedAt?: string;
}

export interface InsightCard {
  id: string;
  problemId: string;
  pattern: Pattern;
  text: string;
  complexityTime: string;
  complexitySpace: string;
  createdAt: string;
}

export interface JourneyState {
  streak: number;
  /** All-time high streak — kept even after `streak` resets, so streak-based
   * achievements (e.g. "hit a 7-day streak") stay earned once unlocked. */
  bestStreak: number;
  lastActiveDate: string | null; // ISO date, for streak calc
  totalSolved: number;
  patternMastery: Partial<Record<Pattern, number>>; // 0..1
  solvedProblemIds: string[];
}

export interface StoredSession {
  session: SessionState;
}
