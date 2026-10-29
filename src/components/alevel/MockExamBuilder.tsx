"use client";

import { useMemo, useState } from "react";
import { alevelTopicList, alevelOriginalTopicUrl } from "@/lib/alevel";
import { SITE } from "@/lib/data";

/**
 * A-Level mock exam builder (original /a-level/mock-exam-builder):
 * pick topics, give the mock a total mark budget, then generate a paper
 * plan — per-topic mark allocations derived from a seeded shuffle — with
 * hot-links to the original topic pages for the actual questions.
 */

export default function MockExamBuilder() {
  const topics = useMemo(() => alevelTopicList(), []);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [budget, setBudget] = useState(100);
  const [built, setBuilt] = useState<{ title: string; module: string; marks: number; href: string }[] | null>(null);

  const toggle = (slug: string) =>
    setPicked((s) => {
      const next = new Set(s);
      if (next.has(slug)) next.delete(slug);
      else if (next.size < 12) next.add(slug);
      return next;
    });

  const build = () => {
    if (picked.size < 2) return;
    const list = topics.filter((t) => picked.has(t.slug));
    // deterministic allocation: weight by position in the picked set
    let seed = [...picked].join("").length * 7 + budget;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    const weights = list.map(() => 0.5 + rand());
    const wSum = weights.reduce((a, b) => a + b, 0);
    let remaining = budget;
    const rows = list.map((t, i) => {
      const marks = i === list.length - 1
        ? Math.max(3, remaining)
        : Math.max(3, Math.round((weights[i] / wSum) * budget));
      remaining -= marks;
      return { title: t.title, module: t.module, marks, href: alevelOriginalTopicUrl(t.slug) };
    });
    setBuilt(rows);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      {/* topic picker */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-title text-lg font-extrabold">Pick topics ({picked.size}/12)</h2>
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="budget" className="font-semibold text-muted">Total marks</label>
            <input
              id="budget"
              type="number"
              min={20}
              max={150}
              value={budget}
              onChange={(e) => setBudget(Math.min(150, Math.max(20, Number(e.target.value) || 20)))}
              className="w-20 rounded-xl border-2 border-line bg-paper px-2.5 py-1.5 text-center font-bold outline-none focus:border-accent"
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {topics.map((t) => {
            const on = picked.has(t.slug);
            return (
              <button
                key={t.slug}
                onClick={() => toggle(t.slug)}
                aria-pressed={on}
                className={`flex items-center justify-between gap-2 rounded-xl border-2 px-3.5 py-2.5 text-left text-sm font-medium transition ${
                  on ? "border-accent bg-accent-soft/60 text-accent" : "border-line bg-paper hover:border-ink/20"
                }`}
              >
                <span className="min-w-0 truncate">{t.title}</span>
                <span className={`grid size-5 flex-none place-items-center rounded-full border-2 text-[10px] font-bold ${on ? "border-accent bg-accent text-white" : "border-line text-transparent"}`}>✓</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* paper plan */}
      <aside className="h-fit rounded-3xl border-2 border-line bg-paper p-6 lg:sticky lg:top-24">
        <h2 className="font-title text-lg font-extrabold">Your mock</h2>
        {!built ? (
          <>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Choose at least two topics, set a mark budget, and the builder splits it into a question plan. Print it or open each topic for its questions.
            </p>
            <button
              onClick={build}
              disabled={picked.size < 2}
              className="mt-5 w-full rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-ink disabled:opacity-40"
            >
              Build mock ({budget} marks)
            </button>
          </>
        ) : (
          <>
            <ul className="mt-4 space-y-2.5">
              {built.map((r, i) => (
                <li key={i} className="flex items-start justify-between gap-3 rounded-xl bg-paper-2 px-3.5 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">Q{i + 1} · {r.title}</p>
                    <p className="truncate text-[11px] text-muted">{r.module}</p>
                  </div>
                  <a href={r.href} target="_blank" rel="noopener noreferrer" className="flex-none rounded-full bg-paper px-2.5 py-1 text-xs font-extrabold text-accent shadow-sm">
                    {r.marks} marks ↗
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between text-sm font-bold">
              <span>Total</span>
              <span>{built.reduce((a, b) => a + b.marks, 0)} marks</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={build} className="flex-1 rounded-full border-2 border-line px-4 py-2.5 text-sm font-bold transition hover:bg-paper-2">Rebuild</button>
              <button onClick={() => { setBuilt(null); }} className="flex-1 rounded-full bg-accent px-4 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink">New mock</button>
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-muted">
              Questions open on the original ({SITE.original}) — pick them from each topic page to fill the plan.
            </p>
          </>
        )}
      </aside>
    </div>
  );
}
