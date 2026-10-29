#!/usr/bin/env python3
"""Build data/as-level-maths/topics-edexcel.json from the 2026-10-29 capture
of mathsgenie.co.uk/as-level/maths/edexcel (RSC payload, crawl_raw/as-level/).

Parent topics = the 24 rows visible in the DOM (14 pure + 7 stats + 3
mechanics). Subsections = the deeper slugs also present in the payload,
grouped under their parent chapter. hrefs preserve the original slugs
byte-for-byte (AGENTS.md: slugs stay diffable).
"""
import json, os

ORIG = "/as-level/maths/edexcel"

def T(slug, title, subs=None):
    d = {"slug": slug, "title": title, "href": f"{ORIG}/{slug}"}
    if subs:
        d["subsections"] = [{"slug": s, "title": t, "href": f"{ORIG}/{s}"} for s, t in subs]
    return d

PURE = [
    T("as-pure-mathematics-1-algebraic-expressions", "Algebraic Expressions", [
        ("as-pure-mathematics-1-1-index-laws", "Index Laws"),
        ("as-pure-mathematics-1-2-expanding-brackets", "Expanding Brackets"),
        ("as-pure-mathematics-1-3-factorising", "Factorising"),
        ("as-pure-mathematics-1-4-negative-and-fractional-indices", "Negative and Fractional Indices"),
        ("as-pure-mathematics-1-5-surds", "Surds"),
    ]),
    T("as-pure-mathematics-2-quadratics", "Quadratics", [
        ("as-pure-mathematics-2-1-solving-quadratics", "Solving Quadratics"),
        ("as-pure-mathematics-2-2-completing-the-square", "Completing the Square"),
        ("as-pure-mathematics-2-3-sketching-quadratic-graphs", "Sketching Quadratic Graphs"),
        ("as-pure-mathematics-2-4-the-discriminant", "The Discriminant"),
        ("as-pure-mathematics-2-5-modelling-with-quadratics", "Modelling with Quadratics"),
    ]),
    T("as-pure-mathematics-3-equations-and-inequalities", "Equations and Inequalities", [
        ("as-pure-mathematics-3-1-linear-simultaneous-equations", "Linear Simultaneous Equations"),
        ("as-pure-mathematics-3-2-quadratic-simultaneous-equations", "Quadratic Simultaneous Equations"),
        ("as-pure-mathematics-3-3-simultaneous-equations-on-graphs", "Simultaneous Equations on Graphs"),
        ("as-pure-mathematics-3-4-linear-inequalities", "Linear Inequalities"),
        ("as-pure-mathematics-3-5-quadratic-inequalities", "Quadratic Inequalities"),
        ("as-pure-mathematics-3-6-inequalities-on-graphs", "Inequalities on Graphs"),
    ]),
    T("as-pure-mathematics-4-graphs-and-transformations", "Graphs and Transformations", [
        ("as-pure-mathematics-4-1-cubic-graphs", "Cubic Graphs"),
        ("as-pure-mathematics-4-2-quartic-graphs", "Quartic Graphs"),
        ("as-pure-mathematics-4-3-reciprocal-graphs", "Reciprocal Graphs"),
        ("as-pure-mathematics-4-4-points-of-intersection", "Points of Intersection"),
        ("as-pure-mathematics-4-5-translating-graphs", "Translating Graphs"),
        ("as-pure-mathematics-4-6-stretching-graphs", "Stretching Graphs"),
        ("as-pure-mathematics-4-7-transforming-functions", "Transforming Functions"),
    ]),
    T("as-pure-mathematics-5-straight-line-graphs", "Straight Line Graphs", [
        ("as-pure-mathematics-5-1-y-mx-c", "y = mx + c"),
        ("as-pure-mathematics-5-2-equations-of-straight-lines", "Equations of Straight Lines"),
        ("as-pure-mathematics-5-3-parallel-and-perpendicular-lines", "Parallel and Perpendicular Lines"),
        ("as-pure-mathematics-5-4-length-and-area", "Length and Area"),
        ("as-pure-mathematics-5-5-modelling-with-straight-lines", "Modelling with Straight Lines"),
    ]),
    T("as-pure-mathematics-6-circles", "Circles", [
        ("as-pure-mathematics-6-1-midpoints-and-perpendicular-bisector", "Midpoints and Perpendicular Bisectors"),
        ("as-pure-mathematics-6-2-equation-of-a-circle", "Equation of a Circle"),
        ("as-pure-mathematics-6-3-intersections-of-straight-lines-and-", "Intersections of Straight Lines and Circles"),
        ("as-pure-mathematics-6-4-use-tangent-and-chord-properties", "Tangent and Chord Properties"),
        ("as-pure-mathematics-6-5-circles-and-triangles", "Circles and Triangles"),
    ]),
    T("as-pure-mathematics-7-algebraic-methods", "Algebraic Methods", [
        ("as-pure-mathematics-7-1-algebraic-fractions", "Algebraic Fractions"),
        ("as-pure-mathematics-7-2-dividing-polynomials", "Dividing Polynomials"),
        ("as-pure-mathematics-7-3-the-factor-theorem", "The Factor Theorem"),
        ("as-pure-mathematics-7-4-mathematical-proof", "Mathematical Proof"),
        ("as-pure-mathematics-7-5-methods-of-proof", "Methods of Proof"),
    ]),
    T("as-pure-mathematics-8-the-binomial-expansion", "The Binomial Expansion", [
        ("as-pure-mathematics-8-1-pascal-s-triangle", "Pascal's Triangle"),
        ("as-pure-mathematics-8-2-factorial-notation", "Factorial Notation"),
        ("as-pure-mathematics-8-3-the-binomial-expansion", "The Binomial Expansion"),
        ("as-pure-mathematics-8-4-solving-binomial-problems", "Solving Binomial Problems"),
        ("as-pure-mathematics-8-5-binomial-estimation", "Binomial Estimation"),
    ]),
    T("as-pure-mathematics-9-trigonometric-ratios", "Trigonometric Ratios", [
        ("as-pure-mathematics-9-1-the-cosine-rule", "The Cosine Rule"),
        ("as-pure-mathematics-9-2-the-sine-rule", "The Sine Rule"),
        ("as-pure-mathematics-9-3-areas-of-triangles", "Areas of Triangles"),
        ("as-pure-mathematics-9-4-solving-triangle-problems", "Solving Triangle Problems"),
        ("as-pure-mathematics-9-5-graphs-of-sine-cosine-and-tangent", "Graphs of Sine, Cosine and Tangent"),
        ("as-pure-mathematics-9-6-transforming-trigonometric-graphs", "Transforming Trigonometric Graphs"),
    ]),
    T("as-pure-mathematics-10-trigonometric-identities-and-equation", "Trigonometric Identities and Equations", [
        ("as-pure-mathematics-10-1-angles-in-all-four-quadrants", "Angles in All Four Quadrants"),
        ("as-pure-mathematics-10-2-exact-values-of-trigonometric-ratio", "Exact Values of Trigonometric Ratios"),
        ("as-pure-mathematics-10-3-trigonometric-identities", "Trigonometric Identities"),
        ("as-pure-mathematics-10-4-solving-trigonometric-equations", "Solving Trigonometric Equations"),
        ("as-pure-mathematics-10-5-harder-trigonometric-equations", "Harder Trigonometric Equations"),
        ("as-pure-mathematics-10-6-equations-and-identities", "Equations and Identities"),
    ]),
    T("as-pure-mathematics-11-vectors", "Vectors", [
        ("as-pure-mathematics-11-1-vectors", "Introduction to Vectors"),
        ("as-pure-mathematics-11-2-representing-vectors", "Representing Vectors"),
        ("as-pure-mathematics-11-3-magnitude-and-direction", "Magnitude and Direction"),
        ("as-pure-mathematics-11-4-position-vectors", "Position Vectors"),
        ("as-pure-mathematics-11-5-solving-geometric-problems", "Solving Geometric Problems"),
        ("as-pure-mathematics-11-6-modelling-with-vectors", "Modelling with Vectors"),
    ]),
    T("as-pure-mathematics-12-differentiation", "Differentiation", [
        ("as-pure-mathematics-12-1-gradients-of-curves", "Gradients of Curves"),
        ("as-pure-mathematics-12-2-differentiation-from-first-principl", "Differentiation from First Principles"),
        ("as-pure-mathematics-12-3-differentiating-x-n", "Differentiating x^n"),
        ("as-pure-mathematics-12-4-differentiating-quadratics", "Differentiating Quadratics"),
        ("as-pure-mathematics-12-5-differentiating-functions-with-two-", "Differentiating Functions with Two Terms"),
        ("as-pure-mathematics-12-6-gradients-tangents-and-normals", "Gradients, Tangents and Normals"),
        ("as-pure-mathematics-12-7-increasing-and-decreasing-functions", "Increasing and Decreasing Functions"),
        ("as-pure-mathematics-12-8-second-order-derivatives", "Second Order Derivatives"),
        ("as-pure-mathematics-12-9-stationary-points", "Stationary Points"),
        ("as-pure-mathematics-12-10-sketching-gradient-functions", "Sketching Gradient Functions"),
        ("as-pure-mathematics-12-11-modelling-with-differentiation", "Modelling with Differentiation"),
    ]),
    T("as-pure-mathematics-13-integration", "Integration", [
        ("as-pure-mathematics-13-1-integrating-x-n", "Integrating x^n"),
        ("as-pure-mathematics-13-2-indefinite-integrals", "Indefinite Integrals"),
        ("as-pure-mathematics-13-3-finding-functions", "Finding Functions"),
        ("as-pure-mathematics-13-4-definite-integrals", "Definite Integrals"),
        ("as-pure-mathematics-13-5-areas-under-curves", "Areas Under Curves"),
        ("as-pure-mathematics-13-6-areas-under-the-x-axis", "Areas Under the x-axis"),
        ("as-pure-mathematics-13-7-areas-between-curves-and-lines", "Areas Between Curves and Lines"),
    ]),
    T("as-pure-mathematics-14-exponentials-and-logarithms", "Exponentials and Logarithms", [
        ("as-pure-mathematics-14-1-exponential-functions", "Exponential Functions"),
        ("as-pure-mathematics-14-2-y-e-x", "y = e^x"),
        ("as-pure-mathematics-14-3-exponential-modelling", "Exponential Modelling"),
        ("as-pure-mathematics-14-4-logarithms", "Logarithms"),
        ("as-pure-mathematics-14-5-laws-of-logarithms", "Laws of Logarithms"),
        ("as-pure-mathematics-14-6-solving-equations-using-logarithms", "Solving Equations Using Logarithms"),
        ("as-pure-mathematics-14-7-working-with-natural-logarithms", "Working with Natural Logarithms"),
        ("as-pure-mathematics-14-8-logarithms-and-non-linear-data", "Logarithms and Non-linear Data"),
    ]),
]

