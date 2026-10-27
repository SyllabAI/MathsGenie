import Link from "next/link";
import { SITE } from "@/lib/data";

const COLS: { title: string; links: { label: string; href: string; ext?: boolean }[] }[] = [
  {
    title: "Revision",
    links: [
      { label: "GCSE Maths — Edexcel", href: "/gcse/maths/edexcel" },
      { label: "GCSE Maths — AQA", href: "/gcse/maths/aqa" },
      { label: "GCSE Maths — OCR", href: "/gcse/maths/ocr" },
      { label: "A-Level Maths — Edexcel", href: "/a-level/maths/edexcel" },
      { label: "Past papers", href: "/gcse/maths/edexcel/papers" },
      { label: "Worksheets", href: "/gcse/worksheets" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Revision planner", href: "/features/revision-planner" },
      { label: "Mock exam builder", href: "/gcse/maths/edexcel/mock-exam-builder" },
      { label: "Grade calculator", href: "/gcse/maths/edexcel/predicted-grade-calculator" },
      { label: "Question Rush", href: "/gcse/question-rush" },
      { label: "Daily Greens", href: "/gcse/daily-greens" },
      { label: "Ask Genie AI", href: "/ask-genie" },
    ],
  },
  {
    title: "Features",
    links: [
      { label: "Answer marking", href: "/features/answer-marking" },
      { label: "Lessons", href: "/gcse/maths/edexcel/lessons" },
      { label: "Videos", href: "/gcse/maths/edexcel/videos" },
      { label: "Flashcards", href: "/gcse/maths/edexcel/flashcards" },
      { label: "Revision guides", href: "/gcse/maths/edexcel/revision-guides" },
      { label: "Predicted papers", href: "/gcse/maths/edexcel/papers" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "The real MathsGenie ↗", href: SITE.original, ext: true },
      { label: "GitHub repository", href: "https://github.com/SyllabAI/MathsGenie", ext: true },
      { label: "Research folder", href: "/research" },
      { label: "Ideas + feedback", href: "https://github.com/SyllabAI/MathsGenie/issues", ext: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-night text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2.4fr]">
          <div>
            <p className="flex items-center gap-2">
              <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
                <path
                  d="M8 20c-1.8 0-3-1.2-3-2.6 0-1.3 1-2.3 2.4-2.5-.2-3.4 2.6-6.4 6.6-6.9 4.4-.5 8.2 1.9 8.9 5.4l4.6 1.2c.9.2 1.5.8 1.5 1.6 0 .9-.8 1.6-1.8 1.6l-3-.1v2.1c0 .7-.5 1.2-1.2 1.2H21l-.8 2.6c-.2.6-.7 1-1.3 1h-6.4c-.7 0-1.2-.5-1.3-1.1L10.5 20H8z"
                  fill="#2fe4b7"
                />
              </svg>
              <span className="font-hand text-3xl font-bold">
                Maths<span className="text-mint">Genie</span>
              </span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
              Free online GCSE and A-Level maths revision — every topic by grade,
              past papers, videos and tools, built as an independent educational
              recreation of the original site.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLS.map((c) => (
              <div key={c.title}>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                  {c.title}
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      {l.ext ? (
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/70 transition hover:text-mint"
                        >
                          {l.label}
                        </a>
                      ) : (
                        <Link href={l.href} className="text-white/70 transition hover:text-mint">
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs leading-relaxed text-white/45 sm:px-6">
          Independent educational recreation — not affiliated with MathsGenie.
          Original content belongs to MathsGenie and the awarding bodies
          (Pearson Edexcel, AQA, OCR, WJEC, Eduqas, CCEA); resources link back
          to the originals.
        </div>
      </div>
    </footer>
  );
}
