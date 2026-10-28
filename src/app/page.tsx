import Link from "next/link";
import { SITE, courseCounts } from "@/lib/data";
import WorksheetDemo from "@/components/home/WorksheetDemo";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import LearnYourWay from "@/components/home/LearnYourWay";
import PractiseTabs from "@/components/home/PractiseTabs";
import RotatingWord from "@/components/home/RotatingWord";

/**
 * Homepage v2 — rebuilt against live screenshots of the original:
 * light theme, blue primary, Shantell display font, pastel feature slides
 * and a single black AI section. Section order mirrors the original.
 */

const STATS = [
  { icon: "👥", color: "#1cb0f6", bg: "#e3f4fe", n: "1m+", label: "students and teachers learning with MathsGenie" },
  { icon: "🏛️", color: "#cd680a", bg: "#fde3c4", n: "4,000+", label: "schools represented across the MathsGenie community" },
];

const AI_ROWS = [
  {
    tag: "✓ Check Your Answers",
    title: "Know Exactly Where You Stand",
    body: "Genie marks every line of your working, shows the method marks you earned and the ones you missed, then suggests the very next thing to practise.",
    card: (
      <div className="rounded-2xl bg-white p-5 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-ink font-title text-sm font-bold text-white">3</span>
          <span className="rounded-full bg-[#fde8ec] px-2.5 py-1 text-[11px] font-bold text-[#e7000b]">● Hard</span>
          <span className="text-xs text-muted">31%</span>
          <span className="ml-auto text-xs text-muted">🔖 ⚑</span>
        </div>
        <p className="mt-3 text-sm font-medium">
          Show that (2x + 5)² − (2x + 1)² is always a multiple of 8. <span className="text-muted">[3]</span>
        </p>
        <div className="mt-3 rounded-xl bg-paper-2 p-3 text-xs leading-relaxed text-muted">
          Expanding: (2x + 5)² = 4x² + 20x + 25 and (2x + 1)² = 4x² + 4x + 1.
          Subtracting: 20x + 25 − 4x − 4 + 1 = 16x + 26... wait — 16x + 24 = 8(2x + 3). ✓ multiple of 8
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-muted">
          <span>🖼 Add</span><span>✎ Draw</span><span>ƒ Math</span>
          <span className="ml-auto rounded-full bg-[#a333e0] px-3 py-1 text-white">1⚡ Grading…</span>
        </div>
      </div>
    ),
  },
  {
    tag: "⧉ Paper Marker",
    title: "Full Papers, Marked In Minutes",
    body: "Upload a scan or type your answers — get a mark per question, examiner-style comments and a topic list of what to revise next.",
    card: (
      <div className="rounded-2xl bg-white p-5 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2 border-b border-line pb-3 text-sm font-semibold">
          <span className="text-accent">☰ Feedback</span>
          <span className="text-muted">◐ Genie AI</span>
          <span className="ml-auto text-xs text-muted">24 questions</span>
        </div>
        <p className="mt-3 font-title text-2xl font-extrabold">61<span className="text-muted">/80</span></p>
        <div className="mt-3 rounded-xl border border-line p-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            Question 8
            <span className="ml-auto flex size-8 items-center justify-center rounded-full border-2 border-[#00c750] text-xs font-bold text-[#0b6b3a]">4/4</span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            Salma has £10 to buy apples and oranges. She buys 9 apples and as
            many oranges as possible. How many oranges does she buy?
          </p>
          <div className="mt-2 rounded-lg bg-paper-2 px-3 py-2 text-xs">10.00 − 2.25 = 7.75 → 12 oranges</div>
          <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold text-muted">
            <span>🖼 Add</span><span>✎ Draw</span><span>ƒ Math</span>
            <span className="ml-auto rounded-full bg-[#a333e0] px-3 py-1 text-white">1⚡ Re-grade</span>
          </div>
        </div>
      </div>
    ),
  },
];

