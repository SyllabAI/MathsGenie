"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SITE } from "@/lib/data";

/**
 * GCSE Subjects grid — pastel-tinted cards with playful gradient
 * illustration tiles and a white label pill, mirroring the original's
 * subject picker. Cards link internally for Maths; everything else
 * links to the original site's course pages.
 */

type Subject = { name: string; tint: string; tile: string; href: string; popular?: boolean; ext?: boolean };

const SUBJECTS: Subject[] = [
  { name: "Maths", tint: "#fde8ec", tile: "from-rose-400 to-red-500", href: "/gcse/maths", popular: true },
  { name: "Combined Science", tint: "#e3f4fe", tile: "from-indigo-400 to-blue-500", href: `${SITE.original}/gcse/combined-science`, ext: true, popular: true },
  { name: "English Language", tint: "#e3f4fe", tile: "from-sky-400 to-blue-500", href: `${SITE.original}/gcse/english-language`, ext: true, popular: true },
  { name: "English Literature", tint: "#e3f4fe", tile: "from-blue-400 to-indigo-500", href: `${SITE.original}/gcse/english-literature`, ext: true, popular: true },
  { name: "History", tint: "#fde3c4", tile: "from-amber-500 to-amber-700", href: `${SITE.original}/gcse/history`, ext: true, popular: true },
  { name: "Physics", tint: "#e9dcfd", tile: "from-violet-400 to-purple-500", href: `${SITE.original}/gcse/physics`, ext: true, popular: true },
  { name: "Spanish", tint: "#fde8ec", tile: "from-red-400 to-rose-500", href: `${SITE.original}/gcse/spanish`, ext: true, popular: true },
  { name: "French", tint: "#e3f4fe", tile: "from-indigo-400 to-indigo-600", href: `${SITE.original}/gcse/french`, ext: true, popular: true },
  { name: "Business", tint: "#e3f4fe", tile: "from-sky-400 to-cyan-500", href: `${SITE.original}/gcse/business`, ext: true, popular: true },
  { name: "Computer Science", tint: "#fde8ec", tile: "from-pink-400 to-fuchsia-500", href: `${SITE.original}/gcse/computer-science`, ext: true, popular: true },
  { name: "Physical Education", tint: "#d9f4e5", tile: "from-emerald-400 to-green-500", href: `${SITE.original}/gcse/physical-education`, ext: true, popular: true },
  { name: "Biology", tint: "#d9f4e5", tile: "from-green-400 to-teal-500", href: `${SITE.original}/gcse/biology`, ext: true, popular: true },
  { name: "Chemistry", tint: "#e3f4fe", tile: "from-cyan-400 to-sky-500", href: `${SITE.original}/gcse/chemistry`, ext: true, popular: true },
  { name: "Geography", tint: "#e3f4fe", tile: "from-blue-400 to-sky-500", href: `${SITE.original}/gcse/geography`, ext: true },
  { name: "Religious Studies", tint: "#d9f4e5", tile: "from-emerald-500 to-green-600", href: `${SITE.original}/gcse/religious-studies`, ext: true },
  { name: "Citizenship", tint: "#fde8ec", tile: "from-rose-400 to-pink-500", href: `${SITE.original}/gcse/citizenship`, ext: true },
  { name: "Sociology", tint: "#fde3c4", tile: "from-orange-400 to-amber-500", href: `${SITE.original}/gcse/sociology`, ext: true },
  { name: "Psychology", tint: "#e9dcfd", tile: "from-purple-400 to-violet-500", href: `${SITE.original}/gcse/psychology`, ext: true },
  { name: "Design & Technology", tint: "#fde3c4", tile: "from-amber-400 to-orange-500", href: `${SITE.original}/gcse/design-and-technology`, ext: true },
  { name: "Media Studies", tint: "#e9dcfd", tile: "from-fuchsia-400 to-purple-500", href: `${SITE.original}/gcse/media-studies`, ext: true },
  { name: "Art & Design", tint: "#fde8ec", tile: "from-pink-400 to-rose-500", href: `${SITE.original}/gcse/art-and-design`, ext: true },
  { name: "Music", tint: "#d9f4e5", tile: "from-teal-400 to-emerald-500", href: `${SITE.original}/gcse/music`, ext: true },
  { name: "Drama", tint: "#fde3c4", tile: "from-orange-400 to-red-400", href: `${SITE.original}/gcse/drama`, ext: true },
  { name: "Food Preparation", tint: "#d3f3fa", tile: "from-cyan-400 to-teal-400", href: `${SITE.original}/gcse/food-preparation-and-nutrition`, ext: true },
];

