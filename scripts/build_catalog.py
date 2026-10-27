#!/usr/bin/env python3
"""Master extractor: parse all crawled MathsGenie pages -> structured JSON catalog.

Stores FACTUAL METADATA ONLY (topic names, slugs, URLs, grades, series listings).
No copyrighted content (PDFs, notes text) is copied - resources are referenced by URL.
"""
import re, json, os

RAW = "/home/z/my-project/crawl_raw"
OUT = "/home/z/my-project/mathsgenie-repo/data"
os.makedirs(OUT, exist_ok=True)


def flight(html_path: str) -> str:
    html = open(html_path, encoding="utf-8", errors="ignore").read()
    chunks = re.findall(r'self\.__next_f\.push\(\[1,(".*?")\]\)</script>', html, re.S)
    payload = ""
    for c in chunks:
        try:
            payload += json.loads(c)
        except Exception:
            pass
    return payload


def jstr(s):
    return json.dumps(s, ensure_ascii=False)


def extract_json_objects(payload, prefix='"slug":"', require_href=False):
    """Extract {...} objects containing slug/title keys from flight payload."""
    objs = []
    for m in re.finditer(r'\{[^{}]*"slug":"[^"]+"[^{}]*\}', payload):
        raw = m.group(0)
        try:
            o = json.loads(raw)
        except Exception:
            # try fixing escaped quotes
            try:
                o = json.loads(raw.replace('\\"', '"'))
            except Exception:
                continue
        if require_href and "href" not in o:
            continue
        objs.append(o)
    return objs


# ---------- 1. GCSE board topics ----------
def gcse_topics():
    boards = {"edexcel": None, "aqa": None, "ocr": None, "wjec": None, "eduqas": None, "ccea": None}
    for b in boards:
        p = os.path.join(RAW, f"gcse_{b}.html")
        if not os.path.exists(p):
            print("MISSING", p); continue
        payload = flight(p)
        topics = extract_json_objects(payload, require_href=True)
        # normalize: keep id, slug, title, topicId, href
        clean, seen = [], set()
        for t in topics:
            slug = t.get("slug", "")
            if not slug.startswith("grade-"):
                continue
            key = slug
            if key in seen:
                continue
            seen.add(key)
            # parse grade from slug: grade-<N>-<N>-<idx>-<name>
            m = re.match(r"grade-(\d+)-(\d+)-(\d+)-(.+)", slug)
            grade = int(m.group(1)) if m else None
            clean.append({
                "slug": slug,
                "title": t.get("title"),
                "grade": grade,
                "href": t.get("href", f"/gcse/maths/{b}/{slug}"),
                "topicId": t.get("topicId"),
            })
        clean.sort(key=lambda x: (x["grade"] or 99, x["slug"]))
        doc = {
            "qualification": "GCSE", "subject": "Maths", "board": b,
            "tier_note": "Foundation covers grades 1-5, Higher covers grades 4-9",
            "topic_count": len(clean),
            "modes": ["questions", "videos", "revision-guides", "lessons", "flashcards",
                       "question-rush", "mock-exam-builder", "mini-tests", "45-min-tests"],
            "grades": {},
        }
        for t in clean:
            doc["grades"].setdefault(str(t["grade"]), []).append(
                {"slug": t["slug"], "title": t["title"], "href": t["href"]})
        boards[b] = doc
        with open(os.path.join(OUT, "gcse-maths", f"topics-{b}.json"), "w") as f:
            json.dump(doc, f, indent=1, ensure_ascii=False)
        print(f"GCSE {b}: {len(clean)} topics across {len(doc['grades'])} grades")
    return boards


