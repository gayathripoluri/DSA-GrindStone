import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import path from "node:path";

const MAX_OUTPUT_BYTES = 200_000;

// Real GCC (used inside the sandbox image) ships `bits/stdc++.h` natively.
// Apple's clang (the local-fallback compiler) doesn't, so this shim exists
// only for that path — see ensureBitsShim() below.
const SANDBOX_IMAGE = "gcc:13";

// Docker Desktop / Colima on macOS only auto-mount the user's home directory
// into the VM that actually runs containers — a system temp dir
// (os.tmpdir(), under /var/folders or /tmp) is invisible from inside a
// container, so bind-mounted work directories must live under $HOME instead.
// This only matters for the sandboxed path, but it's used unconditionally
// here to keep one code path instead of branching the temp-dir strategy.
const WORK_ROOT = path.join(homedir(), ".grindstone-sandbox");

interface ProcResult {
  stdout: string;
  stderr: string;
  code: number | null;
  timedOut: boolean;
}

function runProcess(
  cmd: string,
  args: string[],
  opts: { input?: string; timeoutMs: number }
): Promise<ProcResult> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, opts.timeoutMs);

    child.stdout.on("data", (chunk) => {
      if (stdout.length < MAX_OUTPUT_BYTES) stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      if (stderr.length < MAX_OUTPUT_BYTES) stderr += chunk.toString();
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      // This is a spawn-level failure (e.g. the binary/command itself wasn't
      // found), not the user's program producing stderr — log the real
      // error server-side, but don't hand raw Node/OS error details
      // (potentially including local file paths) back to the client.
      console.error(`[cpp-runner] spawn error for "${cmd}":`, err);
      resolve({ stdout, stderr: "Execution failed unexpectedly.", code: -1, timedOut });
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, code, timedOut });
    });

    if (opts.input !== undefined) {
      child.stdin.write(opts.input);
    }
    child.stdin.end();
  });
}

// --- Docker availability ---
//
// Deliberately re-checked on every call rather than cached for the life of
// the server process: Docker/Colima can go up or down between requests (the
// daemon crashing, the VM not being started yet, `colima stop`, etc.), and a
// stale "yes it's available" would send every subsequent `docker run` into a
// hard failure instead of the graceful host fallback. The check itself is a
// fast local socket call (tens of ms), so re-running it per request is cheap
// relative to the container startup cost that follows when it succeeds.
// Only the "is the image already pulled" state is safe to cache — images
// don't disappear on their own — and `docker run` would auto-pull it anyway
// as a backstop if this cache is ever wrong.
let imagePulled = false;

async function checkDocker(): Promise<boolean> {
  const version = await runProcess("docker", ["version", "--format", "{{.Server.Version}}"], {
    timeoutMs: 3000,
  });
  if (version.code !== 0) {
    console.warn(
      "[cpp-runner] Docker not reachable — running this submission directly on the host with " +
        "NO sandbox (fine for local single-user use only). Install Docker or run " +
        "`colima start` before exposing this app beyond your own machine."
    );
    return false;
  }

  if (!imagePulled) {
    const inspect = await runProcess("docker", ["image", "inspect", SANDBOX_IMAGE], {
      timeoutMs: 5000,
    });
    if (inspect.code !== 0) {
      console.warn(`[cpp-runner] Pulling sandbox image ${SANDBOX_IMAGE} (one-time)...`);
      const pull = await runProcess("docker", ["pull", SANDBOX_IMAGE], { timeoutMs: 300_000 });
      if (pull.code !== 0) {
        console.warn("[cpp-runner] Failed to pull sandbox image — falling back to unsandboxed host execution.");
        return false;
      }
    }
    imagePulled = true;
  }
  return true;
}

// --- Local-fallback-only: bits/stdc++.h shim for Apple clang ---

const BITS_SHIM_ROOT = path.join(tmpdir(), "grindstone-bits-shim");
const BITS_SHIM_CONTENT = `#pragma once
#include <algorithm>
#include <bitset>
#include <cmath>
#include <cstdint>
#include <cstring>
#include <deque>
#include <functional>
#include <iomanip>
#include <iostream>
#include <limits>
#include <list>
#include <map>
#include <numeric>
#include <queue>
#include <set>
#include <sstream>
#include <stack>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <vector>
`;

