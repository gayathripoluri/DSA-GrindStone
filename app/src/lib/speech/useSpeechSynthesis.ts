"use client";

import { useCallback, useState } from "react";

/**
 * Thin wrapper around the browser's native SpeechSynthesis API. Free, no API
 * key, works fully offline in the browser.
 */
export function useSpeechSynthesis() {
  const [supported] = useState(
    () => typeof window !== "undefined" && "speechSynthesis" in window
  );
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback(
    (text: string) => {
      if (!supported) return;
      // Defensive: the interviewer persona is already instructed never to
      // write code or hand over the solution — this just makes sure that if
      // it ever slips and emits a fenced code block anyway, we don't read
      // source code aloud as if it were a sentence.
      const clean = text.replace(/```[\s\S]*?```/g, "").trim();
      if (!clean) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    [supported]
  );

  const cancel = useCallback(() => {
    if (supported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return { supported, speaking, speak, cancel };
}
