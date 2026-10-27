import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Attribution } from "@/components/Content";
import { Badge } from "@/components/ui/Badge";
import { isBoard, boardLabel, loadTopics } from "@/lib/data";
import { SAMPLE_QUESTIONS } from "@/lib/questions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ board: string; topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  return { title: `${topic.replace(/-/g, " ")} - Questions` };
}

export default async function TopicQuestionsPage({
  params,
}: {
  params: Promise<{ board: string; topic: string }>;
}) {
  const { board, topic } = await params;
  if (!isBoard(board)) notFound();
  const doc = await loadTopics(board);

  let title = topic.replace(/-/g, " ");
  let grade: string | null = null;
  outer: for (const g of Object.keys(doc.grades)) {
    for (const t of doc.grades[g]) {
      if (t.slug === topic) {
        title = t.title;
        grade = g;
        break outer;
      }
    }
  }

  // Sample questions are OUR OWN compositions matching the topic/grade (see lib/questions.ts)
  const samples = SAMPLE_QUESTIONS.filter(
    (q) => (grade && q.grade === grade) || q.topic.toLowerCase().includes(topic.split("-").slice(3).join(" ") || "")
  ).slice(0, 5);
  const shown = samples.length ? samples : SAMPLE_QUESTIONS.filter((q) => q.grade === (grade ?? "3")).slice(0, 4);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href={`/gcse/maths/${board}`} className="hover:text-accent">{boardLabel(board)} GCSE Maths</Link>
        <span className="mx-1.5">/</span>
        <Link href={`/gcse/maths/${board}/${topic}`} className="hover:text-accent">{title}</Link>
        <span className="mx-1.5">/</span>
        <span className="font-medium text-ink">Questions</span>
      </nav>

      <h1 className="font-hand mt-4 text-4xl font-bold">{title} — Questions</h1>
      <p className="mt-2 text-muted">
        The original serves a full per-topic question bank with mark-by-mark
        feedback. Below are original sample questions written for this recreation,
        in the same card pattern (marks pill, calculator flag, reveal answer).
      </p>

      <div className="mt-8 space-y-4">
        {shown.map((q) => (
          <details key={q.id} className="group rounded-2xl border border-line bg-panel p-5">
            <summary className="cursor-pointer list-none">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="dark">{q.marks} mark{q.marks > 1 ? "s" : ""}</Badge>
                <Badge>{q.calculator ? "Calculator" : "Non-calculator"}</Badge>
                <Badge tone="accent">Grade {q.grade}</Badge>
              </div>
              <p className="mt-3 font-medium">{q.prompt}</p>
            </summary>
            <div className="mt-4 rounded-xl bg-paper-2 p-4 text-sm">
              <p className="font-semibold text-accent">Answer: {q.answer}</p>
              {q.working && <p className="mt-1 text-muted">Working: {q.working}</p>}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/gcse/question-rush"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:opacity-90"
        >
          ⚡ Try Question Rush
        </Link>
        <a
          href={`https://www.mathsgenie.co.uk/gcse/maths/${board}/${topic}/questions`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-line bg-panel px-5 py-2.5 text-sm font-semibold hover:bg-paper-2"
        >
          Full question bank on the original ↗
        </a>
      </div>

      <Attribution href={`https://www.mathsgenie.co.uk/gcse/maths/${board}/${topic}/questions`} />
    </div>
  );
}
