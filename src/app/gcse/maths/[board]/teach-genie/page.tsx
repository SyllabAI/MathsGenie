import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ResourceHubShell from "@/components/member/ResourceHubShell";
import { isBoard, loadTopics } from "@/lib/data";

export const metadata: Metadata = { title: "Teach Genie" };

/**
 * /gcse/maths/[board]/teach-genie — "Learn by Teaching" (Feynman technique)
 * page (original pattern): Baby Genie mascot, Start New Session CTA,
 * topic picker entry, and the 3-step How it works strip.
 */
export default async function TeachGeniePage({ params }: { params: Promise<{ board: string }> }) {
  const { board } = await params;
  if (!isBoard(board)) notFound();
  const doc = await loadTopics(board);
  const firstGrade = Object.keys(doc.grades)[0];

  const tabs = [
    { label: "All resources", href: `/gcse/maths/${board}`, icon: "▦" },
    { label: "Question bank", href: `/gcse/maths/${board}/questions`, icon: "◉" },
    { label: "Flashcards", href: `/gcse/maths/${board}/flashcards`, icon: "🗂" },
    { label: "Teach Genie", href: `/gcse/maths/${board}/teach-genie`, icon: "🧞" },
    { label: "Lessons", href: `/gcse/maths/${board}/lessons`, icon: "📖" },
  ];

  return (
    <ResourceHubShell board={board} title="Teach Genie" activeTab="Teach Genie" tabs={tabs}>
      <div className="mt-10 grid items-center gap-8 rounded-3xl border-2 border-line bg-gradient-to-br from-[#e9dcfd]/50 to-[#d3f3fa]/50 p-8 sm:grid-cols-[auto_1fr]">
        <BabyGenie className="mx-auto size-32" />
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-extrabold tracking-tight">Learn by Teaching</h2>
          <p className="mt-2 max-w-lg text-sm text-muted">
            Pick a topic, explain it to Baby Genie in your own words, and see what stuck. The Feynman
            technique — the fastest way to find the gaps in your understanding.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
            <Link
              href={`/gcse/maths/${board}/${doc.grades[firstGrade][0].slug}/questions`}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink"
            >
              Start New Session
            </Link>
            <Link
              href={`/gcse/maths/${board}`}
              className="rounded-full border-2 border-line bg-paper px-6 py-2.5 text-sm font-bold transition hover:bg-paper-2"
            >
              Pick your topics
            </Link>
          </div>
        </div>
      </div>

      <h3 className="mt-12 text-xl font-extrabold">How it works</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[
          { n: 1, t: "Pick your topics", d: "Choose any topic from the course — or let Genie pick one you got wrong recently." },
          { n: 2, t: "Teach Baby Genie", d: "Explain the method out loud or in writing. Baby Genie asks the questions a confused student would ask." },
          { n: 3, t: "See what stuck", d: "Get a breakdown of what you explained clearly and what needs another look." },
        ].map((s) => (
          <div key={s.n} className="rounded-3xl border-2 border-line bg-panel p-6">
            <span className="flex size-9 items-center justify-center rounded-full bg-accent font-extrabold text-white">{s.n}</span>
            <h4 className="mt-3 font-extrabold">{s.t}</h4>
            <p className="mt-1.5 text-sm text-muted">{s.d}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted">
        Sessions run on the original&apos;s AI tutor — this recreation documents the flow.
      </p>
    </ResourceHubShell>
  );
}

function BabyGenie({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden>
      <path d="M48 16c17 0 27 11 27 26 0 6.5-2.2 11.6-5.6 15.2 1.5 2 2.3 4.4 2.3 7C71.7 73.6 61.3 82 48 82s-23.7-8.4-23.7-17.8c0-2.6.8-5 2.3-7C23.2 53.6 21 48.5 21 42c0-15 10-26 27-26Z" fill="#2fe4b7" />
      <circle cx="39" cy="42" r="4.4" fill="#14171c" />
      <circle cx="57" cy="42" r="4.4" fill="#14171c" />
      <circle cx="40.4" cy="40.6" r="1.4" fill="#fff" />
      <circle cx="58.4" cy="40.6" r="1.4" fill="#fff" />
      <path d="M39 54c5.4 4.2 12.6 4.2 18 0" stroke="#14171c" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <path d="M26 66c-6 2-9 6-8 11 6 1 11-1 14-6" fill="#2fe4b7" />
    </svg>
  );
}
