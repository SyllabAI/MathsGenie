import type { Metadata } from "next";
import RevisionPlannerClient from "@/components/RevisionPlannerClient";
import { Attribution } from "@/components/Content";
import { catalog } from "@/lib/data";

export const metadata: Metadata = {
  title: "Revision Planner",
  description: "Plan your topics across study days — recreated planner with local persistence.",
};

export default function RevisionPlannerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-hand text-5xl font-bold">Revision Planner</h1>
      <p className="mt-2 max-w-3xl text-muted">
        Pick topics, choose how many days you have, and the plan spreads them
        evenly — mark things done as you go. Built on the parsed GCSE topic
        catalog (134 topics per board). The original version syncs to accounts
        and integrates with its marking loop; this one persists in your browser.
      </p>
      <div className="mt-8">
        <RevisionPlannerClient doc={catalog.gcseEdexcel} />
      </div>
      <Attribution href="https://www.mathsgenie.co.uk/features/revision-planner" />
    </div>
  );
}
