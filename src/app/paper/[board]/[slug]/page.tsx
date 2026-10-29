import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PaperWorkspace from "@/components/paper/PaperWorkspace";
import { paperBySlug } from "@/lib/papers";

/**
 * Original route shape: /paper/{board}/{subject}/{slug}
 * e.g. /paper/gcse/maths/edexcel/gcse-maths-2025-june-1ma1-1f
 * (our board-only segment keeps URLs short while matching the slug space).
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ board: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const paper = paperBySlug(slug);
  if (!paper) return { title: "Paper viewer — Maths Genie (recreation)" };
  return {
    title: `${paper.title} — Paper viewer`,
    description: `View ${paper.title} question paper and mark scheme with annotation tools. PDFs streamed from the original site.`,
  };
}

export default async function PaperViewerPage({
  params,
}: {
  params: Promise<{ board: string; slug: string }>;
}) {
  const { slug } = await params;
  const paper = paperBySlug(slug);
  if (!paper) notFound();
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-zinc-100"><p className="text-sm text-zinc-500">Loading viewer…</p></div>}>
      <PaperWorkspace slug={slug} />
    </Suspense>
  );
}