STATS = [
    T("as-statistics-1-data-collection", "Data Collection", [
        ("as-statistics-populations-and-samples", "Populations and Samples"),
        ("as-statistics-sampling", "Sampling"),
        ("as-statistics-non-random-sampling", "Non-random Sampling"),
        ("as-statistics-types-of-data", "Types of Data"),
        ("as-statistics-the-large-data-set", "The Large Data Set"),
    ]),
    T("as-statistics-2-measures-of-location-and-spread", "Measures of Location and Spread", [
        ("as-statistics-measures-of-central-tendency", "Measures of Central Tendency"),
        ("as-statistics-other-measures-of-location", "Other Measures of Location"),
        ("as-statistics-measures-of-spread", "Measures of Spread"),
        ("as-statistics-variance-and-standard-deviation", "Variance and Standard Deviation"),
        ("as-statistics-coding", "Coding"),
        ("as-statistics-outliers", "Outliers"),
        ("as-statistics-comparing-data", "Comparing Data"),
    ]),
    T("as-statistics-3-representations-of-data", "Representations of Data", [
        ("as-statistics-histograms", "Histograms"),
        ("as-statistics-box-plots", "Box Plots"),
        ("as-statistics-cumulative-frequency", "Cumulative Frequency"),
    ]),
    T("as-statistics-4-correlation", "Correlation", [
        ("as-statistics-correlation", "Correlation"),
        ("as-statistics-linear-regression", "Linear Regression"),
    ]),
    T("as-statistics-5-probability", "Probability", [
        ("as-statistics-calculating-probabilities", "Calculating Probabilities"),
        ("as-statistics-venn-diagrams", "Venn Diagrams"),
        ("as-statistics-tree-diagrams", "Tree Diagrams"),
        ("as-statistics-mutually-exclusive-and-independent-events", "Mutually Exclusive and Independent Events"),
    ]),
    T("as-statistics-6-statistical-distributions", "Statistical Distributions", [
        ("as-statistics-probability-distributions", "Probability Distributions"),
        ("as-statistics-the-binomial-distribution", "The Binomial Distribution"),
        ("as-statistics-cumulative-probabilities", "Cumulative Probabilities"),
    ]),
    T("as-statistics-7-hypothesis-testing", "Hypothesis Testing", [
        ("as-statistics-hypothesis-testing", "Hypothesis Testing"),
        ("as-statistics-finding-critical-values", "Finding Critical Values"),
        ("as-statistics-one-tailed-tests", "One-tailed Tests"),
        ("as-statistics-two-tailed-tests", "Two-tailed Tests"),
    ]),
]

