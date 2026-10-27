"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { gradeTabs, type TopicsDoc } from "@/lib/data";

/** Grade tab strip replicating the original's Grade 1 … 8/9 navigation. */
export default function GradeTabs({ doc }: { doc: TopicsDoc }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("grade") ?? gradeTabs(doc)[0];
  const tabs = gradeTabs(doc);

  return (
    <div
      role="tablist"
      aria-label="Grade tabs"
      className="flex flex-wrap gap-1.5 rounded-2xl border border-line bg-panel p-1.5"
    >
      {tabs.map((g) => {
        const active = g === current;
        return (
          <button
            key={g}
            role="tab"
            aria-selected={active}
            onClick={() => router.replace(`${pathname}?grade=${encodeURIComponent(g)}`, { scroll: false })}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active ? "bg-ink text-paper" : "text-ink/70 hover:bg-paper-2"
            }`}
          >
            Grade {g}
          </button>
        );
      })}
    </div>
  );
}
