"use client";

import type { SessionStage } from "@/lib/types";

const STAGES: { key: SessionStage; label: string }[] = [
  { key: "warmup", label: "Warm-up" },
  { key: "concept", label: "Concept" },
  { key: "note", label: "Note" },
  { key: "interview", label: "Interview" },
  { key: "coding", label: "Code" },
  { key: "reflection", label: "Reflect" },
];

export function StageProgress({ stage }: { stage: SessionStage }) {
  const currentIndex = STAGES.findIndex((s) => s.key === stage);

  return (
    <div className="flex items-center gap-2">
      {STAGES.map((s, i) => {
        const done = currentIndex > i || stage === "complete";
        const active = i === currentIndex;
        return (
          <div key={s.key} className="flex items-center gap-2">
            <div
              className={`h-1.5 w-8 rounded-full transition-colors sm:w-12 ${
                done ? "bg-accent" : active ? "bg-text-dim" : "bg-border"
              }`}
              title={s.label}
            />
          </div>
        );
      })}
    </div>
  );
}
