import papersPastJson from "../../data/gcse-maths/papers-past-edexcel.json";

/**
 * Past-paper catalog crawled from mathsgenie.co.uk's papers list +
 * /paper/* RSC payloads (see scripts/crawl_past_papers.py). PDFs stay on
 * assets.mathsgenie.co.uk and are streamed client-side into our viewer —
 * nothing is re-hosted in this repo.
 */

export type PastPaper = {
  slug: string;
  title: string;
  level?: "foundation" | "higher" | string;
  paperLabel?: string;
  examYear?: number;
  session?: string;
  tier?: "F" | "H" | null;
  coverUrl?: string | null;
  paperUrl: string | null;
  markSchemeUrl: string | null;
  workedSolutionUrl?: string | null;
  insertUrl?: string | null;
  youtubeVideoUrl?: string | null;
};

export type PaperSeries = {
  series: string;
  slugs: string[];
  papers: PastPaper[];
};

export type PapersPastDoc = {
  qualification: string;
  subject: string;
  board: string;
  spec: string;
  paper_count: number;
  series: PaperSeries[];
  papers_index: Record<string, PastPaper>;
};

export const papersPast = papersPastJson as unknown as PapersPastDoc;

export function paperBySlug(slug: string): PastPaper | null {
  return papersPast.papers_index[slug] ?? null;
}

/** The three documents a viewer pane can show (matches original dropdown). */
export type PaneDoc = "question" | "markscheme" | "formula";

export const FORMULA_SHEET_URL =
  "https://assets.mathsgenie.co.uk/board-resources/gcse-maths/gcse-formulae-to-remember.pdf";

export function paperDocUrl(paper: PastPaper, doc: PaneDoc): string | null {
  if (doc === "question") return paper.paperUrl;
  if (doc === "markscheme") return paper.markSchemeUrl ?? paper.paperUrl;
  return FORMULA_SHEET_URL;
}

export function paperDocLabel(doc: PaneDoc): string {
  if (doc === "question") return "Question paper";
  if (doc === "markscheme") return "Mark scheme";
  return "Formula sheet";
}

/** Saved marks live in localStorage (same behaviour as the original's "log your mark"). */
export type PaperMark = { mark: number; outOf: number; doneOnly?: boolean; at: number };

const MARKS_KEY = "mg-paper-marks-v1";

export function loadMarks(): Record<string, PaperMark> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(MARKS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function saveMark(slug: string, entry: PaperMark | null) {
  if (typeof window === "undefined") return;
  const all = loadMarks();
  if (entry === null) delete all[slug];
  else all[slug] = entry;
  window.localStorage.setItem(MARKS_KEY, JSON.stringify(all));
}
