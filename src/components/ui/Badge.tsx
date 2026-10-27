import type { ReactNode } from "react";

/** Pill badge matching the original's rounded-full chip pattern. */
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "foundation" | "higher" | "dark";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-paper-2 text-ink/80 border border-line",
    accent: "bg-accent-soft text-accent",
    foundation: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
    higher: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
    dark: "bg-ink text-paper",
  };
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function TierPill({ tier }: { tier: "F" | "H" }) {
  return <Badge tone={tier === "F" ? "foundation" : "higher"}>{tier === "F" ? "Foundation" : "Higher"}</Badge>;
}

export function GradeBadge({ grade }: { grade: string }) {
  return <Badge tone="accent">Grade {grade}</Badge>;
}
