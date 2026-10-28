"use client";

import { useMemo, useState } from "react";

/**
 * Ideas + feedback board, an original recreation of the maths genie feature
 * request board: status groups, Top/New/Hot sorting, category filters and
 * working upvotes (stored per browser).
 */

type Status = "open" | "planned" | "progress" | "shipped";

type Post = {
  id: string;
  title: string;
  body: string;
  author: string;
  where: string;
  when: string;
  category: "Feature ideas" | "Content ideas" | "Feedback";
  status: Status;
  votes: number;
  comments: number;
};

const STATUS_META: Record<Status, { label: string; dot: string }> = {
  progress: { label: "In progress", dot: "bg-[#8b5cf6]" },
  planned: { label: "Planned", dot: "bg-[#f59e0b]" },
  shipped: { label: "Shipped", dot: "bg-[#10b981]" },
  open: { label: "Open", dot: "bg-[#1cb0f6]" },
};

const POSTS: Post[] = [
  {
    id: "app",
    title: "Make it an app",
    body: "A home-screen app would be handy for revising on the bus — even a simple wrapper that remembers my last topic would do.",
    author: "@mika_r",
    where: "Somewhere else",
    when: "6 days ago",
    category: "Feature ideas",
    status: "progress",
    votes: 41,
    comments: 12,
  },
  {
    id: "darkmode",
    title: "Dark mode for late-night revision",
    body: "My eyes hurt revising after 10pm. A proper dark theme across worksheets and the planner would be brilliant.",
    author: "@sana.k",
    where: "Manchester",
    when: "2 weeks ago",
    category: "Feature ideas",
    status: "planned",
    votes: 33,
    comments: 8,
  },
  {
    id: "print",
    title: "Printable revision checklists per grade",
    body: "A one-page checklist per grade that I can tick off on paper — my printer lives longer than my tablet battery.",
    author: "@tomb_r",
    where: "Bristol",
    when: "3 weeks ago",
    category: "Content ideas",
    status: "open",
    votes: 27,
    comments: 5,
  },
  {
    id: "streaks",
    title: "Streak freeze for weekends",
    body: "I do family things on Saturdays and losing my greens streak feels awful. One freeze token a week, please!",
    author: "@ayaan99",
    where: "Birmingham",
    when: "1 month ago",
    category: "Feedback",
    status: "shipped",
    votes: 19,
    comments: 9,
  },
  {
    id: "pastepaper-timer",
    title: "Built-in timer on past papers",
    body: "Start a paper, timer runs in the corner, auto-stops at 90 minutes and shows the mark scheme. Would save me juggling my phone.",
    author: "@harry_t",
    where: "Leeds",
    when: "1 month ago",
    category: "Feature ideas",
    status: "planned",
    votes: 24,
    comments: 4,
  },
  {
    id: "videos-speed",
    title: "Playback speed on walkthrough videos",
    body: "Let us watch at 1.25x or 1.5x — some explanations are long when you already know half the method.",
    author: "@priyaaaa",
    where: "London",
    when: "2 months ago",
    category: "Feature ideas",
    status: "open",
    votes: 16,
    comments: 3,
  },
];

const CATEGORIES = ["Feature ideas", "Content ideas", "Feedback"] as const;
const STATUS_ORDER: Status[] = ["progress", "planned", "open", "shipped"];

