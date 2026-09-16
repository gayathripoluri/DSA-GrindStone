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
  const [error, setError] = useState<string | null>(null);
  // Refs so the recognition instance doesn't need to be recreated whenever
  // the caller passes a new inline callback (they usually will, every render).
  const onFinalRef = useRef(onFinalResult);
  const onInterimRef = useRef(onInterimResult);
  onFinalRef.current = onFinalResult;
  onInterimRef.current = onInterimResult;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  // Whether the user still wants dictation running — separate from
  // `listening`/the browser's own state, so the auto-restart below (see
  // onend) isn't mistaken for a fresh user-initiated start.
  const activeRef = useRef(false);
  // Some browsers (seen when the mic is blocked at the OS level, or there's
  // no device at all) never fire onresult *or* onerror — recognition just
  // sits "listening" forever with no signal of any kind. Neither onend nor
  // onerror can catch that, so this is a plain timer: if no result has
  // arrived by the deadline, treat it as stuck and say so instead of
  // leaving the mic pulsing with no explanation.
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const armWatchdog = useCallback(() => {
    if (watchdogRef.current) clearTimeout(watchdogRef.current);
    watchdogRef.current = setTimeout(() => {
      watchdogRef.current = null;
      if (!activeRef.current) return;
      activeRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      setListening(false);
      setError("Didn't catch any audio — check that your mic is connected and this site has microphone permission.");
    }, 8000);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    setSupported(true);

    const recognition = new Ctor();
    // Safari's `continuous: true` is broken — it never fires onresult, so
    // the mic just sits "listening" forever with no transcript. Chrome
    // handles continuous mode fine, but chaining single-shot recognitions
    // (restart on every onend) works reliably on both, so use that instead
    // of relying on the browser's own continuous mode.
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      // Any result at all — even interim — proves the mic and the
      // recognition service are actually working, so the "stuck" watchdog
      // no longer applies to this utterance.
      if (watchdogRef.current) {
        clearTimeout(watchdogRef.current);
        watchdogRef.current = null;
      }
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
    recognition.onend = () => {
      if (activeRef.current) {
        // One utterance ended (a pause, or a final result) but the user
        // hasn't tapped stop — restart immediately so dictation feels
        // continuous instead of stopping after every sentence.
        try {
          recognition.start();
          armWatchdog();
          return;
        } catch {
          // fall through to marking not-listening
        }
      }
      if (watchdogRef.current) {
        clearTimeout(watchdogRef.current);
        watchdogRef.current = null;
      }
      setListening(false);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      // 'no-speech' just means the pause was too long — onend fires right
      // after and the restart above picks dictation back up. Anything else
      // (blocked mic, no mic, network) should actually stop and say why,
      // instead of leaving the mic pulsing with no visible explanation.
      if (event.error === "no-speech") return;
      if (watchdogRef.current) {
        clearTimeout(watchdogRef.current);
        watchdogRef.current = null;
      }
      activeRef.current = false;
      setListening(false);
      // Logged so the real cause is checkable in DevTools without having to
      // reproduce it again — `event.error` is one of the SpeechRecognitionErrorEvent
      // codes (not-allowed, audio-capture, network, aborted, language-not-supported, ...).
      console.warn("[speech] recognition error:", event.error, event.message || "");
      const KNOWN_MESSAGES: Record<string, string> = {
        "not-allowed": "Microphone access is blocked — check your browser's site permissions.",
        "service-not-allowed": "Microphone access is blocked — check your browser's site permissions.",
        "audio-capture": "No microphone found.",
        network:
          "Couldn't reach the speech recognition service — check your internet connection (Chrome/Safari send audio to a cloud service, so dictation needs network access even though the rest of the app is local).",
        aborted: "Dictation was interrupted — tap the mic to try again.",
      };
      // Include the raw code for anything not in the known-friendly list above,
      // so an unexpected code is diagnosable straight from the UI, no DevTools
      // needed — remove the parenthetical once the real cause here is confirmed.
      setError(KNOWN_MESSAGES[event.error] ?? `Dictation stopped unexpectedly (${event.error}) — try again.`);
    };

    recognitionRef.current = recognition;
    return () => {
      activeRef.current = false;
      if (watchdogRef.current) {
        clearTimeout(watchdogRef.current);
        watchdogRef.current = null;
      }
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      try {
        recognition.stop();
      } catch {
        // ignore — already stopped
      }
    };
  }, [armWatchdog]);

  const start = useCallback(() => {
    if (!recognitionRef.current || listening) return;
    setError(null);
    activeRef.current = true;
    try {
      recognitionRef.current.start();
      setListening(true);
      armWatchdog();
    } catch {
      // start() throws if called while already running — safe to ignore
    }
  }, [listening, armWatchdog]);

  const stop = useCallback(() => {
    activeRef.current = false;
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
    setListening(false);
  }, []);

  return { supported, listening, start, stop, error };
}
