"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SITE } from "@/lib/data";

/**
 * App-style left sidebar used across /gcse pages, matching the original's
 * logged-out navigation rail: Home, Revision Planner, Ask Genie AI,
 * Worksheets, Question Rush, Daily Greens + pinned Ideas/Other footer.
 */

const MAIN = [
  { label: "Home", href: "/", icon: "M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8.5Z" },
  { label: "Revision Planner", href: "/features/revision-planner", icon: "M5 5h14v15H5V5Zm3-2v3m8-3v3M8 11h8M8 15h5" },
  { label: "Ask Genie AI", href: "/ask-genie", genie: true },
  { label: "Worksheets", href: "/gcse/worksheets", icon: "M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7.5 3.5Z M14 3.5V8h4.5 M9 13h6M9 16.5h6" },
  { label: "Question Rush", href: "/gcse/question-rush", icon: "M12 3.5a8.5 8.5 0 1 1-7.3 4.2L3.5 3.5l4.2 1.2A8.46 8.46 0 0 1 12 3.5Z M9.6 9.2a2.5 2.5 0 0 1 4.9.6c0 1.6-2.4 2-2.4 3.4 M12 16.2h.01" },
  { label: "Daily Greens", href: "/gcse/daily-greens", icon: "M5 20c0-8 4-13 14-14 .5 7-2.5 13-10 13-1.5 0-3-.4-4-1Z M5 20c2-5 5-8 9-10" },
];

const OTHER = [
  { label: "Past papers", href: "/gcse/maths/edexcel/papers" },
  { label: "Grade boundaries", href: `${SITE.original}/gcse-grade-boundaries`, ext: true },
  { label: "Mock exam builder", href: "/gcse/maths/edexcel/mock-exam-builder" },
  { label: "Old site", href: "https://old.mathsgenie.co.uk", ext: true },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [otherOpen, setOtherOpen] = useState(false);

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 flex-col justify-between border-r border-line bg-paper px-3 py-5 lg:flex">
      <nav aria-label="Sections" className="space-y-1">
        {MAIN.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                active ? "bg-paper-2 text-ink" : "text-ink/70 hover:bg-paper-2 hover:text-ink"
              }`}
            >
              {item.genie ? (
                <span className="flex size-6 items-center justify-center">
                  <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
                    <path
                      d="M12 3.6c.9-.9 2.3-.4 2.5.7 2.4.6 4.1 2.6 4.1 5 0 1.2-.4 2.3-1.1 3.2.4.5.6 1.1.6 1.7 0 1.7-1.5 3-3.4 3h-5.4c-1.9 0-3.4-1.3-3.4-3 0-.6.2-1.2.6-1.7C5.8 11.6 5.4 10.5 5.4 9.3c0-2.4 1.7-4.4 4.1-5 .2-1.1 1.6-1.6 2.5-.7Z"
                      fill="#2fe4b7"
                    />
                    <circle cx="9.8" cy="10.2" r="1.3" fill="#0a0a0a" />
                    <circle cx="14.2" cy="10.2" r="1.3" fill="#0a0a0a" />
                  </svg>
                </span>
              ) : (
                <svg viewBox="0 0 24 24" className="size-5.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={item.icon} />
                </svg>
              )}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1">
        <a
          href="https://github.com/SyllabAI/MathsGenie/issues"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink/70 transition hover:bg-paper-2 hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="size-5.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
            <path d="M12 3a7 7 0 0 1 7 7c0 2.5-1.3 4-2.5 5.5-.8 1-1.5 2-1.5 3.5h-6c0-1.5-.7-2.5-1.5-3.5C6.3 14 5 12.5 5 10a7 7 0 0 1 7-7Z" />
            <path d="M10 22h4" />
          </svg>
          Ideas + Feedback
        </a>
        <div className="relative">
          <button
            onClick={() => setOtherOpen((v) => !v)}
            aria-expanded={otherOpen}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink/70 transition hover:bg-paper-2 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="size-5.5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
              <circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none" />
              <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
              <circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none" />
            </svg>
            Other
            <span className={`ml-auto text-xs transition-transform ${otherOpen ? "rotate-180" : ""}`} aria-hidden>▾</span>
          </button>
          {otherOpen && (
            <div className="absolute bottom-12 left-0 w-52 rounded-2xl border border-line bg-paper p-2 shadow-xl shadow-black/5">
              {OTHER.map((o) =>
                o.ext ? (
                  <a key={o.label} href={o.href} target="_blank" rel="noopener noreferrer" className="block rounded-xl px-3 py-2 text-sm font-medium hover:bg-paper-2">
                    {o.label} ↗
                  </a>
                ) : (
                  <Link key={o.label} href={o.href} className="block rounded-xl px-3 py-2 text-sm font-medium hover:bg-paper-2">
                    {o.label}
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
