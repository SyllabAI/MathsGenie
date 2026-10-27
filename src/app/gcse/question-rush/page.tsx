import type { Metadata } from "next";
import { Suspense } from "react";
import QuestionRushGame from "@/components/QuestionRushGame";
import { Attribution } from "@/components/Content";
import { catalog } from "@/lib/data";

export const metadata: Metadata = {
  title: "GCSE Question Rush",
  description: "Timed 60-second drill game across GCSE grades — recreated with original sample questions.",
};

export default function QuestionRushPage() {
  const grades = Object.keys(catalog.gcseEdexcel.grades).sort((a, b) => {
    const na = a === "8/9" ? 8.5 : parseInt(a, 10);
    const nb = b === "8/9" ? 8.5 : parseInt(b, 10);
    return na - nb;
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-hand text-5xl font-bold">Question Rush</h1>
      <p className="mt-2 text-muted">
        Pick a grade, get 60 seconds, answer everything you can. The original runs
        this per-topic and per-board on its question bank; this recreation uses
        original sample questions with the same game feel.
      </p>
      <div className="mt-8">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-paper-2" />}>
          <QuestionRushGame grades={grades} />
        </Suspense>
      </div>
      <Attribution href="https://www.mathsgenie.co.uk/gcse/question-rush" />
    </div>
  );
}
