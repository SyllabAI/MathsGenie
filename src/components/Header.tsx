"use client";

import Link from "next/link";
import { useState } from "react";
import { coursesByQualification, boardLabel, SITE } from "@/lib/data";

const QUALIFICATIONS = [
  { key: "gcse", label: "GCSE" },
  { key: "igcse", label: "IGCSE" },
  { key: "a-level", label: "A Level" },
  { key: "as-level", label: "AS Level" },
  { key: "ks2", label: "KS2" },
  { key: "international-a-level", label: "International A Level" },
  { key: "international-as-level", label: "International AS Level" },
];

const FEATURES = [
  { label: "Revision planner", href: "/features/revision-planner" },
  { label: "Mock exam builder", href: "/gcse/maths/edexcel/mock-exam-builder" },
  { label: "Answer marking", href: "/features/answer-marking" },
  { label: "Grade calculator", href: "/gcse/maths/edexcel/predicted-grade-calculator" },
  { label: "Question Rush", href: "/gcse/question-rush" },
  { label: "Daily Greens", href: "/gcse/daily-greens" },
  { label: "Ask Genie AI", href: "/ask-genie" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [qual, setQual] = useState("gcse");
  const [filter, setFilter] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const courses = coursesByQualification()[qual] ?? [];
  const shown = courses.filter((c) =>
    c.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night/90 text-white backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        {/* logo — original lamp mark drawn from scratch */}
        <Link href="/" className="flex items-center gap-2" aria-label="MathsGenie home">
          <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
            <circle cx="16" cy="16" r="15" fill="#2fe4b7" opacity="0.15" />
            <path
              d="M8 20c-1.8 0-3-1.2-3-2.6 0-1.3 1-2.3 2.4-2.5-.2-3.4 2.6-6.4 6.6-6.9 4.4-.5 8.2 1.9 8.9 5.4l4.6 1.2c.9.2 1.5.8 1.5 1.6 0 .9-.8 1.6-1.8 1.6l-3-.1v2.1c0 .7-.5 1.2-1.2 1.2H21l-.8 2.6c-.2.6-.7 1-1.3 1h-6.4c-.7 0-1.2-.5-1.3-1.1L10.5 20H8z"
              fill="#2fe4b7"
            />
            <circle cx="12.5" cy="12.8" r="1.1" fill="#031117" />
          </svg>
          <span className="font-hand text-[26px] font-bold leading-none tracking-tight">
            Maths<span className="text-mint">Genie</span>
          </span>
        </Link>

        {/* primary nav */}
        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Primary">
          <button
            onClick={() => { setMenuOpen((v) => !v); setFeaturesOpen(false); }}
            aria-expanded={menuOpen}
            className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            GCSE
            <Chevron open={menuOpen} />
          </button>
          <Link
            href="/a-level/maths/edexcel"
            className="rounded-full px-3.5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            A-Level
          </Link>
          <button
            onClick={() => { setMenuOpen((v) => !v); setFeaturesOpen(false); }}
            aria-expanded={menuOpen}
            className="rounded-full px-3.5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Find course
          </button>
          <div className="relative">
            <button
              onClick={() => { setFeaturesOpen((v) => !v); setMenuOpen(false); }}
              aria-expanded={featuresOpen}
              className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              Features
              <Chevron open={featuresOpen} />
            </button>
            {featuresOpen && (
              <div className="absolute left-0 top-11 w-60 rounded-2xl border border-white/10 bg-night-2 p-2 shadow-2xl shadow-black/50">
                {FEATURES.map((f) => (
                  <Link
                    key={f.href}
                    href={f.href}
                    onClick={() => setFeaturesOpen(false)}
                    className="block rounded-xl px-3.5 py-2.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                  >
                    {f.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <a
            href="https://github.com/SyllabAI/MathsGenie/issues"
            className="rounded-full px-3.5 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Ideas + feedback
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={SITE.original}
            className="hidden text-sm font-medium text-white/70 transition hover:text-white sm:block"
          >
            Log in
          </a>
          <a
            href={SITE.original}
            className="rounded-full bg-mint px-4.5 py-2 text-sm font-bold text-night transition hover:brightness-110"
          >
            Sign up
          </a>
          <button
            className="rounded-full border border-white/15 px-3 py-2 text-sm lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* mega menu — 667-course catalog from data/subjects.json */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-night-2/95 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
            <div className="flex flex-wrap items-center gap-2">
              {QUALIFICATIONS.map((q) => (
                <button
                  key={q.key}
                  onClick={() => { setQual(q.key); setFilter(""); }}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                    qual === q.key
                      ? "bg-mint text-night"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {q.label}
                </button>
              ))}
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder={`Search ${courses.length} courses…`}
                className="ml-auto w-48 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-mint/50"
              />
            </div>
            <div className="no-scrollbar mt-4 grid max-h-80 grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {shown.slice(0, 200).map((c) => (
                <Link
                  key={c.href + c.title}
                  href={`/course?href=${encodeURIComponent(c.href)}&title=${encodeURIComponent(c.title)}`}
                  onClick={() => setMenuOpen(false)}
                  className="truncate rounded-xl px-3 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
                >
                  {c.title}
                  {c.board ? <span className="text-white/40"> · {boardLabel(c.board)}</span> : null}
                </Link>
              ))}
              {shown.length === 0 && (
                <p className="px-3 py-2 text-sm text-white/50">No courses match.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {mobileOpen && (
        <nav className="border-t border-white/10 bg-night-2 px-4 py-3 lg:hidden" aria-label="Mobile">
          {FEATURES.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/gcse"
            onClick={() => setMobileOpen(false)}
            className="block rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
          >
            Browse GCSE
          </Link>
          <Link
            href="/a-level/maths/edexcel"
            onClick={() => setMobileOpen(false)}
            className="block rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
          >
            Browse A-Level
          </Link>
        </nav>
      )}
    </header>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
