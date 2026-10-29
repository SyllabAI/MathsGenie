import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import QuestionRushGame from "@/components/QuestionRushGame";
import RushQualSwitcher from "@/components/RushQualSwitcher";
import { Attribution } from "@/components/Content";
import { rushPoolsForQual } from "@/lib/questions";

export const metadata: Metadata = {
  title: "KS2 Question Rush | MathsGenie",
  description: "Timed 60-second arithmetic drill for Key Stage 2 — recreated with original sample questions.",
};

/** /ks2/question-rush — per-qualification Rush (original: /ks2/question-rush). */
export default function Ks2QuestionRushPage() {
  const pools = rushPoolsForQual("ks2");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-sm">
        <Link href="/ks2" className="text-ink/60 hover:text-accent">KS2</Link>
        <span className="text-ink/40" aria-hidden>›</span>
        <span className="font-semibold">Question Rush</span>
      </nav>
      <h1 className="mt-2 font-hand text-5xl font-bold">Question Rush</h1>
      <p className="mt-2 text-muted">
        A minute on the clock and a pile of KS2 questions — addition, fractions,
        time and more. How many can you get through?
      </p>
      <div className="mt-6">
        <RushQualSwitcher current="ks2" />
      </div>
      <div className="mt-8">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-paper-2" />}>
          <QuestionRushGame pools={pools} />
        </Suspense>
      </div>
      <Attribution href="https://www.mathsgenie.co.uk/ks2/question-rush" />
    </div>
  );
}
