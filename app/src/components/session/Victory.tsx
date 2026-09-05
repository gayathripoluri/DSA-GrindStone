"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Problem } from "@/lib/types";

export function Victory({ problem, onContinue }: { problem: Problem; onContinue: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setShow(true), 150);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <div
        className={`transition-all duration-500 ${
          show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <div className="text-3xl">✨</div>
        <div className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-text-dim">
          Solved
        </div>
        <div className="mt-2 text-3xl font-semibold text-text">{problem.title}</div>
        <p className="mt-3 text-sm text-text-dim">You figured it out.</p>

        <Button onClick={onContinue} className="mt-10">
          Continue →
        </Button>
      </div>
    </div>
  );
}
