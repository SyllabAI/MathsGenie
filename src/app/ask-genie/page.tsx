"use client";

import { useRef, useState } from "react";
import { Attribution } from "@/components/Content";
import { Badge } from "@/components/ui/Badge";

type Msg = { role: "user" | "genie"; text: string };

const SUGGESTIONS = [
  "Explain how to factorise quadratics",
  "Plan my revision week",
  "What's the difference between mean and median?",
  "How do surds work?",
];

function cannedReply(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("factor") || p.includes("quadratic"))
    return "Factorising x² + bx + c: look for two numbers that multiply to c and add to b. For x² − 5x + 6 those are −2 and −3, so (x − 2)(x − 3) = 0, giving x = 2 or x = 3. This recreation's Genie is a demo shell — the real AI runs on MathsGenie's own backend.";
  if (p.includes("plan"))
    return "A good week: 3 short sessions (45 min) beats one marathon. Pick your weakest 3 grade-4/5 topics, do 10 questions each, mark honestly, and log greens. The recreated Revision Planner can auto-spread topics across your study days.";
  if (p.includes("mean") || p.includes("median"))
    return "The mean is the sum divided by the count — sensitive to outliers. The median is the middle value when sorted — robust to outliers. Exam tip: if a question says 'the mean is affected by the unusual value', they're nudging you toward the median.";
  if (p.includes("surd"))
    return "Surds are exact irrational roots. Simplify by pulling out square factors: √50 = √(25×2) = 5√2. Add surds only when the radicand matches: 5√2 + 3√2 = 8√2.";
  return "This is a demo response — the recreated Genie shell doesn't call any AI backend. The original Ask Genie runs on MathsGenie's authenticated AI service. Try one of the suggested prompts to see more demo answers, or open the real Genie on the live site.";
}

export default function AskGeniePage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "genie", text: "Hi! I'm the recreated Genie shell 👋 — a UI recreation with canned demo answers. The real Genie AI lives on mathsgenie.co.uk. What are you working on?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  function send(text: string) {
    if (!text.trim() || typing) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "genie", text: cannedReply(text) }]);
      setTyping(false);
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, 700);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center gap-3">
        <h1 className="font-hand text-5xl font-bold">Ask Genie AI</h1>
        <Badge tone="accent">demo shell</Badge>
      </div>
      <p className="mt-2 text-muted">
        Your AI study partner — recreated as an interface study. No backend, no
        accounts; every reply is canned and links you back to the original.
      </p>

      <div
        ref={listRef}
        className="mt-8 h-[26rem] space-y-4 overflow-y-auto rounded-2xl border border-line bg-panel p-5"
      >
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-ink text-paper"
                  : "bg-paper-2"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-paper-2 px-4 py-3 text-sm text-muted">Genie is typing…</div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:bg-paper-2 hover:text-accent"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="mt-4 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about your topics…"
          className="flex-1 rounded-xl border border-line bg-paper px-4 py-3 outline-none"
        />
        <button className="rounded-xl bg-ink px-6 font-semibold text-paper hover:opacity-90">
          Send
        </button>
      </form>

      <Attribution href="https://www.mathsgenie.co.uk/ask-genie" />
    </div>
  );
}
