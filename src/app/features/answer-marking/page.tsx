import type { Metadata } from "next";
import Link from "next/link";
import { Attribution } from "@/components/Content";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Answer Marking",
  description: "How the original's upload-and-mark flow works — documented, with a static demo.",
};

export default function AnswerMarkingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-hand text-5xl font-bold">Answer Marking</h1>
      <p className="mt-2 text-muted">
        The original lets you write your working straight onto a past paper, upload
        it, and have Genie mark it question-by-question against the mark scheme.
        This page documents the flow with a static demo — the marking engine
        itself is MathsGenie&apos;s product and is not recreated.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { step: "1", t: "Choose a paper", d: "Pick any past paper from the papers catalog — question paper and mark scheme pair." },
          { step: "2", t: "Upload your working", d: "Photograph or upload your completed answers; the original reads them question by question." },
          { step: "3", t: "Get examiner-style feedback", d: "Scores per question, total (e.g. 61/80), strengths list, and what to revise next." },
        ].map((s) => (
          <div key={s.step} className="rounded-2xl border border-line bg-panel p-5">
            <Badge tone="dark">Step {s.step}</Badge>
            <p className="mt-3 font-semibold">{s.t}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{s.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-panel p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">Demo result (static)</p>
        <div className="mt-3 flex items-center gap-6">
          <div>
            <p className="font-mono text-4xl font-bold">61<span className="text-muted">/80</span></p>
            <p className="text-sm text-muted">Higher tier · Paper 2</p>
          </div>
          <ul className="text-sm">
            <li className="text-emerald-600 dark:text-emerald-400">✓ Strong: algebraic manipulation, ratios</li>
            <li className="text-amber-600 dark:text-amber-400">△ Loose ends: circle theorem justifications</li>
            <li className="text-rose-600 dark:text-rose-400">✗ Revise: inverse proportion, iteration</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/gcse/maths/edexcel/papers" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:opacity-90">
          Browse the papers catalog
        </Link>
        <a href="https://www.mathsgenie.co.uk" target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:bg-paper-2">
          Try the real marking ↗
        </a>
      </div>

      <Attribution href="https://www.mathsgenie.co.uk" />
    </div>
  );
}
