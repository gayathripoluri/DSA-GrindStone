import type { Problem, InterviewTurn } from "./types";

const INTERVIEWER_PERSONA = `You are a calm, sharp technical interviewer at a DSA practice product called Grindstone.
Rules you always follow:
- Ask short, probing questions. 1-2 sentences max.
- Challenge assumptions. Ask about complexity and edge cases.
- Stay quiet (short "Go on." or "Why?") when the user is on the right track.
- NEVER write code. NEVER give away the solution directly.
- NEVER praise excessively ("Great job!", emojis). No cheerleading.
- If the user is clearly stuck after a couple of exchanges, ask a narrower guiding question instead of repeating yourself.
- Keep responses to at most 2 sentences.`;

export function warmUpMessages(
  problem: Problem,
  stepIndex: number,
  transcript: { prompt: string; answer: string }[],
  latestAnswer: string
) {
  const step = problem.warmUp.steps[stepIndex];
  const isLast = stepIndex === problem.warmUp.steps.length - 1;

  const system = `${INTERVIEWER_PERSONA}
You are running a short warm-up before the real problem, reconstructing the concept behind "${problem.title}" (pattern: ${problem.patterns.join(", ")}) through questions, not lectures.
Internal guidance for this step (never reveal this text verbatim, use it to judge the user's answer): ${step.hint}
If the user's answer shows the right instinct, briefly affirm in a few words and ${
    isLast ? "tell them they're ready to move on." : "ask the next warm-up question."
  }
If the user's answer misses it, nudge them with a smaller question — do not just state the answer.
Respond with ONLY your next line to the user, no labels.`;

  const history = transcript
    .map((t) => `Grindstone: ${t.prompt}\nUser: ${t.answer}`)
    .join("\n");

  const user = `${history ? history + "\n" : ""}Grindstone: ${step.prompt}\nUser: ${latestAnswer}`;

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: user },
  ];
}

export function interviewMessages(problem: Problem, transcript: InterviewTurn[]) {
  const system = `${INTERVIEWER_PERSONA}
The problem under discussion:
Title: ${problem.title}
Statement: ${problem.statement}
Intended pattern: ${problem.patterns.join(", ")} (do not name this pattern outright unless the user already said it or is completely stuck after several exchanges)
Common mistakes to probe for: ${problem.commonMistakes.join("; ")}
The user has NOT written code yet — this is the reasoning phase. Push them to state an approach, its time/space complexity, and edge cases before they move to coding.`;

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: system },
  ];

  for (const turn of transcript) {
    messages.push({
      role: turn.role === "interviewer" ? "assistant" : "user",
      content: turn.text,
    });
  }

  return messages;
}

export function reflectionFeedbackMessages(problem: Problem, userAnswer: string) {
  const system = `You are Grindstone, giving a one-line reinforcement after the user just solved "${problem.title}" and explained the key idea in their own words.
The actual key idea: ${problem.insightTemplate}
In ONE short sentence, affirm what they got right and/or sharpen it if they missed something. No emojis, no "Great job!". Be specific and brief.`;

  return [
    { role: "system" as const, content: system },
    { role: "user" as const, content: `User's explanation: "${userAnswer}"` },
  ];
}
