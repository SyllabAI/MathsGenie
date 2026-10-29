"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { TierPill } from "@/components/ui/Badge";
import type { PaperSeries, PastPaper } from "@/lib/papers";

/**
 * Papers index (original layout): search box, type/year filters, series
 * accordion sections, cover-thumbnail cards with "view question paper" /
 * "view mark scheme" buttons — both open our recreated /paper viewer.
 */

export default function PapersIndexClient({
  series,
  years,
}: {
  series: PaperSeries[];
  years: number[];
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [year, setYear] = useState("all");
  const [open, setOpen] = useState<string | null>(series[0]?.series ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return series
      .map((s) => ({
        ...s,
        papers: s.papers.filter((p) => {
          if (type === "foundation" && p.level !== "foundation") return false;
          if (type === "higher" && p.level !== "higher") return false;
          if (year !== "all" && String(p.examYear) !== year) return false;
          if (q && !(`${p.title} ${p.paperLabel ?? ""}`.toLowerCase().includes(q))) return false;
          return true;
        }),
      }))
      .filter((s) => s.papers.length > 0);
  }, [series, query, type, year]);

  const count = filtered.reduce((a, s) => a + s.papers.length, 0);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative">
          <span className="sr-only">Search papers</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search papers..."
            className="w-56 rounded-full border border-line bg-panel px-4 py-2 text-sm outline-none focus:border-accent"
          />
        </label>
        <label>
          <span className="sr-only">Filter papers by type</span>
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-full border border-line bg-panel px-3 py-2 text-sm">
            <option value="all">All papers</option>
            <option value="foundation">Foundation</option>
            <option value="higher">Higher</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Filter papers by year</span>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="rounded-full border border-line bg-panel px-3 py-2 text-sm">
            <option value="all">All years</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
          </select>
        </label>
        <p className="ml-auto text-xs text-muted" aria-live="polite">
          {count} paper{count === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {filtered.map((s) => {
          const isOpen = open === s.series;
          return (
            <section key={s.series} className="overflow-hidden rounded-2xl border border-line bg-panel">
              <button
                onClick={() => setOpen(isOpen ? null : s.series)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-paper-2/60"
              >
                <h2 className="font-hand text-2xl font-bold">{s.series.replace(/ Papers$/, "")}</h2>
                <span className={`text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden>
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                </span>
              </button>
              {isOpen && (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,10rem),1fr))] gap-x-3 gap-y-6 border-t border-line px-5 pb-6 pt-5">
                  {s.papers.map((p) => (
                    <PaperCard key={p.slug} paper={p} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
        {filtered.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line bg-panel px-6 py-10 text-center text-sm text-muted">
            No papers match those filters.
          </p>
        )}
      </div>
    </div>
  );
}

function PaperCard({ paper }: { paper: PastPaper }) {
  return (
    <div className="group row-span-3 grid min-w-0 grid-rows-subgrid content-start gap-y-0">
      <div className="relative">
        <Link
          href={`/paper/edexcel/${paper.slug}`}
          className="block"
          aria-label={`${paper.title}: view question paper`}
        >
          <div className="relative isolate block max-h-[190px] w-full overflow-hidden rounded-2xl border-2 border-line bg-paper-2 px-7 pt-7 transition-colors group-hover:border-accent/50">
            <div className="relative mx-auto aspect-3/4 w-full max-w-[240px] overflow-hidden rounded-xl shadow-xl ring-2 ring-line transition-all group-hover:scale-105">
              {paper.coverUrl ? (
                <Image
                  src={paper.coverUrl}
                  alt=""
                  fill
                  sizes="200px"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-3xl">📄</div>
              )}
            </div>
          </div>
        </Link>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <h3 className="min-w-0 truncate text-sm font-semibold">
          <Link href={`/paper/edexcel/${paper.slug}`} className="hover:text-accent">
            {paper.paperLabel ?? paper.title}
          </Link>
        </h3>
        {paper.tier && <TierPill tier={paper.tier} />}
      </div>
      <div className="mt-2 flex flex-col gap-1.5">
        <Link
          href={`/paper/edexcel/${paper.slug}`}
          className="flex items-center justify-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold text-paper hover:opacity-90"
        >
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6s1.5-2 5-2 5 2 5 2v14s-1.5-1-5-1-5 1-5 1zM22 6s-1.5-2-5-2-5 2-5 2v14s1.5-1 5-1 5 1 5 1z" /></svg>
          View question paper
        </Link>
        {paper.markSchemeUrl && (
          <Link
            href={`/paper/edexcel/${paper.slug}?doc=markscheme`}
            className="flex items-center justify-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11px] font-semibold hover:bg-paper-2"
          >
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14M8 7h8M8 11h8M8 15h5" /></svg>
            View mark scheme
          </Link>
        )}
        {paper.workedSolutionUrl && (
          <Link
            href={`/paper/edexcel/${paper.slug}?doc=markscheme`}
            className="flex items-center justify-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11px] font-semibold hover:bg-paper-2"
          >
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
            View solutions
          </Link>
        )}
      </div>
    </div>
  );
}
