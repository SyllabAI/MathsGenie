import type { Metadata } from "next";
import Link from "next/link";
import { BoardCards, Faq, Attribution } from "@/components/Content";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "GCSE Maths Revision",
  description:
    "Choose your exam board to find past papers, mark schemes, grade boundaries and revision materials — recreated from the parsed MathsGenie catalog.",
};

const SECTION_LINKS = {
  popular: [
    { label: "Worksheets", desc: "Downloadable exam booklets", href: "/gcse/worksheets" },
    { label: "Past papers", desc: "Real papers with mark schemes", href: "/gcse/maths/edexcel/papers" },
    { label: "Question bank", desc: "Browse topics, drill into questions", href: "/gcse/maths/edexcel/grade-1-1-1-addition-and-subtraction/questions" },
  ],
  practice: [
    { label: "Predicted papers", desc: "Practice papers built from likely topics", href: "/gcse/maths/edexcel/papers" },
    { label: "Mini tests", desc: "Short topic-focused tests", href: "/gcse/maths/edexcel/worksheets" },
    { label: "45 min tests", desc: "Half-length revision papers", href: "/gcse/maths/edexcel/worksheets" },
  ],
  learn: [
    { label: "Revision guides", desc: "Topic-by-topic notes", href: "/gcse/maths/edexcel/revision-guides" },
    { label: "Lessons", desc: "Interactive bite-sized lessons", href: "/gcse/maths/edexcel/lessons" },
    { label: "Videos", desc: "Topic-by-topic walkthroughs", href: "/gcse/maths/edexcel/videos" },
    { label: "Flashcards", desc: "Active-recall cards", href: "/gcse/maths/edexcel/flashcards" },
  ],
  tools: [
    { label: "Predicted grade calculator", desc: "Predict grades from marks", href: "/gcse/maths/edexcel/predicted-grade-calculator" },
    { label: "Mock exam builder", desc: "Compose a custom paper", href: "/gcse/maths/edexcel/mock-exam-builder" },
  ],
};

function Section({ title, links }: { title: string; links: { label: string; desc: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">{title}</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="rounded-2xl border border-line bg-panel p-4 transition-shadow hover:shadow-md"
          >
            <p className="font-semibold hover:text-accent">{l.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{l.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function GcsePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Badge tone="accent">GCSE</Badge>
      <h1 className="font-hand mt-3 text-5xl font-bold">GCSE Maths Revision</h1>
      <p className="mt-2 max-w-2xl text-lg text-muted">
        Pick your exam board — every board shares the same 134-topic structure in
        this catalog, exactly as the original organises it.
      </p>

      <section className="mt-10">
        <h2 className="font-hand text-3xl font-bold">Pick your exam board</h2>
        <div className="mt-4">
          <BoardCards />
        </div>
      </section>

      <section className="mt-14 space-y-10">
        <Section title="Popular" links={SECTION_LINKS.popular} />
        <Section title="Practice" links={SECTION_LINKS.practice} />
        <Section title="Learn" links={SECTION_LINKS.learn} />
        <Section title="Tools" links={SECTION_LINKS.tools} />
      </section>

      <section className="mt-14">
        <h2 className="font-hand text-3xl font-bold">GCSE Maths FAQs</h2>
        <div className="mt-4">
          <Faq
            items={[
              {
                q: "Which exam boards offer GCSE Maths?",
                a: "AQA, Edexcel, Eduqas, OCR, WJEC and CCEA — all six are catalogued here with their own course page, matching the original's board grid.",
              },
              {
                q: "Where can I find GCSE Maths past papers?",
                a: "Each board's Papers page lists every series with question papers and mark schemes. This recreation links out to the original PDFs rather than re-hosting them.",
              },
              {
                q: "Are these GCSE Maths resources free?",
                a: "On the original site, the core revision resources are free and the AI tools have paid tiers. This recreation is fully free and open-source.",
              },
              {
                q: "Can I revise with a different board's Maths past papers?",
                a: "Yes — the topic content is broadly shared across boards. The original's FAQ makes the same point; cross-board practice is common.",
              },
            ]}
          />
        </div>
      </section>

      <Attribution href="https://www.mathsgenie.co.uk/gcse.html" />
    </div>
  );
}
