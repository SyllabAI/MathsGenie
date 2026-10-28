import type { Metadata } from "next";
import Link from "next/link";
import LessonsFilter from "@/components/alevel/LessonsFilter";
import { Attribution } from "@/components/Content";
import ALevelHubShell from "@/components/alevel/ALevelHubShell";
import {
  alevelLessonSlugs,
  ALEVEL_MODULE_ORDER,
  ALEVEL_ORIGINAL_PATH,
  alevelOriginalLessonsUrl,
  alevelOriginalUrl,
  alevelTopics,
} from "@/lib/alevel";

export const metadata: Metadata = {
  title: "A Level Maths Lessons",
  description:
    "Step-by-step Edexcel A Level Maths lessons by topic — interactive recreated lessons plus outbound links to the original's lesson library.",
};

export default function ALevelLessonsPage() {
  const doc = alevelTopics;
  const lessons = alevelLessonSlugs();
  const lessonCount = lessons.size;

  const groups = ALEVEL_MODULE_ORDER.map((mod) => ({ mod, topics: doc.modules[mod] }));

  return (
    <ALevelHubShell title="Lessons" activeTab="Lessons">
      <div className="mt-6 max-w-3xl">
        <p className="text-[15px] leading-relaxed text-ink/70">
          Step-by-step Edexcel A Level Maths lessons by topic, building up to
          exam-style questions. Start with the pure algebra and calculus toolkit —
          almost every statistics and mechanics topic on the course depends on it.
        </p>
        <p className="mt-2 text-sm text-muted">
          <span className="font-bold text-accent">{lessonCount} interactive lessons</span>{" "}
          (original demo content, work in this recreation) · every other topic opens
          the original&apos;s lesson library.
        </p>
      </div>

      <LessonsFilter
        pills={["All", "Year 1", "Year 2"]}
        groups={groups.map((g) => ({
          key: g.mod,
          label: g.mod,
          group: g.mod.startsWith("Year 1") ? "Year 1" : "Year 2",
          topics: g.topics.map((t) => ({
            slug: t.slug,
            title: t.title,
            hasLesson: lessons.has(t.slug),
            lessonHref: `${ALEVEL_ORIGINAL_PATH}/lessons/${t.slug}`,
            originalHref: alevelOriginalLessonsUrl(t.slug),
          })),
        }))}
      />

      <p className="mt-8 text-sm text-muted">
        Looking for a topic that isn&apos;t here? Every module of the course is on
        the{" "}
        <Link href={ALEVEL_ORIGINAL_PATH} className="font-semibold text-accent hover:underline">
          A Level Maths hub
        </Link>
        .
      </p>

      <Attribution href={alevelOriginalUrl(`${ALEVEL_ORIGINAL_PATH}/lessons`)} />
    </ALevelHubShell>
  );
}
