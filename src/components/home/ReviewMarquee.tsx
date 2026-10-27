import Link from "next/link";

/**
 * Testimonial marquee. All quotes are fictional, written for this
 * recreation (see research/07 — no real user content is reproduced).
 */
export type Review = { quote: string; bold?: string; name: string; role: string };

export const REVIEWS_A: Review[] = [
  {
    quote: "The grade tabs tell me exactly what to revise next — no more guessing.",
    name: "Amara O.",
    role: "GCSE Student",
  },
  {
    quote: "Went from a 5 to a 7 in one term just by working through past papers.",
    bold: "from a 5 to a 7 in one term",
    name: "Josh M.",
    role: "GCSE Student",
  },
  {
    quote: "The worked solutions line up with how we mark in class. Rare and valuable.",
    name: "Priya S.",
    role: "Teacher",
  },
  {
    quote: "Question Rush turned my weakest topic into my strongest in a week.",
    bold: "my weakest topic into my strongest",
    name: "Leo K.",
    role: "GCSE Student",
  },
  {
    quote: "Finally a site where revision feels like a game I want to keep playing.",
    name: "Sofia R.",
    role: "IGCSE Student",
  },
];

export const REVIEWS_B: Review[] = [
  {
    quote: "The predicted grade calculator is scarily accurate. Plan your revision around it.",
    bold: "scarily accurate",
    name: "Daniel W.",
    role: "A-Level Student",
  },
  {
    quote: "I set my whole class daily greens as homework. The streaks do the motivating for me.",
    name: "Mrs. Clarke",
    role: "Head of Maths",
  },
  {
    quote: "Every topic has videos, notes and exam questions in one place. That's the whole trick.",
    bold: "videos, notes and exam questions in one place",
    name: "Idris B.",
    role: "A-Level Student",
  },
  {
    quote: "Mock exam builder saved me hours of pasting questions into a doc.",
    name: "Hannah T.",
    role: "GCSE Student",
  },
];

function Cards({ items }: { items: Review[] }) {
  return (
    <>
      {items.map((r) => (
        <figure
          key={r.name + r.quote.slice(0, 12)}
          className="mx-3 w-[320px] shrink-0 rounded-2xl border border-line bg-panel p-5 shadow-sm sm:w-[380px]"
        >
          <blockquote className="text-[15px] leading-relaxed text-ink/85">
            {r.bold ? (
              <>
                <span className="font-semibold text-ink">{r.bold}</span>
                {r.quote.split(r.bold)[1] ? r.quote.split(r.bold)[1] : ""}
                {r.quote.startsWith(r.bold) ? "" : r.quote.split(r.bold)[0]}
              </>
            ) : (
              r.quote
            )}
          </blockquote>
          <figcaption className="mt-3 flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-500 text-xs font-bold text-white">
              {r.name.charAt(0)}
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">{r.name}</span>
              <span className="block text-xs text-muted">{r.role}</span>
            </span>
          </figcaption>
        </figure>
      ))}
    </>
  );
}

export default function ReviewMarquee() {
  return (
    <div className="relative overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent" />
      <div className="marquee-track" style={{ "--marquee-speed": "55s" } as React.CSSProperties}>
        <Cards items={REVIEWS_A} />
        <Cards items={REVIEWS_A} />
      </div>
      <div className="marquee-track marquee-reverse mt-4" style={{ "--marquee-speed": "62s" } as React.CSSProperties}>
        <Cards items={REVIEWS_B} />
        <Cards items={REVIEWS_B} />
      </div>
    </div>
  );
}
