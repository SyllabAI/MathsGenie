import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "KS2 SATs Maths — MathsGenie",
  description:
    "Free KS2 SATs Maths preparation: arithmetic and reasoning past papers with mark schemes, topic-by-topic worksheets, and the Year 5/6 checklist.",
};

const TOPIC_GROUPS: { name: string; items: string[] }[] = [
  {
    name: "Number & place value",
    items: ["Place value to 10,000,000", "Negative numbers", "Rounding", "Factors, multiples & primes", "Square & cube numbers"],
  },
  {
    name: "Calculation",
    items: ["Written addition & subtraction", "Short & long multiplication", "Short & long division", "Order of operations (BIDMAS)", "Mental strategies"],
  },
  {
    name: "Fractions, decimals & percentages",
    items: ["Simplifying fractions", "Adding & subtracting fractions", "Multiplying & dividing fractions", "Fraction–decimal–percentage equivalents", "Percentage of an amount"],
  },
  {
    name: "Ratio, proportion & algebra",
    items: ["Simple ratio", "Scale factors", "Missing number problems", "Simple formulae & sequences", "Unknowns in equations"],
  },
  {
    name: "Geometry",
    items: ["Angle rules", "Circles: radius & diameter", "Area & perimeter", "Volume of cuboids", "Coordinates & translation", "Nets of 3D shapes"],
  },
  {
    name: "Statistics & measures",
    items: ["Line graphs & tables", "Pie charts", "The mean average", "Converting units", "Time & money problems", "Perimeter & area of compound shapes"],
  },
];

/** /ks2/maths/sat — SAT course hub: papers, worksheets and the topic checklist. */
export default function Ks2SatPage() {
  return (
    <div>
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#d9f4e5]/70 via-[#e3f4fe]/60 to-[#fff3c9]/70"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-5 pt-7 sm:px-6">
          <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-sm">
            <Link href="/ks2" className="text-ink/60 hover:text-accent">Key Stage 2</Link>
            <span className="text-ink/40" aria-hidden>›</span>
            <span className="font-semibold">Maths SAT</span>
          </nav>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Maths</h1>
          <p className="mt-1.5 max-w-3xl text-sm text-ink/70">
            The Year 6 national curriculum tests: Paper 1 arithmetic (30 minutes), plus Papers 2
            and 3 reasoning (40 minutes each). Prepare with real past papers, mark schemes and
            topic-by-topic worksheets — all free.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {/* quick resources */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <a
            href={`${SITE.original}/ks2/maths/sat/papers`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 rounded-2xl border-2 border-line p-4 transition hover:bg-paper-2"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#e3f4fe] text-2xl" aria-hidden>📄</span>
            <span>
              <span className="block font-bold group-hover:text-accent">Past papers &amp; mark schemes</span>
              <span className="mt-0.5 block text-sm text-muted">Arithmetic and reasoning papers from recent years, printable PDFs.</span>
            </span>
          </a>
          <a
            href={`${SITE.original}/ks2/maths/sat/worksheets`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 rounded-2xl border-2 border-line p-4 transition hover:bg-paper-2"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#d9f4e5] text-2xl" aria-hidden>🖨</span>
            <span>
              <span className="block font-bold group-hover:text-accent">Worksheets</span>
              <span className="mt-0.5 block text-sm text-muted">Exam booklets to print, organised topic by topic.</span>
            </span>
          </a>
        </div>

        {/* topic checklist */}
        <section className="mt-12">
          <h2 className="text-xl font-extrabold tracking-tight">What&apos;s on the test</h2>
          <p className="mt-2 max-w-3xl text-sm text-ink/70">
            The SATs draw on the whole Key Stage 2 curriculum, with the heaviest weighting on
            calculation and fractions. Work through this checklist and tick topics off as your
            mock scores improve.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {TOPIC_GROUPS.map((g) => (
              <section key={g.name} className="rounded-2xl border-2 border-line bg-paper p-4">
                <h3 className="text-sm font-bold">{g.name}</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-ink/75">
                  {g.items.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 text-accent" aria-hidden>✓</span>
                      {i}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-muted">
          Papers and worksheets stay on{" "}
          <a href={`${SITE.original}/ks2/maths/sat`} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
            the original site ↗
          </a>
        </p>
      </div>
    </div>
  );
}
