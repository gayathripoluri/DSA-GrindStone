import { NextRequest, NextResponse } from "next/server";
import { compileCpp, runBinary, cleanup } from "@/lib/cpp-runner";
import { rejectCrossOrigin } from "@/lib/require-same-origin";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { readJsonLimited, PayloadTooLargeError } from "@/lib/read-json-limited";
import { acquireSandboxSlot } from "@/lib/sandbox-queue";
import { PROBLEMS } from "@/data/problems";

const MAX_BODY_BYTES = 100_000; // generous for any real C++ solution

export async function POST(req: NextRequest) {
  const blocked = rejectCrossOrigin(req);
  if (blocked) return blocked;

  const { allowed, retryAfterSeconds } = rateLimit(`execute:${clientKey(req)}`, {
    limit: 10,
    windowMs: 60_000,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  let body: { problemId?: string; code?: string; includeHidden?: boolean };
  try {
    body = (await readJsonLimited(req, MAX_BODY_BYTES)) as typeof body;
  } catch (err) {
    if (err instanceof PayloadTooLargeError) {
      return NextResponse.json({ error: "Submission too large." }, { status: 413 });
    }
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }
  const { problemId, code, includeHidden } = body;

  const problem = problemId ? PROBLEMS[problemId] : undefined;
  if (!problem || typeof code !== "string") {
    return NextResponse.json({ error: "Unknown problem" }, { status: 400 });
  }

  const tests = [
    ...problem.visibleTests,
    ...(includeHidden ? problem.hiddenTests : []),
  ];

  let releaseSlot: (() => void) | null = null;
  try {
    releaseSlot = await acquireSandboxSlot();
  } catch {
    return NextResponse.json(
      { error: "The judge is busy right now. Please try again in a few seconds." },
      { status: 503 }
    );
  }

  try {
    let compiled;
    try {
      compiled = await compileCpp(code);
    } catch (err) {
      console.error(err);
      return NextResponse.json(
        { error: "No C++ compiler available on this machine." },
        { status: 503 }
      );
    }

    try {
      if (compiled.compileError) {
        return NextResponse.json({ compileError: compiled.compileError });
      }

      const results = [];
      for (const test of tests) {
        const run = await runBinary(compiled, test.input);
        const actual = run.stdout.trim();
        const expected = test.expected.trim();
        results.push({
          input: test.input,
          expected,
          actual,
          stderr: run.stderr,
          passed: actual === expected,
          hidden: test.hidden ?? false,
        });
      }

      const passed = results.filter((r) => r.passed).length;
      return NextResponse.json({
        results,
        passed,
        total: results.length,
        allPassed: passed === results.length,
      });
    } finally {
      await cleanup(compiled.dir);
    }
  } finally {
    releaseSlot();
  }
}
