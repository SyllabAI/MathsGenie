import { SITE } from "@/lib/data";
import type { ALevelSubject } from "@/lib/alevel-subjects";

/**
 * AS-Level subject catalogue mirroring the original /as-level hub
 * (captured 2026-10-29, see research/11): "Popular" shelf of 15
 * board-picker cards + "Other subjects" grid. Six of the other subjects
 * are direct-link cards on the original (board baked into the URL) —
 * those hrefs are preserved verbatim; the rest open "Choose exam board"
 * menus. Cover art is hot-linked from the original's CDN
 * (assets.mathsgenie.co.uk/subject-covers) — nothing is re-hosted.
 */

export const AS_LEVEL_SUBJECTS: ALevelSubject[] = [
  // ---- Popular (order matches the original shelf) ----
  { name: "Maths", slug: "maths", cover: "ib-math-aa.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }, { label: "OCR (MEI)", slug: "ocr-mei" }, { label: "WJEC", slug: "wjec" }, { label: "CCEA", slug: "ccea" }] },
  { name: "Further Maths", slug: "further-maths", cover: "ib-math-ai.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }, { label: "OCR (MEI)", slug: "ocr-mei" }, { label: "WJEC", slug: "wjec" }] },
  { name: "Psychology", slug: "psychology", cover: "ib-psychology-new.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }] },
  { name: "Biology", slug: "biology", cover: "ib-biology-new.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR A", slug: "ocr-a" }, { label: "OCR B", slug: "ocr-b" }, { label: "WJEC", slug: "wjec" }] },
  { name: "Chemistry", slug: "chemistry", cover: "ib-chemistry-new.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR A", slug: "ocr-a" }, { label: "OCR B", slug: "ocr-b" }, { label: "WJEC", slug: "wjec" }] },
  { name: "Business", slug: "business", cover: "ib-business-management.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "WJEC", slug: "wjec" }] },
  { name: "Physics", slug: "physics", cover: "ib-physics.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR A", slug: "ocr-a" }, { label: "OCR B", slug: "ocr-b" }, { label: "WJEC", slug: "wjec" }] },
  { name: "History", slug: "history", cover: "ib-history.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }, { label: "WJEC", slug: "wjec" }] },
  { name: "Sociology", slug: "sociology", cover: "myp-i-and-s.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "OCR", slug: "ocr" }, { label: "WJEC", slug: "wjec" }] },
  { name: "Economics", slug: "economics", cover: "ib-economics.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }] },
  { name: "Art and Design", slug: "art-and-design", cover: "ib-design-tech-art.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }, { label: "WJEC", slug: "wjec" }] },
  { name: "Geography", slug: "geography", cover: "ib-geography-new.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }, { label: "WJEC", slug: "wjec" }] },
  { name: "English Literature", slug: "english-literature", cover: "ib-english-lit-new.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }, { label: "WJEC", slug: "wjec" }] },
  { name: "Politics", slug: "politics", cover: "ib-global-politics.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }] },
  { name: "Computer Science", slug: "computer-science", cover: "ib-computer-science-new.jpg", popular: true, boards: [{ label: "AQA", slug: "aqa" }, { label: "OCR", slug: "ocr" }, { label: "WJEC", slug: "wjec" }] },
  // ---- Other subjects (alphabetical, as on the original) ----
  { name: "Chinese", slug: "chinese", cover: "ib-chinese-a-langlit.jpg", hrefOverride: `${SITE.original}/as-level/chinese/edexcel` },
  { name: "Classical Civilisation", slug: "classical-civilisation", cover: "ib-history-classical-civ.jpg", hrefOverride: `${SITE.original}/as-level/classical-civilisation/ocr` },
  { name: "Design And Technology", slug: "design-and-technology", cover: "ib-design-technology-new.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }] },
  { name: "Drama", slug: "drama", cover: "ib-english-lit-new.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "WJEC", slug: "wjec" }] },
  { name: "English Language", slug: "english-language", cover: "ib-english-langlit-new.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }, { label: "WJEC", slug: "wjec" }] },
  { name: "English Language And Literature", slug: "english-language-and-literature", cover: "ib-english-langlit-new.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }, { label: "WJEC", slug: "wjec" }] },
  { name: "French", slug: "french", cover: "ib-french-a.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }, { label: "WJEC", slug: "wjec" }] },
  { name: "German", slug: "german", cover: "ib-german-a.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }, { label: "WJEC", slug: "wjec" }] },
  { name: "ICT", slug: "ict", cover: "ib-digital-society.jpg", hrefOverride: `${SITE.original}/as-level/ict/wjec` },
  { name: "Latin", slug: "latin", cover: "ib-philosophy-latin.jpg", hrefOverride: `${SITE.original}/as-level/latin/ocr` },
  { name: "Law", slug: "law", cover: "ib-philosophy-law.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }, { label: "WJEC", slug: "wjec" }] },
  { name: "Media Studies", slug: "media-studies", cover: "ib-digital-society.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Eduqas", slug: "eduqas" }, { label: "WJEC", slug: "wjec" }] },
  { name: "Music", slug: "music", cover: "ib-theory-of-knowledge-tok.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }, { label: "Eduqas", slug: "eduqas" }] },
  { name: "Physical Education", slug: "physical-education", cover: "ib-sports-exercise-and-health-science-sehs-new-syllabus.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "OCR", slug: "ocr" }, { label: "WJEC", slug: "wjec" }] },
  { name: "Religious Studies", slug: "religious-studies", cover: "ib-philosophy.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }, { label: "WJEC", slug: "wjec" }] },
  { name: "Russian", slug: "russian", cover: "ib-english-b-russian.jpg", hrefOverride: `${SITE.original}/as-level/russian/edexcel` },
  { name: "Spanish", slug: "spanish", cover: "ib-spanish-a.jpg", boards: [{ label: "AQA", slug: "aqa" }, { label: "Edexcel", slug: "edexcel" }, { label: "OCR", slug: "ocr" }, { label: "WJEC", slug: "wjec" }] },
  { name: "Welsh", slug: "welsh", cover: "ib-english-b.jpg", hrefOverride: `${SITE.original}/as-level/welsh/wjec` },
];

/** Destination for an AS subject card click (internal for Maths, original for the rest). */
export function asSubjectHref(subject: ALevelSubject, board?: string): string {
  if (subject.hrefOverride) return subject.hrefOverride;
  if (subject.slug === "maths") {
    return board && board !== "edexcel" ? `${SITE.original}/as-level/maths/${board}` : "/as-level/maths/edexcel";
  }
  return `${SITE.original}/as-level/${subject.slug}/${board ?? "aqa"}`;
}
