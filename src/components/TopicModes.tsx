import type { ReactNode } from "react";
import { SITE } from "@/lib/data";

/**
 * Topic mode grid recreating the original topic page structure:
 * four labelled sections (Popular / Practice / Learn / Tools) of horizontal
 * icon-row cards in a narrow content column. All icons are original inline
 * SVG recreations of the original's tinted mode-card tiles.
 */

type ModeItem = {
  label: string;
  desc: string;
  href: string;
  icon: ReactNode;
  tint: { bg: string; fg: string };
  outbound?: boolean;
};

type ModeSection = { title: string; items: ModeItem[] };

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Original icon glyphs (hand-drawn recreation, 24x24 stroke style). */
const Icon = {
  worksheets: (
    <svg viewBox="0 0 24 24" aria-hidden {...S}>
      <path d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7.5 3.5Z" />
      <path d="M14 3.5V8h4.5" />
      <path d="M9 12.5h6M9 16h6" />
    </svg>
  ),
  papers: (
    <svg viewBox="0 0 24 24" aria-hidden {...S}>
      <path d="M8 7.5V5A1.5 1.5 0 0 1 9.5 3.5h6.6l3.4 3.4V17a1.5 1.5 0 0 1-1.5 1.5H16" />
      <path d="M6.5 7.5h6.6l3.4 3.4V20a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 20V9a1.5 1.5 0 0 1 1.5-1.5Z" />
      <path d="M8.5 14h4M8.5 17h4" />
    </svg>
  ),
  questionBank: (
    <svg viewBox="0 0 24 24" aria-hidden {...S}>
      <path d="M12 3.5a8.5 8.5 0 1 1-7.3 4.2L3.5 3.5l4.2 1.2A8.46 8.46 0 0 1 12 3.5Z" />
      <path d="M9.6 9.2a2.5 2.5 0 0 1 4.9.6c0 1.6-2.4 2-2.4 3.4" />
      <path d="M12 16.2h.01" />
    </svg>
  ),
  rush: (
    <svg viewBox="0 0 24 24" aria-hidden {...S}>
      <path d="M13 2.5 5 13.5h5.5L10 21.5l8-11h-5.5L13 2.5Z" />
    </svg>
  ),
  greens: (
    <svg viewBox="0 0 24 24" aria-hidden {...S}>
      <path d="M5 20c0-8 4-13 14-14 .5 7-2.5 13-10 13-1.5 0-3-.4-4-1Z" />
      <path d="M5 20c2-5 5-8 9-10" />
    </svg>
  ),
  heatmap: (
    <svg viewBox="0 0 24 24" aria-hidden {...S}>
      <path d="M12 21.5c-4.4 0-7.5-3-7.5-7 0-4.6 4.5-6.3 3.5-11 3.5 1.5 5 4.5 5 6.5 1-.8 1.5-2 1.5-3.5 2.6 2 5 5 5 8 0 4-3.1 7-7.5 7Z" />
      <path d="M12 21.5c-1.9 0-3.3-1.4-3.3-3.2 0-2 1.9-2.9 1.6-5 1.7.8 2.9 2.4 2.9 4 0 .8.6 1.2 1.2.8.6 1.9-.5 3.4-2.4 3.4Z" />
    </svg>
  ),
  lessons: (
    <svg viewBox="0 0 24 24" aria-hidden {...S}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2.5 2.5 0 0 1 2 1 2.5 2.5 0 0 1 2-1h4.5A1.5 1.5 0 0 1 20 5.5v12a1.5 1.5 0 0 1-1.5 1.5H14a2.5 2.5 0 0 0-2 1 2.5 2.5 0 0 0-2-1H5.5A1.5 1.5 0 0 1 4 17.5v-12Z" />
      <path d="M12 5v15" />
    </svg>
  ),
  revision: (
    <svg viewBox="0 0 24 24" aria-hidden {...S}>
      <rect x="4" y="3.5" width="16" height="17" rx="1.5" />
      <path d="M8 8h8M8 12h8M8 16h5" />
      <path d="M15.5 15.8 20 20.2" />
    </svg>
  ),
  videos: (
    <svg viewBox="0 0 24 24" aria-hidden {...S}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m10.2 9.2 4.8 2.8-4.8 2.8V9.2Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  flashcards: (
    <svg viewBox="0 0 24 24" aria-hidden {...S}>
      <rect x="7.5" y="3.5" width="13" height="11" rx="1.5" transform="rotate(6 14 9)" />
      <rect x="3.5" y="9.5" width="13" height="11" rx="1.5" />
      <path d="m7 15 1.8 1.8L12 13.5" />
    </svg>
  ),
  scheme: (
    <svg viewBox="0 0 24 24" aria-hidden {...S}>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <circle cx="5" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="5" cy="18" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
  examBuilder: (
    <svg viewBox="0 0 24 24" aria-hidden {...S}>
      <rect x="3.5" y="3.5" width="7.4" height="7.4" rx="1.5" />
      <rect x="13.1" y="3.5" width="7.4" height="7.4" rx="1.5" />
      <rect x="3.5" y="13.1" width="7.4" height="7.4" rx="1.5" />
      <path d="M16.8 13.5v6.6M13.5 16.8h6.6" />
    </svg>
  ),
  marker: (
    <svg viewBox="0 0 24 24" aria-hidden {...S}>
      <path d="m14.5 4.5 5 5L8 21H3v-5L14.5 4.5Z" />
      <path d="m12.5 6.5 5 5" />
      <path d="M13.5 20.5H21" />
    </svg>
  ),
  calculator: (
    <svg viewBox="0 0 24 24" aria-hidden {...S}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8.5 7h7" />
      <path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5h.01M8.5 19h.01M12 19h.01M15.5 19h.01" strokeWidth="2.2" />
    </svg>
  ),
};

const TINTS = {
  mint: { bg: "#d9f4e5", fg: "#059669" },
  sky: { bg: "#e3f4fe", fg: "#0284c7" },
  peri: { bg: "#e3f4fe", fg: "#4f46e5" },
  coral: { bg: "#fde8ec", fg: "#e11d48" },
  amber: { bg: "#fde3c4", fg: "#b45309" },
  lime: { bg: "#e5f8ec", fg: "#16a34a" },
};

function ModeCard({ item }: { item: ModeItem }) {
  return (
    <a
      href={item.href}
      target={item.outbound ? "_blank" : undefined}
      rel={item.outbound ? "noopener noreferrer" : undefined}
      className="group -mx-2 flex items-center gap-5 rounded-3xl p-2 transition-colors hover:bg-paper-2"
    >
      <span
        className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl transition-transform group-hover:scale-[1.05]"
        style={{ background: item.tint.bg, color: item.tint.fg }}
      >
        <span className="size-7">{item.icon}</span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 font-semibold tracking-tight group-hover:text-accent">
          {item.label}
          {item.outbound && (
            <span className="text-xs text-muted" aria-hidden>↗</span>
          )}
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-muted">{item.desc}</span>
      </span>
    </a>
  );
}

function ModeSection({ title, items }: { title: string; items: ModeItem[] }) {
  return (
    <section className="scroll-mt-24" aria-labelledby={`modes-${title}`}>
      <h2
        id={`modes-${title}`}
        className="mb-2 text-lg font-bold tracking-tight text-muted"
      >
        {title}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <ModeCard key={item.label} item={item} />
        ))}
      </div>
    </section>
  );
}

