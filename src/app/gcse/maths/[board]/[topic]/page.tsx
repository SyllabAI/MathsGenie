import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ModeCards, Attribution } from "@/components/Content";
import { GradeBadge } from "@/components/ui/Badge";
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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/gcse" className="hover:text-accent">GCSE</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/gcse/maths/${board}`} className="hover:text-accent">{boardLabel(board)}</Link>
        <span className="mx-1.5">/</span>
        <span className="font-medium text-ink">{found.title}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-hand text-5xl font-bold">{found.title}</h1>
        <GradeBadge grade={found.grade} />
      </div>
      <p className="mt-2 text-muted">
        Every mode the original offers for this topic — recreated links and
        outbound links side by side.
      </p>

      <div className="mt-8">
        <ModeCards board={board} topic={topic} originalHref={`/gcse/maths/${board}/${topic}`} />
      </div>

      <Attribution href={`${SITE.original}/gcse/maths/${board}/${topic}`} />
    </div>
  );
}
