# Feature 07 — Revision Planner

## Behaviour on original

1. `/features/revision-planner` — tool landing + app. Marketed in the site footer under "Tools" alongside Mock exam builder, Ask Genie AI, Answer marking, Lesson starters, Grade calculator.
2. Concept: schedule topics across available study days up to exam dates; track confidence/done state per topic; integrate with question practice (per-topic links).
3. Auth-gated for persistence (account-linked plans).

## Evidence

- revision_planner.html (458 KB): planner landing layout; nav item in primary position (2nd).
- Footer tool list captured on multiple pages ("Revision planner · Mock exam builder · Ask Genie AI · Answer marking · Grade calculator · Pricing").

## Recreation

- `src/app/features/revision-planner/page.tsx` — working local planner: pick qualification/board (from `topics-*.json`), toggle topics → auto-distributed across a date range picker; per-topic status (todo/done), progress bar, localStorage persistence, ICS-free week grid.
- No account needed; a banner explains the original syncs to accounts.
