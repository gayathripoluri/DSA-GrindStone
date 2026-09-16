"use client";

import { useRef } from "react";
import { useSpeechRecognition } from "@/lib/speech/useSpeechRecognition";

export function DictationTextarea({
  value,
  onChange,
  onSubmit,
  placeholder,
  rows = 3,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  /** Enter (without shift) triggers this, matching the app's existing textareas. */
  onSubmit?: () => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}) {
  // Snapshot of the text as it stood before the current dictation burst, so
  // interim (not-yet-final) speech can be shown live without stacking on
  // top of itself as recognition keeps refining the same phrase.
  const baseRef = useRef(value);

  const { supported, listening, start, stop, error } = useSpeechRecognition(
    (finalText) => {
      baseRef.current = baseRef.current ? `${baseRef.current} ${finalText}` : finalText;
      onChange(baseRef.current);
    },
    (interimText) => {
      if (!interimText) return;
      onChange(baseRef.current ? `${baseRef.current} ${interimText}` : interimText);
    }
  );

  function toggleMic() {
    if (listening) {
      stop();
    } else {
      baseRef.current = value;
      start();
    }
  }

  return (
    <div>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => {
            baseRef.current = e.target.value;
            onChange(e.target.value);
          }}
          onKeyDown={(e) => {
            if (onSubmit && e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`w-full resize-none rounded-xl border bg-surface px-4 py-3 text-sm text-text placeholder:text-text-dim focus:outline-none ${
            supported ? "pr-12" : ""
          } ${listening ? "border-accent" : "border-border focus:border-accent"}`}
        />
        {supported && (
          <button
            type="button"
            onClick={toggleMic}
            disabled={disabled}
            title={listening ? "Stop dictating" : "Speak your answer"}
            className={`absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full border text-sm transition-colors disabled:opacity-40 ${
              listening
                ? "border-accent bg-accent/20 text-accent animate-pulse"
                : "border-border bg-surface-2 text-text-dim hover:text-text"
            }`}
          >
            {listening ? "●" : "🎤"}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
