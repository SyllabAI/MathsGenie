import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import GradeTabs from "@/components/GradeTabs";
import { TopicList, Attribution } from "@/components/Content";
import { Badge, TierPill } from "@/components/ui/Badge";
import { isBoard, boardLabel, loadTopics, gradeTabs, BOARD_SLUGS, SITE } from "@/lib/data";

export async function generateStaticParams() {
  return BOARD_SLUGS.map((board) => ({ board }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ board: string }>;
}): Promise<Metadata> {
  const { board } = await params;
  if (!isBoard(board)) return {};
  return {
    title: `${boardLabel(board)} GCSE Maths Revision`,
    description: `Free ${boardLabel(board)} GCSE Maths resources — 134 topics by grade, past papers, mark schemes and revision materials (recreated catalog).`,
  };
}

export default async function BoardPage({
  params,
  searchParams,
}: {
  params: Promise<{ board: string }>;
  searchParams: Promise<{ grade?: string }>;
}) {
  const { board } = await params;
  if (!isBoard(board)) notFound();
  const doc = await loadTopics(board);
  const tabs = gradeTabs(doc);
  const { grade } = await searchParams;
  const active = grade && doc.grades[grade] ? grade : tabs[0];
  const topics = doc.grades[active] ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/gcse" className="hover:text-accent">GCSE</Link>
        <span className="mx-1.5">/</span>
        <span className="font-medium text-ink">Maths · {boardLabel(board)}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-hand text-5xl font-bold">
          {boardLabel(board)} GCSE Maths
        </h1>
        <Badge>Spec 1MA1</Badge>
      </div>
      <p className="mt-2 flex flex-wrap items-center gap-2 text-muted">
        {doc.topic_count} topics · <TierPill tier="F" /> Foundation covers grades 1–5
        · <TierPill tier="H" /> Higher covers grades 4–9
      </p>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        {[
          { label: "Past papers", href: `/gcse/maths/${board}/papers` },
          { label: "Worksheets", href: `/gcse/maths/${board}/worksheets` },
          { label: "Revision guides", href: `/gcse/maths/${board}/revision-guides` },
          { label: "Videos", href: `/gcse/maths/${board}/videos` },
          { label: "Lessons", href: `/gcse/maths/${board}/lessons` },
          { label: "Flashcards", href: `/gcse/maths/${board}/flashcards` },
          { label: "Grade calculator", href: `/gcse/maths/${board}/predicted-grade-calculator` },
          { label: "Mock exam builder", href: `/gcse/maths/${board}/mock-exam-builder` },
        ].map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="rounded-full border border-line bg-panel px-4 py-1.5 font-medium hover:bg-paper-2 hover:text-accent"
          >
            {l.label}
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-hand text-3xl font-bold">Topics by grade</h2>
        <p className="mt-1 text-sm text-muted">
          Grade tabs mirror the original; the topic list for each grade comes from
          the parsed flight payload.
        </p>
        <div className="mt-4">
          <Suspense fallback={<div className="h-14 animate-pulse rounded-2xl bg-paper-2" />}>
            <GradeTabs doc={doc} />
          </Suspense>
        </div>
        <div className="mt-4">
          <TopicList topics={topics} board={board} />
        </div>
      </section>

      <Attribution href={`${SITE.original}/gcse/maths/${board}`} />
    </div>
  );
}
