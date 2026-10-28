import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Attribution } from "@/components/Content";
import { TierPill } from "@/components/ui/Badge";
import { isBoard, boardLabel, catalog, SITE } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ board: string }>;
}): Promise<Metadata> {
  const { board } = await params;
  if (!isBoard(board)) return {};
  return {
    title: `${boardLabel(board)} GCSE Maths Past Papers`,
    description: `${boardLabel(board)} GCSE Maths (1MA1) past papers by series with mark schemes — catalog recreated, PDFs served by the original site.`,
  };
}

type PaperRow = { paper: string; code: string; tier: "F" | "H" };

function rowsForSeries(_series: string): PaperRow[] {
  return [
    { paper: "Paper 1 · Non-Calculator", code: "1MA1/1F", tier: "F" },
    { paper: "Paper 1 · Non-Calculator", code: "1MA1/1H", tier: "H" },
    { paper: "Paper 2 · Calculator", code: "1MA1/2F", tier: "F" },
    { paper: "Paper 2 · Calculator", code: "1MA1/2H", tier: "H" },
    { paper: "Paper 3 · Calculator", code: "1MA1/3F", tier: "F" },
    { paper: "Paper 3 · Calculator", code: "1MA1/3H", tier: "H" },
  ];
}

export default async function PapersPage({
  params,
}: {
  params: Promise<{ board: string }>;
}) {
  const { board } = await params;
  if (!isBoard(board)) notFound();
  const doc = catalog.papersEdexcel;
  const boardNote =
    board === "edexcel"
      ? "Series and paper codes below come from the parsed Edexcel papers page (15 series, 136 resource URLs)."
      : "Series structure mirrors the Edexcel catalog; the original lists board-specific series on each papers page.";

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
        {boardLabel(board)} GCSE Maths ({doc.spec}) past papers by year and exam
        series, with mark schemes and worked solutions where available.{" "}
        {boardNote} Every button below opens the <strong>original</strong> PDF on
        mathsgenie.co.uk — nothing is re-hosted here.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {doc.paper_codes.map((c) => (
          <span key={c} className="rounded-full bg-paper-2 px-3 py-1 font-mono text-xs">{c}</span>
        ))}
      </div>

      <div className="mt-10 space-y-10">
        {doc.series_listed.map((series) => (
          <section key={series}>
            <h2 className="font-hand text-3xl font-bold">{series} Papers</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {rowsForSeries(series).map((p) => (
                <div key={series + p.code} className="rounded-2xl border border-line bg-panel p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{p.paper}</p>
                    <TierPill tier={p.tier} />
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-muted">{p.code}</p>
                  <div className="mt-3 flex gap-2">
                    <a
                      href={`${SITE.original}/gcse/maths/edexcel/papers`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-full bg-ink px-3 py-1.5 text-center text-xs font-semibold text-paper hover:opacity-90"
                    >
                      Question paper ↗
                    </a>
                    <a
                      href={`${SITE.original}/gcse/maths/edexcel/papers`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-full border border-line px-3 py-1.5 text-center text-xs font-semibold hover:bg-paper-2"
                    >
                      Mark scheme ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Attribution href={`${SITE.original}/gcse/maths/edexcel/papers`} />
    </div>
  );
}