function SubjectCard({ s }: { s: Subject }) {
  const inner = (
    <div
      className="group flex h-44 flex-col justify-end rounded-3xl p-3 transition-transform hover:-translate-y-0.5"
      style={{ background: s.tint }}
    >
      <div className={`relative flex flex-1 items-end overflow-hidden rounded-2xl bg-gradient-to-br ${s.tile} shadow-sm`}>
        {/* playful abstract shapes (original illustration stand-in) */}
        <svg viewBox="0 0 120 120" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <circle cx="92" cy="26" r="16" fill="#ffffff" opacity="0.25" />
          <path d="M18 96c14-20 8-34 26-44s40-6 50 8-4 34-24 40-42 6-52-4Z" fill="#ffffff" opacity="0.18" />
          <path d="M78 14l4 9 9 4-9 4-4 9-4-9-9-4 9-4 4-9Z" fill="#ffffff" opacity="0.6" />
          <path d="M24 22l2.5 5.5L32 30l-5.5 2.5L24 38l-2.5-5.5L16 30l5.5-2.5L24 22Z" fill="#ffffff" opacity="0.5" />
        </svg>
        <span className="relative m-2.5 rounded-lg bg-white/95 px-2.5 py-1 text-sm font-bold text-ink shadow-sm">
          {s.name}
        </span>
      </div>
    </div>
  );
  return s.ext ? (
    <a href={s.href} target="_blank" rel="noopener noreferrer" className="block">
      {inner}
    </a>
  ) : (
    <Link href={s.href} className="block">
      {inner}
    </Link>
  );
}

export default function SubjectGrid() {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => SUBJECTS.filter((s) => s.name.toLowerCase().includes(q.trim().toLowerCase())),
    [q]
  );
  const popular = filtered.filter((s) => s.popular);
  const others = filtered.filter((s) => !s.popular);

  return (
    <div>
      <h1 className="flex items-center gap-3 font-title text-3xl font-extrabold tracking-tight">
        <svg viewBox="0 0 24 24" className="size-7 text-ink" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2.5 2.5 0 0 1 2 1 2.5 2.5 0 0 1 2-1h4.5A1.5 1.5 0 0 1 20 5.5v12a1.5 1.5 0 0 1-1.5 1.5H14a2.5 2.5 0 0 0-2 1 2.5 2.5 0 0 0-2-1H5.5A1.5 1.5 0 0 1 4 17.5v-12Z" />
          <path d="M12 6v14" />
        </svg>
        GCSE Subjects
      </h1>

      <div className="relative mt-5 max-w-sm">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search subjects..."
          aria-label="Search subjects"
          className="w-full rounded-2xl bg-paper-2 px-11 py-3 text-sm outline-none ring-line transition focus:ring-2"
        />
        <svg viewBox="0 0 20 20" className="pointer-events-none absolute left-4 top-3.5 size-4.5 text-muted" aria-hidden>
          <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="m13 13 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>

      {popular.length > 0 && (
        <>
          <h2 className="mt-8 text-lg font-bold">Popular</h2>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {popular.map((s) => (
              <SubjectCard key={s.name} s={s} />
            ))}
          </div>
        </>
      )}

      {others.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-bold">Other subjects</h2>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {others.map((s) => (
              <SubjectCard key={s.name} s={s} />
            ))}
          </div>
        </>
      )}

      {filtered.length === 0 && (
        <p className="mt-10 text-sm text-muted">No subjects match “{q}”.</p>
      )}
    </div>
  );
}
