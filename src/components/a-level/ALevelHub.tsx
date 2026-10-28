"use client";

import { useMemo, useState } from "react";
import SubjectDeckCard from "@/components/a-level/SubjectDeckCard";
import { ALEVEL_SUBJECTS } from "@/lib/alevel-subjects";

/**
 * /a-level hub body — "A Level Subjects" with live search, a
 * horizontally-snapping "Popular" shelf and an "Other subjects" grid,
 * every card rendered as the original's 3D deck tile.
 */
export default function ALevelHub() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const filtered = useMemo(
    () => ALEVEL_SUBJECTS.filter((s) => s.name.toLowerCase().includes(query)),
    [query]
  );
  const popular = filtered.filter((s) => s.popular);
  const others = filtered.filter((s) => !s.popular);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 24 24" className="size-7 text-ink" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" strokeLinejoin="round" />
          <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" strokeLinejoin="round" />
          <path d="M9 7h7M9 10.5h5" strokeLinecap="round" />
        </svg>
        <h1 className="text-3xl font-extrabold tracking-tight">A Level Subjects</h1>
      </div>

      <div className="relative mt-5 max-w-sm">
        <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search subjects..."
          aria-label="Search subjects"
          className="w-full rounded-2xl border border-line bg-paper-2 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:bg-paper focus:ring-2 focus:ring-accent/30"
        />
      </div>

      {popular.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold">Popular</h2>
          <div className="-mx-4 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {popular.map((s) => (
              <div key={s.slug} className="w-[136px] flex-none snap-start sm:w-[172px]">
                <SubjectDeckCard subject={s} />
              </div>
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold">Other subjects</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {others.map((s) => (
              <SubjectDeckCard key={s.slug} subject={s} />
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-muted">
          No subjects match “{q}”. All of our rebuilt content lives under{" "}
          <a href="/a-level/maths/edexcel" className="font-semibold text-accent hover:underline">
            A Level Maths
          </a>
          .
        </p>
      )}

      <p className="mt-12 text-center text-xs text-muted">
        Course pages beyond Maths link back to the original site — this recreation documents
        and rebuilds the Maths course in full.
      </p>
    </div>
  );
}