const PROGRESS_CARDS = [
  {
    bg: "var(--pas-peri)",
    title: "Leaderboard",
    body: (
      <div className="space-y-2.5">
        {[
          { medal: "🥇", name: "Maya", time: "8h 42m", w: 92 },
          { medal: "🥈", name: "Alex", time: "6h 15m", w: 74 },
          { medal: "🥉", name: "Jordan (You)", time: "4h 48m", w: 58 },
        ].map((r) => (
          <div key={r.name} className="flex items-center gap-2.5">
            <span className="text-sm">{r.medal}</span>
            <span className="w-24 truncate text-xs font-bold">{r.name}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/70">
              <span className="block h-full rounded-full bg-gradient-to-r from-[#ff8a7a] to-[#1cb0f6]" style={{ width: `${r.w}%` }} />
            </span>
            <span className="text-[11px] font-semibold text-ink/60">{r.time}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    bg: "var(--pas-amber)",
    title: "Day Streak",
    body: (
      <div>
        <p className="font-title text-3xl font-extrabold text-[#cd680a]">🔥 12</p>
        <p className="text-xs font-semibold text-ink/60">Day Streak</p>
        <div className="mt-3 flex justify-between text-center text-[10px] font-bold text-muted">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i}>
              <span className={`mx-auto mb-1 block size-5 rounded-full ${i < 5 ? "bg-[#ff9429] text-white" : "bg-white/70"}`}>{i < 5 ? "🔥" : "💧"}</span>
              {d}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    bg: "var(--pas-green)",
    title: "Focus Timer",
    body: (
      <div className="text-center">
        <span className="mx-auto flex size-24 items-center justify-center rounded-full border-4 border-[#059669]/25 font-title text-2xl font-extrabold">
          25:00
        </span>
        <p className="mt-2 text-xs font-semibold text-ink/60">● General study</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#059669] px-5 py-2 text-xs font-bold text-white">
          ▶ Start focus
        </span>
      </div>
    ),
  },
];

const WALL = [
  { name: "Seher", role: "GCSE Student", emoji: "🐣", bg: "#fde8ec", hlColor: "#a333e0", text: "First of all, it's a life saver. As someone starting my GCSE journey, this website is helping me so much. Having everything in one place keeps me motivated and less stressed. You just ", hl: "helped an exam-stresser relax forever", tail: "!" },
  { name: "Janine C.", role: "Teacher", emoji: "🐧", bg: "#e3f4fe", hlColor: "#0b6b3a", text: "Thank you for the amazing resources your website provides. They really do have ", hl: "a positive impact on students", tail: "." },
  { name: "Rehan R.", role: "GCSE Student", emoji: "🐢", bg: "#d9f4e5", hlColor: "#cd680a", text: "The website is genuinely ", hl: "the most perfect thing ever created", tail: ". If only it was made earlier!" },
  { name: "Mia S.", role: "Tutor", emoji: "🦁", bg: "#fde3c4", hlColor: "#e7000b", text: "Love the website and have ", hl: "recommended it to so many families", tail: " I work with now!" },
  { name: "Daryl G.", role: "Teacher", emoji: "🐙", bg: "#e9dcfd", hlColor: "#0369a1", text: "Took me a bit of getting used to, but this new site is excellent. I found the old one really useful, but ", hl: "this is next level", tail: ". I share it with all my colleagues and students." },
  { name: "Mohamed M.", role: "GCSE Student", emoji: "🐸", bg: "#d3f3fa", hlColor: "#a333e0", text: "I didn't realise how ", hl: "so many more things to help with all kinds of revision", tail: " were on here until I looked around." },
];

export default function Home() {
  const counts = courseCounts();
  return (
    <div>
      {/* ------------------------------------------------ hero */}
      <section className="hero-wash relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:pt-14">
          <div>
            <Link
              href="/research"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:border-accent/40"
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-ink text-[9px] text-white">▶</span>
              Watch the launch video
            </Link>

            <div className="mt-7 flex gap-10">
              {STATS.map((s) => (
                <div key={s.n} className="max-w-44">
                  <p className="flex items-center gap-2 font-title text-lg font-extrabold">
                    <span className="flex size-7 items-center justify-center rounded-lg text-sm" style={{ background: s.bg }}>
                      {s.icon}
                    </span>
                    {s.n}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{s.label}</p>
                </div>
              ))}
            </div>

            <h1 className="font-hand mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[64px]">
              Your{" "}
              <span className="underline-swash">All-in-One</span>
              <br />
              Resource to Crush
              <br />
              Your <RotatingWord />
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              Exam-style worksheets marked by Genie as you go, plus past papers,
              videos and lessons for every topic. Used by 1,000,000+ students.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-xl pb-10 lg:pb-0">
            <WorksheetDemo />
            {/* genie blob peeking */}
            <svg viewBox="0 0 90 90" className="absolute -top-10 right-2 size-20" aria-hidden>
              <path
                d="M45 12c5-5 12-2 13 4 9 3 15 11 15 20 0 5-2 10-5 13 2 2.5 3 5.5 3 8.5C71 66 63 74 53 74H37C27 74 19 66 19 57.5c0-3 1-6 3-8.5-3-3.5-5-8-5-13 0-9 6-17 15-20 1-6 8-9 13-4Z"
                fill="#2fe4b7"
              />
              <circle cx="38" cy="42" r="5" fill="#0a0a0a" />
              <circle cx="52" cy="42" r="5" fill="#0a0a0a" />
              <circle cx="39.5" cy="40.5" r="1.6" fill="#fff" />
              <circle cx="53.5" cy="40.5" r="1.6" fill="#fff" />
            </svg>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ big quote carousel */}
      <TestimonialCarousel />

      {/* ------------------------------------------------ launch video card */}
      <section className="bg-paper pb-16 sm:pb-20" aria-label="Introducing the new MathsGenie">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex aspect-video flex-col items-center justify-center rounded-3xl bg-night text-center">
            <h2 className="font-title px-6 text-3xl font-extrabold text-white sm:text-5xl">
              Introducing the{" "}
              <span className="underline-swash">all new</span>
            </h2>
            <p className="font-title mt-3 flex items-center gap-3 text-3xl font-extrabold text-white sm:text-5xl">
              <span className="flex size-11 items-center justify-center rounded-xl bg-ink-solid sm:size-14">
                <svg viewBox="0 0 24 24" className="size-7 sm:size-9" aria-hidden>
                  <path d="M12 3.6c.9-.9 2.3-.4 2.5.7 2.4.6 4.1 2.6 4.1 5 0 1.2-.4 2.3-1.1 3.2.4.5.6 1.1.6 1.7 0 1.7-1.5 3-3.4 3h-5.4c-1.9 0-3.4-1.3-3.4-3 0-.6.2-1.2.6-1.7C5.8 11.6 5.4 10.5 5.4 9.3c0-2.4 1.7-4.4 4.1-5 .2-1.1 1.6-1.6 2.5-.7Z" fill="#2fe4b7" />
                  <circle cx="9.8" cy="10.2" r="1.4" fill="#0a0a0a" />
                  <circle cx="14.2" cy="10.2" r="1.4" fill="#0a0a0a" />
                </svg>
              </span>
              MathsGenie
            </p>
            <div className="mt-8 flex w-full items-center gap-3 px-8 text-white/60">
              <span className="flex size-8 items-center justify-center rounded-full border border-white/30 text-xs">▶</span>
              <span className="text-xs">0:00</span>
              <span className="h-1 flex-1 rounded-full bg-white/15" />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ learn your way slides */}
      <LearnYourWay />

      {/* ------------------------------------------------ three feature cards */}
      <section className="bg-paper pb-16 sm:pb-20" aria-label="Marking and progress features">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 md:grid-cols-3">
          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="text-sm leading-relaxed text-muted">
              <span className="underline decoration-[#e7000b] decoration-2 underline-offset-2">Priestley presents the Inspector as a moral force.</span>{" "}
              The imperative “remember” commands the audience, while{" "}
              <span className="underline decoration-[#a333e0] decoration-2 underline-offset-2">the 1912 setting exposes Edwardian complacency</span>{" "}
              to a post-war audience.
            </p>
            <p className="mt-3 text-xs font-semibold text-muted">✍️ Essay feedback, line by line</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-paper-2 px-3 py-1.5 text-xs font-semibold">
              📄 june-2025-paper-1.pdf
            </p>
            <div className="mt-4 flex h-2 overflow-hidden rounded-full">
              <span className="w-1/2 bg-[#e7000b]" />
              <span className="w-1/6 bg-[#cd680a]" />
              <span className="flex-1 bg-[#00c750]" />
            </div>
            <div className="mt-4 space-y-2 text-xs font-medium">
              <p className="flex justify-between"><span className="text-[#0b6b3a]">✓ Question 1</span><span className="text-muted">3/3</span></p>
              <p className="flex justify-between"><span className="text-[#e7000b]">✗ Question 2</span><span className="text-muted">1/4</span></p>
            </div>
            <p className="mt-3 text-xs font-semibold text-muted">📄 Upload a paper, get it marked</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-5">
            <div className="flex items-start justify-between">
              <p className="font-title text-4xl font-extrabold">7</p>
              <p className="text-right text-xs text-muted">
                <span className="block font-bold text-ink">172 / 240 marks</span>
                <span className="text-[#0b6b3a]">↑ 14 marks to 8</span>
              </p>
            </div>
            <div className="mt-3 space-y-2.5">
              <div>
                <div className="flex justify-between text-[11px] text-muted"><span>Paper 1</span><span>62 / 80</span></div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-paper-2">
                  <div className="h-full w-[78%] rounded-full bg-accent" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-muted"><span>Paper 2</span><span>54 / 80</span></div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-paper-2">
                  <div className="h-full w-[68%] rounded-full bg-accent" />
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs font-semibold text-muted">📈 Grade prediction from real boundaries</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ practise tabs */}
      <PractiseTabs />

      {/* ------------------------------------------------ black AI section */}
      <section className="night-space py-20 text-white sm:py-28" aria-label="Meet Genie">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-title text-4xl font-extrabold tracking-tight sm:text-5xl">
              Meet Genie
              <br />
              Your AI Study Partner
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Get instant explanations and custom practice, personalized to how you learn.
            </p>
            <a href="/ask-genie" className="btn-primary mt-7">Try Genie for free</a>
          </div>

          <div className="mt-16 space-y-16 lg:space-y-24">
            {AI_ROWS.map((row) => (
              <div key={row.title} className="grid items-center gap-10 lg:grid-cols-2">
                <div className={row.title === "Know Exactly Where You Stand" ? "" : "lg:order-2"}>{row.card}</div>
                <div className={row.title === "Know Exactly Where You Stand" ? "lg:order-2" : ""}>
                  <p className="text-sm font-bold text-accent">{row.tag}</p>
                  <h3 className="font-title mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{row.title}</h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-white/60">{row.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ progress cards */}
      <section className="bg-paper py-16 sm:py-20" aria-label="Turn consistent study into real progress">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-title text-3xl font-extrabold tracking-tight sm:text-4xl">
            Turn consistent study
            <br />
            into real progress
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PROGRESS_CARDS.map((c) => (
              <div key={c.title} className="rounded-3xl p-6" style={{ background: c.bg }}>
                <p className="mb-4 text-sm font-bold">{c.title}</p>
                {c.body}
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/gcse" className="btn-black">
              Explore every feature <span aria-hidden>›</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ reviews wall */}
      <section className="bg-paper pb-16 sm:pb-20" aria-label="Reviews">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
            {WALL.map((r) => (
              <figure key={r.name} className="break-inside-avoid rounded-2xl border border-line bg-white p-5">
                <figcaption className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full text-lg" style={{ background: r.bg }} aria-hidden>
                    {r.emoji}
                  </span>
                  <span>
                    <span className="block text-sm font-bold">{r.name}</span>
                    <span className="block text-xs text-muted">{r.role}</span>
                  </span>
                </figcaption>
                <blockquote className="mt-3 text-sm leading-relaxed text-muted">
                  “{r.text}
                  <span className="font-semibold underline decoration-2 underline-offset-2" style={{ color: r.hlColor, textDecorationColor: r.hlColor }}>
                    {r.hl}
                  </span>
                  {r.tail}”
                </blockquote>
              </figure>
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-muted">
            Reviews shown are fictional, written for this recreation.
          </p>
          <div className="mt-6 text-center">
            <a href={`${SITE.original}/auth/signup`} className="btn-black">
              Join 1,000,000+ students <span aria-hidden>›</span>
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ final CTA */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-20" aria-label="Get started">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-[#c9eef8] py-20 text-center">
          {/* crystal mountains (original recreated) */}
          <svg viewBox="0 0 1200 320" className="absolute inset-x-0 bottom-0 h-56 w-full" preserveAspectRatio="xMidYMax slice" aria-hidden>
            <path d="M0 320 L140 150 L240 320 Z" fill="#9fd9e8" />
            <path d="M120 320 L300 90 L470 320 Z" fill="#7ecbe0" />
            <path d="M320 320 L470 140 L640 320 Z" fill="#b5e3ef" />
            <path d="M520 320 L700 70 L900 320 Z" fill="#8ed4e4" />
            <path d="M760 320 L920 160 L1080 320 Z" fill="#a9deeb" />
            <path d="M980 320 L1120 120 L1280 320 Z" fill="#7ecbe0" />
            <path d="M0 320 h1200 v60 H0 Z" fill="#e7f7fb" />
            <path d="M300 90 l30 25 -35 8 Z" fill="#ffffff" opacity="0.7" />
            <path d="M700 70 l32 28 -38 8 Z" fill="#ffffff" opacity="0.7" />
          </svg>
          <h2 className="relative font-title text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Ready to breeze through your GCSEs?
          </h2>
          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href={`${SITE.original}/auth/login`} className="rounded-full bg-white px-6 py-3 text-sm font-bold shadow-sm transition hover:bg-white/80">
              Sign in
            </a>
            <a href={`${SITE.original}/auth/signup`} className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-ink">
              Start studying for free
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
