# Feature 05 — Daily Greens

## Behaviour on original

1. `/gcse/daily-greens` and `/a-level/daily-greens`.
2. Name inference: "greens" = questions marked green/correct — a **daily set of problems** that turns your answers green; framed as a daily habit/streak mechanic.
3. Daily cadence: a fresh small set of questions each day (date-keyed), integrated with the planner/marking loop.

## Evidence

- daily_greens.html (245 KB): nav item "Daily Greens" with a "New" badge in header; page renders a date-based feed shell (client-hydrated content).
- Position in primary nav (between Question Rush and Ideas) signals habitual daily use.

## Limitations

Full question content loads via authenticated client APIs — not captured. Recreation implements the cadence/UI with sample questions.

## Recreation

- `src/app/gcse/daily-greens/page.tsx` — deterministic daily picker: `dayOfYear % pool.length` selects 3 questions from the sample bank (same set for everyone on a given day — matching the "daily" mechanic without a backend).
- Streak tracker in localStorage (calendar strip UI), "streak saved" state after completion.
