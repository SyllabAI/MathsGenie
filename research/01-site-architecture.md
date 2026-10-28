# 01 — Site Architecture

## Stack Fingerprint

Evidence-based identification of the technology behind mathsgenie.co.uk (new site, October 2026).

| Layer | Finding | Evidence |
|---|---|---|
| Framework | **Next.js (App Router)** | `/_next/static/chunks/*` scripts; stylesheet tags carry `data-precedence="next"` (home.html) |
| Bundler | **Turbopack** | chunk `turbopack-18hpueb50ebbw.js` in script list |
| Rendering | **React Server Components (RSC flight)** | inline `<script>self.__next_f.push([1,"..."])` payloads on every page |
| Styling | **Tailwind CSS v4** | utility-class soup in DOM; oklch tokens; `--font-*` CSS variables in css chunks |
| Hydration state | **React Query (TanStack)** | flight payload keys: `dataUpdateCount`, `dataUpdatedAt`, `fetchFailureCount`, `fetchStatus`, `isInvalidated` |
| Asset CDN | **assets.mathsgenie.co.uk** | PDFs, SVGs, MP4s, JPGs referenced from flight payloads |
| Image pipeline | **next/image optimizer** | `/_next/image?url=https%3A%2F%2Fassets.mathsgenie.co.uk%2F...&w=…&q=40` |
| Auth | `/auth/signup?redirectTo=…` | signup links on home/gcse pages |
| Deployment | Vercel-style `?dpl=nogit-1793111713` deployment query params | CSS/JS URLs |

## Rendering Model

Pages ship a complete HTML shell plus RSC flight data. Catalog data (topic lists,
paper series) is **embedded server-side in the flight payload** — e.g. the A-Level
page contains `topics":[{"id":"…","title":"Quadratics","slug":"…"}]` inline, which
is why a crawler can extract the full catalog without executing JavaScript.

Interactive features (Ask Genie AI, marking, question banks beyond the first window)
fetch from client-side APIs after hydration (React Query state keys observed).

## CDN Map (observed asset namespaces)

```
https://assets.mathsgenie.co.uk/
├── subject-covers/*.jpg            course cover images
├── mode-cards/*.svg                topic-mode icons (…-dark-tinted / …-light-tinted variants)
├── board-resources/{qual}-{subj}/  formula sheets etc. (e.g. gcse-formulae-to-remember.pdf)
├── papers/{board}/{qual}-{subj}/…  past papers, mark schemes, solutions
└── walkthroughs/review/*.mp4|jpg   worked-solution walkthrough videos
```

## Old vs New site

The legacy site (linked as "Old MathsGenie") is a plain static HTML site
(`/gcse.html` classic grade-tab layout). The new site reorganises the same content
into a board-first taxonomy (`/gcse/maths/{board}/grade-N-N-index-slug`) and adds
SaaS-style tools (planner, AI, marking, mock builder). The recreation targets the
**new site**, with the classic grade-tab topic browser preserved.

## Implications for recreation

1. Our Next.js App Router recreation mirrors the original's own framework.
2. Server-embedded JSON = we can ship the same data-driven pattern from `data/*.json`.
3. Tailwind v4 lets us reproduce utility-class styling 1:1 without a CSS framework mismatch.
4. Client-heavy features (AI marking) are recreated as UI stubs; no backend calls are made.
