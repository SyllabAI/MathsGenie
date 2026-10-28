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

## Slug Grammar (regex for parsers)

```
course:  ^/(gcse|igcse|a-level|as-level|international-(a|as)-level|ks2)/[a-z0-9-]+/[a-z0-9-]+
topic:   ^/gcse/maths/[a-z]+/grade-\d+-\d+-\d+-[a-z0-9-]+$
alevel:  ^/a-level/maths/edexcel/(a-level|as)-(pure-mathematics|statistics|mechanics)-\d+(-\d+)?-[a-z0-9-]+$
```
