"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import type { TopicsDoc } from "@/lib/data";

type PlanState = Record<string, "todo" | "done">;

/** Local revision planner: pick a grade, toggle topics, auto-spread across days. */
export default function RevisionPlannerClient({ doc }: { doc: TopicsDoc }) {
  const grades = useMemo(
    () => Object.keys(doc.grades).sort((a, b) => {
      const na = a === "8/9" ? 8.5 : parseInt(a, 10);
      const nb = b === "8/9" ? 8.5 : parseInt(b, 10);
      return na - nb;
    }),
    [doc]
  );
  const [grade, setGrade] = useState(grades[2] ?? grades[0]);
  const [selected, setSelected] = useState<string[]>([]);
  const [days, setDays] = useState(7);
  const [state, setState] = useState<PlanState>({});

  const topics = doc.grades[grade] ?? [];
  const schedule = useMemo(() => {
    const chunks: string[][] = Array.from({ length: days }, () => []);
    selected.forEach((slug, i) => {
      chunks[i % days].push(slug);
    });
    return chunks;
  }, [selected, days]);

  function toggle(slug: string) {
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));
  }

  function titleOf(slug: string) {
    return topics.find((t) => t.slug === slug)?.title ?? slug;
  }

  const doneCount = selected.filter((s) => state[s] === "done").length;
  const pct = selected.length ? Math.round((doneCount / selected.length) * 100) : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div>
        <div className="flex flex-wrap gap-1.5">
          {grades.map((g) => (
            <button
              key={g}
              onClick={() => setGrade(g)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                grade === g ? "bg-ink text-paper" : "border border-line hover:bg-paper-2"
              }`}
            >
              Grade {g}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-muted">
          Select topics to plan ({selected.length} selected) — the plan spreads them
          evenly across your study days.
        </p>

        <ol className="mt-3 max-h-[26rem] space-y-1 overflow-y-auto rounded-2xl border border-line bg-panel p-2">
          {topics.map((t) => (
            <li key={t.slug}>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 hover:bg-paper-2">
                <input
                  type="checkbox"
                  checked={selected.includes(t.slug)}
                  onChange={() => toggle(t.slug)}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                <span className="flex-1 text-sm">{t.title}</span>
                {state[t.slug] === "done" && <Badge tone="accent">done ✓</Badge>}
              </label>
            </li>
          ))}
        </ol>
      </div>

      <aside className="rounded-2xl border border-line bg-panel p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Your week</h2>
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10))}
            className="rounded-lg border border-line bg-paper px-2 py-1 text-sm"
            aria-label="Study days"
          >
            {[3, 5, 7, 10, 14].map((d) => (
              <option key={d} value={d}>{d} days</option>
            ))}
          </select>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper-2">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-xs text-muted">{pct}% of planned topics done</p>

        <div className="mt-4 space-y-3">
          {schedule.map((day, i) => (
            <div key={i} className="rounded-xl bg-paper-2 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Day {i + 1}</p>
              {day.length === 0 ? (
                <p className="mt-1 text-xs text-muted">Rest / catch-up</p>
              ) : (
                <ul className="mt-1 space-y-1">
                  {day.map((slug) => (
                    <li key={slug} className="flex items-center justify-between gap-2 text-sm">
                      <button
                        onClick={() => setState((s) => ({ ...s, [slug]: s[slug] === "done" ? "todo" : "done" }))}
                        className={`text-left hover:text-accent ${state[slug] === "done" ? "line-through opacity-60" : ""}`}
                      >
                        {titleOf(slug)}
                      </button>
                      <button
                        onClick={() => setState((s) => ({ ...s, [slug]: s[slug] === "done" ? "todo" : "done" }))}
                        aria-label={`Toggle ${titleOf(slug)}`}
                        className="text-accent"
                      >
                        {state[slug] === "done" ? "✓" : "○"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Saved in your browser only. The original syncs plans to your MathsGenie
          account and schedules by exam date.
        </p>
      </aside>
    </div>
  );
}
