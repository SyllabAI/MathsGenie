"use client";

import { useState } from "react";

const MODES = [
  "Revision Guides & Notes",
  "Videos",
  "Lessons",
  "Flashcards",
  "Teach Genie",
];

/**
 * "Learn every topic your way" tabs with a lesson preview panel.
 * All lesson copy below is original explanatory text for a standard
 * GCSE algebra topic (quadratics) — written for this recreation.
 */
export default function LearnTabs() {
  const [m, setM] = useState(MODES[0]);

  return (
    <div className="rounded-3xl border border-line bg-panel p-5 shadow-xl shadow-ink/5 sm:p-7">
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {MODES.map((x) => (
          <button
            key={x}
            onClick={() => setM(x)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              x === m
                ? "bg-night text-white"
                : "bg-paper-2 text-ink/70 hover:bg-ink/5 hover:text-ink"
            }`}
          >
            {x}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* lesson outline */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted">
            Lesson preview
          </p>
          <h3 className="font-hand mt-1 text-4xl font-bold leading-none">
            Solving Quadratics
          </h3>
          <p className="mt-4 text-sm font-semibold text-ink">What you&apos;ll learn</p>
          <ul className="mt-2 space-y-2 text-sm text-ink/80">
            <li className="flex gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint/15 text-[11px] font-bold text-teal-700">1</span>
              Recognise a quadratic expression by its highest power.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky/15 text-[11px] font-bold text-sky-600">2</span>
              Factorise expressions of the form x² + bx + c into two brackets.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral/20 text-[11px] font-bold text-red-500">3</span>
              Solve a quadratic equation once it has been factorised.
            </li>
          </ul>

          <div className="mt-5 rounded-2xl border border-line bg-paper p-4 text-sm">
            <p className="font-semibold text-ink">1. What is a quadratic?</p>
            <p className="mt-1.5 leading-relaxed text-muted">
              An expression is quadratic when the largest power of the unknown is
              squared — something like <Class>x²</Class> or <Class>x² + 5x + 6</Class>.
              If the top power is a cube or higher, it isn&apos;t quadratic.
            </p>
          </div>
        </div>

        {/* worked example card */}
        <div className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">
            2. Factorising x² + bx + c
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink/80">
            You need two numbers that multiply to the constant term and add to
            the middle coefficient.
          </p>
          <div className="mt-3 rounded-xl border border-teal-500/25 bg-mint/10 p-3.5 text-sm">
            <p className="font-bold text-teal-800">Worked example</p>
            <p className="mt-1.5 font-mono text-[13px] text-ink">
              Factorise x² + 7x + 12
            </p>
            <p className="mt-1.5 text-ink/80">
              3 × 4 = 12 and 3 + 4 = 7, so
            </p>
            <p className="mt-1 font-mono text-[13px] font-semibold text-ink">
              x² + 7x + 12 = (x + 3)(x + 4)
            </p>
            <p className="mt-1.5 text-ink/70">
              Check: 3x + 4x = 7x ✓ — the middle term matches.
            </p>
          </div>
          <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3.5 text-sm">
            <p className="font-bold text-red-600">Common mistake</p>
            <p className="mt-1.5 text-ink/80">
              Pairs like 1 × 12 also multiply to 12 but add to 13 — always check
              <em> both</em> conditions before writing your brackets.
            </p>
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            Every one of the 134 GCSE topics gets the same treatment.
          </p>
        </div>
      </div>
    </div>
  );
}

function Class({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[13px] text-ink">
      {children}
    </span>
  );
}
