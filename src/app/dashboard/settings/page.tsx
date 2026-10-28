"use client";

import { useState } from "react";

const TABS = ["Account", "Subscription", "Preferences"] as const;
type Tab = (typeof TABS)[number];

const LIMITS = [
  { label: "Lessons", used: 1, cap: 3 },
  { label: "Revision notes", used: 3, cap: 3 },
  { label: "Flashcard topics", used: 2, cap: 3 },
  { label: "Question topics", used: 1, cap: 3 },
  { label: "Walkthroughs", used: 2, cap: 3 },
  { label: "Question Rush", used: 9, cap: 10 },
];

const SUBJECTS = [
  { name: "Physics", board: "Edexcel", qual: "A Level" },
  { name: "Chemistry", board: "Edexcel", qual: "GCSE" },
  { name: "Maths", board: "Edexcel", qual: "IGCSE" },
  { name: "History", board: "CIE", qual: "IGCSE" },
];

export default function DashboardSettings() {
  const [tab, setTab] = useState<Tab>("Account");
  const [theme, setTheme] = useState("System");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="mt-5 flex flex-wrap gap-1.5 border-b border-line pb-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t ? "bg-night text-white" : "text-muted hover:bg-paper-2 hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Account" && (
        <div className="mt-6 space-y-6">
          <Card title="Account">
            <p className="text-sm text-muted">Your profile, qualification and subjects.</p>
            <div className="mt-4 flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-500 text-lg font-bold text-white">
                D
              </span>
              <div>
                <p className="font-bold">Demo Student</p>
                <p className="text-sm text-muted">demo.student@example.com · @demostudent</p>
              </div>
              <button className="ml-auto rounded-full border border-line px-4 py-1.5 text-sm font-semibold hover:bg-paper-2">
                Edit
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <p className="rounded-xl bg-paper p-3">Account type · <strong>Student</strong></p>
              <p className="rounded-xl bg-paper p-3">Current streak · <strong>4 days</strong></p>
              <p className="rounded-xl bg-paper p-3">Recent best streak · <strong>4 days</strong></p>
              <p className="rounded-xl bg-paper p-3">Member since · <strong>October 2026</strong></p>
            </div>
          </Card>

          <Card title="Exam details">
            <p className="text-sm text-muted">What you&apos;re studying, and when you sit your exams.</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <p className="rounded-xl bg-paper p-3">Qualification · <strong>GCSE</strong></p>
              <p className="rounded-xl bg-paper p-3">Exam boards · <strong>Edexcel, CIE</strong></p>
            </div>
          </Card>

          <Card title="Subjects & target grades">
            <p className="text-sm text-muted">
              The subjects on your home page, your tier, and what you&apos;re aiming for in each.
            </p>
            <ul className="mt-4 divide-y divide-line">
              {SUBJECTS.map((s) => (
                <li key={s.name + s.qual} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-muted">{s.board} · {s.qual}</span>
                </li>
              ))}
            </ul>
            <button className="mt-3 rounded-full border border-line px-4 py-1.5 text-sm font-semibold hover:bg-paper-2">
              Edit subjects
            </button>
          </Card>
        </div>
      )}

      {tab === "Subscription" && (
        <div className="mt-6 space-y-6">
          <Card title="Your plan">
            <p className="flex items-center gap-2 font-bold">
              Free plan <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-xs font-semibold text-muted">Current plan</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Upgrade for unlimited marking, Ask Genie and mock exams.
            </p>
            <button className="mt-4 rounded-full bg-sky-500 px-5 py-2 text-sm font-bold text-white hover:bg-sky-600">
              View plans
            </button>
          </Card>

          <Card title="Energy">
            <p className="text-sm text-muted">
              Energy is spent on AI marking and Ask Genie. It refills every week.
            </p>
            <p className="mt-3 text-2xl font-bold">
              15 <span className="text-base font-semibold text-muted">/ 20</span>
            </p>
            <div className="mt-2 h-2.5 rounded-full bg-paper-2">
              <div className="h-2.5 w-3/4 rounded-full bg-purple-400" />
            </div>
            <p className="mt-2 text-xs text-muted">
              You get 20 energy a week. Unused energy doesn&apos;t carry over.
            </p>
          </Card>

          <Card title="Weekly limits">
            <ul className="mt-2 divide-y divide-line">
              {LIMITS.map((l) => (
                <li key={l.label} className="flex items-center gap-3 py-2.5 text-sm">
                  <span className="w-36 font-semibold">{l.label}</span>
                  <div className="h-2 flex-1 rounded-full bg-paper-2">
                    <div
                      className={`h-2 rounded-full ${l.used >= l.cap ? "bg-red-400" : "bg-sky-400"}`}
                      style={{ width: `${(l.used / l.cap) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-muted">{l.used}/{l.cap}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === "Preferences" && (
        <div className="mt-6 space-y-6">
          <Card title="Appearance">
            <p className="text-sm text-muted">Theme</p>
            <div className="mt-3 flex gap-2">
              {["Light", "Dark", "System"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
                    theme === t ? "border-sky-400 bg-sky-400/10 text-sky-700" : "border-line hover:bg-paper-2"
                  }`}
                >
                  Aa · {t}
                </button>
              ))}
            </div>
          </Card>
          <Card title="Accessibility">
            <p className="text-sm text-muted">
              Reading and display adjustments — everything here is optional and
              only changes how the site looks for you.
            </p>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="font-semibold">Text size</p>
                <div className="mt-2 flex gap-1.5">
                  {["Default", "Large", "Extra large"].map((s, i) => (
                    <button
                      key={s}
                      className={`rounded-full border px-3.5 py-1.5 font-semibold ${
                        i === 0 ? "border-sky-400 text-sky-700" : "border-line text-muted hover:bg-paper-2"
                      }`}
                      style={{ fontSize: `${12 + i * 2}px` }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-paper p-3">
                <span>
                  <span className="block font-semibold">Easier-reading font</span>
                  <span className="text-xs text-muted">A typeface designed for readability</span>
                </span>
                <span className="h-6 w-11 rounded-full bg-paper-2 p-0.5">
                  <span className="block h-5 w-5 rounded-full bg-white shadow" />
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-paper p-3">
                <span>
                  <span className="block font-semibold">Background colour</span>
                  <span className="text-xs text-muted">A gentle tint instead of white</span>
                </span>
                <span className="h-6 w-11 rounded-full bg-paper-2 p-0.5">
                  <span className="block h-5 w-5 rounded-full bg-white shadow" />
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-panel p-5 sm:p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-1">{children}</div>
    </section>
  );
}
