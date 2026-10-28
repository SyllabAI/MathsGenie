"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";

/**
 * Working predicted-grade calculator (recreation of the original's tool).
 * Boundaries are SAMPLE values (typical Edexcel-style, editable by the user).
 * The original loads official per-series boundaries server-side.
 */

const FOUNDATION_BOUNDARIES = [
  { grade: "5", min: 178 },
  { grade: "4", min: 132 },
  { grade: "3", min: 89 },
  { grade: "2", min: 52 },
  { grade: "1", min: 21 },
];

const HIGHER_BOUNDARIES = [
  { grade: "9", min: 198 },
  { grade: "8", min: 167 },
  { grade: "7", min: 136 },
  { grade: "6", min: 105 },
  { grade: "5", min: 74 },
  { grade: "4", min: 43 },
];

const MAX = 240; // 3 papers × 80 marks

function gradeFor(total: number, boundaries: { grade: string; min: number }[]) {
  for (const b of boundaries) {
    if (total >= b.min) return b.grade;
  }
  return "U";
}

function nextGradeGap(total: number, boundaries: { grade: string; min: number }[]) {
  const sorted = [...boundaries].sort((a, b) => b.min - a.min);
  for (const b of sorted) {
    if (total < b.min) {
      const current = gradeFor(total, boundaries);
      const isNext = b.grade === "U" || current === "U" || parseInt(b.grade) === (current === "U" ? 0 : parseInt(current)) + 1;
      if (isNext || current === "U") {
        return { next: b.grade, marks: b.min - total };
      }
    }
  }
  return null;
}

export default function GradeCalculator() {
  const [tier, setTier] = useState<"F" | "H">("H");
  const [marks, setMarks] = useState<[number, number, number]>([52, 58, 49]);
  const [boundaries, setBoundaries] = useState<Record<"F" | "H", { grade: string; min: number }[]>>({
    F: FOUNDATION_BOUNDARIES,
    H: HIGHER_BOUNDARIES,
  });
  const [editing, setEditing] = useState(false);

  const total = marks[0] + marks[1] + marks[2];
  const active = boundaries[tier];
  const grade = useMemo(() => gradeFor(total, active), [total, active]);
  const gap = useMemo(() => nextGradeGap(total, active), [total, active]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="flex gap-2">
          {(["F", "H"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                tier === t ? "bg-ink text-paper" : "border border-line hover:bg-paper-2"
              }`}
            >
              {t === "F" ? "Foundation" : "Higher"}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-6">
          {["Paper 1 (Non-calculator)", "Paper 2 (Calculator)", "Paper 3 (Calculator)"].map(
            (label, i) => (
              <div key={label}>
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{label}</span>
                  <span className="font-mono text-muted">{marks[i]} / 80</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={80}
                  value={marks[i]}
                  onChange={(e) => {
                    const next = [...marks] as [number, number, number];
                    next[i] = parseInt(e.target.value, 10);
                    setMarks(next);
                  }}
                  className="mt-2 w-full accent-[var(--accent)]"
                  aria-label={`${label} marks`}
                />
              </div>
            )
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-panel p-6">
          <div>
            <p className="text-sm text-muted">Total</p>
            <p className="font-mono text-3xl font-bold">{total} / {MAX}</p>
          </div>
          <div className="ml-4">
            <p className="text-sm text-muted">Predicted grade</p>
            <p className="font-hand text-5xl font-bold text-accent">{grade}</p>
          </div>
          {gap && (
            <div className="ml-auto text-right">
              <Badge tone="accent">{gap.marks} marks to grade {gap.next}</Badge>
            </div>
          )}
        </div>
      </div>

      <aside className="rounded-2xl border border-line bg-panel p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Grade boundaries</h2>
          <button
            onClick={() => setEditing((v) => !v)}
            className="rounded-full border border-line px-3 py-1 text-xs font-medium hover:bg-paper-2"
          >
            {editing ? "Done" : "Edit"}
          </button>
        </div>
        <p className="mt-1 text-xs text-muted">
          Sample {tier === "F" ? "Foundation" : "Higher"} boundaries — edit to match your series.
        </p>
        <table className="mt-3 w-full text-sm">
          <tbody>
            {active.map((b) => (
              <tr key={b.grade} className="border-b border-line last:border-0">
                <td className="py-1.5 font-semibold">Grade {b.grade}</td>
                <td className="py-1.5 text-right font-mono text-muted">
                  {editing ? (
                    <input
                      type="number"
                      value={b.min}
                      min={0}
                      max={MAX}
                      onChange={(e) => {
                        const v = Math.max(0, Math.min(MAX, parseInt(e.target.value || "0", 10)));
                        setBoundaries((prev) => ({
                          ...prev,
                          [tier]: prev[tier].map((x) =>
                            x.grade === b.grade ? { ...x, min: v } : x
                          ),
                        }));
                      }}
                      className="w-20 rounded-lg border border-line bg-paper px-2 py-0.5 text-right"
                    />
                  ) : (
                    `${b.min}+`
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </aside>
    </div>
  );
}
