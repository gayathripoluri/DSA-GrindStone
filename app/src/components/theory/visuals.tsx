"use client";

import { useState } from "react";

// Small hand-authored SVG diagrams for the theory slide decks. Most are
// static illustrations (per-slide, not a continuous animation) — navigating
// between slides swaps the diagram rather than animating it in place. The
// sliding-window ones below are the exception: stepping the window is the
// whole point of the concept, so those are click-through interactive.

const LOCKER_FILL = "#1c1f26"; // surface-2
const LOCKER_STROKE = "#2a2e37"; // border
const ACCENT = "#ff6a3d";
const TEXT = "#f2f3f5";
const TEXT_DIM = "#9aa0ac";

function Locker({
  x,
  index,
  values,
  highlighted,
}: {
  x: number;
  index: number;
  values?: string[];
  highlighted?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={40}
        width={64}
        height={64}
        rx={10}
        fill={highlighted ? ACCENT : LOCKER_FILL}
        stroke={highlighted ? ACCENT : LOCKER_STROKE}
        strokeWidth={2}
      />
      <text
        x={x + 32}
        y={30}
        textAnchor="middle"
        fontSize={12}
        fill={TEXT_DIM}
        fontFamily="monospace"
      >
        {index}
      </text>
      {values?.map((v, i) => (
        <text
          key={v}
          x={x + 32}
          y={68 + i * 16}
          textAnchor="middle"
          fontSize={13}
          fontFamily="monospace"
          fill={highlighted ? "#0b0c0f" : TEXT}
        >
          {v}
        </text>
      ))}
    </g>
  );
}

export function ArrayScanVisual() {
  const values = [2, 7, 11, 15];
  return (
    <svg viewBox="0 0 400 140" className="w-full max-w-sm">
      {values.map((v, i) => (
        <g key={v}>
          <rect
            x={40 + i * 80}
            y={40}
            width={56}
            height={56}
            rx={8}
            fill={LOCKER_FILL}
            stroke={LOCKER_STROKE}
            strokeWidth={2}
          />
          <text
            x={40 + i * 80 + 28}
            y={73}
            textAnchor="middle"
            fontSize={16}
            fontFamily="monospace"
            fill={TEXT}
          >
            {v}
          </text>
        </g>
      ))}
      <path
        d="M 68 110 Q 200 135 332 110"
        stroke={TEXT_DIM}
        strokeWidth={2}
        fill="none"
        strokeDasharray="4 4"
        markerEnd="url(#arrowScan)"
      />
      <text x={200} y={130} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={TEXT_DIM}>
        re-check everything, again and again?
      </text>
      <defs>
        <marker id="arrowScan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={TEXT_DIM} />
        </marker>
      </defs>
    </svg>
  );
}

export function LockersVisual() {
  return (
    <svg viewBox="0 0 400 140" className="w-full max-w-sm">
      {[0, 1, 2, 3, 4].map((i) => (
        <Locker key={i} x={8 + i * 76} index={i} />
      ))}
    </svg>
  );
}

// Lockers are drawn at their natural y (rect at 40-104, index label at 30) and
// then shifted down as a group, leaving clear vertical space above for
// annotations/arrows so nothing overlaps.
const LOCKER_ROW_Y_OFFSET = 90;
const TARGET_LOCKER_X = 8 + 3 * 76 + 32; // center-x of locker index 3

export function HashFunctionVisual() {
  return (
    <svg viewBox="0 0 400 210" className="w-full max-w-sm">
      <text x={20} y={26} fontSize={20} fontFamily="monospace" fill={TEXT}>
        7
      </text>
      <path d="M 44 21 L 216 21" stroke={TEXT_DIM} strokeWidth={2} markerEnd="url(#arrow)" fill="none" />

      <rect x={219} y={4} width={100} height={34} rx={8} fill="none" stroke={ACCENT} strokeWidth={2} />
      <text x={269} y={26} textAnchor="middle" fontSize={13} fontFamily="monospace" fill={ACCENT}>
        hash(x)
      </text>

      <path
        d={`M ${TARGET_LOCKER_X} 40 L ${TARGET_LOCKER_X} 124`}
        stroke={ACCENT}
        strokeWidth={2}
        markerEnd="url(#arrow)"
        fill="none"
      />

      <g transform={`translate(0, ${LOCKER_ROW_Y_OFFSET})`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Locker key={i} x={8 + i * 76} index={i} highlighted={i === 3} />
        ))}
      </g>

      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={TEXT_DIM} />
        </marker>
      </defs>
    </svg>
  );
}

