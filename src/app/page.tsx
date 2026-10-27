import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Attribution } from "@/components/Content";
import { courseCounts, SITE } from "@/lib/data";

const counts = courseCounts() as Record<string, number>;
const totalCourses = Object.values(counts).reduce((a, b) => a + b, 0);

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <Badge tone="accent">Independent educational recreation</Badge>
          <h1 className="font-hand mx-auto mt-5 max-w-3xl text-5xl font-bold leading-tight sm:text-6xl">
            Your all-in-one resource to crush your GCSEs &amp; A&nbsp;Levels
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            A faithful recreation of the new MathsGenie, rebuilt from
            reverse-engineered data — every topic, grade and paper catalogued,
            every resource linked back to the original.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/gcse"
              className="rounded-full bg-ink px-6 py-3 font-semibold text-paper hover:opacity-90"
            >
              Start revising
            </Link>
            <Link
              href="/gcse/maths/edexcel/predicted-grade-calculator"
              className="rounded-full border border-line bg-panel px-6 py-3 font-semibold hover:bg-paper-2"
            >
              Try the grade calculator
            </Link>
          </div>
          <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-2 text-sm text-muted">
            <Badge>{totalCourses} courses catalogued</Badge>
            <Badge>6 boards × 134 GCSE topics</Badge>
            <Badge>15 paper series</Badge>
            <Badge>44 A-Level topics</Badge>
          </div>
        </div>
      </section>

      {/* Qualification cards */}
      <section className="border-b border-line bg-paper-2">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-hand text-4xl font-bold">Pick your qualification</h2>
          <p className="mt-2 text-muted">
            {Object.entries(counts).length} qualification levels — {totalCourses} courses in the catalog.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "GCSE", count: counts["gcse"], href: "/gcse", tint: "from-sky-500 to-sky-700" },
              { label: "IGCSE", count: counts["igcse"], href: "/gcse", tint: "from-emerald-500 to-emerald-700" },
              { label: "A Level", count: counts["a-level"], href: "/a-level/maths/edexcel", tint: "from-violet-500 to-violet-700" },
              { label: "AS Level", count: counts["as-level"], href: "/a-level/maths/edexcel", tint: "from-rose-500 to-rose-700" },
            ].map((q) => (
              <Link
                key={q.label}
                href={q.href}
                className="group overflow-hidden rounded-2xl border border-line bg-panel transition-shadow hover:shadow-md"
              >
                <div className={`flex h-24 items-end bg-gradient-to-br ${q.tint} p-4`}>
                  <span className="font-hand text-3xl font-bold text-white drop-shadow">{q.label}</span>
                </div>
                <p className="px-4 py-3 text-sm text-muted">
                  {q.count ?? 0} courses · topic browser, papers &amp; tools
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Learn every topic your way */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-hand text-4xl font-bold">Learn every topic your way</h2>
            <p className="mt-3 leading-relaxed text-muted">
              The original organises 134 GCSE topics across grade tabs, each with its
              own modes: question banks, videos, revision notes, flashcards and
              bite-sized lessons. This recreation rebuilds the same browsing
              experience data-driven from the parsed catalog, so the structure you
              see here matches the live site one-to-one.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Questions", "Videos", "Revision notes", "Flashcards", "Lessons", "Question Rush"].map((m) => (
                <Badge key={m} tone="accent">{m}</Badge>
              ))}
            </div>
            <Link href="/gcse" className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:opacity-90">
              Browse GCSE Maths →
            </Link>
          </div>
          <div className="rounded-2xl border border-line bg-panel p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">Sample lesson card</p>
            <h3 className="font-hand mt-2 text-3xl font-bold">Solving Quadratics</h3>
            <ol className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">1</span> What is a quadratic equation?</li>
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">2</span> Factorising x² + bx + c</li>
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">3</span> The quadratic formula</li>
            </ol>
            <div className="mt-5 rounded-xl bg-paper-2 p-4 font-mono text-sm">
              x² − 5x + 6 = 0 → (x−2)(x−3) = 0 → x = 2 or x = 3
            </div>
          </div>
        </div>
      </section>

      {/* Marking + AI */}
      <section className="border-b border-line bg-paper-2">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
          {[
            {
              t: "Answers marked like an examiner",
              d: "The original marks uploaded working question-by-question against the mark scheme, with strengths and next steps. Recreated as an explainer — the marking engine is theirs.",
              href: "/features/answer-marking",
              cta: "See how it works",
            },
            {
              t: "Meet Genie — your AI study partner",
              d: "Always available, never judges. The recreated chat shell shows the interaction model; conversations on the original run on their own AI backend.",
              href: "/ask-genie",
              cta: "Open the chat shell",
            },
            {
              t: "Question Rush & Daily Greens",
              d: "Fast timed drills and a daily habit mechanic. Both fully recreated client-side with original sample questions.",
              href: "/gcse/question-rush",
              cta: "Play Question Rush",
            },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-line bg-panel p-6">
              <h3 className="font-hand text-2xl font-bold">{c.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.d}</p>
              <Link href={c.href} className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
                {c.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Research strip */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-hand text-4xl font-bold">Built like a research project</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted">
            Every claim in this recreation is documented: the tech-stack fingerprint
            (the original is itself Next.js), the full URL taxonomy, the RSC flight
            payload decoding used to extract the catalog, and per-feature briefs with
            evidence citations. Read the research folder in the repository for the
            complete reverse-engineering record.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="https://github.com/SyllabAI/MathsGenie/tree/main/research" className="rounded-full border border-line bg-panel px-5 py-2.5 text-sm font-semibold hover:bg-paper-2" rel="noopener noreferrer">
              research/ folder
            </a>
            <a href="https://github.com/SyllabAI/MathsGenie/tree/main/data" className="rounded-full border border-line bg-panel px-5 py-2.5 text-sm font-semibold hover:bg-paper-2" rel="noopener noreferrer">
              data/ catalog
            </a>
            <a href={SITE.original} className="rounded-full border border-line bg-panel px-5 py-2.5 text-sm font-semibold hover:bg-paper-2" rel="noopener noreferrer">
              The real MathsGenie ↗
            </a>
          </div>
          <Attribution />
        </div>
      </section>
    </div>
  );
}
