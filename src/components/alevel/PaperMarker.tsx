"use client";

import { useRef, useState } from "react";

/**
 * Paper marker / answer marking (original /a-level/paper-marker and
 * /a-level/essay-marker): upload a completed paper (or paste written
 * working) and get it marked question by question. This recreation runs
 * a local canned pipeline — it parses lines like "1) 42" or "Q2: x = 5"
 * and marks them against a small answer key, producing the same
 * "question · your answer · marks · comment" read-out the original shows.
 */

type Result = { q: string; yours: string; marks: number; outOf: number; comment: string };

const KEY: { q: string; accept: string[]; outOf: number; comment: string }[] = [
  { q: "1", accept: ["2"], outOf: 1, comment: "Differentiate term by term; the constant vanishes." },
  { q: "2", accept: ["6.5", "13/2"], outOf: 2, comment: "Solve the quadratic by factorising; both roots checked, negative rejected." },
  { q: "3", accept: ["0.72", "18/25"], outOf: 2, comment: "Conditional probability — divide by the probability the student studies French." },
  { q: "4", accept: ["21.6", "21.6 m"], outOf: 3, comment: "SUVAT with s = ut + ½at²; keep units on the final line." },
  { q: "5", accept: ["ln(3)"], outOf: 2, comment: "Take logs after isolating the exponential; exact form preferred." },
];

function parseAnswers(text: string): { q: string; yours: string }[] {
  const out: { q: string; yours: string }[] = [];
  for (const raw of text.split(/\n+/)) {
    const m = raw.trim().match(/^(?:Q\s*)?(\d+)\s*[).:—-]?\s*(.+)$/i);
    if (m) out.push({ q: m[1], yours: m[2].trim() });
  }
  return out;
}

export default function PaperMarker({ mode }: { mode: "paper" | "answer" }) {
  const isPaper = mode === "paper";
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<Result[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const mark = () => {
    const given = parseAnswers(text);
    if (!given.length) return;
    const rows: Result[] = KEY.map((k) => {
      const g = given.find((x) => x.q === k.q);
      const ok = g ? k.accept.some((a) => g.yours.toLowerCase().replace(/\s/g, "").includes(a)) : false;
      return {
        q: k.q,
        yours: g ? g.yours : "— not attempted",
        marks: ok ? k.outOf : 0,
        outOf: k.outOf,
        comment: g ? (ok ? k.comment : `Close — ${k.comment}`) : k.comment,
      };
    });
    setResults(rows);
  };

  const total = results?.reduce((a, b) => a + b.marks, 0) ?? 0;
  const outOf = results?.reduce((a, b) => a + b.outOf, 0) ?? 0;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl border-2 border-line bg-paper p-6">
        <h2 className="font-title text-lg font-extrabold">{isPaper ? "Upload a completed paper" : "Paste your written answer"}</h2>
        <p className="mt-1 text-sm text-muted">
          {isPaper
            ? "PDF or photo. The marker reads each question response and marks it against the scheme."
            : "One answer per line, e.g. “1) 2” — try the sample below to see marking in action."}
        </p>

        {isPaper && (
          <div
            className="mt-4 grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-line bg-paper-2/60 px-6 py-8 text-center transition hover:border-accent/50"
            onClick={() => fileRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
            <svg viewBox="0 0 24 24" className="size-8 text-muted" fill="none" aria-hidden><path d="M12 16V4m0 0L7 9m5-5 5 5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <p className="mt-2 text-sm font-semibold">{fileName ? `Selected: ${fileName}` : "Choose a file or drop it here"}</p>
            <p className="text-xs text-muted">Processed in this demo — nothing is uploaded.</p>
          </div>
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder={"1) 2\n2) 6.5\n3) 0.72\n4) 21.6\n5) ln(3)"}
          className="mt-4 w-full rounded-2xl border-2 border-line bg-paper-2 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent"
          aria-label={isPaper ? "Or paste answers as text" : "Your written answers"}
        />
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={mark}
            disabled={!text.trim()}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink disabled:opacity-40"
          >
            Mark {isPaper ? "paper" : "answer"}
          </button>
          {results && (
            <button onClick={() => { setResults(null); setText(""); setFileName(null); }} className="rounded-full border-2 border-line px-5 py-2.5 text-sm font-bold transition hover:bg-paper-2">
              Clear
            </button>
          )}
        </div>
      </div>

      {results && (
        <div className="mt-6 rounded-3xl border-2 border-line bg-paper p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-title text-lg font-extrabold">Marking report</h2>
            <span className="rounded-full bg-accent-soft px-4 py-1.5 text-sm font-extrabold text-accent tabular-nums">{total} / {outOf}</span>
          </div>
          <ul className="mt-4 space-y-3">
            {results.map((r) => (
              <li key={r.q} className="flex items-start gap-3 rounded-2xl bg-paper-2 px-4 py-3">
                <span className={`mt-0.5 grid size-7 flex-none place-items-center rounded-full text-xs font-extrabold ${r.marks === r.outOf ? "bg-[#e2f6e9] text-[#0b7a3b]" : "bg-[#ffd9d0] text-[#b3261e]"}`}>
                  {r.marks === r.outOf ? "✓" : "✗"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">Question {r.q} · your answer: {r.yours}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-ink/75">{r.comment}</p>
                </div>
                <span className="flex-none rounded-full bg-paper px-2.5 py-1 text-xs font-extrabold tabular-nums">{r.marks}/{r.outOf}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] leading-relaxed text-muted">
            Demo marking — the key above ships with this recreation. The original marks real submissions with its own AI marker.
          </p>
        </div>
      )}
    </div>
  );
}
