"use client";

import { useState } from "react";

/**
 * Topics / Resources tab switcher for the A-Level hub, mirroring the
 * original's two-tab course header (observed live 2026-10-29). Both panels
 * are server-rendered and passed in; the client only toggles visibility.
 */
export default function ALevelTabs({
  topics,
  resources,
}: {
  topics: React.ReactNode;
  resources: React.ReactNode;
}) {
  const [tab, setTab] = useState<"topics" | "resources">("topics");

  const pill = (id: "topics" | "resources", label: string) => (
    <button
      key={id}
      onClick={() => setTab(id)}
      aria-pressed={tab === id}
      className={`rounded-full px-5 py-2 text-sm font-bold transition ${
        tab === id ? "bg-ink text-paper" : "border border-line bg-panel text-ink/70 hover:bg-paper-2"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="flex gap-2" role="group" aria-label="Course view">
        {pill("topics", "Topics")}
        {pill("resources", "Resources")}
      </div>
      <div hidden={tab !== "topics"}>{topics}</div>
      <div hidden={tab !== "resources"}>{resources}</div>
    </div>
  );
}
