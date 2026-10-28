import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Attribution } from "@/components/Content";
import { GradeBadge } from "@/components/ui/Badge";
import { TopicModes } from "@/components/TopicModes";
import { isBoard, boardLabel, loadTopics, SITE } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ board: string; topic: string }>;
}): Promise<Metadata> {
  const { board, topic } = await params;
  if (!isBoard(board)) return {};
  const doc = await loadTopics(board);
  for (const g of Object.keys(doc.grades)) {
    const t = doc.grades[g].find((x) => x.slug === topic);
    if (t) {
      return {
        title: `${t.title} - ${boardLabel(board)} GCSE Maths Revision`,
        description: `${t.title} revision resources: questions, videos, notes and drills (recreated catalog).`,
      };
    }
  }
  return {};
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ board: string; topic: string }>;
}) {
  const { board, topic } = await params;
  if (!isBoard(board)) notFound();
  const doc = await loadTopics(board);

  let found: { title: string; slug: string; grade: string } | null = null;
  for (const g of Object.keys(doc.grades)) {
    const t = doc.grades[g].find((x) => x.slug === topic);
    if (t) {
      found = { ...t, grade: g };
      break;
    }
  }
  if (!found) notFound();

  return (
    <div>
      {/* Dark hero band, matching the original's night header treatment */}
      <div className="hero-glow relative overflow-hidden bg-night text-paper">
        <div className="grid-fade pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-4 pb-10 pt-8">
          <nav aria-label="Breadcrumb" className="text-sm text-paper/60">
            <Link href="/" className="hover:text-mint">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/gcse" className="hover:text-mint">GCSE</Link>
            <span className="mx-1.5">/</span>
            <Link href={`/gcse/maths/${board}`} className="hover:text-mint">
              {boardLabel(board)}
            </Link>
          </nav>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-paper/50">
            Maths
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="font-hand text-5xl font-bold leading-tight sm:text-6xl">
              {found.title}
            </h1>
            <GradeBadge grade={found.grade} />
          </div>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/70">
            Everything for this topic in one place — worksheets, exam-style
            practice, videos and tools. Recreated catalog; premium modes link
            back to the original site.
          </p>
        </div>
      </div>

      {/* Mode sections on the light body, narrow column like the original */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <TopicModes board={board} topic={topic} />

        <Attribution href={`${SITE.original}/gcse/maths/${board}/${topic}`} />
      </div>
    </div>
  );
}
