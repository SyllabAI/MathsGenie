"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { coursesByQualification, SITE } from "@/lib/data";

const FLYOUT = [
  { label: "GCSE", href: "/gcse" },
  { label: "A Level", href: "/a-level/maths/edexcel" },
  { label: "AS Level", href: `${SITE.original}/aslevel.php` },
  { label: "IGCSE", href: `${SITE.original}/igcse.php` },
  { label: "KS2", href: `${SITE.original}/primary.php` },
  { label: "International A Level", href: `${SITE.original}/newalevel.php` },
  { label: "International AS Level", href: `${SITE.original}/newalevel.php` },
];

const FEATURES = [
  { label: "Revision planner", href: "/features/revision-planner", desc: "Plan your revision schedule" },
  { label: "Mock exam builder", href: "/gcse/maths/edexcel/mock-exam-builder", desc: "Compose a custom paper" },
  { label: "Paper marker", href: "/features/answer-marking", desc: "AI marking for your answers" },
  { label: "Grade calculator", href: "/gcse/maths/edexcel/predicted-grade-calculator", desc: "Predict your final grade" },
  { label: "Question Rush", href: "/gcse/question-rush", desc: "Quick-fire practice game" },
  { label: "Daily Greens", href: "/gcse/daily-greens", desc: "A daily bite of revision" },
  { label: "Ask Genie AI", href: "/ask-genie", desc: "Your AI study partner" },
];

/** Teal genie blob in a black rounded tile — original logo, drawn from scratch. */
function LogoMark() {
  return (
    <span className="flex size-9 items-center justify-center rounded-[10px] bg-ink-solid">
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
        <path
          d="M12 3.6c.9-.9 2.3-.4 2.5.7 2.4.6 4.1 2.6 4.1 5 0 1.2-.4 2.3-1.1 3.2.4.5.6 1.1.6 1.7 0 1.7-1.5 3-3.4 3h-5.4c-1.9 0-3.4-1.3-3.4-3 0-.6.2-1.2.6-1.7C5.8 11.6 5.4 10.5 5.4 9.3c0-2.4 1.7-4.4 4.1-5 .2-1.1 1.6-1.6 2.5-.7Z"
          fill="#2fe4b7"
        />
        <circle cx="9.8" cy="10.2" r="1.5" fill="#0a0a0a" />
        <circle cx="14.2" cy="10.2" r="1.5" fill="#0a0a0a" />
        <path d="M9.6 13.6c1.5 1.1 3.3 1.1 4.8 0" stroke="#0a0a0a" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      </svg>
    </span>
  );
}

export default function Header() {
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [oldChip, setOldChip] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const courses = coursesByQualification();
  const allCourses = Object.values(courses).flat();
  const matches =
    query.trim().length > 1
      ? allCourses
          .filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 6)
      : [];

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!searchRef.current?.contains(e.target as Node)) setQuery((q) => (matches.length ? q : ""));
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [matches.length]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 text-ink backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="MathsGenie home">
          <LogoMark />
          <span className="font-title text-[22px] font-extrabold leading-none tracking-tight">
            MathsGenie
          </span>
        </Link>

        {/* primary nav — pill dropdowns like the original */}
        <nav className="ml-4 hidden items-center gap-1.5 lg:flex" aria-label="Primary">
          <div className="relative">
            <button
              onClick={() => { setFlyoutOpen((v) => !v); setFeaturesOpen(false); }}
              aria-expanded={flyoutOpen}
              className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold transition hover:bg-paper-2"
            >
              Find course
              <Chevron open={flyoutOpen} />
            </button>
            {flyoutOpen && (
              <div className="absolute left-0 top-12 w-64 rounded-2xl border border-line bg-paper p-2 shadow-xl shadow-black/5">
                <p className="px-3 py-1.5 text-xs font-semibold text-muted">Resources</p>
                {FLYOUT.map((f) => (
                  <Link
                    key={f.label}
                    href={f.href}
                    onClick={() => setFlyoutOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-paper-2"
                  >
                    {f.label}
                    <span className="text-muted" aria-hidden>›</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setFeaturesOpen((v) => !v); setFlyoutOpen(false); }}
              aria-expanded={featuresOpen}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-paper-2"
            >
              Features
              <Chevron open={featuresOpen} />
            </button>
            {featuresOpen && (
              <div className="absolute left-0 top-12 w-72 rounded-2xl border border-line bg-paper p-2 shadow-xl shadow-black/5">
                {FEATURES.map((f) => (
                  <Link
                    key={f.href}
                    href={f.href}
                    onClick={() => setFeaturesOpen(false)}
                    className="block rounded-xl px-3 py-2 transition hover:bg-paper-2"
                  >
                    <span className="block text-sm font-semibold">{f.label}</span>
                    <span className="block text-xs text-muted">{f.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {oldChip && (
            <span className="ml-1 flex items-center gap-1 rounded-full border border-line py-1 pl-4 pr-1.5 text-sm font-semibold">
              <a href={SITE.original} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-accent">
                Old site
                <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
                  <path d="M4 2h6v6M10 2 3 9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </a>
              <button
                onClick={() => setOldChip(false)}
                aria-label="Hide the old site link"
                className="flex size-6 items-center justify-center rounded-full transition hover:bg-paper-2"
              >
                ✕
              </button>
            </span>
          )}
        </nav>

        {/* right cluster: search, bell, sign up */}
        <div className="ml-auto flex items-center gap-2.5" ref={searchRef}>
          <div className="relative hidden md:block">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search courses"
              className="w-44 rounded-full bg-paper-2 px-4 py-2 pl-9 text-sm outline-none ring-line transition focus:w-56 focus:ring-2"
            />
            <svg viewBox="0 0 20 20" className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted" aria-hidden>
              <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="m13 13 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            {matches.length > 0 && (
              <div className="absolute right-0 top-11 w-72 rounded-2xl border border-line bg-paper p-2 shadow-xl shadow-black/5">
                {matches.map((c) => (
                  <Link
                    key={c.href + c.title}
                    href={`/course?href=${encodeURIComponent(c.href)}&title=${encodeURIComponent(c.title)}`}
                    onClick={() => setQuery("")}
                    className="block truncate rounded-xl px-3 py-2 text-sm transition hover:bg-paper-2"
                  >
                    {c.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            className="relative hidden size-9 items-center justify-center rounded-full transition hover:bg-paper-2 sm:flex"
            aria-label="Updates (5)"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
              <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 19a2.2 2.2 0 0 0 4 0" strokeLinecap="round" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-[#e7000b] text-[10px] font-bold text-white">
              5
            </span>
          </button>

          <a
            href={`${SITE.original}/auth/signup`}
            className="rounded-full bg-accent px-4.5 py-2 text-sm font-bold text-white transition hover:bg-accent-ink"
          >
            Sign up
          </a>

          <button
            className="flex size-9 items-center justify-center rounded-full transition hover:bg-paper-2 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-line bg-paper px-4 py-3 lg:hidden" aria-label="Mobile">
          {FLYOUT.slice(0, 2).map((f) => (
            <Link key={f.label} href={f.href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-paper-2">
              {f.label}
            </Link>
          ))}
          {FEATURES.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-paper-2 hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`size-3 transition-transform ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
