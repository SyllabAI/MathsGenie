import type { Metadata } from "next";
import Link from "next/link";
import ResourceHubShell from "@/components/member/ResourceHubShell";
import DailyGreensClient from "@/components/DailyGreensClient";

export const metadata: Metadata = {
  title: "GCSE Daily Greens",
  description: "A fresh daily set of questions with a streak mechanic — recreated with original sample questions.",
};

/**
 * /gcse/daily-greens — member pattern (research/04-member-area.md §6):
 * "Wednesday 28 October" heading + grade accordions, and the
 * no-classroom empty state when no Maths classroom exists; the
 * standalone recreation game stays available below.
 */
export default function DailyGreensPage() {
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <ResourceHubShell
      board="edexcel"
      title="Daily Greens"
      activeTab="Daily Greens"
      tabs={[
        { label: "All resources", href: "/gcse/maths/edexcel", icon: "▦" },
        { label: "Worksheets", href: "/gcse/maths/edexcel/worksheets", icon: "🖨" },
        { label: "Question bank", href: "/gcse/maths/edexcel/questions", icon: "◉" },
        { label: "Question Rush", href: "/gcse/question-rush", icon: "⏱" },
        { label: "Daily Greens", href: "/gcse/daily-greens", icon: "🌿" },
        { label: "Hot topics", href: "/gcse/maths/edexcel/topic-heatmap", icon: "📊" },
      ]}
    >
      <div className="mt-6">
        <h2 className="text-xl font-extrabold">{today}</h2>

        <div className="mt-4 rounded-3xl border-2 border-line bg-panel px-6 py-10 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-paper-2 text-2xl" aria-hidden>
            🗓
          </span>
          <h4 className="mt-4 text-xl font-extrabold">No GCSE Maths classrooms yet</h4>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-muted">
            Classrooms are Maths only for now. Create a Maths classroom and its topics will show up here.
          </p>
          <Link
            href="/classrooms"
            className="mt-5 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink"
          >
            Go to classrooms
          </Link>
        </div>

        <details className="mt-8 rounded-3xl border-2 border-line bg-panel p-6">
          <summary className="cursor-pointer font-extrabold">
            Try today&apos;s set — standalone recreation (no classroom needed)
          </summary>
          <p className="mt-2 text-sm text-muted">
            Three questions a day, same set for everyone, streak saved in your browser.
            &ldquo;Greens&rdquo; = the answers you turn green.
          </p>
          <div className="mt-5">
            <DailyGreensClient />
          </div>
        </details>
      </div>
    </ResourceHubShell>
  );
}