export function CollisionVisual() {
  return (
    <svg viewBox="0 0 400 210" className="w-full max-w-sm">
      <text x={20} y={22} fontSize={18} fontFamily="monospace" fill={TEXT}>
        7
      </text>
      <path
        d={`M 44 18 Q 200 18 ${TARGET_LOCKER_X} 124`}
        stroke={TEXT_DIM}
        strokeWidth={2}
        fill="none"
        markerEnd="url(#arrow2)"
      />

      <text x={20} y={62} fontSize={18} fontFamily="monospace" fill={TEXT}>
        16
      </text>
      <path
        d={`M 50 58 Q 200 58 ${TARGET_LOCKER_X - 10} 124`}
        stroke={TEXT_DIM}
        strokeWidth={2}
        fill="none"
        markerEnd="url(#arrow2)"
      />

      <g transform={`translate(0, ${LOCKER_ROW_Y_OFFSET})`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Locker key={i} x={8 + i * 76} index={i} highlighted={i === 3} />
        ))}
      </g>

      <defs>
        <marker id="arrow2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={TEXT_DIM} />
        </marker>
      </defs>
    </svg>
  );
}

export function ChainingVisual() {
  return (
    <svg viewBox="0 0 400 140" className="w-full max-w-sm">
      {[0, 1, 2, 4].map((i) => (
        <Locker key={i} x={8 + i * 76} index={i} />
      ))}
      <Locker x={8 + 3 * 76} index={3} values={["7", "16"]} highlighted />
    </svg>
  );
}

export function FastLookupVisual() {
  return (
    <svg viewBox="0 0 400 140" className="w-full max-w-sm">
      <Locker x={8} index={0} values={["2"]} />
      <Locker x={84} index={1} values={["7"]} />
      <Locker x={160} index={2} />
      <Locker x={236} index={3} values={["11"]} highlighted />
      <Locker x={312} index={4} />
      <text x={274} y={125} fontSize={12} fontFamily="monospace" fill={ACCENT}>
        found it — instantly
      </text>
    </svg>
  );
}

// --- Two Pointers ---

const CELL_W = 56;
const CELL_GAP = 12;
function cellX(i: number) {
  return 8 + i * (CELL_W + CELL_GAP);
}

function ArrayCells({
  values,
  highlight = [],
}: {
  values: (number | string)[];
  highlight?: number[];
}) {
  return (
    <>
      {values.map((v, i) => (
        <g key={i}>
          <rect
            x={cellX(i)}
            y={40}
            width={CELL_W}
            height={56}
            rx={8}
            fill={highlight.includes(i) ? ACCENT : LOCKER_FILL}
            stroke={highlight.includes(i) ? ACCENT : LOCKER_STROKE}
            strokeWidth={2}
          />
          <text
            x={cellX(i) + CELL_W / 2}
            y={73}
            textAnchor="middle"
            fontSize={16}
            fontFamily="monospace"
            fill={highlight.includes(i) ? "#0b0c0f" : TEXT}
          >
            {v}
          </text>
        </g>
      ))}
    </>
  );
}

function PointerLabel({ index, label }: { index: number; label: string }) {
  return (
    <text
      x={cellX(index) + CELL_W / 2}
      y={116}
      textAnchor="middle"
      fontSize={13}
      fontFamily="monospace"
      fill={ACCENT}
    >
      {label}
    </text>
  );
}

const TWO_POINTER_VALUES = [1, 3, 4, 7, 11];

export function ScanPairsVisual() {
  return (
    <svg viewBox="0 0 400 140" className="w-full max-w-sm">
      <ArrayCells values={TWO_POINTER_VALUES} />
      <path
        d="M 36 100 Q 200 132 364 100"
        stroke={TEXT_DIM}
        strokeWidth={1.5}
        fill="none"
        strokeDasharray="3 3"
      />
      <path
        d="M 92 100 Q 200 124 308 100"
        stroke={TEXT_DIM}
        strokeWidth={1.5}
        fill="none"
        strokeDasharray="3 3"
      />
      <path
        d="M 36 100 Q 150 118 252 100"
        stroke={TEXT_DIM}
        strokeWidth={1.5}
        fill="none"
        strokeDasharray="3 3"
      />
      <text x={200} y={128} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={TEXT_DIM}>
        compare every pair?
      </text>
    </svg>
  );
}

export function TwoPointersStartVisual() {
  return (
    <svg viewBox="0 0 400 140" className="w-full max-w-sm">
      <ArrayCells values={TWO_POINTER_VALUES} highlight={[0, 4]} />
      <PointerLabel index={0} label="L" />
      <PointerLabel index={4} label="R" />
    </svg>
  );
}

