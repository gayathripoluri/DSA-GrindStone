"use client";

import { useEffect, useState } from "react";
import { useNavVisibility } from "@/lib/nav-context";
import {
  getJourney,
  saveJourney,
  saveSession,
  getLatestIncompleteSession,
  addInsight,
  upsertReview,
  DEFAULT_JOURNEY,
} from "@/lib/db";
import { computeNewStreak, scheduleFirstReview } from "@/lib/srs";
import type { InsightCard, JourneyState, Problem, SessionState } from "@/lib/types";

import { MissionCard } from "./MissionCard";
import { WarmUp } from "./WarmUp";
import { ConceptExplainer } from "./ConceptExplainer";
import { NoteScreen } from "./NoteScreen";
import { Interview } from "./Interview";
import { CodeEditor } from "./CodeEditor";
import { Victory } from "./Victory";
import { Reflection } from "./Reflection";
import { InsightReveal } from "./InsightReveal";
import { StageProgress } from "./StageProgress";

/** Did the user's warm-up answers ever mention the target pattern's vocabulary? */
function recognizedPattern(
  transcript: { prompt: string; answer: string }[],
  keywords: string[]
): boolean {
  const combined = transcript.map((t) => t.answer.toLowerCase()).join(" ");
  return keywords.some((k) => combined.includes(k.toLowerCase()));
}

function newSession(problemId: string): SessionState {
  const now = new Date().toISOString();
  return {
    sessionId: `session-${Date.now()}`,
    problemId,
    stage: "warmup",
    startedAt: now,
    updatedAt: now,
    warmup: { completed: false, transcript: [] },
    interview: { completed: false, hintsUsed: 0, transcript: [], readyToCode: false },
    coding: { code: "", attempts: 0, testsPassed: 0, testsFailed: 0, solved: false },
    reflection: { completed: false },
  };
}

export function SessionFlow({ problem }: { problem: Problem }) {
  const { setHidden } = useNavVisibility();
  const [journey, setJourney] = useState<JourneyState>(DEFAULT_JOURNEY);
  const [session, setSession] = useState<SessionState | null>(null);
  const [resumeCandidate, setResumeCandidate] = useState<SessionState | null>(null);
  const [insight, setInsight] = useState<InsightCard | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [j, resumable] = await Promise.all([getJourney(), getLatestIncompleteSession()]);
      setJourney(j);
      if (resumable && resumable.problemId === problem.id) {
        setResumeCandidate(resumable);
      }
      setLoaded(true);
    })();
  }, [problem.id]);

  useEffect(() => {
    const inSession = !!session && session.stage !== "complete";
    setHidden(inSession);
    return () => setHidden(false);
  }, [session, setHidden]);

  function persist(next: SessionState) {
    const updated = { ...next, updatedAt: new Date().toISOString() };
    setSession(updated);
    saveSession(updated);
  }

  function start() {
    setResumeCandidate(null);
    persist(newSession(problem.id));
  }

  function resume() {
    if (resumeCandidate) setSession(resumeCandidate);
  }

  if (!loaded) {
    return <div className="flex min-h-screen items-center justify-center text-text-dim">…</div>;
  }

  if (!session) {
    return (
      <MissionCard
        problem={problem}
        streak={journey.streak}
        whyThisProblem={
          journey.totalSolved === 0
            ? "This is your first mission. Two Sum is the cleanest way to feel the whole loop — warm-up, interview, code, and an insight you'll actually remember."
            : "You've been building pattern recognition. Today's session sharpens exactly that, one small step at a time."
        }
        resumeAvailable={!!resumeCandidate}
        onStart={start}
        onResume={resume}
      />
    );
  }

  return (
    <div>
      {["warmup", "concept", "note", "interview", "coding"].includes(session.stage) && (
        <div className="mx-auto flex max-w-2xl justify-center pt-6">
          <StageProgress stage={session.stage} />
        </div>
      )}

      {session.stage === "warmup" && (
        <WarmUp
          problem={problem}
          onComplete={(transcript) => {
            const understood = recognizedPattern(transcript, problem.patternKeywords);
            persist({
              ...session,
              stage: understood ? "note" : "concept",
              warmup: { completed: true, transcript },
            });
          }}
        />
      )}

      {session.stage === "concept" && (
        <ConceptExplainer problem={problem} onComplete={() => persist({ ...session, stage: "note" })} />
      )}

      {session.stage === "note" && (
        <NoteScreen problem={problem} onComplete={() => persist({ ...session, stage: "interview" })} />
      )}

      {session.stage === "interview" && (
        <Interview
          problem={problem}
          onComplete={(transcript, hintsUsed) =>
            persist({
              ...session,
              stage: "coding",
              interview: { completed: true, hintsUsed, transcript, readyToCode: true },
            })
          }
        />
      )}

      {session.stage === "coding" && (
        <CodeEditor
          problem={problem}
          onSolved={(code, attempts) =>
            persist({
              ...session,
              stage: "solved",
              coding: {
                code,
                attempts,
                testsPassed: problem.visibleTests.length + problem.hiddenTests.length,
                testsFailed: 0,
                solved: true,
              },
            })
          }
        />
      )}

      {session.stage === "solved" && (
        <Victory problem={problem} onContinue={() => persist({ ...session, stage: "reflection" })} />
      )}

      {session.stage === "reflection" && (
        <Reflection
          problem={problem}
          onComplete={async (answer) => {
            const newStreak = computeNewStreak(journey.streak, journey.lastActiveDate, new Date());
            const mastery = journey.patternMastery[problem.patterns[0]] ?? 0;
            const updatedJourney: JourneyState = {
              streak: newStreak,
              bestStreak: Math.max(journey.bestStreak, newStreak),
              lastActiveDate: new Date().toISOString().slice(0, 10),
              totalSolved: journey.totalSolved + 1,
              patternMastery: {
                ...journey.patternMastery,
                [problem.patterns[0]]: Math.min(1, mastery + 0.2),
              },
              solvedProblemIds: Array.from(new Set([...journey.solvedProblemIds, problem.id])),
            };

            const card: InsightCard = {
              id: `insight-${Date.now()}`,
              problemId: problem.id,
              pattern: problem.patterns[0],
              text: problem.insightTemplate,
              complexityTime: problem.timeComplexity,
              complexitySpace: problem.spaceComplexity,
              createdAt: new Date().toISOString(),
            };

            const review = scheduleFirstReview(problem.id, problem.patterns[0]);

            await Promise.all([
              saveJourney(updatedJourney),
              addInsight(card),
              upsertReview(review),
            ]);

            setJourney(updatedJourney);
            setInsight(card);
            persist({ ...session, stage: "complete", reflection: { completed: true, answer } });
          }}
        />
      )}

      {session.stage === "complete" && insight && (
        <InsightReveal
          problem={problem}
          insight={insight}
          streak={journey.streak}
          nextReviewLabel="tomorrow"
          onDone={() => setSession(null)}
        />
      )}
    </div>
  );
}
