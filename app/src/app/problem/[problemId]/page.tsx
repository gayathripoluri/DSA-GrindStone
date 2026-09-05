"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SessionFlow } from "@/components/session/SessionFlow";
import { PROBLEMS } from "@/data/problems";

export default function ProblemPage() {
  const { problemId } = useParams<{ problemId: string }>();
  const problem = PROBLEMS[problemId];

  if (!problem) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <h1 className="text-lg font-semibold text-text">Problem not found</h1>
        <p className="mt-2 text-sm text-text-dim">
          &ldquo;{problemId}&rdquo; doesn&rsquo;t exist yet.
        </p>
        <Link href="/journey" className="mt-6 text-sm text-accent underline decoration-dotted">
          Back to Journey
        </Link>
      </main>
    );
  }

  return <SessionFlow problem={problem} />;
}
