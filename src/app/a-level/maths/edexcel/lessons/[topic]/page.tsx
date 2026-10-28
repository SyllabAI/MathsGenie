import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LessonPlayer from "@/components/alevel/LessonPlayer";
import { Attribution } from "@/components/Content";
import ALevelHubShell from "@/components/alevel/ALevelHubShell";
import {
  alevelLesson,
  alevelLessonSlugs,
  alevelNextLesson,
  alevelOriginalTopicUrl,
  ALEVEL_ORIGINAL_PATH,
} from "@/lib/alevel";

export async function generateStaticParams() {
  return [...alevelLessonSlugs()].map((topic) => ({ topic }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const lesson = alevelLesson(topic);
  if (!lesson) return {};
  return {
    title: `${lesson.title} — A Level Maths Lesson`,
    description: `Interactive step-by-step lesson on ${lesson.title} (Edexcel A Level Maths, ${lesson.module}) — original demo content with worked examples and quick checks.`,
  };
}

export default async function ALevelLessonPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const lesson = alevelLesson(topic);
  if (!lesson) notFound();

  const next = alevelNextLesson(lesson.slug);

  return (
    <ALevelHubShell
      title={lesson.title}
      heading={lesson.title}
      activeTab="Lessons"
      extraCrumb={{ label: "Lessons", href: `${ALEVEL_ORIGINAL_PATH}/lessons` }}
    >
      <div className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
          <span className="rounded-full bg-accent-soft px-3 py-1 text-accent">{lesson.module}</span>
          <span className="rounded-full bg-paper-2 px-3 py-1">interactive lesson</span>
        </div>
      </div>

      <div className="mt-4 max-w-3xl">
        <LessonPlayer
          lesson={lesson}
          practiceUrl={alevelOriginalTopicUrl(lesson.slug)}
          next={
            next
              ? { slug: next.slug, title: next.title, href: `${ALEVEL_ORIGINAL_PATH}/lessons/${next.slug}` }
              : undefined
          }
        />
      </div>

      <Attribution href={alevelOriginalTopicUrl(lesson.slug)} />
    </ALevelHubShell>
  );
}
