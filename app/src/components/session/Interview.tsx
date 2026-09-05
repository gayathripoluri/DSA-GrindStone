"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { DictationTextarea } from "@/components/ui/DictationTextarea";
import { useSpeechSynthesis } from "@/lib/speech/useSpeechSynthesis";
import type { InterviewTurn, Problem } from "@/lib/types";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function Interview({
  problem,
  onComplete,
}: {
  problem: Problem;
  onComplete: (transcript: InterviewTurn[], hintsUsed: number) => void;
}) {
  const [transcript, setTranscript] = useState<InterviewTurn[]>([
    { role: "interviewer", text: "Walk me through your approach." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  // Off by default — the back-and-forth here is fast, and not every line
  // needs to be spoken aloud. Voice narration is reserved for moments where
  // it actually adds something (a hint walkthrough while coding, the recap
  // after solving); this toggle stays available for anyone who wants the
  // full interview read aloud, but it's opt-in, not automatic.
  const [speakEnabled, setSpeakEnabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { supported: ttsSupported, speaking, speak, cancel } = useSpeechSynthesis();
  const lastSpokenIndex = useRef(-1);

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [transcript]);

  // Read new interviewer lines aloud. This speaks exactly what's already on
  // screen — the "never give away the solution" rule lives in the prompt
  // (prompts.ts), not here, so voice mode can't accidentally say more than
  // the text mode already would.
  useEffect(() => {
    if (!speakEnabled || !ttsSupported) return;
    const last = transcript.length - 1;
    if (last <= lastSpokenIndex.current) return;
    const turn = transcript[last];
    if (turn.role === "interviewer") speak(turn.text);
    lastSpokenIndex.current = last;
  }, [transcript, speakEnabled, ttsSupported, speak]);

  async function send() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    const next: InterviewTurn[] = [...transcript, { role: "user", text }];
    setTranscript(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "interview", problemId: problem.id, transcript: next }),
      });
      const data = await res.json();
      const reply = data.reply ?? "Go on.";
      setTranscript((t) => [...t, { role: "interviewer", text: reply }]);
    } catch {
      setTranscript((t) => [...t, { role: "interviewer", text: "Go on." }]);
    } finally {
      setLoading(false);
    }
  }

  function useHint() {
    if (hintsUsed >= problem.hints.length) return;
    const hint = problem.hints[hintsUsed];
    setTranscript((t) => [...t, { role: "interviewer", text: hint }]);
    setHintsUsed((h) => h + 1);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-0px)] max-w-2xl flex-col px-6 py-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-text-dim">
          Interview
        </div>
        <div className="flex items-center gap-3">
          {ttsSupported && (
            <button
              onClick={() => {
                if (speakEnabled) cancel();
                setSpeakEnabled((v) => !v);
              }}
              title={speakEnabled ? "Mute the interviewer" : "Let the interviewer talk"}
              className={`text-sm ${speaking ? "text-accent" : "text-text-dim"} hover:text-text`}
            >
              {speakEnabled ? "🔊" : "🔇"}
            </button>
          )}
          <div className="font-mono text-sm text-text-dim">{formatTime(elapsed)}</div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pb-4">
        {transcript.map((turn, i) => (
          <div key={i}>
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-text-dim">
              {turn.role === "interviewer" ? "Interviewer" : "You"}
            </div>
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                turn.role === "interviewer"
                  ? "bg-surface text-text"
                  : "ml-auto bg-accent text-[#0b0c0f]"
              }`}
            >
              {turn.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-text-dim">…</div>}
      </div>

      <div className="mt-2 flex flex-col gap-3 border-t border-border pt-4">
        <DictationTextarea
          value={input}
          onChange={setInput}
          onSubmit={send}
          placeholder="I'm thinking... (or tap the mic and just talk it through)"
          rows={2}
          disabled={loading}
        />
        <div className="flex items-center justify-between">
          <button
            onClick={useHint}
            disabled={hintsUsed >= problem.hints.length}
            className="text-xs text-text-dim underline decoration-dotted hover:text-text disabled:opacity-40"
          >
            I&rsquo;m stuck
          </button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={send} disabled={loading || !input.trim()}>
              Send
            </Button>
            <Button onClick={() => onComplete(transcript, hintsUsed)}>
              I&rsquo;m ready to code →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
