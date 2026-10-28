import type { Metadata } from "next";
import { Attribution } from "@/components/Content";

export const metadata: Metadata = {
  title: "Research",
  description: "The reverse-engineering research behind this recreation.",
};

const DOCS = [
  { name: "01 — Site architecture", desc: "Next.js + Turbopack fingerprint, RSC rendering, asset CDN map" },
  { name: "02 — URL taxonomy", desc: "Every route pattern with live examples and regex grammar" },
  { name: "03 — Information architecture", desc: "Navigation, page hierarchy, 667-course catalog" },
  { name: "04 — Data model", desc: "RSC flight payloads and the parsed catalog schema" },
  { name: "05 — Design system", desc: "Palette, fonts, component inventory" },
  { name: "06 — Parsing methodology", desc: "Crawler pipeline + evidence trail (rea-style)" },
  { name: "07 — Recreation map", desc: "Original page → recreated component mapping" },
];

const FEATURES = [
  "00 — Feature inventory", "01 — GCSE course page", "02 — Topic pages",
  "03 — Past papers", "04 — Question Rush", "05 — Daily Greens",
  "06 — Ask Genie AI", "07 — Revision planner", "08 — Grade calculator",
  "09/10/11 — Tools & hubs",
];

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-hand text-5xl font-bold">Research</h1>
      <p className="mt-2 text-muted">
        Every claim in this recreation is documented with evidence. The full
        reverse-engineering record lives in the repository&apos;s{" "}
        <code className="font-mono text-sm">research/</code> folder — this page is
        its index.
      </p>

      <section className="mt-8">
        <h2 className="font-hand text-3xl font-bold">Core documents</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {DOCS.map((d) => (
            <a
              key={d.name}
              href={`https://github.com/SyllabAI/MathsGenie/blob/main/research/${d.name.slice(0, 2)}.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-line bg-panel p-4 hover:shadow-md"
            >
              <p className="font-semibold">{d.name} ↗</p>
              <p className="mt-1 text-xs text-muted">{d.desc}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-hand text-3xl font-bold">Feature briefs</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {FEATURES.map((f) => (
            <a
              key={f}
              href="https://github.com/SyllabAI/MathsGenie/tree/main/research/features"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line bg-panel px-4 py-1.5 text-sm font-medium hover:bg-paper-2 hover:text-accent"
            >
              {f}
            </a>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-line bg-panel p-6">
        <h2 className="font-hand text-2xl font-bold">Method</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Stack fingerprinting from chunk names and link attributes; catalog
          extraction by decoding Next.js RSC flight payloads embedded in the raw
          HTML; design tokens from the compiled Tailwind CSS; feature briefs in
          the rea style — behaviour, evidence, limitations, recreation plan. The
          parser is re-runnable:{" "}
          <code className="font-mono text-xs">python3 scripts/build_catalog.py</code>.
        </p>
      </section>

      <Attribution href="https://github.com/SyllabAI/MathsGenie/tree/main/research" />
    </div>
  );
}
