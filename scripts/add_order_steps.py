#!/usr/bin/env python3
"""Insert 'Tap or drag to order' steps into the GCSE lesson JSON.

The live MathsGenie lesson player includes a fourth interactive question
type — "Tap or drag to order" — where the learner reconstructs a worked
method from shuffled chips. For each lesson whose `example` step has >= 3
worked lines we derive an ordering step from those same lines (already
authored in the correct sequence), so the item set stays original and
factually correct. Capped at 4 items per question, mirroring the
original's 4-slot boards.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "src" / "data" / "lessons" / "edexcel.json"

doc = json.loads(DATA.read_text())

added = 0
skipped = 0
for slug, lesson in doc.items():
    steps = lesson["steps"]
    if any(s["kind"] == "order" for s in steps):
        skipped += 1
        continue
    example = next((s for s in steps if s["kind"] == "example"), None)
    lines = (example or {}).get("lines") or []
    # keep only substantive lines (skip headings/one-word fragments)
    usable = [ln.strip() for ln in lines if len(ln.strip()) >= 8]
    if len(usable) < 3:
        skipped += 1
        continue
    items = usable[:4]
    ex_idx = steps.index(example)
    steps.insert(
        ex_idx + 1,
        {
            "kind": "order",
            "heading": "Tap or drag to order",
            "question": f"Order the steps of the worked example for {lesson['title']} from first to last.",
            "items": items,
        },
    )
    added += 1

DATA.write_text(json.dumps(doc, ensure_ascii=False, indent=2) + "\n")
print(f"added order steps: {added}, skipped (already had or too short): {skipped}")
kinds = {}
for l in doc.values():
    for s in l["steps"]:
        kinds[s["kind"]] = kinds.get(s["kind"], 0) + 1
print("step kind distribution:", kinds)
