import topicsDocJson from "../../data/as-level-maths/topics-edexcel.json";
import { SITE } from "./data";

/**
 * AS-Level (Edexcel Maths, Spec 8MA0) catalog — captured from the live
 * /as-level/maths/edexcel course page on 2026-10-29 (research/11).
 * 24 parent topics across AS Pure Mathematics / AS Statistics /
 * AS Mechanics, each with its subsection breakdown preserved in the data.
 */

export type ASLevelTopic = {
  slug: string;
  title: string;
  href: string;
  subsections?: { slug: string; title: string; href: string }[];
};

export type ASLevelTopicsDoc = {
  qualification: string;
  subject: string;
  board: string;
  spec: string;
  topic_count: number;
  subsection_count: number;
  modules: Record<string, ASLevelTopic[]>;
  assessment: { paper: string; format: string; duration: string; marks: string; weight: string }[];
  captured: string;
  source: string;
};

export const aslevelTopics = topicsDocJson as unknown as ASLevelTopicsDoc;

export const ASLEVEL_MODULE_ORDER = Object.keys(aslevelTopics.modules);

export function aslevelTopicList(): (ASLevelTopic & { module: string })[] {
  return ASLEVEL_MODULE_ORDER.flatMap((m) =>
    aslevelTopics.modules[m].map((t) => ({ ...t, module: m })),
  );
}

/** Base path of the AS course on the original site (route taxonomy mirrored). */
export const ASLEVEL_ORIGINAL_PATH = "/as-level/maths/edexcel";

export const aslevelOriginalUrl = (path: string) => `${SITE.original}${path}`;

export type ASLevelHubTab = { label: string; href: string; icon: string; external: boolean };

export function aslevelHubTabs(active: string): ASLevelHubTab[] {
  const O = ASLEVEL_ORIGINAL_PATH;
  const tabs: ASLevelHubTab[] = [
    { label: "All resources", href: "/as-level/maths/edexcel", icon: "▦", external: false },
    { label: "Question bank", href: aslevelOriginalUrl(`${O}/questions`), icon: "◉", external: true },
    { label: "Worksheets", href: aslevelOriginalUrl(`${O}/worksheets`), icon: "🖨", external: true },
    { label: "Papers", href: aslevelOriginalUrl(`${O}/papers`), icon: "📄", external: true },
    { label: "Mini tests", href: aslevelOriginalUrl(`${O}/mini-tests`), icon: "⏱", external: true },
    { label: "Lessons", href: aslevelOriginalUrl(`${O}/lessons`), icon: "📖", external: true },
    { label: "Videos", href: aslevelOriginalUrl(`${O}/videos`), icon: "▶", external: true },
    { label: "Flashcards", href: aslevelOriginalUrl(`${O}/flashcards`), icon: "🗂", external: true },
    { label: "Exam builder", href: aslevelOriginalUrl(`${O}/mock-exam-builder`), icon: "🧪", external: true },
    { label: "Paper marker", href: aslevelOriginalUrl(`${O}/paper-marker`), icon: "🖊", external: true },
    { label: "Grade calculator", href: aslevelOriginalUrl(`${O}/predicted-grade-calculator`), icon: "🎛", external: true },
    { label: "Daily Greens", href: "/as-level/daily-greens", icon: "🌿", external: false },
  ];
  return tabs;
}
