"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Attribution, BoardCards } from "@/components/Content";
import { Badge } from "@/components/ui/Badge";
import { SITE } from "@/lib/data";

/**
 * Catch-all for the 667-course catalog entries. The maths courses have full
 * recreations; every other subject/course renders an informative hub that
 * links out to the original course page.
 */
export default function CourseInner() {
  const sp = useSearchParams();
  const href = sp?.get("href") ?? "";
  const title = sp?.get("title") ?? "Course";
  const isMaths = /^\/(gcse|a-level|as-level)\/maths\/(edexcel|aqa|ocr|wjec|eduqas|ccea)$/.test(href);

  if (isMaths) {
    const board = href.split("/")[3];
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="font-hand text-5xl font-bold">{title}</h1>
        <p className="mt-2 text-muted">Full recreation available:</p>
        <Link
          href={`/gcse/maths/${board}`}
          className="mt-4 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-paper hover:opacity-90"
        >
          Open the recreated course →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Badge tone="accent">Catalogued course</Badge>
      <h1 className="font-hand mt-3 text-5xl font-bold">{title}</h1>
      <p className="mt-3 leading-relaxed text-muted">
        This course is part of the 667-course catalog parsed from the original
        mega-menu (stored in <code className="font-mono text-sm">data/subjects.json</code>).
        The in-depth recreation covers GCSE &amp; A-Level <strong>Maths</strong> —
        the original subject of the site — while every other course is catalogued
        here and links to its live page.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={`${SITE.original}${href}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-ink px-6 py-3 font-semibold text-paper hover:opacity-90"
        >
          Open {title} on the original ↗
        </a>
        <Link href="/" className="rounded-full border border-line px-6 py-3 font-semibold hover:bg-paper-2">
          Back home
        </Link>
      </div>
      <div className="mt-10">
        <BoardCards />
      </div>
      <Attribution href={`${SITE.original}${href}`} />
    </div>
  );
}