# ---------- 2. A-Level topics ----------
def alevel_topics():
    payload = flight(os.path.join(RAW, "alevel_maths_edexcel.html"))
    topics = []
    for m in re.finditer(r'\{"id":"[0-9a-f-]{36}","title":"([^"]+)","slug":"([^"]+)"\}', payload):
        topics.append({"title": m.group(1), "slug": m.group(2)})
    seen, clean = set(), []
    for t in topics:
        if t["slug"] in seen:
            continue
        seen.add(t["slug"])
        s = t["slug"]
        # Module classification by slug prefix (a-level-pure-mathematics-1-*, a-level-statistics-1-*,
        # a-level-mechanics-1-*, as-pure-mathematics-*, as-statistics-*, as-mechanics-*)
        m = re.match(r"(a-level|as)-(pure-mathematics|statistics|mechanics)-(\d+)", s)
        if m:
            level = "AS" if m.group(1) == "as" else "A2"
            kind = {"pure-mathematics": "Pure Mathematics", "statistics": "Statistics",
                    "mechanics": "Mechanics"}[m.group(2)]
            module = f"{kind} Year {'1' if m.group(3) == '1' else '2'}" if level == "A2" else f"AS {kind}"
        else:
            module = "Other"
        clean.append({"title": t["title"], "slug": s,
                      "href": f"/a-level/maths/edexcel/{s}", "module": module})
    order = ["Pure Mathematics Year 1", "Pure Mathematics Year 2", "Statistics Year 1",
             "Statistics Year 2", "Mechanics Year 1", "Mechanics Year 2",
             "AS Pure Mathematics", "AS Statistics", "AS Mechanics", "Other"]
    modules = {}
    for t in clean:
        modules.setdefault(t["module"], []).append(
            {"slug": t["slug"], "title": t["title"], "href": t["href"]})
    doc = {
        "qualification": "A-Level", "subject": "Maths", "board": "edexcel",
        "topic_count": len(clean),
        "modules": {k: modules[k] for k in order if k in modules},
        "modes": ["questions", "videos", "revision-guides", "flashcards", "question-rush", "mock-exam-builder"],
    }
    with open(os.path.join(OUT, "a-level-maths", "topics-edexcel.json"), "w") as f:
        json.dump(doc, f, indent=1, ensure_ascii=False)
    print(f"A-LEVEL edexcel: {len(clean)} topics -> modules: " +
          ", ".join(f"{k}({len(v)})" for k, v in doc["modules"].items()))
    return doc


# ---------- 3. Papers catalog (metadata + links only) ----------
def papers():
    payload = flight(os.path.join(RAW, "gcse_edexcel_papers.html"))
    series_list = sorted(set(re.findall(r'((?:June|November|January) 20\d\d)', payload)), reverse=True)
    pdfs = sorted(set(re.findall(r'https://assets\.mathsgenie\.co\.uk/papers/[^"\\\s]+\.pdf', payload)))
    # group pdfs by folder
    groups = {}
    for u in pdfs:
        parts = u.split("/")
        folder = "/".join(parts[:-1])
        fname = parts[-1]
        groups.setdefault(folder, []).append(fname)
    catalog = []
    for folder, files in sorted(groups.items()):
        catalog.append({"resource_dir": folder.replace("https://assets.mathsgenie.co.uk/", ""),
                        "files": sorted(files)})
    doc = {
        "qualification": "GCSE", "subject": "Maths", "board": "edexcel", "spec": "1MA1",
        "paper_codes": ["1MA1/1F", "1MA1/1H", "1MA1/2F", "1MA1/2H", "1MA1/3F", "1MA1/3H"],
        "series_listed": series_list,
        "resource_count": len(pdfs),
        "note": "Metadata + resource URLs only. PDFs remain hosted by mathsgenie.co.uk (copyright: exam boards/MathsGenie).",
        "resource_groups": catalog,
    }
    with open(os.path.join(OUT, "gcse-maths", "papers-edexcel.json"), "w") as f:
        json.dump(doc, f, indent=1, ensure_ascii=False)
    print(f"PAPERS: {len(series_list)} series, {len(pdfs)} resource URLs, {len(catalog)} groups")
    return doc


# ---------- 4. Full subject x board catalog from home page ----------
def subjects():
    from html.parser import HTMLParser

    class AParser(HTMLParser):
        def __init__(self):
            super().__init__()
            self.rows = []
            self._href = None
            self._buf = []
            self._in = False

        def handle_starttag(self, tag, attrs):
            d = dict(attrs)
            if tag == "a" and d.get("href"):
                self._href = d["href"]
                self._buf = []
                self._in = True

        def handle_endtag(self, tag):
            if tag == "a" and self._in:
                txt = " ".join("".join(self._buf).split())
                if txt:
                    self.rows.append({"title": txt, "href": self._href})
                self._in = False

        def handle_data(self, data):
            if self._in:
                self._buf.append(data)

    html = open(os.path.join(RAW, "home.html"), encoding="utf-8", errors="ignore").read()
    p = AParser()
    p.feed(html)
    quals = ("gcse", "igcse", "a-level", "as-level", "ks2", "international-a-level", "international-as-level")
    seen, rows = set(), []
    for r in p.rows:
        href = r["href"]
        if not href.startswith("/"):
            continue
        parts = href.strip("/").split("/")
        if len(parts) < 3 or parts[0] not in quals:
            continue
        key = (href, r["title"])
        if key in seen:
            continue
        seen.add(key)
        rows.append({"title": r["title"], "qualification": parts[0], "subject": parts[1],
                     "board": parts[2] if len(parts) > 2 else None, "href": href})
    by_qual = {}
    for r in rows:
        by_qual.setdefault(r["qualification"], []).append(
            {"title": r["title"], "subject": r["subject"], "board": r["board"], "href": r["href"]})
    doc = {"total_courses": len(rows), "by_qualification": by_qual}
    with open(os.path.join(OUT, "subjects.json"), "w") as f:
        json.dump(doc, f, indent=1, ensure_ascii=False)
    print("SUBJECTS:", {k: len(v) for k, v in by_qual.items()}, "total:", len(rows))
    return doc


