"use client";

import { useRef, useState } from "react";

/**
 * Ask Genie side panel — recreation of the live question-player panel:
 * floating rounded-3xl white card on the right with a header (history,
 * new chat, expand, close), the Baby Genie app icon, a personalised
 * greeting, suggested prompt chips and a chat input. Local canned-tutor
 * replies; no network calls.
 */

function GenieAppIcon() {
  return (
    <span className="mx-auto grid size-16 place-items-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#2fe4b7] to-[#5cc1ea] shadow-inner" aria-hidden>
      <svg viewBox="0 0 96 96" className="size-14">
        <path d="M48 16c17 0 27 11 27 26 0 6.5-2.2 11.6-5.6 15.2 1.5 2 2.3 4.4 2.3 7C71.7 73.6 61.3 82 48 82s-23.7-8.4-23.7-17.8c0-2.6.8-5 2.3-7C23.2 53.6 21 48.5 21 42c0-15 10-26 27-26Z" fill="#2fe4b7" />
        <circle cx="39" cy="42" r="4.4" fill="#14171c" />
        <circle cx="57" cy="42" r="4.4" fill="#14171c" />
        <circle cx="40.4" cy="40.6" r="1.4" fill="#fff" />
        <circle cx="58.4" cy="40.6" r="1.4" fill="#fff" />
        <path d="M39 54c5.4 4.2 12.6 4.2 18 0" stroke="#14171c" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      </svg>
    </span>
  );
}

type Msg = { who: "genie" | "me"; text: string };

export default function GeniePanel({
  open,
  onClose,
  topicTitle,
  questionPrompt,
  answer,
}: {
  open: boolean;
  onClose: () => void;
  topicTitle: string;
  questionPrompt: string;
  answer: string;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  const chips = [
    { icon: "▤", label: `Compare calculation methods` },
    { icon: "🔍", label: "Spot the key values" },
    { icon: "✎", label: "Quiz me on this method" },
  ];

  const replyFor = (q: string) => {
    const l = q.toLowerCase();
    if (l.includes("compare") || l.includes("method"))
      return `For "${questionPrompt}" most people either walk the standard method step by step or look for a shortcut with friendly numbers. Try the standard method first — the mark scheme wants the working, not just the answer.`;
    if (l.includes("spot") || l.includes("value") || l.includes("key"))
      return `Pull out the numbers and what they mean: the question gives you everything you need for "${topicTitle}". Which two quantities are actually being combined?`;
    if (l.includes("quiz") || l.includes("practise") || l.includes("practice"))
      return `Warm-up: try the same style but with easier numbers, then come back. If your method still works, you've got it — that's the whole game.`;
    if (l.includes("answer") || l.includes("solution"))
      return `I won't just hand it over — but I'll tell you this: check your units and your final line. If the last line of your working matches "${answer}", you're there.`;
    return `Here's how I'd start "${questionPrompt}": write down what the question actually asks for, then the one rule from ${topicTitle} that connects your givens to it. Say the rule out loud — it usually unblocks the next line.`;
  };

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || thinking) return;
    setInput("");
    setMsgs((m) => [...m, { who: "me", text }]);
    setThinking(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { who: "genie", text: replyFor(text) }]);
      setThinking(false);
      requestAnimationFrame(() => bodyRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }));
    }, 650);
    requestAnimationFrame(() => bodyRef.current?.scrollTo({ top: 9e9 }));
  };

  return (
    <aside
      role="dialog"
      aria-label="Ask Genie"
      className="fixed bottom-4 right-4 z-[1005] flex max-h-[min(78vh,620px)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl border-2 border-line bg-paper shadow-2xl"
    >
      {/* header */}
      <div className="flex flex-none items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-1.5">
          <button aria-label="Chat history" title="Chat history" className="grid size-9 place-items-center rounded-full border-2 border-line text-ink/60 transition hover:bg-paper-2 hover:text-ink">
            <svg viewBox="0 0 24 24" className="size-4.5" fill="none" aria-hidden><path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button
            aria-label="New chat"
            title="New chat"
            onClick={() => setMsgs([])}
            className="grid size-9 place-items-center rounded-full border-2 border-line text-ink/60 transition hover:bg-paper-2 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="size-4.5" fill="none" aria-hidden><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <button aria-label="Expand chat" title="Expand" className="grid size-9 place-items-center rounded-full border-2 border-line text-ink/60 transition hover:bg-paper-2 hover:text-ink">
            <svg viewBox="0 0 24 24" className="size-4.5" fill="none" aria-hidden><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button aria-label="Close chat" onClick={onClose} className="grid size-9 place-items-center rounded-full border-2 border-line text-ink/60 transition hover:bg-paper-2 hover:text-ink">
            <svg viewBox="0 0 24 24" className="size-4.5" fill="none" aria-hidden><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {/* body */}
      <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto px-4 pb-3 pt-2">
        {msgs.length === 0 ? (
          <div className="flex flex-col items-center py-3 text-center">
            <GenieAppIcon />
            <p className="mt-3 font-title text-lg font-bold tracking-tight">What&apos;re you stuck on?</p>
            <p className="mt-0.5 text-xs text-muted">Answer a question. I&apos;ll mark it here.</p>
            <div className="mt-4 flex w-full flex-col items-stretch gap-2">
              {chips.map((c) => (
                <button
                  key={c.label}
                  onClick={() => send(c.label)}
                  className="flex items-center justify-center gap-2 rounded-full border-2 border-accent/25 bg-accent-soft/60 px-3 py-2 text-[13px] font-semibold text-accent transition hover:border-accent/50"
                >
                  <span aria-hidden>{c.icon}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                  m.who === "me"
                    ? "self-end bg-accent text-white"
                    : "self-start border-2 border-line bg-paper-2 text-ink"
                }`}
              >
                {m.text}
              </div>
            ))}
            {thinking && (
              <div className="self-start rounded-2xl border-2 border-line bg-paper-2 px-4 py-3" aria-label="Genie is typing">
                <span className="flex gap-1">
                  <i className="size-1.5 animate-bounce rounded-full bg-ink/40" />
                  <i className="size-1.5 animate-bounce rounded-full bg-ink/40 [animation-delay:120ms]" />
                  <i className="size-1.5 animate-bounce rounded-full bg-ink/40 [animation-delay:240ms]" />
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* input */}
      <div className="flex flex-none items-center gap-2 px-4 pb-4">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border-2 border-line bg-paper-2 px-4 py-2.5 focus-within:border-accent/50">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask…"
            aria-label="Ask Genie"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>
        <button
          onClick={() => send()}
          disabled={!input.trim() || thinking}
          aria-label="Send"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-white transition hover:bg-accent-ink disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="size-4.5" fill="none" aria-hidden><path d="M12 19V5m0 0-6 6m6-6 6 6" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </aside>
  );
}
