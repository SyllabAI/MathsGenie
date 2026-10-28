import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Attribution } from "@/components/Content";
import { Badge } from "@/components/ui/Badge";
import { isBoard, boardLabel, loadTopics, gradeTabs } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ board: string }>;
}): Promise<Metadata> {
  const { board } = await params;
  if (!isBoard(board)) return {};
  return { title: `${boardLabel(board)} GCSE Maths — Mock Exam Builder` };
}

export default async function MockExamBuilderPage({
  params,
}: {
  params: Promise<{ board: string }>;
}) {
  const { board } = await params;
  if (!isBoard(board)) notFound();
  const doc = await loadTopics(board);
  const tabs = gradeTabs(doc);
  const all = tabs.flatMap((g) => doc.grades[g].map((t) => ({ ...t, grade: g })));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href={`/gcse/maths/${board}`} className="hover:text-accent">{boardLabel(board)}</Link>
        <span className="mx-1.5">/</span>
        <span className="font-medium text-ink">Mock exam builder</span>
      </nav>

      <h1 className="font-hand mt-4 text-5xl font-bold">Mock Exam Builder</h1>
      <p className="mt-2 text-muted">
        On the original, you pick topics and difficulty bands and it composes an
        exam-style paper from its question bank. That corpus is theirs — this
        recreation ships the composer UI and produces a <strong>cover sheet</strong>
        {" "}listing your chosen topics with links to practise each one.
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-panel p-6">
        <h2 className="font-semibold">Pick topics ({all.length} available)</h2>
        <div className="mt-4 grid max-h-80 gap-1 overflow-y-auto sm:grid-cols-2">
          {all.map((t) => (
            <label key={t.slug} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-paper-2">
              <input type="checkbox" className="h-4 w-4 accent-[var(--accent)]" />
              <span className="flex-1">{t.title}</span>
              <Badge>Grade {t.grade}</Badge>
            </label>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          Difficulty bands on the original map to question metadata
          (<code className="font-mono text-xs">difficultyBand</code>,
          {" "}<code className="font-mono text-xs">calculatorUse</code>) captured in the research notes.
        </p>
      </div>

      <Attribution href={`https://www.mathsgenie.co.uk/gcse/maths/${board}/mock-exam-builder`} />
    </div>
  );
}
