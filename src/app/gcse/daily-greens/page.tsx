import type { Metadata } from "next";
import DailyGreensClient from "@/components/DailyGreensClient";
import { Attribution } from "@/components/Content";

export const metadata: Metadata = {
  title: "GCSE Daily Greens",
  description: "A fresh daily set of questions with a streak mechanic — recreated with original sample questions.",
};

export default function DailyGreensPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-hand text-5xl font-bold">Daily Greens</h1>
      <p className="mt-2 text-muted">
        Three questions a day, same set for everyone, streak saved in your browser.
        &ldquo;Greens&rdquo; = the answers you turn green. The original runs this
        daily cadence against its full question bank with accounts; here it runs
        fully client-side.
      </p>
      <div className="mt-8">
        <DailyGreensClient />
      </div>
      <Attribution href="https://www.mathsgenie.co.uk/gcse/daily-greens" />
    </div>
  );
}
