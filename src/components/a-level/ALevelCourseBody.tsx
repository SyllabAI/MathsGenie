"use client";

import { useMemo, useState } from "react";
import { SITE } from "@/lib/data";

/**
 * Course body for /a-level/maths/edexcel — mirrors the original's two
 * tabs: "Topics" (search + module accordions, each topic row carrying a
 * progress ring and expanding to its resource links) and "Resources"
 * (categorised Popular/Practice/Learn/Tools tile grid).
 */

type Topic = { slug: string; title: string; href: string };
type Module = { name: string; topics: Topic[] };

function ProgressRing({ label = "0 of 1 completed" }: { label?: string }) {
  return (
    <div role="img" aria-label={label} className="relative size-6 flex-none">
      <svg aria-hidden className="size-6" viewBox="0 0 24 24">
        <circle className="text-ink/10" cx="12" cy="12" fill="none" r="8.25" stroke="currentColor" strokeWidth="3.5" />
      </svg>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`pointer-events-none size-5 shrink-0 opacity-60 transition-transform duration-200 ease-out ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M17.29 8.79a1 1 0 0 0-1.41 0L12 12.67 8.12 8.8a1 1 0 1 0-1.41 1.41l4.7 4.7a1 1 0 0 0 1.42 0l4.7-4.7a1 1 0 0 0 0-1.42Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TopicRow({ topic, index }: { topic: Topic; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="group/subtopic rounded-xl">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="@container relative flex w-full items-center gap-3 rounded-xl px-3 py-3 pr-2 text-left leading-tight text-ink transition-colors hover:bg-paper-2"
      >
        <ProgressRing label={`0 of 4 resources completed`} />
        <span className="min-w-0 flex-auto text-left text-sm font-medium">
          <span className="mr-1.5 text-muted">{index + 1}.</span>
          {topic.title}
        </span>
        <Chevron open={open} />
      </button>
      {open && (
        <div className="pb-2 pl-10 pr-4">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Questions", href: `${SITE.original}${topic.href}/questions` },
              { label: "Video", href: `${SITE.original}${topic.href}/videos` },
              { label: "Worksheet", href: `${SITE.original}${topic.href}/questions` },
            ].map((r) => (
              <a
                key={r.label}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium transition hover:bg-paper-2"
              >
                {r.label} ↗
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const RESOURCES: {
  section: string;
  items: { title: string; desc: string; icon: string; tint: string; href: string; badge?: string; count?: string }[];
}[] = [
  {
    section: "Popular",
    items: [
      {
        title: "Worksheets",
        desc: "Downloadable exam booklets and worksheets per topic",
        icon: "🖨",
        tint: "#d9f4e5",
        href: `${SITE.original}/a-level/maths/edexcel`,
      },
      {
        title: "Papers",
        desc: "Past papers from 2018–2025 with mark schemes and mini tests",
        icon: "📄",
        tint: "#e3f4fe",
        href: `${SITE.original}/a-level/maths/edexcel/papers`,
      },
    ],
  },
  {
    section: "Practice",
    items: [
      {
        title: "Question bank",
        desc: "Practice questions with AI feedback",
        icon: "❓",
        tint: "#e9dcfd",
        href: `${SITE.original}/a-level/maths/edexcel`,
        badge: "Popular",
        count: "12,063 questions",
      },
      {
        title: "Daily Greens",
        desc: "A quick worksheet each day that targets your weaknesses",
        icon: "🌿",
        tint: "#d9f4e5",
        href: `${SITE.original}/a-level/daily-greens`,
      },
    ],
  },
  {
    section: "Learn",
    items: [
      {
        title: "Lessons",
        desc: "Step-by-step lessons and quizzes",
        icon: "📖",
        tint: "#fde3c4",
        href: "/a-level/maths/edexcel/lessons",
      },
      {
        title: "Videos",
        desc: "Master concepts with explainer videos",
        icon: "▶",
        tint: "#e9dcfd",
        href: `${SITE.original}/a-level/maths/edexcel`,
      },
      {
        title: "Flashcards",
        desc: "Remember concepts with active recall",
        icon: "🗂",
        tint: "#e3f4fe",
        href: `${SITE.original}/a-level/maths/edexcel/flashcards`,
      },
    ],
  },
  {
    section: "Tools",
    items: [
      {
        title: "Exam builder",
        desc: "Build a custom mock from exam-style questions",
        icon: "✏️",
        tint: "#f0f1f3",
        href: `${SITE.original}/a-level/maths/edexcel`,
      },
      {
        title: "Paper marker",
        desc: "Upload your answers and get AI-marked feedback",
        icon: "🅰️",
        tint: "#fde8ec",
        href: `${SITE.original}/a-level/maths/edexcel`,
      },
    ],
  },
];

export default function ALevelCourseBody({ modules, topicCount }: { modules: Module[]; topicCount: number }) {
  const [tab, setTab] = useState<"topics" | "resources">("topics");
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      modules
        .map((m) => ({
          ...m,
          topics: m.topics.filter((t) => t.title.toLowerCase().includes(query)),
        }))
        .filter((m) => m.topics.length > 0),
    [modules, query]
  );

  return (
    <div>
      {/* Tabs */}
      <div className="mt-5 flex items-end gap-5 border-b border-line text-sm font-semibold">
        {(
          [
            { key: "topics", label: "Topics", icon: "≡" },
            { key: "resources", label: "Resources", icon: "▦" },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 border-b-[3px] px-1 pb-2.5 pt-1 transition ${
              tab === t.key ? "border-accent text-accent" : "border-transparent text-ink/60 hover:text-ink"
            }`}
            aria-pressed={tab === t.key}
          >
            <span aria-hidden className="text-base leading-none">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "topics" ? (
        <>
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

          <div className="mt-6 flex flex-col gap-4">
            {filtered.map((m) => (
              <section key={m.name} className="rounded-2xl border-2 border-line bg-paper p-1">
                <div className="@container flex items-center gap-3 rounded-xl px-3 py-3 pr-2 transition-colors hover:bg-paper-2">
                  <ProgressRing label={`0 of ${m.topics.length} completed`} />
                  <span className="min-w-0 flex-auto text-base font-semibold">{m.name}</span>
                  <span className="flex-none text-xs text-muted">{m.topics.length} topics</span>
                </div>
                <div className="flex flex-col pl-4">
                  {m.topics.map((t, i) => (
                    <TopicRow key={t.slug} topic={t} index={i} />
                  ))}
                </div>
              </section>
            ))}
            {filtered.length === 0 && (
              <p className="py-10 text-center text-sm text-muted">No topics match “{q}”.</p>
            )}
            <p className="text-center text-xs text-muted">
              {topicCount} topics · topic resources open on the original site
            </p>
          </div>
        </>
      ) : (
        <div className="mt-6 flex flex-col gap-8">
          {RESOURCES.map((group) => (
            <section key={group.section}>
              <h2 className="text-lg font-bold">{group.section}</h2>
              <div className="mt-3 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {group.items.map((r) => (
                  <a
                    key={r.title}
                    href={r.href}
                    target={r.href.startsWith("/") ? undefined : "_blank"}
                    rel={r.href.startsWith("/") ? undefined : "noopener noreferrer"}
                    className="group flex items-start gap-4 rounded-2xl p-2 transition hover:bg-paper-2"
                  >
                    <span
                      className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-2xl"
                      style={{ background: r.tint }}
                      aria-hidden
                    >
                      {r.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-bold group-hover:text-accent">{r.title}</span>
                        {r.badge && (
                          <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold text-white">{r.badge}</span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted">{r.desc}</span>
                      {r.count && <span className="mt-1 block text-xs text-muted">{r.count}</span>}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
