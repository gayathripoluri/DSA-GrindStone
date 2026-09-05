import { NextRequest, NextResponse } from "next/server";
import { ollamaChat } from "@/lib/ollama";
import { warmUpMessages, interviewMessages, reflectionFeedbackMessages } from "@/lib/prompts";
import { rejectCrossOrigin } from "@/lib/require-same-origin";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { readJsonLimited, PayloadTooLargeError } from "@/lib/read-json-limited";
import { PROBLEMS } from "@/data/problems";
import type { InterviewTurn } from "@/lib/types";

const MAX_BODY_BYTES = 50_000; // generous for a multi-turn conversation transcript

export async function POST(req: NextRequest) {
  const blocked = rejectCrossOrigin(req);
  if (blocked) return blocked;

  const { allowed, retryAfterSeconds } = rateLimit(`ai:${clientKey(req)}`, {
    limit: 20,
    windowMs: 60_000,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await readJsonLimited(req, MAX_BODY_BYTES)) as Record<string, unknown>;
  } catch (err) {
    if (err instanceof PayloadTooLargeError) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }
  const { mode, problemId } = body as { mode?: string; problemId?: string };

  const problem = problemId ? PROBLEMS[problemId] : undefined;
  if (!problem) {
    return NextResponse.json({ error: "Unknown problem" }, { status: 400 });
  }

  try {
    let messages;
    switch (mode) {
      case "warmup": {
        const { stepIndex, transcript, answer } = body as {
          stepIndex: number;
          transcript: { prompt: string; answer: string }[];
          answer: string;
        };
        messages = warmUpMessages(problem, stepIndex, transcript, answer);
        break;
      }
      case "interview": {
        const { transcript } = body as { transcript: InterviewTurn[] };
        messages = interviewMessages(problem, transcript);
        break;
      }
      case "reflection": {
        const { answer } = body as { answer: string };
        messages = reflectionFeedbackMessages(problem, answer);
        break;
      }
      default:
        return NextResponse.json({ error: "Unknown mode" }, { status: 400 });
    }

    const reply = await ollamaChat(messages);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "AI backend unavailable. Is Ollama running (`ollama serve`)?" },
      { status: 503 }
    );
  }
}