MECH = [
    T("as-mechanics-1-constant-acceleration", "Constant Acceleration", [
        ("as-mechanics-quantities-and-units", "Quantities and Units"),
        ("as-mechanics-constant-acceleration-formulae", "Constant Acceleration Formulae"),
        ("as-mechanics-displacement-time-graphs", "Displacement-Time Graphs"),
        ("as-mechanics-velocity-time-graphs", "Velocity-Time Graphs"),
        ("as-mechanics-vertical-motion-under-gravity", "Vertical Motion Under Gravity"),
    ]),
    T("as-mechanics-2-forces-and-motion", "Forces and Motion", [
        ("as-mechanics-modelling-assumptions", "Modelling Assumptions"),
        ("as-mechanics-force-diagrams", "Force Diagrams"),
        ("as-mechanics-forces-as-vectors", "Forces as Vectors"),
        ("as-mechanics-forces-and-acceleration", "Forces and Acceleration"),
        ("as-mechanics-pulleys", "Pulleys"),
        ("as-mechanics-connected-particles", "Connected Particles"),
    ]),
    T("as-mechanics-3-variable-acceleration", "Variable Acceleration", [
        ("as-mechanics-functions-of-time", "Functions of Time"),
        ("as-mechanics-using-differentiation", "Using Differentiation"),
        ("as-mechanics-using-integration", "Using Integration"),
        ("as-mechanics-motion-in-2-dimensions", "Motion in 2 Dimensions"),
        ("as-mechanics-maxima-and-minima-problems", "Maxima and Minima Problems"),
        ("as-mechanics-working-with-vectors", "Working with Vectors"),
    ]),
]

