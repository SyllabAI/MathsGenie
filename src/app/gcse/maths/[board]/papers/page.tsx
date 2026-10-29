import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Attribution } from "@/components/Content";
import { isBoard, boardLabel, catalog, SITE } from "@/lib/data";
import { papersPast, type PastPaper } from "@/lib/papers";
import PapersIndexClient from "@/components/paper/PapersIndexClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ board: string }>;
}): Promise<Metadata> {
  const { board } = await params;
  if (!isBoard(board)) return {};
  return {
    title: `${boardLabel(board)} GCSE Maths Past Papers`,
    description: `${boardLabel(board)} GCSE Maths (1MA1) past papers by series — view question papers and mark schemes in the built-in paper viewer.`,
  };
}

export default async function PapersPage({
  params,
}: {
  params: Promise<{ board: string }>;
}) {
  const { board } = await params;
  if (!isBoard(board)) notFound();

  if (board !== "edexcel") {
    const doc = catalog.papersEdexcel;
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link href="/gcse" className="hover:text-accent">GCSE</Link>
          <span className="mx-1.5">/</span>
          <Link href={`/gcse/maths/${board}`} className="hover:text-accent">{boardLabel(board)}</Link>
          <span className="mx-1.5">/</span>
          <span className="font-medium text-ink">Past papers</span>
        </nav>
        <h1 className="font-hand mt-4 text-5xl font-bold">{boardLabel(board)} GCSE Maths — Past Papers</h1>
        <p className="mt-2 max-w-3xl text-muted">
          {boardLabel(board)} GCSE Maths ({doc.spec}) past papers. The recreated viewer currently catalogues the
          Edexcel series in full; every Edexcel paper below opens in the split-pane viewer with mark scheme,
          formula sheet, annotation tools and the exam calculator.
        </p>
        <div className="mt-6 rounded-2xl border border-line bg-panel p-6">
          <p className="text-sm text-muted">
            {boardLabel(board)} papers remain on the original site for now — the crawler maps them exactly like the
            Edexcel set, so they can be added on request.
          </p>
          <a
            href={`${SITE.original}/gcse/maths/${board}/papers`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper hover:opacity-90"
          >
            Open {boardLabel(board)} papers on mathsgenie.co.uk ↗
          </a>
        </div>
        <Attribution href={`${SITE.original}/gcse/maths/edexcel/papers`} />
      </div>
    );
  }

  const series = papersPast.series;
  const all: PastPaper[] = series.flatMap((s) => s.papers);
  const years = [...new Set(all.map((p) => p.examYear).filter((y): y is number => !!y))].sort((a, b) => b - a);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/gcse" className="hover:text-accent">GCSE</Link>
        <span className="mx-1.5">/</span>
        <Link href="/gcse/maths/edexcel" className="hover:text-accent">Maths Edexcel</Link>
        <span className="mx-1.5">/</span>
        <span className="font-medium text-ink">Papers</span>
      </nav>

      <h1 className="font-hand mt-3 text-5xl font-bold">Maths Papers</h1>
      <p className="mt-2 max-w-3xl text-muted">
        Edexcel GCSE Maths ({papersPast.spec}) — {all.length} papers across {series.length} exam series. Every paper
        opens in the recreated <strong>paper viewer</strong>: question paper and mark scheme side by side, formula
        sheet, annotation toolbar and the exam calculator. PDFs stream from the original site.
      </p>

      <PapersIndexClient series={series} years={years} />

      <Attribution href={`${SITE.original}/gcse/maths/edexcel/papers`} />
    </div>
  );
}
