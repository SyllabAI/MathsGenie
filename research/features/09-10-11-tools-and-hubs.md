# Feature 09 — Mock Exam Builder

## Behaviour on original

1. Route: `{course}/mock-exam-builder` (linked from topic pages' tools strip and footer "Tools").
2. Concept: compose a custom mock paper by selecting topics (and difficulty bands), then generate/print an exam-style paper with mark scheme.
3. Auth/paid-gated beyond samples (part of the site's pricing tiers).

## Evidence

- Topic flight payload: mock-exam-builder mode card assets (`…/mode-cards/exam-builder-{dark,light}-tinted.svg`), `Exam`, `exam-style`, `examBoard` keys.
- Footer tool list on multiple pages includes "Mock exam builder".

## Recreation status

**Documented + UI stub.** `src/app/gcse/maths/[board]/mock-exam-builder/page.tsx` renders a topic-multi-select (from topic JSON) + difficulty pills + "generate" flow that produces a printable cover sheet listing chosen topics with per-topic links out to the original question banks. Actual paper generation requires their question corpus (proprietary) — not recreated.

---

# Feature 10 — Answer Marking (Upload & Mark)

## Behaviour on original

1. Homepage section "Get your answers marked like an examiner" + "Upload & Mark Past Papers".
2. Flow: upload a completed paper/photo → AI marks question-by-question against the mark scheme → score (e.g. `40/40`, `61/80`), strengths list, per-question feedback.
3. Ties into past papers ("Write your working straight onto the paper and Genie marks it question by question").

## Evidence

- Homepage flight: marking demo strings ("Strengths", "40 / 40", "61/80", "Upload & Mark Past Papers", "Get detailed feedback on your papers & l…").
- Papers page copy: "Genie marks it question by question against the mark scheme."
- Footer tool list: "Answer marking".

## Recreation status

**Documented only** (requires their AI backend). Recreation ships `src/app/features/answer-marking/page.tsx` explainer page mirroring the marketing flow with static demo states.

---

# Feature 11 — Worksheets, Flashcards, Lessons, Videos (course resource hubs)

## Behaviour on original

1. Per-course hubs: `/worksheets` (downloadable exam booklets), `/revision-guides` (topic-by-topic notes), `/lessons` (interactive bite-sized lessons), `/videos` (walkthroughs), `/flashcards` (active recall).
2. Also `/predicted-papers`, `/mini-tests`, `/45-min-tests` practice sets.
3. Worksheets available per board; revision guides/lessons/flashcards for all 6 boards (links observed on /gcse.html).
4. Media from `assets.mathsgenie.co.uk` (walkthrough MP4s observed on topic pages).

## Evidence

- gcse.html: 6 boards × {worksheets, papers, questions, revision-guides, lessons, videos, flashcards, predicted-grade-calculator} links; Practice section descriptions ("Predicted papers — Practice papers built from likely topics…", "Mini tests — Short topic-focused tests…", "45 min tests — 45-minute revision papers: half-length but…").
- revision_guides.html (448 KB) hub layout captured.

## Recreation status

`src/app/gcse/maths/[board]/{worksheets,revision-guides,lessons,videos,flashcards}/page.tsx` — hub pages listing topic names from the parsed catalog in the original's card/list patterns, each item linking **out to the corresponding original resource** with attribution. No media re-hosted.
