# 02 — URL Taxonomy

Every route pattern observed on the new mathsgenie.co.uk, with live examples captured October 2026.

## Qualification Roots

```
/gcse                              /igcse
/a-level                           /as-level
/ks2                               /international-a-level
/international-as-level
```

## Course (Subject × Board)

```
/{qual}/{subject}/{board}                    e.g. /gcse/maths/edexcel
/{qual}/{subject}/{board}/{variant}          e.g. /gcse/biology/ocr/twenty-first-century
                                             e.g. /gcse/science/aqa/synergy
```

Observed course count (from home-page mega-menu): **667 courses** —
GCSE 189, IGCSE 91, A-Level 172, AS 106, KS2 1, IAL 60, IAS 48.

## GCSE Maths Topic Slugs

```
/gcse/maths/{board}/grade-{tierTop}-{grade}-{index}-{slug}

/gcse/maths/edexcel/grade-1-1-1-addition-and-subtraction
/gcse/maths/edexcel/grade-3-3-13-substitution
/gcse/maths/edexcel/grade-4-4-14-cylinders
```

- First number = lowest grade band for the topic, second = its grade tab (1–8/9), index = position within the grade.
- 134 topics per board (Edexcel/AQA/OCR/WJEC/Eduqas/CCEA), grouped in tabs Grade 1 … Grade 8/9.

## Topic Modes (sub-routes)

```
{topic}/questions          question bank for the topic
{topic}/videos             topic videos
{topic}/revision-guides    revision notes
{topic}/flashcards         active-recall cards
{topic}/lessons            bite-sized lessons
{topic}/question-rush      timed drill for the topic
```

## Resource Type Routes (per course)

```
/{course}/papers               past papers by series
/{course}/worksheets           printable booklets
/{course}/questions            question bank root
/{course}/revision-guides      notes hub
/{course}/lessons              lessons hub
/{course}/videos               video hub
/{course}/flashcards           flashcards hub
/{course}/predicted-papers     predicted papers
/{course}/mini-tests           short topic tests
/{course}/45-min-tests         half-length papers
/{course}/predicted-grade-calculator
/{course}/mock-exam-builder
```

## Global Tools

```
/features/revision-planner     planner landing/tool
/ask-genie                     AI study partner
/gcse/question-rush            cross-topic drill (also /a-level/question-rush)
/gcse/daily-greens             daily problems (also /a-level/daily-greens)
/gcse/worksheets, /a-level/worksheets
/feature-requests              feedback board
/auth/signup                   auth (redirectTo param)
```

## Legacy (old site) routes still live

```
/gcse.html                     classic grade-tab revision index
/alevel.html                   old Edexcel A-Level (Spec 9371) C1–C4/S1/M1
/papers.html                   classic papers index
/grade2.html                   classic per-grade topic pages
```

## Asset hosts & bulk download patterns (verified live)

Three CDN/asset hosts serve the site's files; all were probed and verified
during the reverse-engineering pass (see `scripts/download_resources.py`):

| Family | Host | Pattern | Notes |
|--------|------|---------|-------|
| Papers / worked solutions | `assets.mathsgenie.co.uk` | `/papers/{board}/gcse-maths/{resource_dir}/{file}` | `resource_dir` + `file` are fully catalogued in `data/gcse-maths/papers-<board>.json` (136 files for Edexcel). Real PDFs, `content-type: application/pdf`. |
| Classic topic worksheets | `old-asset.mathsgenie.co.uk` | `/resources/{grade}-{title-slug}.pdf` | Derived from modern topic slugs `grade-{g}-{dup}-{nn}-{title}` → `{g}-{title}.pdf` (e.g. `grade-3-3-13-substitution` → `3-substitution.pdf`). Single PDF per topic (questions only); `-markscheme`/`-answers`/`-revision` variants are NOT published. |
| Board reference material | `assets.mathsgenie.co.uk` | `/board-resources/gcse-maths/*.pdf` | e.g. `gcse-formulae-to-remember.pdf`. |

Key caveats discovered by probing:

* `www.mathsgenie.co.uk/resources/*` returns an **HTML soft-200 fallback** for
  every missing file — HTTP 200 does not mean the file exists. The only
  reliable check is the `%PDF` magic byte on the body.
* Modern topic pages (`/gcse/maths/{board}/{topic}`) do NOT expose worksheet
  PDF URLs in server HTML; assets load client-side. The classic-pattern
  derivation above is the practical discovery route.
* The old-site topic pages (`old.mathsgenie.co.uk/{topic}.php`) embed lesson
  text and YouTube embeds, but no direct PDF links either.

## Slug Grammar (regex for parsers)

```
course:  ^/(gcse|igcse|a-level|as-level|international-(a|as)-level|ks2)/[a-z0-9-]+/[a-z0-9-]+
topic:   ^/gcse/maths/[a-z]+/grade-\d+-\d+-\d+-[a-z0-9-]+$
alevel:  ^/a-level/maths/edexcel/(a-level|as)-(pure-mathematics|statistics|mechanics)-\d+(-\d+)?-[a-z0-9-]+$
```
