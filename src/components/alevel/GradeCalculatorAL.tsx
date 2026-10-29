"use client";

import { useMemo, useState } from "react";

/**
 * A-Level grade calculator (original /a-level/predicted-grade-calculator):
 * three papers (Pure 100, Stats & Mech 100 combined on the real spec —
 * recreated here as P1 / P2 / SM), marks entered per paper, then mapped
 * onto typical Edexcel boundaries for a predicted grade A*–E/U.
 * Boundaries are illustrative for this recreation; the original computes
 * from its own data.
 */

const PAPERS = [
  { id: "p1", label: "Paper 1 — Pure", max: 100 },
  { id: "p2", label: "Paper 2 — Pure", max: 100 },
  { id: "sm", label: "Paper 3 — Statistics & Mechanics", max: 100 },
] as const;

const BOUNDARIES: [string, number][] = [
  ["A*", 230], ["A", 199], ["B", 168], ["C", 137], ["D", 106], ["E", 75],
];

export default function GradeCalculatorAL() {
  const [marks, setMarks] = useState<Record<string, string>>({ p1: "", p2: "", sm: "" });

  const total = useMemo(
    () => PAPERS.reduce((acc, p) => acc + (Math.min(100, Math.max(0, Number(marks[p.id]) || 0))), 0),
    [marks]
  );
  const grade = useMemo(() => {
    for (const [g, min] of BOUNDARIES) if (total >= min) return g;
    return "U";
  }, [total]);

  const rows = useMemo(() => {
    const next: Record<string, number> = {};
    for (const [g, min] of BOUNDARIES) next[g] = min;
    return BOUNDARIES.map(([g, min], i) => ({
      grade: g,
      min,
      max: i === 0 ? 300 : BOUNDARIES[i - 1][1] - 1,
      hit: total >= min && (i === 0 || total < BOUNDARIES[i - 1][1]),
    }));
  }, [total]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border-2 border-line bg-paper p-6">
        <h2 className="font-title text-lg font-extrabold">Enter your marks</h2>
        <div className="mt-4 space-y-4">
          {PAPERS.map((p) => (
            <div key={p.id}>
              <div className="flex items-center justify-between text-sm">
                <label htmlFor={p.id} className="font-semibold">{p.label}</label>
                <span className="text-muted">/ {p.max}</span>
              </div>
              <input
                id={p.id}
                type="number"
                min={0}
                max={100}
                value={marks[p.id]}
                onChange={(e) => setMarks((m) => ({ ...m, [p.id]: e.target.value }))}
                placeholder="—"
                className="mt-1.5 w-full rounded-xl border-2 border-line bg-paper-2 px-4 py-2.5 text-lg font-bold outline-none transition focus:border-accent"
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between rounded-2xl bg-paper-2 px-5 py-4">
          <span className="text-sm font-bold text-muted">Total</span>
          <span className="font-title text-2xl font-extrabold tabular-nums">{total} / 300</span>
        </div>
      </div>

      <div className="rounded-3xl border-2 border-line bg-paper p-6">
        <h2 className="font-title text-lg font-extrabold">Predicted grade</h2>
        <div className="mt-4 flex items-center gap-4">
          <span className={`grid size-20 place-items-center rounded-2xl font-title text-3xl font-extrabold ${
            grade === "A*" || grade === "A" ? "bg-[#e2f6e9] text-[#0b7a3b]"
            : grade === "B" || grade === "C" ? "bg-[#fff4cc] text-[#8a6100]"
            : grade === "U" ? "bg-paper-2 text-muted"
            : "bg-[#ffe9c7] text-[#9a5b00]"
          }`}>{grade}</span>
          <p className="text-sm leading-relaxed text-muted">
            Against typical grade boundaries for the 9MA0 specification. Real boundaries move each series — treat this as a guide, not a promise.
          </p>
        </div>
        <table className="mt-5 w-full text-sm">
          <thead>
            <tr className="border-b-2 border-line text-left text-xs font-bold uppercase tracking-wide text-muted">
              <th className="py-2">Grade</th>
              <th className="py-2">Marks</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.grade} className={`border-b border-line/60 ${r.hit ? "bg-accent-soft/60 font-bold text-accent" : ""}`}>
                <td className="py-2 font-extrabold">{r.grade}</td>
                <td className="py-2 tabular-nums">{r.min} – {r.max}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
