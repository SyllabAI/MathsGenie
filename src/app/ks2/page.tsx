import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Key Stage 2 Maths Revision — MathsGenie",
  description:
    "Free Key Stage 2 (KS2) Maths revision: past papers with mark schemes, printable worksheets organised topic by topic, and daily practice for Years 3–6.",
};

const FAQS = [
  {
    q: "Where can I find Key Stage 2 Maths past papers and mark schemes?",
    a: "Every KS2 SATs maths paper from recent years — arithmetic and reasoning, paper 1 to 3 — is available with its mark scheme on the original site's papers page. Each paper downloads as a printable PDF alongside the marking guidance, so you can mark at home the way examiners do.",
  },
  {
    q: "Are these Key Stage 2 Maths resources free?",
    a: "Yes — all of them, with no sign-up needed. Worksheets, past papers and mark schemes are free to download and print, at school or at home, exactly as they have always been on MathsGenie.",
  },
];

/** /ks2 — Key Stage 2 landing, mirroring the original primary.php structure. */
export default function Ks2Page() {
  return (
    <div>
      {/* hero */}
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#d9f4e5]/70 via-[#e3f4fe]/60 to-[#fff3c9]/70"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6">
          <h1 className="text-3xl font-extrabold tracking-tight">Key Stage 2 Maths Revision</h1>
          <p className="mt-2 max-w-3xl text-sm text-ink/70">
            Free KS2 Maths resources for Years 3–6: printable worksheets organised topic by
            topic, every SATs past paper with its mark scheme, and a short daily practice to
            keep arithmetic sharp. Everything is free to download and print — no sign-up needed.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`${SITE.original}/ks2/daily-greens`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-line bg-paper px-4 py-1.5 text-sm font-semibold transition hover:bg-paper-2"
            >
              Daily Greens 🌿
            </a>
            <a
              href={`${SITE.original}/ks2/question-rush`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-line bg-paper px-4 py-1.5 text-sm font-semibold transition hover:bg-paper-2"
            >
              Question Rush ⚡
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {/* Pick your exam board */}
        <section className="mt-6">
          <h2 className="text-xl font-bold tracking-tight">Pick your exam board</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            <a
              href={`${SITE.original}/ks2/maths/sat`}
              className="group flex h-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-line px-3 py-6 text-center transition-colors hover:border-ink/20 hover:bg-paper-2"
              aria-label="KS2 SAT Key Stage 2 Maths"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[#e9dcfd] to-[#cfe6ff] text-lg" aria-hidden>
                🎒
              </span>
              <span className="text-base font-medium group-hover:text-accent">KS2 SAT</span>
              <span className="text-[11px] text-muted">National curriculum tests</span>
            </a>
          </div>
          <p className="mt-3 text-sm text-muted">
            Not sure which board you&apos;re taking? Ask your teacher, or check the front cover
            of a past paper or mock you&apos;ve been given — the exam board&apos;s logo is
            printed at the top.
          </p>
        </section>

        {/* Free resources */}
        <section className="mt-12">
          <h2 className="text-xl font-bold tracking-tight">Free Key Stage 2 Maths resources</h2>
          <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-muted">Popular</h3>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <a
              href={`${SITE.original}/ks2/maths/sat/worksheets`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-2xl p-2 transition hover:bg-paper-2"
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#d9f4e5] text-2xl" aria-hidden>
                🖨
              </span>
              <span>
                <span className="block font-bold group-hover:text-accent">Worksheets</span>
                <span className="mt-0.5 block text-sm text-muted">
                  Downloadable exam booklets and worksheets to print, topic by topic — from
                  column addition and times tables through to fractions, decimals and
                  percentages.
                </span>
              </span>
            </a>
            <a
              href={`${SITE.original}/ks2/maths/sat/papers`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-2xl p-2 transition hover:bg-paper-2"
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#e3f4fe] text-2xl" aria-hidden>
                📄
              </span>
              <span>
                <span className="block font-bold group-hover:text-accent">Past papers</span>
                <span className="mt-0.5 block text-sm text-muted">
                  Real SATs past papers with mark schemes, organised by year — arithmetic paper 1
                  plus reasoning papers 2 and 3.
                </span>
              </span>
            </a>
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-12">
          <h2 className="text-xl font-bold tracking-tight">Key Stage 2 Maths FAQs</h2>
          <div className="mt-4 max-w-3xl divide-y divide-line rounded-2xl border-2 border-line bg-paper">
            {FAQS.map((f) => (
              <details key={f.q} className="group px-4 py-3.5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold">
                  {f.q}
                  <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-muted transition-transform group-open:rotate-180" fill="none" aria-hidden>
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <p className="mt-2.5 text-sm leading-relaxed text-ink/70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-muted">
          Looking for GCSE or A Level instead?{" "}
          <Link href="/gcse" className="font-semibold text-accent hover:underline">GCSE</Link>
          {" · "}
          <Link href="/a-level" className="font-semibold text-accent hover:underline">A Level</Link>
          {" · "}
          <Link href="/igcse" className="font-semibold text-accent hover:underline">IGCSE</Link>
        </p>
      </div>
    </div>
  );
}