export function TwoPointersMoveVisual() {
  return (
    <svg viewBox="0 0 400 150" className="w-full max-w-sm">
      <text x={200} y={20} textAnchor="middle" fontSize={12} fontFamily="monospace" fill={TEXT_DIM}>
        1 + 11 = 12 — too big
      </text>
      <ArrayCells values={TWO_POINTER_VALUES} highlight={[0, 4]} />
      <PointerLabel index={0} label="L" />
      <PointerLabel index={4} label="R" />
      <path
        d={`M ${cellX(4) + CELL_W / 2} 130 L ${cellX(3) + CELL_W / 2} 130`}
        stroke={ACCENT}
        strokeWidth={2}
        markerEnd="url(#arrowTP)"
        fill="none"
      />
      <text x={cellX(3) + CELL_W} y={146} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={ACCENT}>
        move R left
      </text>
      <defs>
        <marker id="arrowTP" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={ACCENT} />
        </marker>
      </defs>
    </svg>
  );
}

export function TwoPointersConvergeVisual() {
  return (
    <svg viewBox="0 0 400 140" className="w-full max-w-sm">
      <text x={200} y={20} textAnchor="middle" fontSize={12} fontFamily="monospace" fill={ACCENT}>
        1 + 7 = 8 — found it
      </text>
      <ArrayCells values={TWO_POINTER_VALUES} highlight={[0, 3]} />
      <PointerLabel index={0} label="L" />
      <PointerLabel index={3} label="R" />
    </svg>
  );
}

export function TwoPointersDoneVisual() {
  return (
    <svg viewBox="0 0 400 140" className="w-full max-w-sm">
      <ArrayCells values={TWO_POINTER_VALUES} highlight={[0, 1, 2, 3]} />
      <text x={200} y={125} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={ACCENT}>
        every step ruled something out — never re-checked
      </text>
    </svg>
  );
}

// --- Sliding Window ---

function WindowBracket({ start, end, label }: { start: number; end: number; label?: string }) {
  const x1 = cellX(start);
  const x2 = cellX(end) + CELL_W;
  return (
    <g>
      <path d={`M ${x1} 104 L ${x1} 112 L ${x2} 112 L ${x2} 104`} stroke={ACCENT} strokeWidth={2} fill="none" />
      {label && (
        <text x={(x1 + x2) / 2} y={128} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={ACCENT}>
          {label}
        </text>
      )}
    </g>
  );
}

const SW_VALUES = [2, 1, 5, 1, 3, 2];

export function SlidingWindowScanVisual() {
  return (
    <svg viewBox="0 0 400 140" className="w-full max-w-sm">
      <text x={200} y={20} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={TEXT_DIM}>
        re-sum every window from scratch?
      </text>
      <ArrayCells values={SW_VALUES} />
      <WindowBracket start={0} end={2} />
      <WindowBracket start={1} end={3} />
      <WindowBracket start={2} end={4} />
    </svg>
  );
}

function StepControls({
  onReset,
  onNext,
  nextLabel,
  nextDisabled,
}: {
  onReset: () => void;
  onNext: () => void;
  nextLabel: string;
  nextDisabled: boolean;
}) {
  return (
    <div className="mt-3 flex items-center justify-center gap-2">
      <button
        onClick={onReset}
        className="rounded-full border border-border px-3 py-1 text-xs font-medium text-text-dim hover:border-text-dim hover:text-text"
      >
        Reset
      </button>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="rounded-full border border-accent bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {nextLabel}
      </button>
    </div>
  );
}

const SW_K = 3; // fixed window width for this demo

function windowSum(start: number) {
  let sum = 0;
  for (let i = start; i < start + SW_K; i++) sum += SW_VALUES[i];
  return sum;
}

// Click-through: each step slides the fixed-width window one cell to the
// right, showing exactly the two numbers that changed (one leaves, one
// enters) instead of a pre-baked before/after pair.
export function SlidingWindowFixedVisual() {
  const [start, setStart] = useState(0);
  const lastStart = SW_VALUES.length - SW_K;
  const isFirst = start === 0;
  const isLast = start === lastStart;
  const sum = windowSum(start);
  let best = windowSum(0);
  for (let s = 1; s <= start; s++) best = Math.max(best, windowSum(s));

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 400 140" className="w-full max-w-sm">
        {isFirst ? (
          <text x={200} y={20} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={TEXT_DIM}>
            first window — sum computed once
          </text>
        ) : (
          <>
            <text
              x={cellX(start - 1) + CELL_W / 2}
              y={30}
              textAnchor="middle"
              fontSize={13}
              fontFamily="monospace"
              fill={TEXT_DIM}
            >
              -{SW_VALUES[start - 1]}
            </text>
            <text
              x={cellX(start + SW_K - 1) + CELL_W / 2}
              y={30}
              textAnchor="middle"
              fontSize={13}
              fontFamily="monospace"
              fill={ACCENT}
            >
              +{SW_VALUES[start + SW_K - 1]}
            </text>
          </>
        )}
        <ArrayCells values={SW_VALUES} highlight={Array.from({ length: SW_K }, (_, i) => start + i)} />
        <WindowBracket start={start} end={start + SW_K - 1} label={`sum = ${sum}`} />
      </svg>
      <p className="mt-1 text-xs font-mono text-text-dim">
        best so far: <span className={sum === best ? "text-accent" : ""}>{best}</span>
      </p>
      <StepControls
        onReset={() => setStart(0)}
        onNext={() => setStart((s) => Math.min(lastStart, s + 1))}
        nextLabel={isLast ? "Done sliding" : "Slide window →"}
        nextDisabled={isLast}
      />
    </div>
  );
}

