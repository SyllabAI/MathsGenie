# 07 — Recreation Map

Original page / component → recreated implementation in this repo's Next.js app.

Workflow: [JCodesMore/ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template)
four steps — **Map → Observe → Build → Compare**.

## Route map

| Original route | Recreation route | Component / source | Data |
|---|---|---|---|
| `/` | `/` | `src/app/page.tsx` (hero, learn/practice/marking/AI sections) | static |
| `/gcse` | `/gcse` | `src/app/gcse/page.tsx` (board grid, resource sections, FAQ) | `subjects.json` |
| `/gcse/maths/{board}` | `/gcse/maths/[board]` | `src/app/gcse/maths/[board]/page.tsx` (grade tabs + topic list) | `topics-{board}.json` |
| `{topic}` | `/gcse/maths/[board]/[topic]` | topic page w/ mode cards | topic JSON |
| `{topic}/questions` | `…/[topic]/questions` | question bank UI (sample items, links out) | — |
| `{course}/papers` | `/gcse/maths/[board]/papers` | series → paper table | `papers-edexcel.json` |
| `/a-level/maths/edexcel` | `/a-level/maths/edexcel` | module sections + topic lists | `topics-edexcel.json` |
| `/gcse/question-rush` | `/gcse/question-rush` | timed drill game UI (client component) | questions from JSON |
| `/gcse/daily-greens` | `/gcse/daily-greens` | daily problem card + streak UI | questions from JSON |
| `/ask-genie` | `/ask-genie` | chat UI shell (no backend) | — |
| `/features/revision-planner` | `/features/revision-planner` | planner UI (add topics → schedule) | topics JSON |
| `{course}/predicted-grade-calculator` | same route | working sliders → grade bands | static boundaries |

## Component mapping

| Original | Recreation (`src/components/`) |
|---|---|
| Sticky header nav pills | `Header.tsx` (nav, Sign up CTA, Old-site link) |
| Mega-menu (667 courses) | `QualificationMenu.tsx` (client, dropdown by qualification) |
| Board cards grid | `BoardCards.tsx` |
| Mode cards (icon tiles) | `ModeCards.tsx` (inline SVG icons, light/dark variants) |
| Grade tab strip | `GradeTabs.tsx` (client, URL-state) |
| Topic row list | `TopicList.tsx` |
| Pill badge | `ui/Badge.tsx` |
| Paper series table | `PaperTable.tsx` |
| FAQ accordion | `Faq.tsx` (native `<details>`) |
| Cookie banner | `CookieBanner.tsx` (client, localStorage) |
| Footer (Tools/Company) | `Footer.tsx` |

## Design substitutions

| Original | Recreation | Reason |
|---|---|---|
| MathsGenie Hand font | Caveat (Google Fonts) | proprietary font not copied |
| mode-cards SVG icons | inline original SVGs drawn by hand | not redistributing assets |
| subject-covers photos | CSS gradient covers per subject | not redistributing assets |
| PDFs re-hosted | outbound links to mathsgenie.co.uk | copyright stays with owners |

## Compare step

After build: `npm run build && npm start`, then screenshot side-by-side against
live site at matched viewport (1440×900, 390×844) and repair visual diffs
(gaps tracked as GitHub issues).
