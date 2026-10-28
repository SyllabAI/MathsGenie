import topicsDocJson from "../../data/a-level-maths/topics-edexcel.json";
import lessonsDocJson from "../../data/a-level-maths/lessons-edexcel.json";
import { SITE } from "./data";

/** One topic row of the parsed Edexcel A-Level catalog (slug-preserving). */
export type ALevelTopic = { slug: string; title: string; href: string };

export type ALevelTopicsDoc = {
  qualification: string;
  subject: string;
  board: string;
  spec: string;
  topic_count: number;
  modules: Record<string, ALevelTopic[]>;
  modes: string[];
  regroup_note?: string;
};

/** A quick-check question inside a lesson's check step. */
export type LessonQuestion =
  | {
      type: "mcq";
      prompt: string;
      options: string[];
      answer: number;
      explain: string;
    }
  | {
      type: "numeric";
      prompt: string;
      answer: string;
      accept: string[];
      explain: string;
    };

export type LessonStep =
  | {
      kind: "concept";
      title: string;
      body: string[];
      example: { problem: string; lines: string[]; takeaway: string };
    }
  | {
      kind: "check";
      title: string;
      questions: LessonQuestion[];
    };

/** An original-composition interactive lesson (UI demo content). */
export type ALevelLesson = {
  slug: string;
  title: string;
  module: string;
  minutes: number;
  keyIdea: string;
  objectives: string[];
  steps: LessonStep[];
};

export type ALevelLessonsDoc = {
  qualification: string;
  subject: string;
  board: string;
  spec: string;
  note: string;
  lessons: ALevelLesson[];
};

export const alevelTopics = topicsDocJson as unknown as ALevelTopicsDoc;
export const alevelLessonsDoc = lessonsDocJson as unknown as ALevelLessonsDoc;

/** Module order as the live site presents it (Year 1 → Year 2). */
export const ALEVEL_MODULE_ORDER = Object.keys(alevelTopics.modules);

/** All topics flat, in module order. */
export function alevelTopicList(): (ALevelTopic & { module: string })[] {
  return ALEVEL_MODULE_ORDER.flatMap((m) =>
    alevelTopics.modules[m].map((t) => ({ ...t, module: m })),
  );
}

const lessonBySlug = new Map(alevelLessonsDoc.lessons.map((l) => [l.slug, l]));

export function alevelLesson(slug: string): ALevelLesson | undefined {
  return lessonBySlug.get(slug);
}

/** Slugs that have an interactive (recreated) lesson. */
export function alevelLessonSlugs(): Set<string> {
  return new Set(lessonBySlug.keys());
}

/** The next lesson in data order, for the player's "next" affordance. */
export function alevelNextLesson(slug: string): ALevelLesson | undefined {
  const idx = alevelLessonsDoc.lessons.findIndex((l) => l.slug === slug);
  if (idx === -1) return undefined;
  return alevelLessonsDoc.lessons[(idx + 1) % alevelLessonsDoc.lessons.length];
}

/** Base path of the course on the original site (route taxonomy mirrored). */
export const ALEVEL_ORIGINAL_PATH = "/a-level/maths/edexcel";

export const alevelOriginalTopicUrl = (slug: string) =>
  `${SITE.original}${ALEVEL_ORIGINAL_PATH}/${slug}`;

export const alevelOriginalLessonsUrl = (slug: string) =>
  `${SITE.original}${ALEVEL_ORIGINAL_PATH}/${slug}/lessons`;

export const alevelOriginalUrl = (path: string) => `${SITE.original}${path}`;

/**
 * A-Level resource tab taxonomy observed on the original's member-era course
 * pages (research/04-member-area.md + live 2026-10-29). Internal routes are
 * used where this recreation ships a working page; everything else links out.
 */
export type ALevelHubTab = { label: string; href: string; icon: string; external?: boolean };

export function alevelHubTabs(active: string): ALevelHubTab[] {
  const tabs: ALevelHubTab[] = [
    { label: "All resources", href: ALEVEL_ORIGINAL_PATH, icon: "▦" },
    { label: "Question bank", href: alevelOriginalUrl(`${ALEVEL_ORIGINAL_PATH}/questions`), icon: "◉", external: true },
    { label: "Worksheets", href: alevelOriginalUrl("/a-level/worksheets"), icon: "🖨", external: true },
    { label: "Papers", href: alevelOriginalUrl(`${ALEVEL_ORIGINAL_PATH}/papers`), icon: "📄", external: true },
    { label: "Revision Guides", href: alevelOriginalUrl(`${ALEVEL_ORIGINAL_PATH}/revision-guides`), icon: "📘", external: true },
    { label: "Lessons", href: `${ALEVEL_ORIGINAL_PATH}/lessons`, icon: "📖" },
    { label: "Videos", href: alevelOriginalUrl(`${ALEVEL_ORIGINAL_PATH}/videos`), icon: "▶", external: true },
    { label: "Flashcards", href: alevelOriginalUrl(`${ALEVEL_ORIGINAL_PATH}/flashcards`), icon: "🗂", external: true },
    { label: "Exam builder", href: alevelOriginalUrl(`${ALEVEL_ORIGINAL_PATH}/mock-exam-builder`), icon: "🧪", external: true },
    { label: "Paper marker", href: alevelOriginalUrl(`${ALEVEL_ORIGINAL_PATH}/paper-marker`), icon: "🖊", external: true },
    { label: "Teach Genie", href: `${ALEVEL_ORIGINAL_PATH}/teach-genie`, icon: "🧞" },
    { label: "Grade calculator", href: alevelOriginalUrl(`${ALEVEL_ORIGINAL_PATH}/predicted-grade-calculator`), icon: "🎛", external: true },
    { label: "Daily Greens", href: alevelOriginalUrl("/a-level/daily-greens"), icon: "🌿", external: true },
  ];
  return tabs;
}
