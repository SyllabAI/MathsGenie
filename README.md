# MathsGenie — Reverse Engineered & Recreated

A research-driven recreation of [mathsgenie.co.uk](https://www.mathsgenie.co.uk):
the complete resource catalog parsed and stored as structured data, the features
reverse-engineered with evidence citations, and the frontend rebuilt in Next.js.

> **Independent educational/research project.** Not affiliated with MathsGenie.
> All original content (papers, notes, videos, media) belongs to MathsGenie and
> the awarding bodies (Pearson Edexcel, AQA, OCR, WJEC, Eduqas, CCEA). This repo
> stores **metadata and link indexes only** — every resource links back to the
> original. Nothing copyrighted is re-hosted.

## Repository map

```
MathsGenie/
├── src/            Next.js 16 (App Router, React 19, TS strict, Tailwind v4)
│   ├── app/        recreated routes (mirroring the original's URL taxonomy)
│   ├── components/ recreated component set
│   └── lib/        data loaders + original sample questions
├── data/           parsed catalog (factual metadata):
│   ├── subjects.json               667 courses (7 qualifications × subjects × boards)
│   ├── gcse-maths/topics-{6 boards}.json   134 topics per board, by grade
│   ├── gcse-maths/papers-edexcel.json      15 series, 136 resource URLs
│   ├── a-level-maths/topics-edexcel.json   44 topics in modules
│   ├── site-map.json               nav, URL patterns, features
│   └── design-tokens.json          observed palette + typography
├── research/       reverse-engineering docs (evidence-cited, rea-style)
│   ├── 01-site-architecture.md … 07-recreation-map.md
│   └── features/   12 per-feature briefs
├── scripts/        crawler + parser (Python) that regenerates data/
├── docs/plans/     build plans (superpowers-style)
└── .agents/skills/ clone-website + reverse-engineering skill definitions
```

## The recreation (Next.js app)

| Route | What it recreates |
|---|---|
| `/` | Homepage hero, qualification cards, learn/practice/marking/AI sections |
| `/gcse` | Board grid (6 boards), Popular/Practice/Learn/Tools sections, FAQs |
| `/gcse/maths/{board}` | Grade-tab topic browser — 134 topics × 6 boards, data-driven |
| `/gcse/maths/{board}/{topic}` | Topic page with mode cards (questions/videos/notes/…) |
| `/gcse/maths/{board}/{topic}/questions` | Question-bank UI with original sample questions |
| `/gcse/maths/{board}/papers` | Past-papers catalog, 15 series, links to original PDFs |
| `/gcse/maths/{board}/predicted-grade-calculator` | **Working** slider calculator, editable boundaries |
| `/gcse/maths/{board}/mock-exam-builder` | Topic-picker composer (cover-sheet output) |
| `/gcse/maths/{board}/{worksheets,revision-guides,lessons,videos,flashcards}` | Resource hub pages |
| `/a-level/maths/edexcel` | 44 topics in module sections |
| `/gcse/question-rush` | 60-second timed drill game (client-side) |
| `/gcse/daily-greens` | Deterministic daily set + streak tracking |
| `/ask-genie` | AI chat shell (demo mode, no backend) |
| `/features/revision-planner` | Working local planner (pick topics → spread across days) |
| `/features/answer-marking` | Upload-and-mark flow documentation + static demo |
| `/course`, `/research` | Catalog catch-all + research index |

All routes also exist for the original site's other boards (aqa/ocr/wjec/eduqas/ccea)
via the same `[board]` dynamic segment.

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck + production build
```

## Regenerating the data catalog

```bash
python3 scripts/build_catalog.py   # parses crawl_raw/ HTML → data/*.json
```

Method documented in [research/06-parsing-methodology.md](research/06-parsing-methodology.md):
raw pages are fetched, Next.js RSC flight payloads are decoded, and the embedded
topic/paper structures are normalised into JSON.

## Methodology & tooling credits

- [obra/superpowers](https://github.com/obra/superpowers) — repo working agreement
  (AGENTS.md, plans, skills, evidence-first workflow) — see [AGENTS.md](AGENTS.md)
- [JCodesMore/ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template)
  — the Map → Observe → Build → Compare cloning workflow and repo layout
  (see `.agents/skills/clone-website/`)
- [morluto/rea](https://github.com/morluto/rea) — the reverse-engineering
  methodology (claims cite evidence; limitations stated) applied throughout
  `research/` (see `.agents/skills/reverse-engineering/`)

## Known deviations from the original

- Proprietary `MathsGenie Hand` font substituted with open-licensed Caveat.
- Subject cover photos and mode-card icons redrawn as CSS gradients / inline SVG.
- Question content: sample questions are original compositions (UI demos only).
- AI features (Ask Genie, marking, mock generation) are UI shells — the real
  backends are proprietary services.
- PDFs and videos are never downloaded into this repo; all resource buttons open
  the original site.

## License

Code and research documentation: MIT (see [LICENSE](LICENSE)).
MathsGenie name and original content remain the property of their respective owners.
