import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Attribution } from "@/components/Content";
import { TopicModes } from "@/components/TopicModes";
import { isBoard, boardLabel, loadTopics, SITE } from "@/lib/data";

const SPEC_CODES: Record<string, string> = {
  edexcel: "1MA1",
  aqa: "8300",
  ocr: "J560",
};

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

/** Short original study-note intro for a handful of sample topics. */
const INTROS: Record<string, string> = {
  substitution: "Learn how to replace letters with numbers carefully, including negatives, brackets, powers and formulae.",
};

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

  const intro =
    INTROS[topic] ??
    `Revise ${found.title} with exam-style questions, worksheets, worked solutions and revision notes — everything the original site publishes for this topic, catalogued and linked.`;

  return (
    <div>
      {/* aurora hero band */}
      <div className="aurora-hero">
        <div className="mx-auto max-w-4xl px-4 pb-8 pt-8 sm:px-8">
          <div className="flex items-center justify-between gap-4 text-sm">
            <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-1.5 text-ink/70">
              <Link href="/gcse" className="font-medium hover:text-accent">GCSE</Link>
              <span className="text-ink/40" aria-hidden>›</span>
              <Link href={`/gcse/maths/${board}`} className="font-medium hover:text-accent">
                Maths {boardLabel(board)}
              </Link>
              <span className="text-ink/40" aria-hidden>›</span>
              <span className="truncate font-bold text-ink">{found.title}</span>
            </nav>
            <p className="shrink-0 text-ink/60">
              Spec <span className="font-bold text-ink">{SPEC_CODES[board] ?? "—"}</span>
            </p>
          </div>

          <h1 className="font-title mt-3 text-4xl font-extrabold tracking-tight">{found.title}</h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink/70">
            Revise {boardLabel(board)} GCSE Maths {found.title} with the worksheets,
            question bank, question rush, lessons, revision guides, videos, and flashcards.
          </p>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink/70">{intro}</p>
          <p className="mt-2 text-sm font-semibold text-ink/50">Grade {found.grade}</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
        <TopicModes board={board} topic={topic} />
        <Attribution href={`${SITE.original}/gcse/maths/${board}/${topic}`} />
      </div>
    </div>
  );
}
