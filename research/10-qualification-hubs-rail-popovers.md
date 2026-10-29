# 10 — Qualification hubs (IGCSE / KS2), rail polish, header popovers

Session date: 2026-10-29. Follow-up to `09-loggedin-probe-sidebar-lessons.md`.
All capture done logged-out via static fetches of the original app (JS-rendered;
content was extracted from the Next.js RSC payload in the HTML source).

## 1. IGCSE (original capture)

- `https://www.mathsgenie.co.uk/igcse` — **subjects landing** ("IGCSE Subjects"):
  search + Popular shelf + Other subjects grid, same pattern as `/a-level`.
  - 24 "choose exam board" button-cards: Maths, Combined Science, English
    Language, English as a Second Language, English Literature, History,
    Geography, Religious Studies, Art and Design, Biology, Chemistry, Physics,
    Spanish, French, Business, Computer Science, Accounting, Economics,
    Further Maths, German, ICT, Pakistan Studies, Psychology, Social Studies.
  - 21 direct-link cards, e.g. `Agriculture /igcse/agriculture/cie`,
    `Sociology /igcse/sociology/oxford-aqa`,
    **`World Literature /igcse/world-literature/cie`** (this is the "literary"
    hub on the original — Maths Genie has no separate Literacy section).
- `https://www.mathsgenie.co.uk/igcse.php` → `/igcse/maths/edexcel` course page:
  - H1 "Maths", chip **Spec 4MA1**, description "1,210 exam-style questions,
    650 worksheets, past papers from 2018–2025".
  - Tabs Topics | Resources; topics grouped **by grade** (1..8/9), 119 topics.
  - Topic URL pattern: `/igcse/maths/edexcel/grade-{G}-{i}-{j}-{slug}`
    (G = grade, `8-9` for the top group; e.g.
    `/igcse/maths/edexcel/grade-1-1-1-addition-and-subtraction`).
  - Row anatomy: progress ring (size-6, stroke 3.5) + number + title +
    chevron accordion revealing Questions/Video/Worksheet pills.
  - "Assessment at a glance": Paper 1/2 × Foundation/Higher, 2h, 100 marks,
    50% each; calculator allowed in both.
  - Sections: Course aims & skills (9 bullets), 6 FAQs.
- Full topic list archived in `src/data/igcse-maths/topics-edexcel.json`
  (built by `scripts/build_igcse_data.py` from the RSC payload scrape).

## 2. KS2 (original capture)

- `https://www.mathsgenie.co.uk/primary.php` — "Key Stage 2 Maths Revision":
  hero intro + quick links (`/ks2/daily-greens`, `/ks2/question-rush`),
  "Pick your exam board" → single card **KS2 SAT** → `/ks2/maths/sat`,
  helper note ("check the front cover of a past paper…"),
  "Free Key Stage 2 Maths resources" Popular grid:
  worksheets (`/ks2/maths/sat/worksheets`) + past papers
  (`/ks2/maths/sat/papers`), then FAQs (2 questions).

## 3. Replica implementation (this session)

| Route | Component | Notes |
| --- | --- | --- |
| `/igcse` | `components/igcse/IgcseHub.tsx` | Popular shelf (Maths internal) + Other grid (external) |
| `/igcse/maths/edexcel` | `components/courses/CourseBody.tsx` | generalized Topics/Resources body; 119 topics in 8 grade groups + assessment table + aims + 6 FAQs |
| `/ks2` | `app/ks2/page.tsx` | hero, board card, resources, 2 FAQs |
| `/ks2/maths/sat` | `app/ks2/maths/sat/page.tsx` | papers/worksheets cards + 6-group "What's on the test" checklist |

- Header FLYOUT: IGCSE → `/igcse`, KS2 → `/ks2` (were external links);
  mobile nav now lists every internal qualification.
- `MemberShell` qualification `<select>` gained AS Level + KS2 options.

## 4. Sidebar collapse-to-rail polish

Previous state: 64px icon rail via `rail-collapsed` + native `title` tooltips.
This session ("polish"):

- Custom dark hover/focus tooltips (`role="tooltip"`, `.mg-pop` pop-in)
  rendered **outside** the `<aside>` with fixed positioning — the aside is
  `overflow-hidden` and would clip an absolutely-positioned flyout. One
  tooltip instance for the whole rail, positioned from the hovered row's
  `getBoundingClientRect()`.
- "Other" disclosure group now works in rail mode: opens as a flyout to the
  RIGHT of the rail (expanded mode keeps the popover above the button).
  Outside-click handler checks both the menu and the toggle button so the
  toggle doesn't flicker-reopen.
- Active row keeps `#CEFBFF` bg in rail mode (matches original); icons center
  (`mr-0 justify-center`); `data-rail-collapsed` attribute set for tests.
- Expansion still: header pin button (`mg-rail-expand` event) — matches the
  original which hides bug/collapse in rail mode.

## 5. Header popovers

- **Updates (bell)**: new popover — unread badge state, 5 update items with
  tinted icon tiles + unread dots + relative times, per-item click marks read,
  "Mark all as read", "See all updates" → `/feature-requests`.
- XP / Energy / Streak / Profile popovers existed from member/02–05 research;
  polished: Escape-to-close, `aria-haspopup` + `aria-expanded` on every
  trigger, `role="dialog"` / `role="menu"`, `.mg-pop` entry animation
  (160ms, origin top-right; disabled under `prefers-reduced-motion`).
- Fixed latent bug: "GCSE" and "Find course" pills shared one `flyoutOpen`
  state, so both dropdowns opened simultaneously — now separate states that
  also close the Features menu.

## 6. Tooling pitfall (IMPORTANT for future sessions)

This environment's transcript display **eats the two-character sequences
`[h` and `[m` in BOTH tool inputs and displayed outputs** (file writes, bash
commands, read-backs). Source files on disk are usually fine — verify with
runtime-constructed strings (e.g. `chr(91)+'h'` in python) or by building,
never by eyeballing transcript text. Copying displayed code into `old_str`
edits fails silently; scripts `scripts/fix_brackets.py`,
`scripts/check_mangle.py`, `scripts/sanitize_brackets.py` were written during
the investigation (sanitize is safe/idempotent, check produces false
positives on intact text — trust the build instead).