interface GrowShrinkStep {
  right: number;
  left: number;
  removed: string[];
  windowLen: number;
  isNewBest: boolean;
}

function computeGrowShrinkSteps(word: string): GrowShrinkStep[] {
  const seen = new Set<string>();
  let left = 0;
  let best = 0;
  const steps: GrowShrinkStep[] = [];
  for (let right = 0; right < word.length; right++) {
    const removed: string[] = [];
    while (seen.has(word[right])) {
      seen.delete(word[left]);
      removed.push(word[left]);
      left++;
    }
    seen.add(word[right]);
    const windowLen = right - left + 1;
    const isNewBest = windowLen > best;
    if (isNewBest) best = windowLen;
    steps.push({ right, left, removed, windowLen, isNewBest });
  }
  return steps;
}

const GS_WORD = "abcabcbb"; // the exact example from the problem statement
const GS_STEPS = computeGrowShrinkSteps(GS_WORD);
const GS_CELL_W = 42;
const GS_GAP = 8;
function gsCellX(i: number) {
  return 8 + i * (GS_CELL_W + GS_GAP);
}
const GS_VIEWBOX_W = gsCellX(GS_WORD.length - 1) + GS_CELL_W + 8;

// Click-through: each step advances the right edge by one character. When
// that character is already inside the window, the left edge jumps forward
// past every duplicate in one action — "shrink until it doesn't repeat",
// not one cell at a time.
export function SlidingWindowGrowShrinkVisual() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = GS_STEPS[stepIndex];
  const isLast = stepIndex === GS_STEPS.length - 1;
  const windowStr = GS_WORD.slice(step.left, step.right + 1);
  const best = GS_STEPS.slice(0, stepIndex + 1).reduce((m, s) => Math.max(m, s.windowLen), 0);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${GS_VIEWBOX_W} 140`} className="w-full max-w-sm">
        {step.removed.length > 0 && (
          <text
            x={GS_VIEWBOX_W / 2}
            y={20}
            textAnchor="middle"
            fontSize={11}
            fontFamily="monospace"
            fill={TEXT_DIM}
          >
            repeat &apos;{GS_WORD[step.right]}&apos; — shrink past {step.removed.map((c) => `'${c}'`).join(", ")}
          </text>
        )}
        {GS_WORD.split("").map((ch, i) => {
          const inWindow = i >= step.left && i <= step.right;
          return (
            <g key={i}>
              <rect
                x={gsCellX(i)}
                y={40}
                width={GS_CELL_W}
                height={GS_CELL_W}
                rx={8}
                fill={inWindow ? ACCENT : LOCKER_FILL}
                stroke={inWindow ? ACCENT : LOCKER_STROKE}
                strokeWidth={2}
              />
              <text
                x={gsCellX(i) + GS_CELL_W / 2}
                y={40 + GS_CELL_W / 2 + 5}
                textAnchor="middle"
                fontSize={15}
                fontFamily="monospace"
                fill={inWindow ? "#0b0c0f" : TEXT}
              >
                {ch}
              </text>
            </g>
          );
        })}
        <text
          x={GS_VIEWBOX_W / 2}
          y={112}
          textAnchor="middle"
          fontSize={12}
          fontFamily="monospace"
          fill={ACCENT}
        >
          &quot;{windowStr}&quot; (len {step.windowLen}){step.isNewBest ? " — new best" : ""}
        </text>
      </svg>
      <p className="mt-1 text-xs font-mono text-text-dim">
        longest so far: <span className="text-accent">{best}</span>
      </p>
      <StepControls
        onReset={() => setStepIndex(0)}
        onNext={() => setStepIndex((i) => Math.min(GS_STEPS.length - 1, i + 1))}
        nextLabel={isLast ? "Done stepping" : "Next character →"}
        nextDisabled={isLast}
      />
    </div>
  );
}

export function SlidingWindowDoneVisual() {
  return (
    <svg viewBox="0 0 400 140" className="w-full max-w-sm">
      <text x={200} y={20} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={ACCENT}>
        one pass, O(1) work per slide
      </text>
      <ArrayCells values={SW_VALUES} highlight={[2, 3, 4]} />
      <WindowBracket start={2} end={4} label="max sum = 9" />
    </svg>
  );
}
