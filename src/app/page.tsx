import Link from "next/link";
import { courseCounts, loadTopics, SITE, type TopicsDoc } from "@/lib/data";
import RotatingWord from "@/components/home/RotatingWord";
import GradePreview, { type PreviewGrades } from "@/components/home/GradePreview";
import LearnTabs from "@/components/home/LearnTabs";
import ReviewMarquee from "@/components/home/ReviewMarquee";
import { Attribution } from "@/components/Content";

export default async function Home() {
  const counts = courseCounts() as Record<string, number>;
  const totalCourses = Object.values(counts).reduce((a, b) => a + b, 0);
  const doc: TopicsDoc = await loadTopics("edexcel");

  const preview: PreviewGrades = ["1", "3", "4", "5", "6", "7", "8/9"].map((g) => ({
    grade: g === "8/9" ? "Grade 8/9" : `Grade ${g}`,
    topics: (doc.grades[g] ?? []).slice(0, 8).map((t) => ({
      title: t.title,
      href: `/gcse/maths/edexcel/${t.slug}`,
    })),
  })).filter((x) => x.topics.length > 0);

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="hero-glow relative overflow-hidden text-white">
        <div className="grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full border border-mint/30 bg-mint/10 px-3.5 py-1.5 text-xs font-semibold text-mint">
                ▶ Watch the launch video
              </span>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-white/60">
              <span><strong className="text-white">1m+</strong> students &amp; teachers</span>
              <span className="h-4 w-px bg-white/15" />
              <span><strong className="text-white">4,000+</strong> schools represented</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">
              Your all-in-one resource
              <br className="hidden sm:block" /> to crush your <RotatingWord />
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
              Exam-style worksheets, past papers, videos and lessons for every
              topic — with instant AI marking as you go. Everything you need,
              in one place.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/gcse"
                className="rounded-full bg-mint px-7 py-3.5 text-base font-bold text-night transition hover:brightness-110"
              >
                Get Started for Free
              </Link>
              <Link
                href="/gcse"
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
              >
                I&apos;m a student
              </Link>
              <Link
                href="/gcse"
                className="rounded-full px-4 py-3.5 text-base font-semibold text-white/60 transition hover:text-white"
              >
                I&apos;m a parent · I&apos;m an educator
              </Link>
            </div>
          </div>

          {/* product preview */}
          <div className="mx-auto mt-12 max-w-3xl">
            <GradePreview grades={preview} />
            <p className="mt-5 text-center text-lg text-white/70">
              Students improve by <strong className="text-mint">1.5 grades</strong> on average
            </p>
          </div>
        </div>
      </section>

      {/* ================= SOCIAL PROOF MARQUEE ================= */}
      <section className="border-b border-line py-12">
        <ReviewMarquee />
      </section>

      {/* ================= LEARN YOUR WAY ================= */}
      <section className="border-b border-line py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="rounded-full bg-accent-soft px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-accent">
              See the all new MathsGenie
            </span>
            <h2 className="font-hand mt-4 text-5xl font-bold leading-none">
              Learn every topic your way
            </h2>
            <p className="mt-3 text-muted">
              Guides, videos, lessons, flashcards or teach-back — switch how a
              topic is explained until it clicks.
            </p>
          </div>
          <div className="mt-10">
            <LearnTabs />
          </div>

          {/* revision guides blurb */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-line bg-gradient-to-r from-sky-400/10 to-blue-500/10 p-6 sm:flex-row sm:p-8">
            <div>
              <h3 className="font-hand text-3xl font-bold">Bite-sized revision guides</h3>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted">
                Dense specification content distilled into short, syllabus-aligned
                pages you can actually re-read the night before.
              </p>
            </div>
            <Link
              href="/gcse/maths/edexcel/revision-guides"
              className="shrink-0 rounded-full bg-night px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Explore revision guides
            </Link>
          </div>
        </div>
      </section>

      {/* ================= PRACTISE ================= */}
      <section className="border-b border-line bg-paper-2/60 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-hand text-5xl font-bold leading-none">
              Practise until exam day feels easy
            </h2>
            <p className="mt-3 text-muted">
              Four ways to drill — from topic banks to full mocks, all mapped to
              the grade you&apos;re aiming for.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Question Bank", d: "Exam questions for every topic, sorted by grade.", href: "/gcse/maths/edexcel", c: "from-sky-400 to-blue-500" },
              { t: "Predicted Papers", d: "Fresh papers built from past-paper patterns.", href: "/gcse/maths/edexcel/papers", c: "from-green-500 to-emerald-600" },
              { t: "Past Paper Videos", d: "Watch every paper walked through line by line.", href: "/gcse/maths/edexcel/papers", c: "from-purple-500 to-violet-600" },
              { t: "Mock Exam Builder", d: "Compose your own paper from chosen topics.", href: "/gcse/maths/edexcel/mock-exam-builder", c: "from-pink-500 to-rose-500" },
            ].map((m) => (
              <Link
                key={m.t}
                href={m.href}
                className="group rounded-3xl border border-line bg-panel p-5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/5"
              >
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${m.c} text-lg font-bold text-white`}>
                  {m.t.charAt(0)}
                </span>
                <h3 className="mt-3.5 text-lg font-bold">{m.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{m.d}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-accent opacity-0 transition group-hover:opacity-100">
                  Open →
                </span>
              </Link>
            ))}
          </div>

          {/* sample question cards (original questions written for this recreation) */}
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-line bg-panel p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">Medium</span>
                <span className="text-xs font-semibold text-muted">Question 54 · Grade 7</span>
              </div>
              <p className="mt-4 leading-relaxed text-ink/90">
                y is inversely proportional to the square of x.
                When x = 5, y = 4. Work out the value of y when x = 10.
              </p>
              <div className="mt-4 flex gap-2">
                {["y = 2", "y = 1", "y = 8", "y = 16"].map((o, i) => (
                  <span
                    key={o}
                    className={`rounded-xl border px-3.5 py-2 text-sm font-semibold ${
                      i === 1
                        ? "border-green-500/40 bg-green-500/10 text-green-700"
                        : "border-line bg-paper text-ink/70"
                    }`}
                  >
                    {o}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted">
                y = k/x², so k = 4 × 25 = 100 — then y = 100/100 = 1.
              </p>
            </div>

            <div className="rounded-3xl border border-line bg-panel p-6">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">Hard</span>
                <span className="text-xs font-semibold text-muted">Question 23 · Grade 9</span>
              </div>
              <p className="mt-4 leading-relaxed text-ink/90">
                Prove algebraically that the sum of any two-digit number and the
                number formed by reversing its digits is a multiple of 11.
              </p>
              <textarea
                readOnly
                placeholder="Write your answer here..."
                className="mt-4 h-24 w-full resize-none rounded-2xl border border-line bg-paper p-3.5 text-sm text-muted outline-none"
              />
              <p className="mt-3 text-xs text-muted">
                10a + b + 10b + a = 11(a + b) — a multiple of 11. ∎
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MARKING ================= */}
      <section className="border-b border-line py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-hand text-5xl font-bold leading-tight">
              Get your answers marked like an examiner would
            </h2>
            <p className="mt-4 leading-relaxed text-muted">
              Upload your working and receive mark-by-mark feedback: where each
              mark was earned, where method marks slipped, and what an examiner
              would write in the margin.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/features/answer-marking"
                className="rounded-full bg-night px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
              >
                Try answer marking
              </Link>
              <Link
                href="/gcse/maths/edexcel/predicted-grade-calculator"
                className="rounded-full border border-line bg-panel px-6 py-3 text-sm font-bold transition hover:bg-paper-2"
              >
                Predicted Grade Calculator
              </Link>
            </div>
          </div>

          {/* mock marking UI (illustrative, original content) */}
          <div className="rounded-3xl border border-line bg-panel p-6 shadow-xl shadow-ink/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">Marked paper · Higher Tier</p>
              <span className="rounded-full bg-green-500/15 px-3 py-1 text-sm font-bold text-green-700">
                17 / 20
              </span>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              {[
                { q: "Q1 · Expanding brackets", m: "3/3", ok: true },
                { q: "Q2 · Quadratic formula", m: "4/5", ok: false },
                { q: "Q3 · Circle theorems", m: "5/5", ok: true },
                { q: "Q4 · Histograms", m: "5/7", ok: false },
              ].map((r) => (
                <div key={r.q} className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-2.5">
                  <span className="text-ink/85">{r.q}</span>
                  <span className={`font-bold ${r.ok ? "text-green-600" : "text-amber-600"}`}>{r.m}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl bg-paper-2 p-4">
              <p className="text-sm font-bold">Strengths</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-muted">
                <li>Full method shown in every expansion.</li>
                <li>Correct formula quoted before substitution.</li>
              </ul>
              <p className="mt-3 text-sm font-bold">To improve</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-muted">
                <li>State the conclusion after solving inequalities.</li>
                <li>Label axes before plotting frequency density.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= AI / GENIE (dark) ================= */}
      <section className="hero-glow relative overflow-hidden py-16 text-white sm:py-24">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-hand text-5xl font-bold leading-none sm:text-6xl">
              Meet Genie — your AI study partner
            </h2>
            <p className="mt-4 text-white/65">
              Ask anything at any hour. Genie explains, quizzes and re-explains —
              and never makes you feel bad for asking twice.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                t: "Always available, never judges",
                d: "2am before the mock? Genie is on. Ask the same question five different ways until it sticks.",
                href: "/ask-genie",
              },
              {
                t: "Know exactly where you stand",
                d: "Topic-by-topic mastery tracking shows what's solid and what needs one more pass.",
                href: "/features/revision-planner",
              },
              {
                t: "Feedback on long answers",
                d: "Upload essays and full solutions for examiner-style comments, not just a score.",
                href: "/features/answer-marking",
              },
            ].map((c) => (
              <Link
                key={c.t}
                href={c.href}
                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition hover:border-mint/40 hover:bg-white/[0.07]"
              >
                <h3 className="text-lg font-bold">{c.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{c.d}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-mint opacity-0 transition group-hover:opacity-100">
                  Open →
                </span>
              </Link>
            ))}
          </div>

          {/* progress tools */}
          <div className="mt-16">
            <div className="mx-auto max-w-2xl text-center">
              <h3 className="font-hand text-4xl font-bold leading-none">
                Turn consistent study into real progress
              </h3>
              <p className="mt-3 text-white/60">
                Small daily sessions, tracked — that&apos;s the whole method.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {[
                { t: "Revision Planner", d: "Spread topics across your week", href: "/features/revision-planner" },
                { t: "Analytics", d: "See accuracy by topic and grade", href: "/features/revision-planner" },
                { t: "Friends", d: "Compare streaks with classmates", href: "/gcse/daily-greens" },
                { t: "Streaks & XP", d: "Earn XP for every session", href: "/gcse/daily-greens" },
                { t: "Pomodoro Timer", d: "25-minute focused sprints", href: "/features/revision-planner" },
              ].map((p) => (
                <Link
                  key={p.t}
                  href={p.href}
                  className="rounded-2xl border border-white/10 bg-night-2/70 p-4 transition hover:border-mint/40"
                >
                  <p className="text-sm font-bold">{p.t}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/55">{p.d}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= REVIEWS WALL ================= */}
      <section className="border-b border-line py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-hand text-5xl font-bold leading-none">
              Hear what students and teachers have to say
            </h2>
            <p className="mt-3 text-muted">Student reviews from the community.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { q: "Daily greens are the first homework my son does without being asked.", n: "Rachel P.", r: "Parent" },
              { q: "The mock exam builder built my revision timetable for me.", n: "Omar F.", r: "GCSE Student" },
              { q: "Grade boundaries are editable, so the calculator matches our mock series.", n: "Mr. Yates", r: "Teacher" },
              { q: "Question Rush in the last 10 minutes of class is now a ritual.", n: "Elena V.", r: "Teacher" },
              { q: "Flashcards synced what I learned from videos the same evening.", n: "Kian D.", r: "IGCSE Student" },
              { q: "I finally understand histograms. That's it. That's the review.", n: "Maya L.", r: "GCSE Student" },
            ].map((r) => (
              <figure key={r.n} className="rounded-3xl border border-line bg-panel p-5">
                <blockquote className="text-[15px] leading-relaxed text-ink/85">“{r.q}”</blockquote>
                <figcaption className="mt-3 flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-xs font-bold text-white">
                    {r.n.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{r.n}</span>
                    <span className="block text-xs text-muted">{r.r}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-hand text-5xl font-bold leading-tight">
            Ready to start climbing grades?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Browse all {totalCourses} catalogued courses, or jump straight into
            GCSE Maths with {doc.topic_count} topics across 6 boards.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/gcse"
              className="rounded-full bg-night px-8 py-4 text-base font-bold text-white transition hover:opacity-90"
            >
              Start with GCSE
            </Link>
            <Link
              href="/a-level/maths/edexcel"
              className="rounded-full border border-line bg-panel px-8 py-4 text-base font-bold transition hover:bg-paper-2"
            >
              A-Level Maths
            </Link>
            <a
              href={SITE.original}
              className="rounded-full px-4 py-4 text-sm font-semibold text-muted underline-offset-4 hover:underline"
              rel="noopener noreferrer"
            >
              Visit the original site ↗
            </a>
          </div>
          <div className="mt-12">
            <Attribution />
          </div>
        </div>
      </section>
    </div>
  );
}
