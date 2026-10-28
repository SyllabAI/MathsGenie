# 06 — Parsing Methodology (rea-style evidence trail)

How the catalog in `data/` was extracted, with the evidence for every conclusion.
Method: morluto/rea's principle — *inspect, cite evidence, state limitations* —
applied to a website target.

## Pipeline

```
1. FETCH    curl (Chrome UA) → crawl_raw/*.html          (22 pages, ~6.3 MB)
2. DECODE   regex self.__next_f.push([1,"…"]) → json.loads per chunk → flight payload
3. EXTRACT  scripts/extract_links.py                     (HTMLParser link graph)
            scripts/build_catalog.py                     (structured catalog → data/)
4. VERIFY   counts cross-checked against rendered page observations
```

## Crawled evidence set

| Page | File | Size | What it yielded |
|---|---|---|---|
| Home | home.html | 877 KB | nav mega-menu (667 courses), homepage sections |
| /gcse | gcse.html | 168 KB | board grid, Popular/Practice/Learn/Tools sections, FAQs |
| /gcse/maths/{6 boards} | gcse_*.html | ~400 KB each | 134 topics/board in flight payload |
| /gcse/maths/edexcel/papers | gcse_edexcel_papers.html | 1.0 MB | 15 series, 136 resource URLs |
| /a-level/maths/edexcel | alevel_maths_edexcel.html | 433 KB | 44 topics with UUIDs |
| topic page | topic_substitution.html | 145 KB | mode cards, RSC structure |
| topic questions | topic_questions.html | 285 KB | asset CDN namespaces, React Query keys |
| question-rush, daily-greens, planner, ask-genie, grade-calc, revision-guides | *.html | 230–460 KB | feature layouts |
| CSS chunks | css_*.html | 823 KB | fonts, palette, Tailwind v4 fingerprint |

## Key decodes (claim → evidence)

1. **Next.js + Turbopack** → `/_next/static/chunks/turbopack-*.js`, `data-precedence="next"` stylesheets.
2. **Flight payloads embed the catalog** → `topics":[{"id":"a7212ef8-…","title":"Quadratics",…}]` present in raw HTML.
3. **Grade-tab topic grammar** → 134 hrefs matching `grade-\d+-\d+-\d+-[a-z0-9-]+` per board.
4. **Asset CDN namespaces** → literal URLs: `assets.mathsgenie.co.uk/{subject-covers,mode-cards,board-resources,papers,walkthroughs}`.
5. **React Query client layer** → payload keys `dataUpdateCount/dataUpdatedAt/fetchFailureCount/fetchStatus`.
6. **Paper codes** → `1MA1/{1F,1H,2F,2H,3F,3H}` tokens; series headings June/November 2017–2025.

## Limitations (stated honestly, per rea practice)

- Client-fetched question banks (per-question PDFs, interactive marking, Genie AI
  responses) hydrate post-load via authenticated APIs — **not** captured, and
  deliberately out of scope (copyright + ToS).
- Resource URLs may rotate (predicted-paper slugs embed the year); the parser
  records the observation date.
- Some A-Level topics share slugs across AS/A2 (counted once each).

## Reproduce

```bash
python3 scripts/build_catalog.py     # re-parse crawl_raw/ → data/
```

Crawler scripts are in `scripts/` (`extract_links.py`, `build_catalog.py`).
