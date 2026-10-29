# 13 — Fullscreen Paper Viewer (question papers + mark schemes)

Probed live on mathsgenie.co.uk (logged-out) — route `/paper/gcse/maths/edexcel/gcse-maths-2025-june-1ma1-1f`.

## Original structure (captured from live DOM + RSC payload)

### Route + data model
- List page: `/gcse/maths/edexcel/papers` — SSR HTML with series accordions
  (`aria-label="June 2025 Papers"`), cover thumbnails
  (`assets.mathsgenie.co.uk/papers/covers/paper-{uuid}.jpg`), per-paper cards.
- Viewer route: `/paper/{board}/{subject}/{slug}` (Next.js `FullscreenPaperViewer` component).
- RSC payload embeds the full paper object:
  `slug, title ("June 2025 - Paper 1F 1MA1/1F"), level, examYear, session, paperLabel,`
  `paperUrl, markSchemeUrl, workedSolutionUrl, insertUrl, youtubeVideoUrl` (etc).
- **PDF host**: `assets.mathsgenie.co.uk/sources/genie/past-papers/{year}/pearson/gcse-maths/{code}/question-paper-*.pdf` / `mark-scheme-*.pdf` — CORS `access-control-allow-origin: *` (verified), so client-side pdf.js rendering works.

### Viewer chrome (from live probing)
- Top bar: back arrow · paper title · **View mark scheme** (teal pill; toggles → "Hide mark scheme")
  · Download · Print · ⋯ More controls · Log your mark · (Sign up when logged out).
- **More controls menu**: Formula sheet · Calculator · Report an issue.
- **Split workspace**: 1 pane by default; "View mark scheme" adds a second pane side by side.
  Each pane: document dropdown (`Left pane` combobox → Question paper / Mark scheme /
  Formula sheet), close button, its own scrollable pages, own zoom (− / + rail).
- **Pages render to `<canvas>`** (pdf.js-style; no iframes, no embeds).
- **Bottom floating annotation toolbar**: undo, redo, clear-all, browse/select, Text box (T),
  Math text box (√), pen, highlighter, eraser, pen colour (black/blue/red/green),
  pen thickness (fine/medium/bold), line, ruler, protractor, compasses, collapse toolbar.
- **Answer boxes**: click with text tool → "Put your answer down — Click anywhere in the box
  and type your working. It saves as you go." with `Add text` placeholder + watermarks.
- **Log your mark dialog**: "Your mark [0] / Out of [80] / Save mark / Just mark as done".
- **Calculator**: floating fx-83GT CW emulator (dark body, green LCD), model dropdown
  (fx-83GT CW / fx-991 CW), minimisable.
- **Open Ask Genie** floating button.

## Recreation (this repo)
- `scripts/crawl_past_papers.py` → `data/gcse-maths/papers-past-edexcel.json`
  (14 series, 83 papers, 83 question PDFs + 83 mark schemes + 59 worked solutions, all with covers).
- Route `src/app/paper/[board]/[slug]/page.tsx` (Suspense-wrapped) →
  `src/components/paper/PaperWorkspace.tsx` (~1200 lines):
  - pdfjs-dist 4.x, worker at `public/pdf.worker.min.mjs`; PDFs streamed from the original host (never re-hosted).
  - Split panes with doc dropdown / close / per-pane zoom; ops model
    `{page, kind: stroke|line|arc|text}` normalised 0–1 per page, drawn on overlay canvases;
    undo/redo stacks per document; annotations persisted to localStorage per slug.
  - Toolbar parity: browse / text / math text / pen / highlighter / eraser / 4 colours /
    3 thicknesses / line / ruler (draggable cm straightedge) / protractor (draggable, degree ticks) /
    compasses (drag centre→radius, commits an arc op).
  - Text boxes reproduce the "Put your answer down" popover; saved as you go (debounced localStorage).
  - Log your mark dialog + top-bar echo ("Your mark: 64/80"), persisted `mg-paper-marks-v1`.
  - fx-83GT-style calculator (functional: arithmetic, sin/cos/tan in degrees, log/ln, √, x^, π, DEL/AC/EXE).
  - `?doc=markscheme|formula` deep link opens the split view directly (used by index cards).
- Papers index `src/app/gcse/maths/[board]/papers/page.tsx` restyled to the original:
  search + type/year filters, series accordions, cover cards, buttons → viewer route
  (Question paper / Mark scheme / Solutions). Non-Edexcel boards keep a note + original link.
- Chrome suppression: `/paper/` added to `FOCUS_PATTERN` (header/footer) + CookieBanner hidden —
  the viewer is a fullscreen route exactly like the original.

## Verification
- clone-paper-viewer2.png (single pane), clone-paper-dual.png (split), clone-paper-draw.png
  (pen stroke), clone-paper-text.png ("x = 4" box), clone-paper-calc.png (7×8=56),
  clone-paper-formula.png (formula sheet), clone-papers-index.png (index restyle).
- `npm run check` clean (0 errors); marks + annotations verified in localStorage.
