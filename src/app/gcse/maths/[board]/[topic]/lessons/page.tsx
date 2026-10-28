import type { Metadata } from "next";
import Link from "next/link";
import LessonPlayer from "@/components/player/LessonPlayer";
import { lessonByTitle } from "@/lib/lessons";
import { isBoard, loadTopics } from "@/lib/data";

type Props = { params: Promise<{ board: string; topic: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const label = topic.replace(/^[^-]+-[^-]+-[^-]+-/, "").replace(/-/g, " ");
  return { title: `${label} - Lesson` };
}

/**
 * /gcse/maths/[board]/[topic]/lessons — full-screen lesson player.
 * Lesson content is keyed by topic title (boards share the GCSE
 * catalogue), so every board serves the same interactive lesson.
 */
export default async function TopicLessonPage({ params }: Props) {
  const { board, topic } = await params;
  if (!isBoard(board)) return null;
  const doc = await loadTopics(board);
  const all = Object.values(doc.grades).flat();
  const t = all.find((x) => x.slug === topic);
  if (!t) return null;

  const lesson = lessonByTitle(t.title);
  if (!lesson) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold">{t.title} — lesson coming soon</h1>
        <p className="mt-2 text-sm text-muted">
          The interactive player is built, but this topic has no lesson steps yet.
        </p>
        <Link
          href={`/gcse/maths/${board}/lessons`}
          className="mt-6 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white hover:bg-accent-ink"
        >
          Back to lessons
        </Link>
      </div>
    );
  }

  return <LessonPlayer board={board} slug={topic} title={t.title} lesson={lesson} />;
}
