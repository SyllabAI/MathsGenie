import subjects from "../../data/subjects.json";
import papersEdexcel from "../../data/gcse-maths/papers-edexcel.json";
import alevelEdexcel from "../../data/a-level-maths/topics-edexcel.json";
import siteMap from "../../data/site-map.json";
import designTokens from "../../data/design-tokens.json";
import gcseEdexcel from "../../data/gcse-maths/topics-edexcel.json";

export type Course = { title: string; subject: string; board: string | null; href: string };
export type TopicsDoc = {
  qualification: string;
  subject: string;
  board: string;
  topic_count: number;
  grades: Record<string, { slug: string; title: string; href: string }[]>;
};
export type PapersDoc = {
  qualification: string;
  subject: string;
  board: string;
  spec: string;
  paper_codes: string[];
  series_listed: string[];
  resource_count: number;
  note: string;
  resource_groups: { resource_dir: string; files: string[] }[];
};
export type ALevelDoc = {
  qualification: string;
  subject: string;
  board: string;
  topic_count: number;
  modules: Record<string, { slug: string; title: string; href: string }[]>;
};

export const BOARD_SLUGS = ["edexcel", "aqa", "ocr", "wjec", "eduqas", "ccea"] as const;
export type BoardSlug = (typeof BOARD_SLUGS)[number];

export function isBoard(v: string): v is BoardSlug {
  return (BOARD_SLUGS as readonly string[]).includes(v);
}

export function boardLabel(b: string) {
  return b.charAt(0).toUpperCase() + b.slice(1);
}

export async function loadTopics(board: BoardSlug): Promise<TopicsDoc> {
  const mod = await import(`../../data/gcse-maths/topics-${board}.json`);
  return mod.default as TopicsDoc;
}

/** Ordered grade tabs exactly like the original (Grade 1..8/9). */
export function gradeTabs(doc: TopicsDoc): string[] {
  return Object.keys(doc.grades).sort((a, b) => {
    const na = a === "8/9" ? 8.5 : parseInt(a, 10);
    const nb = b === "8/9" ? 8.5 : parseInt(b, 10);
    return na - nb;
  });
}

export function coursesByQualification(): Record<string, Course[]> {
  const by = (subjects as { by_qualification: Record<string, Course[]> }).by_qualification;
  const out: Record<string, Course[]> = {};
  for (const [qual, list] of Object.entries(by)) {
    out[qual] = list.map((c) => ({
      title: c.title,
      subject: c.subject,
      board: c.board ?? null,
      href: c.href,
    }));
  }
  return out;
}

export function courseCounts() {
  const by = (subjects as { by_qualification: Record<string, unknown[]> }).by_qualification;
  return Object.fromEntries(Object.entries(by).map(([k, v]) => [k, v.length]));
}

export const catalog = {
  subjects,
  papersEdexcel: papersEdexcel as PapersDoc,
  alevelEdexcel: alevelEdexcel as ALevelDoc,
  siteMap,
  designTokens,
  gcseEdexcel: gcseEdexcel as TopicsDoc,
};

export const SITE = {
  original: "https://www.mathsgenie.co.uk",
  attribution:
    "An independent educational recreation. MathsGenie and the awarding bodies own all original content — resources link back to the original site.",
};