# ---------- 5. Site map + nav ----------
def site_map():
    nav = {
        "primary": [
            {"label": "Home", "href": "/"},
            {"label": "Revision planner", "href": "/features/revision-planner"},
            {"label": "Ask Genie AI", "href": "/ask-genie"},
            {"label": "Worksheets", "href": "/gcse/worksheets | /a-level/worksheets"},
            {"label": "Question Rush", "href": "/gcse/question-rush | /a-level/question-rush"},
            {"label": "Daily Greens", "href": "/gcse/daily-greens | /a-level/daily-greens"},
            {"label": "Ideas + feedback", "href": "/feature-requests"},
        ],
        "qualifications": ["gcse", "igcse", "a-level", "as-level", "ks2", "international-a-level", "international-as-level"],
        "url_patterns": {
            "course": "/{qual}/{subject}/{board}",
            "topic": "/gcse/maths/{board}/grade-{grade}-{grade}-{index}-{slug}",
            "topic_mode": "{topic_href}/{mode}",
            "modes": ["questions", "videos", "revision-guides", "flashcards", "lessons", "question-rush", "mock-exam-builder", "mini-tests", "45-min-tests", "predicted-papers", "predicted-grade-calculator"],
            "asset_cdn": "https://assets.mathsgenie.co.uk/",
            "asset_paths": {
                "subject_covers": "subject-covers/*.jpg",
                "mode_cards": "mode-cards/*.svg (dark-tinted / light-tinted)",
                "board_resources": "board-resources/{qual}-{subject}/*.pdf",
                "papers": "papers/{board}/{qual}-{subject}/{resource-dir}/{file}.pdf",
                "walkthroughs": "walkthroughs/review/*.mp4|*.jpg",
            },
        },
        "features": [
            "revision-planner", "ask-genie-ai", "answer-marking", "mock-exam-builder",
            "question-rush", "daily-greens", "grade-calculator", "lesson-starters",
            "upload-and-mark", "predicted-grade-calculator", "worksheets", "flashcards",
        ],
    }
    with open(os.path.join(OUT, "site-map.json"), "w") as f:
        json.dump(nav, f, indent=1, ensure_ascii=False)
    print("SITE MAP written")


# ---------- 6. Design tokens ----------
def design():
    css = open(os.path.join(RAW, "css_15zr37hkmkria.css"), encoding="utf-8", errors="ignore").read()
    from collections import Counter
    colors = Counter(re.findall(r'#[0-9a-fA-F]{6}\b', css)).most_common(15)
    fonts = sorted(set(f.strip()[:60] for f in re.findall(r'font-family:([^;}]{3,70})', css)))
    doc = {
        "observed_fonts": fonts,
        "signature_font": "MathsGenie Hand (handwritten display font)",
        "top_colors_hex": colors,
        "palette_inference": {
            "paper": "#fafafa", "ink": "#14171c", "ink_soft": "#242424", "muted": "#737373",
            "line": "#e5e5e5", "accent_soft": "#d4ddff", "deep_blue": "#075985",
            "dark_bg": "#0a0a0a", "dark_panel": "#171717", "dark_panel2": "#191919",
        },
        "css_framework": "Tailwind CSS v4 (utility classes, oklch tokens, --font-* vars)",
        "theme": "light default + dark mode variants",
    }
    with open(os.path.join(OUT, "design-tokens.json"), "w") as f:
        json.dump(doc, f, indent=1, ensure_ascii=False)
    print("DESIGN TOKENS written")


if __name__ == "__main__":
    os.makedirs(os.path.join(OUT, "gcse-maths"), exist_ok=True)
    os.makedirs(os.path.join(OUT, "a-level-maths"), exist_ok=True)
    gcse_topics()
    alevel_topics()
    papers()
    subjects()
    site_map()
    design()
    print("\nDONE ->", OUT)
