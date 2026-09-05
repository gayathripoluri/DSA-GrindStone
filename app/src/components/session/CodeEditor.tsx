"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { Button } from "@/components/ui/Button";
import type { Problem } from "@/lib/types";

interface TestResult {
  input: string;
  expected: string;
  actual: string;
  stderr: string;
  passed: boolean;
  hidden: boolean;
}

interface RunResponse {
  results?: TestResult[];
  passed?: number;
  total?: number;
  allPassed?: boolean;
  compileError?: string;
  error?: string;
}

export function CodeEditor({
  problem,
  onSolved,
}: {
  problem: Problem;
  onSolved: (finalCode: string, attempts: number) => void;
}) {
  const [code, setCode] = useState(problem.starterCode);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResponse | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [investigation, setInvestigation] = useState("");
  const [showInvestigate, setShowInvestigate] = useState(false);

  async function run(includeHidden: boolean) {
    setRunning(true);
    setResult(null);
    setShowInvestigate(false);
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: problem.id, code, includeHidden }),
      });
      const data: RunResponse = await res.json();
      setResult(data);
      setAttempts((a) => a + 1);

      if (includeHidden) {
        if (data.allPassed) {
          onSolved(code, attempts + 1);
        } else {
          setShowInvestigate(true);
        }
      } else if (data.results && !data.results.every((r) => r.passed)) {
        setShowInvestigate(true);
      }
    } catch {
      setResult({ error: "Could not reach the execution service. Try again." });
    } finally {
      setRunning(false);
    }
  }

  const firstFailure = result?.results?.find((r) => !r.passed);

  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-[380px_1fr]">
      <div className="overflow-y-auto border-b border-border bg-surface p-6 lg:border-b-0 lg:border-r">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-text-dim">
          {problem.title}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text">{problem.statement}</p>

        <div className="mt-6 text-xs font-semibold uppercase tracking-wide text-text-dim">
          Examples
        </div>
        {problem.examples.map((ex, i) => (
          <div key={i} className="mt-2 rounded-lg bg-surface-2 p-3 font-mono text-xs text-text-dim">
            <div>Input: {ex.input}</div>
            <div>Output: {ex.output}</div>
          </div>
        ))}

        <div className="mt-6 text-xs font-semibold uppercase tracking-wide text-text-dim">
          Constraints
        </div>
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-text-dim">
          {problem.constraints.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-text-dim">
            Code
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => run(false)} disabled={running}>
              {running ? "Running…" : "Run Code"}
            </Button>
            <Button onClick={() => run(true)} disabled={running}>
              Submit
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <CodeMirror
            value={code}
            height="100%"
            theme="dark"
            extensions={[cpp()]}
            onChange={(v) => setCode(v)}
            style={{ height: "100%", fontSize: 13 }}
          />
        </div>

        <div className="max-h-64 overflow-y-auto border-t border-border bg-surface p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-text-dim">
            Test Results
          </div>

          {result?.error && <div className="mt-2 text-sm text-danger">{result.error}</div>}
          {result?.compileError && (
            <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-surface-2 p-3 font-mono text-xs text-danger">
              {result.compileError}
            </pre>
          )}

          {result?.results && (
            <div className="mt-2 space-y-2">
              <div className="text-sm text-text-dim">
                {result.passed} / {result.total} tests passed
              </div>
              {result.results.map((r, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-3 font-mono text-xs ${
                    r.passed ? "border-success/30 bg-success/5" : "border-danger/30 bg-danger/5"
                  }`}
                >
                  <div className={r.passed ? "text-success" : "text-danger"}>
                    {r.passed ? "✓ Passed" : "✕ Failed"} {r.hidden ? "(hidden)" : ""}
                  </div>
                  {!r.hidden && !r.passed && (
                    <>
                      <div className="mt-1 text-text-dim">Input: {r.input.replace(/\n/g, " / ")}</div>
                      <div className="text-text-dim">Expected: {r.expected}</div>
                      <div className="text-text-dim">Your output: {r.actual || "(empty)"}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {showInvestigate && firstFailure && (
            <div className="mt-4 rounded-lg border border-border bg-surface-2 p-4">
              <div className="text-sm text-text">⚠ Something&rsquo;s off. What do you think happened?</div>
              <textarea
                value={investigation}
                onChange={(e) => setInvestigation(e.target.value)}
                placeholder="I think the issue is..."
                rows={2}
                className="mt-2 w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-dim focus:border-accent focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
