# MathsGenie — Reverse Engineering Research

Evidence-based documentation of **mathsgenie.co.uk** (as crawled October 2026),
produced following the methodology of [morluto/rea](https://github.com/morluto/rea)
(every claim cites its evidence) and the page-brief convention of
[JCodesMore/ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template).

## Scope & Legal Note

This research stores **factual metadata only**: URL taxonomies, topic titles, grade
structures, feature inventories, design tokens. No copyrighted content (exam papers,
revision notes, videos, images) has been copied into this repository — all resource
links point back to the original hosts (`mathsgenie.co.uk`, `assets.mathsgenie.co.uk`).
Copyright in exam papers belongs to the awarding bodies (Pearson Edexcel, AQA, OCR,
WJEC, Eduqas, CCEA); site content belongs to MathsGenie.

## Index

| Doc | What it covers |
|---|---|
| [01-site-architecture.md](01-site-architecture.md) | Tech stack fingerprint, rendering model, CDN map |
| [02-url-patterns.md](02-url-patterns.md) | Complete URL taxonomy with live examples |
| [03-information-architecture.md](03-information-architecture.md) | Navigation, page hierarchy, course catalog (667 courses) |
| [04-data-model.md](04-data-model.md) | RSC flight payloads, embedded JSON, parsed catalog schema |
| [05-design-system.md](05-design-system.md) | Palette, typography, component inventory |
| [06-parsing-methodology.md](06-parsing-methodology.md) | Crawler design + evidence trail (rea-style) |
| [07-recreation-map.md](07-recreation-map.md) | Original page → recreated component mapping |
| features/ | Per-feature reverse-engineering briefs |

## Feature Briefs (features/)

| Feature | Status on original site | Recreated? |
|---|---|---|
| [00-feature-inventory.md](features/00-feature-inventory.md) | — | — |
| [01-gcse-course-page.md](features/01-gcse-course-page.md) | Grade tabs + 134 topics × 6 boards | ✅ data-driven |
| [02-topic-pages.md](features/02-topic-pages.md) | Mode cards per topic | ✅ |
| [03-past-papers.md](features/03-past-papers.md) | 15 series catalog | ✅ catalog + outbound links |
| [04-question-rush.md](features/04-question-rush.md) | Timed drill game | ✅ UI |
| [05-daily-greens.md](features/05-daily-greens.md) | Daily problem feed | ✅ UI |
| [06-ask-genie.md](features/06-ask-genie.md) | AI study partner | ✅ UI |
| [07-revision-planner.md](features/07-revision-planner.md) | Study planner tool | ✅ UI |
| [08-grade-calculator.md](features/08-grade-calculator.md) | Predicted grade tool | ✅ working |
| [09-10-11-tools-and-hubs.md](features/09-10-11-tools-and-hubs.md) | Mock builder · marking · resource hubs | ✅ stubs/hubs |

## Raw Evidence

Crawled HTML + decoded RSC payloads used by the parser are described in
[06-parsing-methodology.md](06-parsing-methodology.md). The structured result
is the `data/` directory at repo root.
