#!/usr/bin/env python3
"""MathsGenie bulk-resource downloader.

Downloads publicly available PDF resources referenced by the reverse-engineered
catalog in ``data/`` and writes them to a local ``downloads/`` tree with a
``manifest.json`` for resumability and provenance.

Confirmed URL patterns (verified during the reverse-engineering pass):

1. Past papers / predicted papers / worked solutions
       https://assets.mathsgenie.co.uk/papers/{board}/gcse-maths/{resource_dir}/{file}
   Source of truth: data/gcse-maths/papers-<board>.json -> resource_groups[]

2. Classic topic worksheets (old site asset host)
       https://old-asset.mathsgenie.co.uk/resources/{grade}-{topic-slug}.pdf
   The modern topic slugs look like ``grade-3-3-13-substitution``; the classic
   asset name is ``3-substitution.pdf``. Candidate suffix variants are probed
   and only responses whose body starts with ``%PDF`` are kept — the origin
   serves HTML soft-200 fallbacks for missing files, so magic-byte validation
   is mandatory.

3. Board-level reference material
       https://assets.mathsgenie.co.uk/board-resources/gcse-maths/...

IMPORTANT — fair use & copyright
    * These PDFs are (c) Maths Genie Ltd and the awarding bodies.
    * Download them for personal research / offline study only.
    * Do NOT commit the downloads/ directory to git, do NOT re-host the
      files publicly, and do NOT redistribute them. This project's web app
      deliberately links back to the originals instead of re-hosting.
    * The default request rate is conservative (>= 1.2 s between requests)
      so the script will not hammer the origin. Do not lower it.

Usage:
    python scripts/download_resources.py --dry-run
    python scripts/download_resources.py --kind papers
    python scripts/download_resources.py --board edexcel --kind topics
    python scripts/download_resources.py --all
"""

from __future__ import annotations

import argparse
import hashlib
import json
import random
import re
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DATA = REPO / "data"
DEFAULT_OUT = REPO / "downloads"

USER_AGENT = (
    "MathsGenieCatalogResearch/1.0 (student mirror study; "
    "contact via github.com/SyllabAI/MathsGenie)"
)

ASSETS = "https://assets.mathsgenie.co.uk"
OLD_ASSET = "https://old-asset.mathsgenie.co.uk"

# Suffix candidates probed for classic topic assets. Only %PDF bodies survive.
# Verified during reverse engineering: classic topic assets are a single PDF per
# topic ("{grade}-{title}.pdf"); -markscheme/-answers variants are NOT published
# (the origin serves HTML soft-200 fallbacks for them). Add more suffixes here
# if the origin ever publishes separated mark schemes.
TOPIC_SUFFIXES = [""]

MANIFEST_NAME = "manifest.json"
PDF_MAGIC = b"%PDF"
PDF_MAGIC_LEN = len(PDF_MAGIC)

SLUG_RE = re.compile(r"^grade-(?P<grade>\d+)-\d+-(?P<num>\d+)-(?P<title>.+)$")


# --------------------------------------------------------------------------
# small helpers
# --------------------------------------------------------------------------

def log(msg: str) -> None:
    print(msg, flush=True)


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 16), b""):
            h.update(chunk)
    return h.hexdigest()


def fetch_bytes(url: str, timeout: float = 30.0) -> bytes | None:
    """GET a URL and return the body, or None on any failure."""
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read()
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, OSError):
        return None


def looks_like_pdf(body: bytes | None) -> bool:
    return bool(body) and body[:PDF_MAGIC_LEN] == PDF_MAGIC


# --------------------------------------------------------------------------
# plan builders — each planned item is a dict:
#   { "url": str, "rel": pathlib-like str, "kind": str, "label": str }
# --------------------------------------------------------------------------

def build_papers_plan(board: str) -> list[dict]:
    """Past papers from the catalogued resource_groups (exact paths, no probing)."""
    path = DATA / "gcse-maths" / f"papers-{board}.json"
    if not path.exists():
        log(f"  ! no papers catalog for board '{board}', skipping")
        return []
    doc = json.loads(path.read_text())
    plan: list[dict] = []
    for group in doc.get("resource_groups", []):
        rd = group.get("resource_dir", "").strip("/")
        # resource_dir is already the full asset path, e.g.
        # "papers/edexcel/gcse-maths/gcse-maths-edexcel-predicted-..." — no re-prefixing.
        for fname in group.get("files", []):
            url = f"{ASSETS}/{rd}/{fname}"
            short = rd.split("/")[-1] or rd
            rel = Path("papers") / board / short / fname
            plan.append({"url": url, "rel": str(rel), "kind": "papers", "label": short})
    return plan


