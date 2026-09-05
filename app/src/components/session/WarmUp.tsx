"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DictationTextarea } from "@/components/ui/DictationTextarea";
import type { Problem } from "@/lib/types";

interface Bubble {
  from: "grindstone" | "user";
  text: string;
}

export function WarmUp({
  problem,
  onComplete,
}: {
  problem: Problem;
  onComplete: (transcript: { prompt: string; answer: string }[]) => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([
    { from: "grindstone", text: problem.warmUp.intro },
    { from: "grindstone", text: problem.warmUp.steps[0].prompt },
  ]);
  const [transcript, setTranscript] = useState<{ prompt: string; answer: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const isLastStep = stepIndex === problem.warmUp.steps.length - 1;

  async function handleSubmit() {
    if (!input.trim() || loading) return;
    const answer = input.trim();
    const step = problem.warmUp.steps[stepIndex];
    setBubbles((b) => [...b, { from: "user", text: answer }]);
    setInput("");
    setLoading(true);

    const newTranscript = [...transcript, { prompt: step.prompt, answer }];

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "warmup",
          problemId: problem.id,
          stepIndex,
          transcript,
          answer,
        }),
      });
      const data = await res.json();
      const reply = data.reply ?? "Go on.";
      setBubbles((b) => [...b, { from: "grindstone", text: reply }]);
      setTranscript(newTranscript);

      if (isLastStep) {
        // Component unmounts on completion; leave `loading` true so the
        // (about-to-disappear) input can't be submitted again in the meantime.
        setTimeout(() => onComplete(newTranscript), 900);
      } else {
        setTimeout(() => {
          setStepIndex((i) => i + 1);
          setBubbles((b) => [
            ...b,
            { from: "grindstone", text: problem.warmUp.steps[stepIndex + 1].prompt },
          ]);
          setLoading(false);
        }, 600);
      }
    } catch {
      setBubbles((b) => [
        ...b,
        { from: "grindstone", text: "Go on. What would that look like?" },
      ]);
      setTranscript(newTranscript);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col px-6 py-12">
      <div className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-text-dim">
        Quick warm-up
      </div>

      <div className="flex flex-col gap-3">
        {bubbles.map((b, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              b.from === "grindstone"
                ? "self-start bg-surface text-text"
                : "self-end bg-accent text-[#0b0c0f]"
            }`}
          >
            {b.text}
          </div>
        ))}
        {loading && (
          <div className="self-start rounded-2xl bg-surface px-4 py-3 text-sm text-text-dim">
            …
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <DictationTextarea
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          placeholder="I would probably... (or tap the mic and just talk it through)"
          rows={3}
          disabled={loading}
        />
        <Button onClick={handleSubmit} disabled={loading || !input.trim()} className="self-end">
          Continue →
        </Button>
      </div>
    </div>
  );
}
