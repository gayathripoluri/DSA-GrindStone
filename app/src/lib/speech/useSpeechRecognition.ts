"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Thin wrapper around the browser's native Web Speech API (SpeechRecognition).
 * Free, no API key, runs in the browser — Chrome and Safari support it,
 * Firefox doesn't (falls back to `supported: false`, mic button hides itself).
 */
export function useSpeechRecognition(
  onFinalResult: (text: string) => void,
  onInterimResult?: (text: string) => void
) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  // Refs so the recognition instance doesn't need to be recreated whenever
  // the caller passes a new inline callback (they usually will, every render).
  const onFinalRef = useRef(onFinalResult);
  const onInterimRef = useRef(onInterimResult);
  onFinalRef.current = onFinalResult;
  onInterimRef.current = onInterimResult;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    setSupported(true);

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else interimText += result[0].transcript;
      }
      if (finalText.trim()) onFinalRef.current(finalText.trim());
      onInterimRef.current?.(interimText);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      try {
        recognition.stop();
      } catch {
        // ignore — already stopped
      }
    };
  }, []);

  const start = useCallback(() => {
    if (!recognitionRef.current || listening) return;
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      // start() throws if called while already running — safe to ignore
    }
  }, [listening]);

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
    setListening(false);
  }, []);

  return { supported, listening, start, stop };
}
