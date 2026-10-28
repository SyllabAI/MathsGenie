import lessonsData from "@/data/lessons/edexcel.json";

/**
 * Lesson content index — server-safe (plain JSON import), so server
 * components can resolve a topic's lesson before rendering the player.
 */

export type McqOption = { label: string; text: string; correct: boolean; why?: string | null };
export type Step =
  | { kind: "teach" | "example"; heading: string; paragraphs?: string[]; lines?: string[]; icon?: string }
  | { kind: "mcq"; heading: string; question: string; options: McqOption[] }
  | { kind: "fill" | "input"; heading: string; before?: string; question?: string; answer: string; after?: string; hint?: string };

export type Lesson = { title: string; grade: number; steps: Step[] };

export const LESSONS = lessonsData as unknown as Record<string, Lesson>;

export function lessonByTitle(title: string): Lesson | null {
  for (const l of Object.values(LESSONS)) {
    if (l.title === title) return l;
  }
  return null;
}

export const LESSON_INDEX: { slug: string; title: string; grade: number }[] = Object.entries(
  LESSONS
).map(([slug, l]) => ({ slug, title: l.title, grade: l.grade }));
