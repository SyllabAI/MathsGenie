# 04 — Data Model

How the original site structures data, and the parsed catalog schema in `data/`.

## Original site: RSC flight payloads

Next.js App Router serializes server component state into inline
`self.__next_f.push([1,"<json-string>"])` script tags. Decoding these chunks
(`json.loads` per chunk, concatenated) yields the page's full server data without
running JavaScript.

Observed embedded shapes:

```jsonc
// A-Level topics (from /a-level/maths/edexcel flight payload)
{"id": "a7212ef8-…", "title": "Quadratics", "slug": "as-pure-mathematics-2-quadratics"}

// GCSE topic rows (from /gcse/maths/edexcel flight payload)
{"id": "s3-r13", "slug": "grade-4-4-14-cylinders", "title": "Cylinders",
 "topicId": "48237789-…", "href": "/gcse/maths/edexcel/grade-4-4-14-cylinders"}

// React Query hydration keys (client-fetch features)
{"dataUpdateCount": 1, "dataUpdatedAt": 1760000000000, "fetchStatus": "idle", …}
```

Topic-mode metadata observed on topic pages: `learningResourceType`, mode cards
(questions / videos / flashcards / exam-builder) with light+dark SVG icon pairs.

## Parsed catalog schema (`data/`)

```
data/
├── site-map.json                  nav, URL patterns, feature list
├── design-tokens.json             fonts + observed palette
├── subjects.json                  667 courses: {qualification, subject, board, href}
├── gcse-maths/
│   ├── topics-{board}.json        × 6 boards
│   └── papers-edexcel.json        15 series, 136 resource URLs
└── a-level-maths/
    └── topics-edexcel.json        44 topics in modules
```

### topics-{board}.json

```jsonc
{
  "qualification": "GCSE", "subject": "Maths", "board": "edexcel",
  "tier_note": "Foundation covers grades 1-5, Higher covers grades 4-9",
  "topic_count": 134,
  "modes": ["questions", "videos", "revision-guides", "lessons", "flashcards",
             "question-rush", "mock-exam-builder", "mini-tests", "45-min-tests"],
  "grades": {
    "1": [{"slug": "grade-1-1-1-addition-and-subtraction",
           "title": "Addition and Subtraction",
           "href": "/gcse/maths/edexcel/grade-1-1-1-addition-and-subtraction"}],
    "2": [ … 17 topics … ], "3": [ … ], "4": [ … ], … "8/9": [ … ]
  }
}
```

### papers-edexcel.json

```jsonc
{
  "qualification": "GCSE", "subject": "Maths", "board": "edexcel", "spec": "1MA1",
  "paper_codes": ["1MA1/1F", "1MA1/1H", "1MA1/2F", "1MA1/2H", "1MA1/3F", "1MA1/3H"],
  "series_listed": ["June 2025", "November 2024", … "June 2017"],
  "resource_count": 136,
  "note": "Metadata + resource URLs only. PDFs remain hosted by mathsgenie.co.uk.",
  "resource_groups": [
    {"resource_dir": "papers/gcse-maths/mini-tests/f5", "files": ["F5MiniTest1.pdf"]},
    {"resource_dir": "papers/edexcel/gcse-maths/gcse-maths-edexcel-predicted-current-2026-…",
     "files": ["paper.pdf", "worked-solutions.pdf"]}
  ]
}
```

## Design decisions

1. **Metadata, not media.** The catalog stores factual links. Exam papers are
   copyrighted by awarding bodies; site media by MathsGenie. Nothing is re-hosted.
2. **One file per board** keeps topic JSON importable by the Next.js app via
   `resolveJsonModule` with no runtime fetch needed.
3. **Slug grammar preserved** so recreated routes match the original 1:1
   (`grade-{tier}-{grade}-{index}-{name}`).
4. **Grades keyed as strings** (JSON object keys) with the 8/9 tab named `"8/9"`.