def build_topics_plan(board: str) -> list[dict]:
    """Classic topic worksheets derived from the modern topic slugs."""
    path = DATA / "gcse-maths" / f"topics-{board}.json"
    if not path.exists():
        log(f"  ! no topics catalog for board '{board}', skipping")
        return []
    doc = json.loads(path.read_text())
    seen: set[str] = set()
    plan: list[dict] = []
    for grade_key, topics in doc.get("grades", {}).items():
        for topic in topics:
            slug = topic.get("slug", "")
            m = SLUG_RE.match(slug)
            if not m:
                continue
            base = f"{m.group('grade')}-{m.group('title')}"
            for suffix in TOPIC_SUFFIXES:
                fname = f"{base}{suffix}.pdf"
                if fname in seen:
                    continue
                seen.add(fname)
                url = f"{OLD_ASSET}/resources/{fname}"
                rel = Path("topics") / board / fname
                plan.append(
                    {
                        "url": url,
                        "rel": str(rel),
                        "kind": "topics",
                        "label": f"{topic.get('title', slug)} (grade {grade_key})",
                    }
                )
    return plan


def build_board_plan(board: str) -> list[dict]:
    """Board-level reference material (formulae sheet and friends)."""
    known = [
        ("gcse-formulae-to-remember.pdf", "Formulae sheet"),
    ]
    plan: list[dict] = []
    for fname, label in known:
        url = f"{ASSETS}/board-resources/gcse-maths/{fname}"
        rel = Path("board-resources") / board / fname
        plan.append({"url": url, "rel": str(rel), "kind": "board", "label": label})
    return plan


# --------------------------------------------------------------------------
# downloader
# --------------------------------------------------------------------------

def download_one(item: dict, out_dir: Path, manifest: dict, min_delay: float) -> str:
    """Download a single planned item. Returns 'ok' | 'skip' | 'miss' | 'error'."""
    rel = item["rel"]
    dest = out_dir / rel

    prior = manifest.get("files", {}).get(rel)
    if prior and dest.exists() and prior.get("sha256") == sha256(dest):
        return "skip"

    time.sleep(min_delay + random.uniform(0, min_delay * 0.4))
    body = fetch_bytes(item["url"])
    if not looks_like_pdf(body):
        return "miss"

    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(body)
    manifest.setdefault("files", {})[rel] = {
        "url": item["url"],
        "sha256": sha256(dest),
        "bytes": len(body),
        "kind": item["kind"],
        "label": item["label"],
        "downloaded_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    return "ok"


def save_manifest(out_dir: Path, manifest: dict) -> None:
    out_dir.joinpath(MANIFEST_NAME).write_text(
        json.dumps(manifest, indent=2, sort_keys=True), encoding="utf-8"
    )


def main() -> int:
    ap = argparse.ArgumentParser(description="Bulk-download MathsGenie PDF resources.")
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT, help="output directory")
    ap.add_argument("--board", default="edexcel", help="board slug (edexcel, aqa, ...)")
    ap.add_argument(
        "--kind",
        choices=["papers", "topics", "board", "all"],
        default="all",
        help="which resource families to download",
    )
    ap.add_argument("--limit", type=int, default=0, help="max downloads (0 = unlimited)")
    ap.add_argument("--delay", type=float, default=1.2, help="min seconds between requests")
    ap.add_argument("--dry-run", action="store_true", help="list plan without downloading")
    args = ap.parse_args()

    kinds = ["papers", "topics", "board"] if args.kind == "all" else [args.kind]
    builders = {
        "papers": build_papers_plan,
        "topics": build_topics_plan,
        "board": build_board_plan,
    }

    plan: list[dict] = []
    for kind in kinds:
        items = builders[kind](args.board)
        log(f"planned {kind:>6}: {len(items):4d} candidate files")
        plan.extend(items)

    if not plan:
        log("nothing to do — check data/ catalogs and --board")
        return 1

    if args.dry_run:
        for item in plan[:40]:
            print(f"  {item['kind']:>7}  {item['rel']}   <- {item['url']}")
        if len(plan) > 40:
            print(f"  ... and {len(plan) - 40} more")
        return 0

    out_dir: Path = args.out
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = out_dir / MANIFEST_NAME
    manifest: dict = {}
    if manifest_path.exists():
        manifest = json.loads(manifest_path.read_text())

    stats = {"ok": 0, "skip": 0, "miss": 0, "error": 0}
    limit = args.limit if args.limit > 0 else len(plan)

    log(f"\ndownloading to {out_dir} (delay>={args.delay}s, limit={limit})")
    try:
        for item in plan:
            if limit <= 0:
                break
            try:
                result = download_one(item, out_dir, manifest, args.delay)
            except Exception as exc:  # noqa: BLE001 — keep the loop alive
                log(f"  error {item['rel']}: {exc}")
                result = "error"
            stats[result] += 1
            if result in ("ok", "miss"):
                limit -= 1
            if result == "ok":
                log(f"  + {item['rel']} ({item['label']})")
            save_manifest(out_dir, manifest)
    except KeyboardInterrupt:
        log("\ninterrupted — progress saved to manifest.json; rerun to resume")

    save_manifest(out_dir, manifest)
    log(
        f"\ndone: {stats['ok']} downloaded, {stats['skip']} already present, "
        f"{stats['miss']} not published as PDF, {stats['error']} errors"
    )
    log("remember: personal research use only — do not commit or re-host these files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
