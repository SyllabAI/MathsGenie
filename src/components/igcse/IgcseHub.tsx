"use client";

import { useMemo, useState } from "react";
import { SITE } from "@/lib/data";

/**
 * /igcse hub body — "IGCSE Subjects", mirroring the original landing:
 * a search field, a horizontally-snapping "Popular" shelf of board-picker
 * cards (Maths links to our rebuilt Edexcel course) and an "Other subjects"
 * grid (cards link back to the original site).
 */

type Sub = { name: string; slug: string; board?: string; popular?: boolean; internal?: boolean };

const POPULAR: Sub[] = [
  { name: "Maths", slug: "maths", internal: true },
  { name: "Combined Science", slug: "combined-science" },
  { name: "English Language", slug: "english-language" },
  { name: "English as a Second Language", slug: "english-as-a-second-language" },
  { name: "English Literature", slug: "english-literature" },
  { name: "History", slug: "history" },
  { name: "Geography", slug: "geography" },
  { name: "Religious Studies", slug: "religious-studies" },
  { name: "Art and Design", slug: "art-and-design" },
  { name: "Biology", slug: "biology" },
  { name: "Chemistry", slug: "chemistry" },
  { name: "Physics", slug: "physics" },
];

const OTHERS: Sub[] = [
  { name: "Spanish", slug: "spanish" },
  { name: "French", slug: "french" },
  { name: "Business", slug: "business" },
  { name: "Computer Science", slug: "computer-science" },
  { name: "Accounting", slug: "accounting" },
  { name: "Economics", slug: "economics" },
  { name: "Further Maths", slug: "further-maths" },
  { name: "German", slug: "german" },
  { name: "ICT", slug: "ict" },
  { name: "Pakistan Studies", slug: "pakistan-studies" },
  { name: "Psychology", slug: "psychology" },
  { name: "Social Studies", slug: "social-studies" },
  { name: "Agriculture", slug: "agriculture", board: "cie" },
  { name: "Arabic", slug: "arabic", board: "edexcel" },
  { name: "Chinese", slug: "chinese", board: "edexcel" },
  { name: "Citizenship Studies", slug: "citizenship-studies", board: "edexcel" },
  { name: "Design and Technology", slug: "design-and-technology", board: "cie" },
  { name: "Drama", slug: "drama", board: "cie" },
  { name: "Enterprise", slug: "enterprise", board: "cie" },
  { name: "Environmental Management", slug: "environmental-management", board: "cie" },
  { name: "Food and Nutrition", slug: "food-and-nutrition", board: "cie" },
  { name: "Islamiyat", slug: "islamiyat", board: "cie" },
  { name: "Italian", slug: "italian", board: "cie" },
  { name: "Latin", slug: "latin", board: "cie" },
  { name: "Marine Science", slug: "marine-science", board: "cie" },
  { name: "Music", slug: "music", board: "cie" },
  { name: "Physical Education", slug: "physical-education", board: "cie" },
  { name: "Physical Science", slug: "physical-science", board: "cie" },
  { name: "Sciences (Co-ordinated, Double)", slug: "sciences-co-ordinated-double", board: "cie" },
  { name: "Sociology", slug: "sociology", board: "oxford-aqa" },
  { name: "Statistics", slug: "statistics", board: "cie" },
  { name: "World Literature", slug: "world-literature", board: "cie" },
];

function subHref(s: Sub) {
  if (s.internal) return "/igcse/maths/edexcel";
  return `${SITE.original}/igcse/${s.slug}${s.board ? `/${s.board}` : ""}`;
}

function ShelfCard({ s }: { s: Sub }) {
  return (
    <a
      href={subHref(s)}
      target={s.internal ? undefined : "_blank"}
      rel={s.internal ? undefined : "noopener noreferrer"}
      className="group relative flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-line px-3 py-6 text-center transition-colors hover:border-ink/20 hover:bg-paper-2"
    >
      <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#e9dcfd] to-[#cfe6ff] text-lg" aria-hidden>
        {s.name.startsWith("Maths") ? "∑" : "📚"}
      </span>
      <span className="text-sm font-semibold leading-tight group-hover:text-accent">{s.name}</span>
      <span className="text-[11px] text-muted">{s.internal ? "Edexcel · rebuilt" : "Choose exam board"}</span>
    </a>
  );
}

export default function IgcseHub() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const match = (s: Sub) => s.name.toLowerCase().includes(query);
  const popular = POPULAR.filter(match);
  const others = OTHERS.filter(match);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 24 24" className="size-7 text-ink" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" strokeLinejoin="round" />
          <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" strokeLinejoin="round" />
          <path d="M9 7h7M9 10.5h5" strokeLinecap="round" />
        </svg>
        <h1 className="text-3xl font-extrabold tracking-tight">IGCSE Subjects</h1>
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
              <div key={s.slug} className="w-[150px] flex-none snap-start sm:w-[172px]">
                <ShelfCard s={s} />
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
              <ShelfCard key={s.slug} s={s} />
            ))}
          </div>
        </section>
      )}

      {popular.length === 0 && others.length === 0 && (
        <p className="mt-12 text-center text-sm text-muted">
          No subjects match “{q}”. Our rebuilt Edexcel Maths course lives under{" "}
          <a href="/igcse/maths/edexcel" className="font-semibold text-accent hover:underline">
            IGCSE Maths
          </a>
          .
        </p>
      )}

      <p className="mt-12 text-center text-xs text-muted">
        Subject pages beyond Maths link back to the original site — this recreation documents
        and rebuilds the Edexcel Maths course in full.
      </p>
    </div>
  );
}
