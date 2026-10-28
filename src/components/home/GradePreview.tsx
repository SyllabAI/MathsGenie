"use client";

import { useState } from "react";
import Link from "next/link";

export type PreviewGrades = { grade: string; topics: { title: string; href: string }[] }[];

/** Hero product preview: grade tabs driving a topic grid, like the original's */
export default function GradePreview({ grades }: { grades: PreviewGrades }) {
  const [g, setG] = useState(grades[0]?.grade ?? "Grade 4");
  const active = grades.find((x) => x.grade === g) ?? grades[0];

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-night-2/80 p-4 shadow-2xl shadow-black/40 backdrop-blur sm:p-5">
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
        {grades.map((x) => (
          <button
            key={x.grade}
            onClick={() => setG(x.grade)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
              x.grade === g
                ? "bg-mint text-night"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {x.grade}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {active?.topics.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group flex items-center justify-between gap-2 rounded-xl border border-white/5 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white/85 transition hover:border-mint/40 hover:bg-white/[0.08] hover:text-white"
          >
            <span className="truncate">{t.title}</span>
            <span className="text-mint opacity-0 transition group-hover:opacity-100">→</span>
          </Link>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-white/40">
        {active?.topics.length} of 134 topics shown · pick a grade to browse
      </p>
    </div>
  );
}