parents = PURE + STATS + MECH
doc = {
    "qualification": "as-level",
    "subject": "Maths",
    "board": "edexcel",
    "spec": "8MA0",
    "topic_count": len(parents),
    "subsection_count": sum(len(p.get("subsections", [])) for p in parents),
    "modules": {
        "AS Pure Mathematics": PURE,
        "AS Statistics": STATS,
        "AS Mechanics": MECH,
    },
    "assessment": [
        {"paper": "Paper 1 (Pure Mathematics)", "format": "Written exam", "duration": "2h", "marks": "100 marks", "weight": "62.5%"},
        {"paper": "Paper 2 (Statistics and Mechanics)", "format": "Written exam", "duration": "1h 15m", "marks": "60 marks", "weight": "37.5%"},
    ],
    "captured": "2026-10-29",
    "source": "mathsgenie.co.uk/as-level/maths/edexcel (RSC payload)",
}

os.makedirs("data/as-level-maths", exist_ok=True)
with open("data/as-level-maths/topics-edexcel.json", "w") as f:
    json.dump(doc, f, indent=2, ensure_ascii=False)

slugs = [p["slug"] for p in parents]
assert len(slugs) == len(set(slugs)) == 24, f"expected 24 unique parents, got {len(slugs)}"
print(f"OK: {doc['topic_count']} topics, {doc['subsection_count']} subsections")
