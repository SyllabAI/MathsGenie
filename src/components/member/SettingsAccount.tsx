"use client";

import { useState } from "react";
import { USER } from "@/lib/classrooms";

/**
 * /settings/account panel, cloned from the live page
 * (research/04-member-area.md §9): category nav (Account / Subscription /
 * Preferences / Emails / Privacy & security / Guardians), avatar card,
 * exam details, subjects & target grades, account actions
 * (Sign out / Reset progress / Delete account).
 */

const CATEGORIES = [
  "Account",
  "Subscription",
  "Preferences",
  "Emails",
  "Privacy & security",
  "Guardians",
] as const;

const SUBJECT_ROWS = [
  { name: "Maths", target: "Grade 7" },
  { name: "Physics", target: "Grade 6" },
  { name: "Chemistry", target: "Grade 6" },
  { name: "History", target: "Grade 5" },
];

export default function SettingsAccount() {
  const [tab, setTab] = useState<(typeof CATEGORIES)[number]>("Account");
  const [name, setName] = useState(USER.full);
  const [editingName, setEditingName] = useState(false);
  const [accountType, setAccountType] = useState("Student");

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      <h1 className="pt-8 text-3xl font-extrabold tracking-tight">Settings</h1>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        <nav aria-label="Settings categories" className="shrink-0 lg:w-52">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <button
                  onClick={() => setTab(c)}
                  className={`w-full whitespace-nowrap rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition ${
                    tab === c ? "bg-[#cefbff] text-[#1cb0f6]" : "text-ink/60 hover:bg-paper-2 hover:text-ink"
                  }`}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 flex-1">
          {tab === "Account" ? (
            <>
              {/* profile card */}
              <section className="rounded-3xl border-2 border-line bg-panel p-6">
                <div className="flex items-center gap-4">
                  <AvatarBlock />
                  <div className="min-w-0 flex-1">
                    {editingName ? (
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setEditingName(false)}
                        onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
                        className="w-full rounded-xl border-2 border-accent bg-paper px-3 py-2 text-lg font-extrabold outline-none"
                        autoFocus
                      />
                    ) : (
                      <h3 className="truncate text-lg font-extrabold">{name}</h3>
                    )}
                    <p className="text-xs text-muted">{USER.first} · Joined 6 days ago</p>
                  </div>
                  <button
                    onClick={() => setEditingName((v) => !v)}
                    className="rounded-full border-2 border-line px-3.5 py-1.5 text-xs font-bold transition hover:bg-paper-2"
                  >
                    {editingName ? "Save" : "Edit Name"}
                  </button>
                </div>
              </section>

              {/* exam details */}
              <section className="mt-5 rounded-3xl border-2 border-line bg-panel p-6">
                <h3 className="font-extrabold">Exam details</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <SelectRow label="Account type" value={accountType} onChange={setAccountType} options={["Student", "Teacher", "Parent", "Tutor"]} />
                  <SelectRow label="Active qualification" value="GCSE" onChange={() => {}} options={["GCSE", "A Level", "IGCSE"]} />
                </div>
                <button className="mt-4 rounded-full border-2 border-line px-4 py-2 text-sm font-bold transition hover:bg-paper-2">
                  Add school
                </button>
              </section>

              {/* subjects */}
              <section className="mt-5 rounded-3xl border-2 border-line bg-panel p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold">Subjects &amp; target grades</h3>
                  <button className="rounded-full border-2 border-line px-3.5 py-1.5 text-xs font-bold transition hover:bg-paper-2">
                    Edit subjects
                  </button>
                </div>
                <ul className="mt-3 divide-y divide-line">
                  {SUBJECT_ROWS.map((s) => (
                    <li key={s.name} className="flex items-center justify-between py-3 text-sm">
                      <span className="font-semibold">{s.name}</span>
                      <span className="flex items-center gap-3 text-muted">
                        {s.target}
                        <button aria-label={`Options for ${s.name}`} className="rounded-full px-2 py-1 transition hover:bg-paper-2">⋯</button>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* actions */}
              <section className="mt-5 rounded-3xl border-2 border-line bg-panel p-6">
                <h4 className="font-extrabold">Account actions</h4>
                <a
                  href="https://mathsgenie.co.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block rounded-full border-2 border-line px-4 py-2 text-sm font-bold transition hover:bg-paper-2"
                >
                  Sign out
                </a>

                <h4 className="mt-6 font-extrabold">Reset progress</h4>
                <button className="mt-2 rounded-full border-2 border-[#ffb3b3] px-4 py-2 text-sm font-bold text-[#d4093b] transition hover:bg-[#fde8ec]">
                  Reset progress
                </button>

                <h4 className="mt-6 font-extrabold">Delete account</h4>
                <button className="mt-2 rounded-full border-2 border-[#ffb3b3] px-4 py-2 text-sm font-bold text-[#d4093b] transition hover:bg-[#fde8ec]">
                  Delete account
                </button>
              </section>
            </>
          ) : (
            <section className="rounded-3xl border-2 border-line bg-panel p-10 text-center">
              <h3 className="text-lg font-extrabold">{tab}</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                The {tab} settings live behind the account on the original site. This recreation keeps the
                Account panel; the other categories are documented in{" "}
                <code className="rounded bg-paper-2 px-1.5 py-0.5 text-xs">research/04-member-area.md</code>.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function AvatarBlock() {
  return (
    <button className="relative shrink-0" aria-label="Customize avatar">
      <span className="flex size-16 items-center justify-center overflow-hidden rounded-full bg-sky-400">
        <svg viewBox="0 0 24 24" className="size-14" aria-hidden="true">
          <path d="M12 5.2c3.6 0 6.2 2.5 6.2 6.2 0 1.5-.4 2.7-1.1 3.7H6.9c-.7-1-1.1-2.2-1.1-3.7 0-3.7 2.6-6.2 6.2-6.2Z" fill="#5cc1ea" />
          <path d="M4.5 9.5C4.5 6 7.9 3 12 3s7.5 3 7.5 6.5c0 .8-.6 1.4-1.4 1.4H5.9c-.8 0-1.4-.6-1.4-1.4Z" fill="#e7000b" />
          <circle cx="9.6" cy="12.6" r="1.1" fill="#0a0a0a" />
          <circle cx="14.4" cy="12.6" r="1.1" fill="#0a0a0a" />
          <path d="M9.8 15.6c1.4 1 3 1 4.4 0" stroke="#0a0a0a" strokeWidth="1" strokeLinecap="round" fill="none" />
        </svg>
      </span>
      <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-ink text-white" aria-hidden>
        ✎
      </span>
    </button>
  );
}

function SelectRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border-2 border-line bg-paper px-3 py-2.5 text-sm font-normal outline-none transition focus:border-accent"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
