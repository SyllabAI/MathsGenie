#!/usr/bin/env python3
"""Extract all internal links + structure from MathsGenie raw HTML pages."""
import re, json, os
from html.parser import HTMLParser
from urllib.parse import urljoin

RAW = "/home/z/my-project/crawl_raw"

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self._href = None
        self._text = []
        self._in_a = False
        self._current_heading = None
        self._in_heading = False
        self.headings = []

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == "a" and d.get("href"):
            self._in_a = True
            self._href = d["href"]
            self._text = []
        if tag in ("h1", "h2", "h3", "h4"):
            self._in_heading = True
            self._h = tag
            self._htext = []

    def handle_endtag(self, tag):
        if tag == "a" and self._in_a:
            txt = " ".join("".join(self._text).split())
            if txt:
                self.links.append({"href": self._href, "text": txt})
            self._in_a = False
        if tag in ("h1", "h2", "h3", "h4") and self._in_heading:
            txt = " ".join("".join(self._htext).split())
            if txt:
                self.headings.append({"tag": self._h, "text": txt})
            self._in_heading = False

    def handle_data(self, data):
        if self._in_a:
            self._text.append(data)
        if self._in_heading:
            self._htext.append(data)

results = {}
for f in ["home.html", "gcse.html", "alevel.html"]:
    html = open(os.path.join(RAW, f), encoding="utf-8", errors="ignore").read()
    p = LinkParser()
    p.feed(html)
    # dedupe by href+text
    seen, uniq = set(), []
    for l in p.links:
        key = (l["href"], l["text"])
        if key not in seen:
            seen.add(key)
            uniq.append(l)
    results[f] = {"links": uniq, "headings": p.headings, "total_links": len(uniq)}

out = os.path.join(RAW, "links_extract.json")
json.dump(results, open(out, "w"), indent=1)

# Print summary of internal hrefs
for f, data in results.items():
    print("=" * 25, f, f"({data['total_links']} unique links)", "=" * 25)
    for l in data["links"][:80]:
        print(f"  {l['text'][:55]:57s} -> {l['href'][:100]}")
    print("  ...HEADINGS:", [h["text"][:40] for h in data["headings"][:20]])
