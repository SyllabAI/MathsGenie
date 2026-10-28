"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Filter pills (All / Year 1 / Year 2) + module-grouped topic list for the
 * A-Level lessons hub. Topics with a recreated interactive lesson get an
 * accent "Start lesson" action; every topic links out to the original.
 */

type LessonTopic = {
  slug: string;
  title: string;
  hasLesson: boolean;
  lessonHref: string;
  originalHref: string;
};

type LessonGroup = {
  key: string;
  label: string;
  group: string;
  topics: LessonTopic[];
};

export default function LessonsFilter({
  pills,
  groups,
}: {
  pills: string[];
  groups: LessonGroup[];
}) {
  const [filter, setFilter] = useState("All");
  const shown = groups.filter((g) => filter === "All" || g.group === filter);

  return (
    <div className="mt-6">
      <div className="flex gap-2" role="group" aria-label="Filter lessons by year">
        {pills.map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            aria-pressed={filter === p}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
              filter === p
                ? "bg-accent text-white"
                : "border border-line bg-panel text-ink/70 hover:bg-paper-2"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-9">
        {shown.map((g) => (
          <section key={g.key} aria-label={g.label}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-title text-xl font-extrabold tracking-tight">{g.label}</h2>
              <span className="text-xs font-semibold text-muted">
                {g.topics.filter((t) => t.hasLesson).length} interactive · {g.topics.length} topics
              </span>
            </div>
            <ol className="mt-3 grid gap-1.5 md:grid-cols-2">
              {g.topics.map((t, i) => (
                <li
                  key={t.slug}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-panel px-3.5 py-2.5 transition hover:border-accent/40"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-paper-2 text-sm font-bold text-muted">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">{t.title}</span>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {t.hasLesson && (
                      <Link
                        href={t.lessonHref}
                        className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-white transition hover:bg-accent-ink"
                      >
                        Start lesson
                      </Link>
                    )}
                    <a
                      href={t.originalHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-line px-3 py-1 text-[11px] font-semibold transition hover:bg-paper-2"
                    >
                      Original ↗
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
