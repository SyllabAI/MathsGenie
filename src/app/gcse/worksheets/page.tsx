import type { Metadata } from "next";
import { Attribution, BoardCards } from "@/components/Content";

export const metadata: Metadata = {
  title: "GCSE Worksheets",
  description: "GCSE Maths worksheets for every board — recreated hub linking to the original booklets.",
};

export default function GcseWorksheetsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-hand text-5xl font-bold">GCSE Worksheets</h1>
      <p className="mt-2 text-muted">
        The original publishes downloadable exam booklets per board. Pick a board
        to see the recreated grade-by-grade worksheet index — each booklet opens on
        the original site.
      </p>
      <div className="mt-8">
        <BoardCards />
      </div>
      <div className="mt-8 rounded-2xl border border-line bg-panel p-6">
        <p className="font-semibold">What the original serves</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
          <li>Grade-separated exam booklets (Grade 1 → 8/9) with matched answer booklets</li>
          <li>Topic worksheets for all 134 topics per board</li>
          <li>Mini tests and 45-minute half-papers for timed practice</li>
        </ul>
      </div>
      <Attribution href="https://www.mathsgenie.co.uk/gcse/worksheets" />
    </div>
  );
}
