import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import QuestionRushGame from "@/components/QuestionRushGame";
import RushQualSwitcher from "@/components/RushQualSwitcher";
import { Attribution } from "@/components/Content";
import { rushPoolsForQual } from "@/lib/questions";

export const metadata: Metadata = {
  title: "IGCSE Question Rush | MathsGenie",
  description: "Timed 60-second drill across IGCSE topics — recreated with original sample questions.",
};

/** /igcse/question-rush — per-qualification Rush (original: /igcse/question-rush). */
export default function IgcseQuestionRushPage() {
  const pools = rushPoolsForQual("igcse");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-sm">
        <Link href="/igcse" className="text-ink/60 hover:text-accent">IGCSE</Link>
        <span className="text-ink/40" aria-hidden>›</span>
        <Link href="/igcse/maths/edexcel" className="text-ink/60 hover:text-accent">Maths</Link>
        <span className="text-ink/40" aria-hidden>›</span>
        <span className="font-semibold">Question Rush</span>
      </nav>
      <h1 className="mt-2 font-hand text-5xl font-bold">Question Rush</h1>
      <p className="mt-2 text-muted">
        Sixty seconds of quick-fire IGCSE questions. Answer as many as you can —
        streaks build your score, and one wrong answer resets it.
      </p>
      <div className="mt-6">
        <RushQualSwitcher current="igcse" />
      </div>
      <div className="mt-8">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-paper-2" />}>
          <QuestionRushGame pools={pools} />
        </Suspense>
      </div>
      <Attribution href="https://www.mathsgenie.co.uk/igcse/question-rush" />
    </div>
  );
}
