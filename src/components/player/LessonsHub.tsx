"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { LESSON_INDEX } from "@/lib/lessons";
import { doneLessonsRaw } from "@/components/player/LessonPlayer";

/**
 * Lessons hub — mirrors the original /gcse/maths/[board]/lessons:
 * gradient hero, intro copy, topic search, grade accordion cards with
 * per-topic progress rings (filled once the lesson is completed —
 * tracked in localStorage like a signed-out progress book).
 */

type Topic = { slug: string; title: string };
type GradeGroup = { grade: string; topics: Topic[] };

function Ring({ done }: { done: boolean }) {
  return (
    <div role="img" aria-label={done ? "completed" : "not completed"} className="relative size-6 flex-none">
      <svg aria-hidden className="size-6" viewBox="0 0 24 24">
        <circle className={done ? "text-emerald-500" : "text-ink/10"} cx="12" cy="12" fill="none" r="8.25" stroke="currentColor" strokeWidth="3.5" />
        {done && (
          <path className="text-emerald-500" d="m8.5 12.5 2.4 2.4 4.8-5.2" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </div>
  );
}

function subscribe(cb: () => void) {
  window.addEventListener("mg-lessons-updated", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("mg-lessons-updated", cb);
    window.removeEventListener("storage", cb);
  };
}

export default function LessonsHub({ board, groups }: { board: string; groups: GradeGroup[] }) {
  const [q, setQ] = useState("");
  const [openGrades, setOpenGrades] = useState<Set<string>>(new Set(groups.slice(0, 1).map((g) => g.grade)));

  // completed-lesson set, read from localStorage via an external store
  const doneRaw = useSyncExternalStore(subscribe, doneLessonsRaw, () => "[]");
  const done = useMemo(() => new Set<string>(JSON.parse(doneRaw) as string[]), [doneRaw]);

  const query = q.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      groups
        .map((g) => ({ ...g, topics: g.topics.filter((t) => t.title.toLowerCase().includes(query)) }))
        .filter((g) => g.topics.length > 0),
    [groups, query]
  );

  const toggleGrade = (g: string) =>
    setOpenGrades((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });

  const totalTopics = groups.reduce((n, g) => n + g.topics.length, 0);
  const doneCount = groups.reduce(
    (n, g) => n + g.topics.filter((t) => done.has(t.slug)).length,
    0
  );

  return (
    <div>
      {/* gradient hero band */}
      <div className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#ffd3e0]/70 via-[#e9dcfd]/60 to-[#cfe6ff]/70" />
        <div className="relative mx-auto max-w-6xl px-4 pb-6 pt-7 sm:px-6">
          <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-sm">
            <Link href="/gcse" className="text-ink/60 hover:text-accent">GCSE</Link>
            <span className="text-ink/40" aria-hidden>›</span>
            <Link href={`/gcse/maths/${board}`} className="text-ink/60 hover:text-accent">Maths</Link>
            <span className="text-ink/40" aria-hidden>›</span>
            <span className="font-semibold">Lessons</span>
            <span className="ml-auto hidden text-xs text-ink/50 sm:block">Spec 1MA1</span>
          </nav>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Maths Lessons</h1>
          <p className="mt-6 max-w-3xl text-sm leading-6 text-ink/70">
            Step-by-step lessons by topic, building up to exam-style questions. Build fluency with
            number, ratio and algebra first, since geometry, probability and statistics topics rely
            on them, and leave extra time nearer the exam for Higher-tier problem-solving and
            multi-step reasoning questions.
          </p>
          {doneCount > 0 && (
            <p className="mt-3 text-sm font-semibold text-emerald-700">
              {doneCount} of {totalTopics} lessons completed
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {/* search */}
        <div className="relative mt-6 max-w-sm">
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search topics..."
            aria-label="Search topics"
            className="w-full rounded-2xl border border-line bg-paper-2 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:bg-paper focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {/* grade accordion cards */}
        <div className="mt-6 flex flex-col gap-4">
          {filtered.map((g) => {
            const open = openGrades.has(g.grade) || query !== "";
            const doneInGrade = g.topics.filter((t) => done.has(t.slug)).length;
            return (
              <section key={g.grade} className="rounded-2xl border-2 border-line bg-paper p-1">
                <button
                  onClick={() => toggleGrade(g.grade)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 pr-2 text-left transition-colors hover:bg-paper-2"
                >
                  <Ring done={doneInGrade === g.topics.length && g.topics.length > 0} />
                  <span className="min-w-0 flex-auto text-base font-semibold">Grade {g.grade}</span>
                  <span className="flex-none text-xs text-muted">{g.topics.length} topics</span>
                  <svg
                    className={`size-5 flex-none opacity-60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24" fill="none" aria-hidden
                  >
                    <path d="M17.29 8.79a1 1 0 0 0-1.41 0L12 12.67 8.12 8.8a1 1 0 1 0-1.41 1.41l4.7 4.7a1 1 0 0 0 1.42 0l4.7-4.7a1 1 0 0 0 0-1.42Z" fill="currentColor" />
                  </svg>
                </button>
                {open && (
                  <div className="flex flex-col pb-1 pl-4">
                    {g.topics.map((t) => (
                      <Link
                        key={t.slug}
                        href={`/gcse/maths/${board}/${t.slug}/lessons`}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 pr-2 transition-colors hover:bg-paper-2"
                      >
                        <Ring done={done.has(t.slug)} />
                        <span className="min-w-0 flex-auto truncate text-sm font-medium">{t.title}</span>
                        <span className="flex-none text-xs font-semibold text-accent">Start ›</span>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-muted">No topics match “{q}”.</p>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-muted">
          {LESSON_INDEX.length} interactive lessons · completed lessons are tracked on this device
        </p>
      </div>
    </div>
  );
}
