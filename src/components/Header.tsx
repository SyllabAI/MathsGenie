"use client";

import Link from "next/link";
import { useState } from "react";
import { coursesByQualification, boardLabel } from "@/lib/data";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Revision planner", href: "/features/revision-planner" },
  { label: "Ask Genie AI", href: "/ask-genie" },
  { label: "Worksheets", href: "/gcse/worksheets" },
  { label: "Question Rush", href: "/gcse/question-rush" },
  { label: "Daily Greens", href: "/gcse/daily-greens" },
  { label: "Ideas + feedback", href: "https://github.com/SyllabAI/MathsGenie/issues" },
];

const QUALIFICATIONS = [
  { key: "gcse", label: "GCSE" },
  { key: "igcse", label: "IGCSE" },
  { key: "a-level", label: "A Level" },
  { key: "as-level", label: "AS Level" },
  { key: "ks2", label: "KS2" },
  { key: "international-a-level", label: "International A Level" },
  { key: "international-as-level", label: "International AS Level" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [qual, setQual] = useState<string>("gcse");
  const [filter, setFilter] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState<boolean | null>(null);

  const courses = coursesByQualification()[qual] ?? [];
  const shown = courses.filter((c) =>
    c.title.toLowerCase().includes(filter.toLowerCase())
  );

  function toggleTheme() {
    const next = !(document.documentElement.classList.contains("dark"));
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("mg-theme", next ? "dark" : "light"); } catch {}
    setDark(next);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
        <Link href="/" className="font-hand text-2xl font-bold tracking-tight">
          Maths<span className="text-accent">Genie</span>
          <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 align-middle text-[10px] font-medium uppercase tracking-wide text-accent">
            Recreation
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-ink/80 hover:bg-paper-2 hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="rounded-full border border-line px-3 py-1.5 text-sm hover:bg-paper-2"
          >
            {dark === null
              ? "◐"
              : dark
              ? "☀"
              : "☾"}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full border border-line px-3 py-1.5 text-sm font-medium hover:bg-paper-2"
            aria-expanded={menuOpen}
          >
            Courses
          </button>
          <a
            href="https://www.mathsgenie.co.uk/auth/signup"
            className="rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-paper hover:opacity-90"
          >
            Sign up
          </a>
          <button
            className="rounded-full border border-line px-3 py-1.5 text-sm lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Courses mega-menu (667-course catalog from data/subjects.json) */}
      {menuOpen && (
        <div className="border-t border-line bg-panel">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex flex-wrap gap-1.5">
              {QUALIFICATIONS.map((q) => (
                <button
                  key={q.key}
                  onClick={() => { setQual(q.key); setFilter(""); }}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                    qual === q.key
                      ? "bg-ink text-paper"
                      : "border border-line hover:bg-paper-2"
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={`Filter ${courses.length} courses…`}
              className="mt-3 w-full rounded-xl border border-line bg-paper px-4 py-2 text-sm outline-none"
            />
            <div className="mt-3 grid max-h-72 grid-cols-1 gap-1 overflow-y-auto sm:grid-cols-2 md:grid-cols-3">
              {shown.slice(0, 180).map((c) => {
                const board = c.board ? ` / ${boardLabel(c.board)}` : "";
                return (
                  <Link
                    key={c.href + c.title}
                    href={`/course?href=${encodeURIComponent(c.href)}&title=${encodeURIComponent(c.title)}`}
                    onClick={() => setMenuOpen(false)}
                    className="truncate rounded-lg px-3 py-1.5 text-sm text-ink/80 hover:bg-paper-2 hover:text-ink"
                  >
                    {c.title}
                    <span className="text-muted">{board}</span>
                  </Link>
                );
              })}
              {shown.length === 0 && (
                <p className="px-3 py-2 text-sm text-muted">No courses match.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {mobileOpen && (
        <nav className="border-t border-line bg-panel px-4 py-2 lg:hidden" aria-label="Mobile">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-paper-2"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
