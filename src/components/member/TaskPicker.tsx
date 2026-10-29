"use client";

import { useMemo, useState } from "react";
import topicsJson from "../../../data/gcse-maths/topics-edexcel.json";

/**
 * Topic picker used by both the "Set homework" and "Make a test" wizards
 * (research/04 §4): grade-grouped accordions of the GCSE Edexcel course,
 * tick topics to add them as tasks, set how many questions each carries.
 */

export type Task = { topic: string; count: number };

type Doc = { grades: Record<string, { slug: string; title: string; href: string }[]> };

const doc = topicsJson as unknown as Doc;
const GRADES = Object.keys(doc.grades);

export default function TaskPicker({
  value,
  onChange,
  noun = "questions",
}: {
  value: Task[];
  onChange: (tasks: Task[]) => void;
  noun?: string;
}) {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const groups = useMemo(
    () =>
      GRADES.map((g) => ({
        grade: g,
        topics: doc.grades[g].filter((t) => t.title.toLowerCase().includes(query)),
      })).filter((g) => g.topics.length > 0),
    [query],
  );

  const has = (title: string) => value.some((t) => t.topic === title);

  function toggle(title: string) {
    if (has(title)) {
      onChange(value.filter((t) => t.topic !== title));
    } else {
      onChange([...value, { topic: title, count: 5 }]);
    }
  }

  function step(title: string, delta: number) {
    onChange(
      value.map((t) =>
        t.topic === title ? { ...t, count: Math.min(20, Math.max(1, t.count + delta)) } : t,
      ),
    );
  }

  return (
    <div>
      {/* chosen tasks */}
      <div className="min-h-[2.5rem]">
        {value.length === 0 ? (
          <p className="text-sm text-muted">No tasks chosen yet — tick topics below.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {value.map((t) => (
              <span
                key={t.topic}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-accent/40 bg-accent-soft/60 py-1 pl-3 pr-1.5 text-xs font-semibold"
              >
                {t.topic}
                <span className="inline-flex items-center overflow-hidden rounded-full border border-line bg-paper">
                  <button
                    type="button"
                    aria-label={`Fewer ${noun} for ${t.topic}`}
                    onClick={() => step(t.topic, -1)}
                    className="px-1.5 text-sm leading-5 text-muted hover:text-ink"
                  >
                    −
                  </button>
                  <span className="min-w-4 text-center text-[11px]">{t.count}</span>
                  <button
                    type="button"
                    aria-label={`More ${noun} for ${t.topic}`}
                    onClick={() => step(t.topic, 1)}
                    className="px-1.5 text-sm leading-5 text-muted hover:text-ink"
                  >
                    +
                  </button>
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${t.topic}`}
                  onClick={() => toggle(t.topic)}
                  className="rounded-full px-1 text-muted hover:text-rose-500"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <label className="mt-3 flex items-center gap-2 rounded-full bg-paper-2 px-4 py-2.5">
        <svg viewBox="0 0 20 20" className="size-4 text-muted" aria-hidden>
          <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="m13 13 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search topics…"
          aria-label="Search topics"
          className="w-full bg-transparent text-sm outline-none"
        />
      </label>

      <div className="mt-3 max-h-72 overflow-y-auto rounded-2xl border-2 border-line p-1">
        {groups.map((g) => (
          <details key={g.grade} open={groups.length === 1}>
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2.5 text-sm font-bold hover:bg-paper-2">
              Grade {g.grade}
              <span className="text-xs font-medium text-muted">{g.topics.length} topics</span>
            </summary>
            <div className="pb-2 pl-3 pr-2">
              {g.topics.map((t) => {
                const on = has(t.title);
                return (
                  <label
                    key={t.slug}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-paper-2"
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(t.title)}
                      className="size-4 accent-[#1cb0f6]"
                    />
                    <span className="min-w-0 flex-1 truncate">{t.title}</span>
                  </label>
                );
              })}
            </div>
          </details>
        ))}
        {groups.length === 0 && (
          <p className="py-6 text-center text-sm text-muted">No topics match “{q}”.</p>
        )}
      </div>
    </div>
  );
}
