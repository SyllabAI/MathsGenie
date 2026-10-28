import type { Metadata } from "next";
import LessonsHub from "@/components/player/LessonsHub";
import { gradeTabs, isBoard, loadTopics } from "@/lib/data";

export const metadata: Metadata = { title: "GCSE Maths Lessons" };

/**
 * /gcse/maths/[board]/lessons — interactive lessons hub (original
 * layout: hero, search, grade accordions with per-topic progress).
 */
export default async function LessonsPage({ params }: { params: Promise<{ board: string }> }) {
  const { board } = await params;
  if (!isBoard(board)) return null;
  const doc = await loadTopics(board);
  const groups = gradeTabs(doc).map((grade) => ({
    grade,
    topics: doc.grades[grade].map((t) => ({ slug: t.slug, title: t.title })),
  }));
  return <LessonsHub board={board} groups={groups} />;
}
