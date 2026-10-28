import { SITE } from "@/lib/data";

/**
 * A-Level subject catalogue mirroring the original /a-level hub:
 * "Popular" shelf + "Other subjects" grid. Cover art is hot-linked
 * from the original's CDN (assets.mathsgenie.co.uk/subject-covers)
 * — nothing is re-hosted, matching the project's linking policy.
 */

export type ALevelSubject = {
  name: string;
  slug: string;
  cover: string;
  /** boards shown in the "Choose exam board" menu; omit → direct link */
  boards?: { label: string; slug: string }[];
  popular?: boolean;
  /** href overrides (Old Maths lives on the legacy site) */
  hrefOverride?: string;
};

const MATHS_BOARDS = [
  { label: "AQA", slug: "aqa" },
  { label: "Edexcel", slug: "edexcel" },
  { label: "OCR", slug: "ocr" },
  { label: "Edexcel (Legacy)", slug: "edexcel-legacy" },
  { label: "OCR (MEI)", slug: "ocr-mei" },
  { label: "WJEC", slug: "wjec" },
  { label: "CCEA", slug: "ccea" },
];

const SCI_BOARDS = [
  { label: "AQA", slug: "aqa" },
  { label: "Edexcel", slug: "edexcel" },
  { label: "OCR A", slug: "ocr-a" },
  { label: "OCR B", slug: "ocr-b" },
  { label: "WJEC", slug: "wjec" },
  { label: "CCEA", slug: "ccea" },
];