let bitsShimReady: Promise<string> | null = null;

async function ensureBitsShim(): Promise<string> {
  if (!bitsShimReady) {
    bitsShimReady = (async () => {
      const bitsDir = path.join(BITS_SHIM_ROOT, "bits");
      await mkdir(bitsDir, { recursive: true });
      await writeFile(path.join(bitsDir, "stdc++.h"), BITS_SHIM_CONTENT, "utf8");
      return BITS_SHIM_ROOT;
    })();
  }
  return bitsShimReady;
}

let cachedLocalCompiler: string | null = null;

async function findLocalCompiler(): Promise<string> {
  if (cachedLocalCompiler) return cachedLocalCompiler;
  for (const candidate of ["g++", "clang++"]) {
    const result = await runProcess(candidate, ["--version"], { timeoutMs: 5000 });
    if (result.code === 0) {
      cachedLocalCompiler = candidate;
      return candidate;
    }
  }
  throw new Error("No C++ compiler found (looked for g++, clang++).");
}

// --- Public API ---

export interface CompiledProgram {
  dir: string;
  sandboxed: boolean;
  /** Absolute path to the binary — only meaningful when !sandboxed. */
  binPath: string;
  compileError: string | null;
}

export async function compileCpp(code: string): Promise<CompiledProgram> {
  await mkdir(WORK_ROOT, { recursive: true });
  const dir = await mkdtemp(path.join(WORK_ROOT, "run-"));
  const srcPath = path.join(dir, "main.cpp");
  const binPath = path.join(dir, "solution.out");
  await writeFile(srcPath, code, "utf8");

  const sandboxed = await checkDocker();

  const compile = sandboxed
    ? await runProcess(
        "docker",
        [
          "run",
          "--rm",
          "--network",
          "none",
          "--memory",
          "256m",
          "--memory-swap",
          "256m",
          "--cpus",
          "1",
          "--pids-limit",
          "128",
          "--cap-drop",
          "ALL",
          "--security-opt",
          "no-new-privileges",
          "--user",
          "1000:1000",
          "-v",
          `${dir}:/workspace`,
          "-w",
          "/workspace",
          SANDBOX_IMAGE,
          "timeout",
          "15",
          "g++",
          "-std=c++17",
          "-O2",
          "-o",
          "solution.out",
          "main.cpp",
        ],
        { timeoutMs: 20_000 }
      )
    : await runProcess(
        await findLocalCompiler(),
        ["-std=c++17", "-O2", "-isystem", await ensureBitsShim(), "-o", binPath, srcPath],
        { timeoutMs: 15_000 }
      );

  if (compile.timedOut || compile.code === 124) {
    return { dir, sandboxed, binPath, compileError: "Compilation timed out." };
  }
  if (compile.code !== 0) {
    return {
      dir,
      sandboxed,
      binPath,
      compileError: compile.stderr || compile.stdout || "Compilation failed.",
    };
  }
  return { dir, sandboxed, binPath, compileError: null };
}

export async function runBinary(compiled: CompiledProgram, stdin: string) {
  const run = compiled.sandboxed
    ? await runProcess(
        "docker",
        [
          "run",
          "--rm",
          "-i",
          "--network",
          "none",
          "--memory",
          "256m",
          "--memory-swap",
          "256m",
          "--cpus",
          "1",
          "--pids-limit",
          "64",
          "--cap-drop",
          "ALL",
          "--security-opt",
          "no-new-privileges",
          "--user",
          "1000:1000",
          "-v",
          `${compiled.dir}:/workspace:ro`,
          "-w",
          "/workspace",
          SANDBOX_IMAGE,
          "timeout",
          "5",
          "./solution.out",
        ],
        { input: stdin, timeoutMs: 8_000 }
      )
    : await runProcess(compiled.binPath, [], { input: stdin, timeoutMs: 5_000 });

  const timedOut = run.timedOut || run.code === 124;
  return {
    stdout: run.stdout,
    stderr: timedOut ? "Time limit exceeded." : run.stderr,
    timedOut,
  };
}

export async function cleanup(dir: string) {
  await rm(dir, { recursive: true, force: true });
}
