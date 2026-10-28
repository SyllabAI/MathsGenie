import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QuestionPlayer from "@/components/player/QuestionPlayer";
import { isBoard, loadTopics } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ board: string; topic: string; qid: string }>;
}): Promise<Metadata> {
  const { topic, qid } = await params;
  return {
    title: `${topic.replace(/-/g, " ")} — Question ${qid.replace(/^q/i, "")}`,
  };
}

/**
 * /gcse/maths/[board]/[topic]/questions/q[N] — the question player with
 * focus mode (original anatomy: research/04-member-area.md §6; evidence
 * crawl_raw/member/18-question-ui.png + 19-markscheme.png). Standard
 * header/footer are stripped by Chrome.tsx on this route; the player
 * renders its own minimal chrome.
 */
export default async function QuestionPlayerPage({
  params,
}: {
  params: Promise<{ board: string; topic: string; qid: string }>;
}) {
  const { board, topic, qid } = await params;
  if (!isBoard(board)) notFound();

  const n = parseInt(qid.replace(/^q/i, ""), 10);
  if (!Number.isFinite(n) || n < 1) notFound();

  const doc = await loadTopics(board);
  let title = topic.replace(/-/g, " ");
  let grade = "3";
  outer: for (const g of Object.keys(doc.grades)) {
    for (const t of doc.grades[g]) {
      if (t.slug === topic) {
        title = t.title;
        grade = g;
        break outer;
      }
    }
  }

  return <QuestionPlayer board={board} topic={topic} title={title} grade={grade} initialN={n} />;
}