export const ALEVEL_SUBJECTS: ALevelSubject[] = [
  // ---- Popular (order matches the original shelf) ----
  { name: "Maths", slug: "maths", cover: "ib-math-aa.jpg", popular: true, boards: MATHS_BOARDS },
  { name: "Further Maths", slug: "further-maths", cover: "ib-math-ai.jpg", popular: true, boards: MATHS_BOARDS },
  { name: "Psychology", slug: "psychology", cover: "ib-psychology-new.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }] },
  { name: "Biology", slug: "biology", cover: "ib-biology-new.jpg", popular: true, boards: SCI_BOARDS },
  { name: "Chemistry", slug: "chemistry", cover: "ib-chemistry-new.jpg", popular: true, boards: SCI_BOARDS },
  { name: "Business", slug: "business", cover: "ib-business-management.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }] },
  { name: "Physics", slug: "physics", cover: "ib-physics.jpg", popular: true, boards: SCI_BOARDS },
  { name: "History", slug: "history", cover: "ib-history.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }] },
  { name: "Sociology", slug: "sociology", cover: "myp-i-and-s.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }] },
  { name: "Economics", slug: "economics", cover: "ib-economics.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }] },
  { name: "Art and Design", slug: "art-and-design", cover: "ib-design-tech-art.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }] },
  { name: "Geography", slug: "geography", cover: "ib-geography-new.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }] },
  { name: "English Literature", slug: "english-literature", cover: "ib-english-lit-new.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }] },
  { name: "Politics", slug: "politics", cover: "ib-global-politics.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }] },
  { name: "Computer Science", slug: "computer-science", cover: "ib-computer-science-new.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "OCR", slug: "ocr" }] },
  // ---- Other subjects (alphabetical, as on the original) ----
  { name: "Accounting", slug: "accounting", cover: "ib-business-management.jpg" },
  { name: "Arabic", slug: "arabic", cover: "ib-arabic-ab-initio.jpg" },
  { name: "Bengali", slug: "bengali", cover: "ib-arabic-ab-initio-bengali.jpg" },
  { name: "Biblical Hebrew", slug: "biblical-hebrew", cover: "ib-philosophy-biblical-hebrew.jpg" },
  { name: "Chinese", slug: "chinese", cover: "ib-chinese-a-langlit.jpg" },
  { name: "Classical Civilisation", slug: "classical-civilisation", cover: "ib-history-classical-civ.jpg" },
  { name: "Dance", slug: "dance", cover: "ib-sehs-dance.jpg" },
  { name: "Design and Technology", slug: "design-and-technology", cover: "ib-design-technology-new.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }] },
  { name: "Drama", slug: "drama", cover: "ib-english-lit-new.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }] },
  { name: "Engineering", slug: "engineering", cover: "ib-design-technology.jpg" },
  { name: "English", slug: "english", cover: "myp-english.jpg" },
  { name: "English Language", slug: "english-language", cover: "ib-english-langlit-new.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }] },
  { name: "English Language and Literature", slug: "english-language-and-literature", cover: "ib-english-langlit-new.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }] },
  { name: "Environmental Science", slug: "environmental-science", cover: "ib-environmental-systems-and-societies-ess-new-syllabus.jpg" },
  { name: "French", slug: "french", cover: "ib-french-a.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }] },
  { name: "German", slug: "german", cover: "ib-german-a.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }] },
  { name: "Italian", slug: "italian", cover: "ib-spanish-ab-initio-italian.jpg" },
  { name: "Japanese", slug: "japanese", cover: "ib-chinese-b.jpg" },
  { name: "Latin", slug: "latin", cover: "ib-philosophy-latin.jpg" },
  { name: "Law", slug: "law", cover: "ib-philosophy-law.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "WJEC", slug: "wjec" }] },
  { name: "Media Studies", slug: "media-studies", cover: "ib-digital-society.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Eduqas", slug: "eduqas" }] },
  { name: "Modern Hebrew", slug: "modern-hebrew", cover: "ib-arabic-b-hebrew.jpg" },
  { name: "Music", slug: "music", cover: "ib-theory-of-knowledge-tok.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }, { label: "Eduqas", slug: "eduqas" }] },
  { name: "Old Maths", slug: "old-maths", cover: "ib-math-aa-old.jpg", hrefOverride: `${SITE.original}/a-level/maths/edexcel-legacy` },
  { name: "Panjabi", slug: "panjabi", cover: "ib-arabic-ab-initio-panjabi.jpg" },
  { name: "Physical Education", slug: "physical-education", cover: "ib-sports-exercise-and-health-science-sehs-new-syllabus.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "OCR", slug: "ocr" }] },
  { name: "Polish", slug: "polish", cover: "ib-german-ab-initio.jpg" },
  { name: "Portuguese", slug: "portuguese", cover: "ib-spanish-b.jpg" },
  { name: "Religious Studies", slug: "religious-studies", cover: "ib-philosophy.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }] },
  { name: "Russian", slug: "russian", cover: "ib-english-b-russian.jpg" },
  { name: "Spanish", slug: "spanish", cover: "ib-spanish-a.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }] },
  { name: "Statistics", slug: "statistics", cover: "ib-math-ai-stats.jpg" },
  { name: "Turkish", slug: "turkish", cover: "ib-arabic-b.jpg" },
  { name: "Urdu", slug: "urdu", cover: "ib-arabic-ab-initio-urdu.jpg" },
  { name: "Welsh", slug: "welsh", cover: "ib-english-b.jpg" },
];

/** Pastel tile tint per subject — derived from the cover's dominant hue. */
export const SUBJECT_TINTS: Record<string, string> = {
  maths: "#fde8ec",
  "further-maths": "#fde8ec",
  psychology: "#fde8ec",
  biology: "#d9f4e5",
  chemistry: "#e9dcfd",
  business: "#fde3c4",
  physics: "#e3f4fe",
  history: "#fde3c4",
  sociology: "#fde8ec",
  economics: "#d9f4e5",
  "art-and-design": "#fde8ec",
  geography: "#d3f3fa",
  "english-literature": "#e3f4fe",
  politics: "#e9dcfd",
  "computer-science": "#e3f4fe",
};

export function subjectCoverUrl(subject: ALevelSubject): string {
  return `${SITE.assets}/subject-covers/${subject.cover}`;
}

/** Destination for a subject card click (internal for Maths, original for the rest). */
export function subjectHref(subject: ALevelSubject, board?: string): string {
  if (subject.hrefOverride) return subject.hrefOverride;
  if (subject.slug === "maths") {
    // our rebuilt course page
    return board && board !== "edexcel" ? `${SITE.original}/a-level/maths/${board}` : "/a-level/maths/edexcel";
  }
  return `${SITE.original}/a-level/${subject.slug}/${board ?? "aqa"}`;
}