/**
 * The 14 mode cards of the original topic page, grouped into
 * Popular / Practice / Learn / Tools. Internal routes are used where this
 * recreation has a page; everything else links outbound to the original.
 */
export function TopicModes({
  board,
  topic,
}: {
  board: string;
  topic: string;
}) {
  const base = `/gcse/maths/${board}/${topic}`;
  const orig = `${SITE.original}${base}`;
  const boardBase = `/gcse/maths/${board}`;

  const sections: ModeSection[] = [
    {
      title: "Popular",
      items: [
        {
          label: "Worksheets",
          desc: "Exam booklet, worksheet and solutions for this topic",
          href: `${orig}/worksheets`,
          icon: Icon.worksheets,
          tint: TINTS.mint,
          outbound: true,
        },
        {
          label: "Papers",
          desc: "Past papers, predicted papers and mini tests",
          href: `${boardBase}/papers`,
          icon: Icon.papers,
          tint: TINTS.sky,
        },
      ],
    },
    {
      title: "Practice",
      items: [
        {
          label: "Question bank",
          desc: "Practise exam-style questions for this topic",
          href: `${base}/questions`,
          icon: Icon.questionBank,
          tint: TINTS.peri,
        },
        {
          label: "Question Rush",
          desc: "Race the clock on quick-fire multiple-choice questions",
          href: "/gcse/question-rush",
          icon: Icon.rush,
          tint: TINTS.coral,
        },
        {
          label: "Daily Greens",
          desc: "A quick daily worksheet that targets your weaknesses",
          href: "/gcse/daily-greens",
          icon: Icon.greens,
          tint: TINTS.lime,
        },
        {
          label: "Hot topics",
          desc: "See which topics come up most in real past papers",
          href: `${SITE.original}/gcse/maths/${board}/topic-heatmap`,
          icon: Icon.heatmap,
          tint: TINTS.amber,
          outbound: true,
        },
      ],
    },
    {
      title: "Learn",
      items: [
        {
          label: "Lessons",
          desc: "Interactive bite-sized lesson with practice cards",
          href: `${orig}/lessons`,
          icon: Icon.lessons,
          tint: TINTS.sky,
          outbound: true,
        },
        {
          label: "Revision Guides",
          desc: "Study notes with worked examples",
          href: `${orig}/revision-guides`,
          icon: Icon.revision,
          tint: TINTS.mint,
          outbound: true,
        },
        {
          label: "Videos",
          desc: "Revision videos for this topic",
          href: `${orig}/videos`,
          icon: Icon.videos,
          tint: TINTS.coral,
          outbound: true,
        },
        {
          label: "Flashcards",
          desc: "Active-recall flashcards to self-test this topic",
          href: "/gcse/maths/flashcards",
          icon: Icon.flashcards,
          tint: TINTS.peri,
        },
        {
          label: "Scheme of learning",
          desc: "A stage-by-stage course through every topic",
          href: `${SITE.original}/gcse/maths/${board}/scheme-of-learning`,
          icon: Icon.scheme,
          tint: TINTS.amber,
          outbound: true,
        },
      ],
    },
    {
      title: "Tools",
      items: [
        {
          label: "Exam builder",
          desc: "Build a custom mock from exam-style questions",
          href: `${boardBase}/mock-exam-builder?topic=${encodeURIComponent(topic)}`,
          icon: Icon.examBuilder,
          tint: TINTS.peri,
        },
        {
          label: "Paper marker",
          desc: "Upload a completed paper and get it marked",
          href: "/features/answer-marking",
          icon: Icon.marker,
          tint: TINTS.mint,
        },
        {
          label: "Grade calculator",
          desc: "Enter your marks to see your predicted grade",
          href: `${boardBase}/predicted-grade-calculator`,
          icon: Icon.calculator,
          tint: TINTS.sky,
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      {sections.map((s) => (
        <ModeSection key={s.title} title={s.title} items={s.items} />
      ))}
    </div>
  );
}
