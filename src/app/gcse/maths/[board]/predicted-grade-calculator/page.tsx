import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GradeCalculator from "@/components/GradeCalculator";
import { Attribution } from "@/components/Content";
import { isBoard, boardLabel } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ board: string }>;
}): Promise<Metadata> {
  const { board } = await params;
  if (!isBoard(board)) return {};
  return { title: `${boardLabel(board)} GCSE Maths — Predicted Grade Calculator` };
}

export default async function GradeCalculatorPage({
  params,
}: {
  params: Promise<{ board: string }>;
}) {
  const { board } = await params;
  if (!isBoard(board)) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/gcse" className="hover:text-accent">GCSE</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/gcse/maths/${board}`} className="hover:text-accent">{boardLabel(board)}</Link>
        <span className="mx-1.5">/</span>
        <span className="font-medium text-ink">Predicted grade calculator</span>
      </nav>

      <h1 className="font-hand mt-4 text-5xl font-bold">Predicted Grade Calculator</h1>
      <p className="mt-2 max-w-3xl text-muted">
        Drag the sliders to your marks on each paper and see your predicted grade
        plus how far you are from the next boundary — the same slider model the
        original uses, with sample boundaries you can edit. The original loads
        official per-series boundaries from its own data.
      </p>

      <div className="mt-8">
        <GradeCalculator />
      </div>

      <Attribution href={`https://www.mathsgenie.co.uk/gcse/maths/${board}/predicted-grade-calculator`} />
    </div>
  );
}
