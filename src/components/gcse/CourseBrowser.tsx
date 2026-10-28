"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

/**
 * Course page body — Topics/Resources tabs, topic search, and grade
 * accordions with radio-circle topic rows, mirroring the original.
 */

type Topic = { slug: string; title: string };

export default function CourseBrowser({
  board,
  grades,
}: {
  board: string;
  grades: { grade: string; topics: Topic[] }[];
}) {
  const [tab, setTab] = useState<"topics" | "resources">("topics");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(grades[0]?.grade ?? null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return null;
    const out: { grade: string; topics: Topic[] }[] = [];
    for (const g of grades) {
      const hits = g.topics.filter((t) => t.title.toLowerCase().includes(needle));
      if (hits.length) out.push({ grade: g.grade, topics: hits });
    }
    return out;
  }, [q, grades]);

  const shown = filtered ?? grades;

  const RESOURCES = [
    { label: "Past papers", desc: "Every series since 2017 with mark schemes", href: `/gcse/maths/${board}/papers` },
    { label: "Predicted papers", desc: "Mocks built from past-paper trends", href: `/gcse/maths/${board}/papers` },
    { label: "Worksheets", desc: "Exam-style booklets by grade", href: "/gcse/worksheets" },
    { label: "Revision guides", desc: "Topic-by-topic study notes", href: `/gcse/maths/${board}/revision-guides` },
    { label: "Videos", desc: "Walkthroughs for every topic", href: `/gcse/maths/${board}/videos` },
    { label: "Lessons", desc: "Interactive practice cards", href: `/gcse/maths/${board}/lessons` },
    { label: "Flashcards", desc: "Active-recall self-testing", href: "/gcse/maths/flashcards" },
    { label: "Mock exam builder", desc: "Compose a custom paper", href: `/gcse/maths/${board}/mock-exam-builder` },
    { label: "Grade calculator", desc: "Predict your final grade", href: `/gcse/maths/${board}/predicted-grade-calculator` },
    { label: "Question Rush", desc: "Timed quick-fire practice", href: "/gcse/question-rush" },
  ];

  return (
    <div>
      {/* tabs */}
      <div className="flex items-center gap-6 border-b border-line">
        <button
          onClick={() => setTab("topics")}
          aria-selected={tab === "topics"}
          role="tab"
          className={`-mb-px flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-bold transition-colors ${
            tab === "topics" ? "border-accent text-accent" : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
            <path d="M5.5 4h8M5.5 8h8M5.5 12h8M2.5 4h.01M2.5 8h.01M2.5 12h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
          Topics
        </button>
        <button
          onClick={() => setTab("resources")}
          aria-selected={tab === "resources"}
          role="tab"
          className={`-mb-px flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-bold transition-colors ${
            tab === "resources" ? "border-accent text-accent" : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
            <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor" />
            <rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor" opacity="0.45" />
            <rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor" opacity="0.45" />
            <rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor" opacity="0.45" />
          </svg>
          Resources
        </button>
      </div>

      {tab === "topics" ? (
        <>
          <div className="relative mt-6 max-w-sm">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search topics..."
              aria-label="Search topics"
              className="w-full rounded-2xl bg-paper-2 px-11 py-3 text-sm outline-none ring-line transition focus:ring-2"
            />
            <svg viewBox="0 0 20 20" className="pointer-events-none absolute left-4 top-3.5 size-4.5 text-muted" aria-hidden>
              <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="m13 13 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>

          <div className="mt-6 space-y-3">
            {shown.map((g) => {
              const isOpen = filtered ? true : open === g.grade;
              return (
                <div key={g.grade} className="overflow-hidden rounded-2xl border border-line bg-white">
                  <button
                    onClick={() => setOpen(isOpen && !filtered ? null : g.grade)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left"
                  >
                    <span className="size-5 rounded-full border-[1.5px] border-ink/25" aria-hidden />
                    <span className="font-title text-base font-bold">Grade {g.grade}</span>
                    <span className="ml-auto text-muted" aria-hidden>
                      <svg viewBox="0 0 12 12" className={`size-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                        <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  {isOpen && (
                    <ul className="border-t border-line px-5 py-2">
                      {g.topics.map((t) => (
                        <li key={t.slug}>
                          <Link
                            href={`/gcse/maths/${board}/${t.slug}`}
                            className="group flex items-center gap-4 rounded-xl px-1 py-2.5 transition hover:bg-paper-2"
                          >
                            <span className="size-5 shrink-0 rounded-full border-[1.5px] border-ink/20 transition group-hover:border-accent" aria-hidden />
                            <span className="text-sm font-semibold group-hover:text-accent">{t.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
            {shown.length === 0 && (
              <p className="py-6 text-sm text-muted">No topics match “{q}”.</p>
            )}
          </div>
        </>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {RESOURCES.map((r) => (
            <Link
              key={r.label}
              href={r.href}
              className="group rounded-2xl border border-line bg-white p-5 transition hover:border-accent/50 hover:shadow-sm"
            >
              <p className="font-semibold group-hover:text-accent">{r.label}</p>
              <p className="mt-1 text-sm text-muted">{r.desc}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
