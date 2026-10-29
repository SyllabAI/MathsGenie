import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import QuestionRushGame from "@/components/QuestionRushGame";
import RushQualSwitcher from "@/components/RushQualSwitcher";
import { Attribution } from "@/components/Content";
import { rushPoolsForQual } from "@/lib/questions";

export const metadata: Metadata = {
  title: "AS Level Question Rush | MathsGenie",
  description: "Timed 60-second drill across AS Level Pure, Statistics and Mechanics — recreated with original sample questions.",
};

/** /as-level/question-rush — per-qualification Rush (original: /as-level/question-rush). */
export default function AsLevelQuestionRushPage() {
  const pools = rushPoolsForQual("as-level");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-sm">
        <Link href="/as-level" className="text-ink/60 hover:text-accent">AS Level</Link>
        <span className="text-ink/40" aria-hidden>›</span>
        <span className="font-semibold">Question Rush</span>
        <span className="ml-auto hidden text-xs text-ink/50 sm:block">Spec 8MA0</span>
      </nav>
      <h1 className="mt-2 font-hand text-5xl font-bold">Question Rush</h1>
      <p className="mt-2 text-muted">
        Beat the clock on quick-fire AS Level questions — Pure, Statistics and Mechanics pools.
        Speed and accuracy both count, and one wrong answer resets your streak.
      </p>
      <div className="mt-6">
        <RushQualSwitcher current="as-level" />
      </div>
      <div className="mt-8">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-paper-2" />}>
          <QuestionRushGame pools={pools} />
        </Suspense>
      </div>
      <Attribution href="https://www.mathsgenie.co.uk/as-level/question-rush" />
    </div>
  );
}