export default function FeatureRequestsPage() {
  const [tab, setTab] = useState<"Top" | "New" | "Hot">("Top");
  const [cat, setCat] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [voted, setVoted] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    let list = POSTS.filter(
      (p) =>
        (!cat || p.category === cat) &&
        (!query.trim() ||
          (p.title + " " + p.body).toLowerCase().includes(query.toLowerCase()))
    );
    if (tab === "Top") list = [...list].sort((a, b) => b.votes - a.votes);
    if (tab === "New") list = [...list].sort((a, b) => a.when.localeCompare(b.when));
    if (tab === "Hot")
      list = [...list].sort((a, b) => b.votes + b.comments * 3 - (a.votes + a.comments * 3));
    return list;
  }, [tab, cat, query]);

  const groups = STATUS_ORDER.map((s) => ({
    status: s,
    posts: filtered.filter((p) => p.status === s),
  })).filter((g) => g.posts.length);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-title text-3xl font-extrabold tracking-tight text-ink">
            Ideas + feedback
          </h1>
          <p className="mt-1.5 text-[15px] text-ink/60">
            Suggest what this recreation should build next, and vote on ideas from others.
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert("This recreation stores ideas locally — open a GitHub discussion to suggest for real.")}
          className="flex shrink-0 items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-ink"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          Create new post
        </button>
      </div>

      <div className="mt-6 rounded-2xl bg-paper-2 p-5 text-sm leading-relaxed text-ink/80">
        We read every post. One idea per post, please — if someone has already suggested
        yours, upvote theirs instead of opening a duplicate. Be kind, and keep personal
        details out of public posts.
        <span className="mt-2 block text-ink/50">– The MathsGenie team</span>
        <div className="mt-3 flex items-center gap-4 border-t border-line pt-3">
          {(["Top", "New", "Hot"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 border-b-2 pb-2 text-sm font-semibold transition ${
                tab === t
                  ? "border-accent text-accent"
                  : "border-transparent text-ink/60 hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
          <div className="ml-auto relative">
            <svg viewBox="0 0 24 24" className="absolute left-3 top-2.5 size-4 text-ink/40" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search ideas"
              className="w-44 rounded-full bg-paper py-2 pl-9 pr-4 text-sm outline-none ring-1 ring-line transition focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_240px]">
        <div className="space-y-8">
          {groups.length === 0 && (
            <p className="text-sm text-ink/50">No ideas match that search yet.</p>
          )}
          {groups.map(({ status, posts }) => (
            <section key={status}>
              <h2 className="flex items-center gap-2 text-sm font-bold text-ink/80">
                <span className={`inline-block size-2.5 rounded-full ${STATUS_META[status].dot}`} aria-hidden />
                {STATUS_META[status].label}
              </h2>
              <ul className="mt-3 divide-y divide-line">
                {posts.map((p) => (
                  <li key={p.id} className="flex items-start gap-4 py-4">
                    <button
                      onClick={() => setVoted((v) => ({ ...v, [p.id]: !v[p.id] }))}
                      aria-pressed={!!voted[p.id]}
                      aria-label={`Upvote ${p.title}`}
                      className={`flex w-12 shrink-0 flex-col items-center rounded-xl px-2 py-1.5 text-sm font-bold transition ${
                        voted[p.id]
                          ? "bg-accent text-white"
                          : "bg-paper-2 text-ink/70 hover:bg-accent-soft hover:text-accent"
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
                        <path d="M12 5l7 8H5l7-8Z" />
                      </svg>
                      {p.votes + (voted[p.id] ? 1 : 0)}
                    </button>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[15px] font-bold text-ink">{p.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink/70">{p.body}</p>
                      <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-ink/50">
                        <span className="inline-flex size-4 items-center justify-center rounded-full bg-pas-lav text-[9px] font-bold text-ink/70">
                          {p.author[1].toUpperCase()}
                        </span>
                        <span className="font-semibold text-ink/70">{p.author}</span>
                        <span>in {p.where}</span>
                        <span>· {p.when}</span>
                        <span className="ml-auto inline-flex items-center gap-1">
                          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                            <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z" />
                          </svg>
                          {p.comments}
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line p-4">
            <h2 className="text-sm font-bold text-ink">Categories</h2>
            <ul className="mt-2 space-y-1">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => setCat((v) => (v === c ? null : c))}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                      cat === c ? "bg-[#cefbff] text-accent" : "text-ink/70 hover:bg-paper-2"
                    }`}
                  >
                    <span className="inline-block size-2 rounded-full bg-ink/25" aria-hidden />
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-line p-4 text-xs leading-relaxed text-ink/50">
            This board is an original recreation for the MathsGenie clone study. Votes are
            stored in your browser only — nothing is sent anywhere.
          </div>
        </aside>
      </div>
    </div>
  );
}
