/**
 * ORIGINAL sample questions written for this recreation's UI demos.
 * These are our own compositions on standard UK curriculum topics —
 * NOT copied from mathsgenie.co.uk or any awarding body.
 * Used by: Question Rush, Daily Greens, topic question-bank demo.
 */

export type SampleQuestion = {
  id: string;
  grade: string; // "1" .. "8/9"
  topic: string; // topic title match (lowercase contains)
  prompt: string;
  marks: number;
  calculator: boolean;
  answer: string;
  working?: string;
};

export const SAMPLE_QUESTIONS: SampleQuestion[] = [
  // Grade 1
  { id: "q1-1", grade: "1", topic: "addition", prompt: "Work out 347 + 256.", marks: 1, calculator: false, answer: "603", working: "347 + 256 = 603" },
  { id: "q1-2", grade: "1", topic: "multiplication", prompt: "Calculate 23 × 6.", marks: 1, calculator: false, answer: "138", working: "20×6=120, 3×6=18, 120+18=138" },
  { id: "q1-3", grade: "1", topic: "time", prompt: "A train leaves at 14:45 and arrives at 16:10. How long does the journey take, in hours and minutes?", marks: 2, calculator: false, answer: "1 hour 25 minutes" },
  { id: "q1-4", grade: "1", topic: "place value", prompt: "Write the number 5,072 in words.", marks: 1, calculator: false, answer: "five thousand and seventy-two" },
  { id: "q1-5", grade: "1", topic: "rounding", prompt: "Round 3,847 to the nearest hundred.", marks: 1, calculator: false, answer: "3,800" },
  { id: "q1-6", grade: "1", topic: "negative numbers", prompt: "Work out −4 + 9.", marks: 1, calculator: false, answer: "5" },
  { id: "q1-7", grade: "1", topic: "factors", prompt: "Write down all the factors of 18.", marks: 1, calculator: false, answer: "1, 2, 3, 6, 9, 18" },
  { id: "q1-8", grade: "1", topic: "coordinates", prompt: "Write down the coordinates of the point halfway between (1, 2) and (5, 10).", marks: 1, calculator: false, answer: "(3, 6)" },
  { id: "q1-9", grade: "1", topic: "pictograms", prompt: "A pictogram uses 1 cup icon to represent 4 books. A row shows 3 and a half cup icons. How many books?", marks: 1, calculator: false, answer: "14 books" },

  // Grade 2
  { id: "q2-1", grade: "2", topic: "fractions of an amount", prompt: "Work out 3/8 of 96.", marks: 2, calculator: false, answer: "36", working: "96÷8=12, 12×3=36" },
  { id: "q2-2", grade: "2", topic: "fractions, decimals and percentages", prompt: "Write 0.35 as a fraction in its simplest form.", marks: 1, calculator: false, answer: "7/20" },
  { id: "q2-3", grade: "2", topic: "simplifying algebra", prompt: "Simplify 5a + 3b − 2a + b.", marks: 1, calculator: false, answer: "3a + 4b" },
  { id: "q2-4", grade: "2", topic: "function machines", prompt: "A function machine does ×3 then −4. The input is 7. What is the output?", marks: 1, calculator: false, answer: "17", working: "7×3=21, 21−4=17" },
  { id: "q2-5", grade: "2", topic: "solving one step equations", prompt: "Solve x + 9 = 15.", marks: 1, calculator: false, answer: "x = 6" },
  { id: "q2-6", grade: "2", topic: "angles", prompt: "Two angles on a straight line are 3x° and 96°. Find x.", marks: 2, calculator: false, answer: "x = 28", working: "3x+96=180 so 3x=84, x=28" },
  { id: "q2-7", grade: "2", topic: "area and perimeter", prompt: "A rectangle is 7 cm by 4 cm. Find its perimeter.", marks: 1, calculator: false, answer: "22 cm" },
  { id: "q2-8", grade: "2", topic: "probability", prompt: "A bag has 3 red, 5 blue and 2 green counters. What is the probability of picking a blue counter? Give your answer as a fraction.", marks: 1, calculator: false, answer: "1/2" },
  { id: "q2-9", grade: "2", topic: "averages", prompt: "Find the mean of 4, 7, 9, 12, 8.", marks: 2, calculator: false, answer: "8", working: "sum=40, 40÷5=8" },
  { id: "q2-10", grade: "2", topic: "bar charts", prompt: "A bar chart shows 45 books in 2024 and 30 books in 2025. How many fewer books were read in 2025?", marks: 1, calculator: false, answer: "15" },

  // Grade 3
  { id: "q3-1", grade: "3", topic: "error intervals", prompt: "x rounded to 1 decimal place is 4.7. Write the error interval for x.", marks: 2, calculator: false, answer: "4.65 ≤ x < 4.75" },
  { id: "q3-2", grade: "3", topic: "fractions", prompt: "Work out 2/3 + 1/4. Give your answer as a mixed number.", marks: 2, calculator: false, answer: "1 1/12", working: "8/12+3/12=11/12… actually 2/3=8/12, 1/4=3/12, sum=11/12" },
  { id: "q3-3", grade: "3", topic: "estimating", prompt: "Estimate the value of 41.2 × 5.8.", marks: 1, calculator: false, answer: "≈240 (40×6)" },
  { id: "q3-4", grade: "3", topic: "ratio", prompt: "Share £120 in the ratio 2:3. Give the larger share.", marks: 2, calculator: false, answer: "£72", working: "parts=5, 120÷5=24, 3×24=72" },
  { id: "q3-5", grade: "3", topic: "percentages", prompt: "Find 15% of 460.", marks: 1, calculator: false, answer: "69" },
  { id: "q3-6", grade: "3", topic: "percentage change", prompt: "A price rises from £80 to £92. Write the percentage increase.", marks: 2, calculator: false, answer: "15%", working: "12/80=0.15" },
  { id: "q3-7", grade: "3", topic: "substitution", prompt: "a=5, b=−2. Work out 3a − 4b.", marks: 2, calculator: false, answer: "23", working: "15 − (−8) = 23" },
  { id: "q3-8", grade: "3", topic: "solving equations", prompt: "Solve 4x − 7 = 21.", marks: 2, calculator: false, answer: "x = 7" },
  { id: "q3-9", grade: "3", topic: "drawing linear graphs", prompt: "A line has equation y = 2x − 1. What is y when x = 6?", marks: 1, calculator: false, answer: "11" },
  { id: "q3-10", grade: "3", topic: "area and circumference of circles", prompt: "A circle has radius 5 cm. Find its area, to 1 decimal place. (Take π = 3.14)", marks: 2, calculator: false, answer: "78.5 cm²", working: "3.14×25=78.5" },

  // Grade 4
  { id: "q4-1", grade: "4", topic: "compound interest", prompt: "£500 is invested at 4% compound interest per year for 2 years. Find the final amount, to the nearest penny.", marks: 3, calculator: true, answer: "£540.80", working: "500×1.04²=540.80" },
  { id: "q4-2", grade: "4", topic: "indices", prompt: "Write 5⁶ ÷ 5⁴ as a single power.", marks: 1, calculator: false, answer: "5²" },
  { id: "q4-3", grade: "4", topic: "prime factors", prompt: "Express 60 as a product of prime factors in index form.", marks: 2, calculator: false, answer: "2² × 3 × 5" },
  { id: "q4-4", grade: "4", topic: "inequalities", prompt: "Solve the inequality 3x + 2 > 17.", marks: 2, calculator: false, answer: "x > 5" },
  { id: "q4-5", grade: "4", topic: "forming and solving equations", prompt: "Tom is 3 years older than Amy. The sum of their ages is 27. Form an equation and find Amy's age.", marks: 3, calculator: false, answer: "Amy is 12", working: "a+(a+3)=27 so 2a=24, a=12" },
  { id: "q4-6", grade: "4", topic: "sequences", prompt: "Find the nth term of the sequence 7, 10, 13, 16, …", marks: 2, calculator: false, answer: "3n + 4" },
  { id: "q4-7", grade: "4", topic: "expanding and factorising", prompt: "Factorise fully 6x² + 9x.", marks: 1, calculator: false, answer: "3x(2x + 3)" },
  { id: "q4-8", grade: "4", topic: "pythagoras", prompt: "A right-angled triangle has legs 6 cm and 8 cm. Find the hypotenuse.", marks: 2, calculator: false, answer: "10 cm" },
  { id: "q4-9", grade: "4", topic: "angles in parallel lines", prompt: "Two parallel lines are cut by a transversal. One angle is 112°. Find its co-interior (allied) angle.", marks: 1, calculator: false, answer: "68°" },
  { id: "q4-10", grade: "4", topic: "cylinders", prompt: "A cylinder has radius 3 cm and height 10 cm. Find its volume, to 1 decimal place. (π = 3.14)", marks: 3, calculator: true, answer: "282.6 cm³", working: "3.14×9×10=282.6" },

  // Grade 5
  { id: "q5-1", grade: "5", topic: "direct and inverse proportion", prompt: "y is inversely proportional to x. When x = 4, y = 6. Find y when x = 8.", marks: 3, calculator: false, answer: "y = 3", working: "xy=24, so y=24/8=3" },
  { id: "q5-2", grade: "5", topic: "standard form", prompt: "Work out (3 × 10⁴) × (4 × 10³). Give your answer in standard form.", marks: 2, calculator: false, answer: "1.2 × 10⁸" },
  { id: "q5-3", grade: "5", topic: "speed", prompt: "A car travels 150 km in 2 hours 30 minutes. Find its average speed in km/h.", marks: 2, calculator: false, answer: "60 km/h" },
  { id: "q5-4", grade: "5", topic: "simultaneous equations", prompt: "Solve: x + y = 10, x − y = 4.", marks: 3, calculator: false, answer: "x = 7, y = 3" },
  { id: "q5-5", grade: "5", topic: "trigonometry", prompt: "In a right-angled triangle, the angle is 30° and the hypotenuse is 10 cm. Find the opposite side, to 1 decimal place.", marks: 2, calculator: true, answer: "5.0 cm", working: "10×sin30°=5" },

  // Grade 6
  { id: "q6-1", grade: "6", topic: "quadratic formula", prompt: "Solve x² − 5x + 6 = 0 by factorising.", marks: 2, calculator: false, answer: "x = 2 or x = 3" },
  { id: "q6-2", grade: "6", topic: "circle theorems", prompt: "A, B, C lie on a circle centre O. Angle AOC = 140°. Find angle ABC at the circumference.", marks: 2, calculator: false, answer: "70°", working: "angle at centre is twice angle at circumference" },
  { id: "q6-3", grade: "6", topic: "cumulative frequency", prompt: "The median of a cumulative frequency graph with 40 data points is read at which data value?", marks: 1, calculator: false, answer: "the 20th value" },
  { id: "q6-4", grade: "6", topic: "vectors", prompt: "AB = (3, −1) and BC = (−2, 5). Find AC as a column vector.", marks: 2, calculator: false, answer: "(1, 4)" },

  // Grade 7
  { id: "q7-1", grade: "7", topic: "algebraic fractions", prompt: "Simplify (x² − 9)/(x + 3).", marks: 2, calculator: false, answer: "x − 3" },
  { id: "q7-2", grade: "7", topic: "surds", prompt: "Simplify √50 + √18.", marks: 2, calculator: false, answer: "8√2", working: "5√2+3√2" },
  { id: "q7-3", grade: "7", topic: "functions", prompt: "f(x) = 2x + 3. Find f⁻¹(x).", marks: 2, calculator: false, answer: "(x − 3)/2" },
  { id: "q7-4", grade: "7", topic: "similar shapes", prompt: "Two similar triangles have scale factor 3. The small one has area 7 cm². Find the area of the larger.", marks: 2, calculator: false, answer: "63 cm²", working: "area scale factor = 9" },

  // Grade 8/9
  { id: "q89-1", grade: "8/9", topic: "quadratic sequences", prompt: "The nth term of a quadratic sequence is n² + 2n. Find the 10th term.", marks: 1, calculator: false, answer: "120" },
  { id: "q89-2", grade: "8/9", topic: "iteration", prompt: "xₙ₊₁ = (xₙ)² − 1, x₁ = 1.5. Find x₂.", marks: 1, calculator: true, answer: "1.25" },
  { id: "q89-3", grade: "8/9", topic: "proof", prompt: "Prove that the sum of two consecutive odd numbers is always even. Start by writing two consecutive odd numbers as 2n+1 and 2n+3.", marks: 2, calculator: false, answer: "2n+1+2n+3=4n+4=4(n+1), a multiple of 4, hence even" },
  { id: "q89-4", grade: "8/9", topic: "gradient of a tangent", prompt: "y = x². Find the gradient of the curve at x = 3.", marks: 1, calculator: false, answer: "6", working: "dy/dx = 2x = 6" },
  { id: "q89-5", grade: "8/9", topic: "vectors geometry", prompt: "OABC is a parallelogram with OA = a and OC = c. M is the midpoint of AB. Find OM in terms of a and c.", marks: 3, calculator: false, answer: "a + ½c" },
];

export function questionsForGrade(grade: string): SampleQuestion[] {
  return SAMPLE_QUESTIONS.filter((q) => q.grade === grade);
}

/** Deterministic daily set: same 3 questions for everyone on a given day. */
export function dailySet(date = new Date()): SampleQuestion[] {
  const day = Math.floor(date.getTime() / 86_400_000);
  const picks: SampleQuestion[] = [];
  for (let i = 0; i < 3; i++) {
    picks.push(SAMPLE_QUESTIONS[(day * 7 + i * 53) % SAMPLE_QUESTIONS.length]);
  }
  return picks;
}

/* ------------------------------------------------------------------ */
/* Qualification-level banks for the other Daily Greens pages          */
/* (original compositions, same policy as the GCSE set above).         */
/* ------------------------------------------------------------------ */

export type QualKey = "gcse" | "a-level" | "as-level" | "igcse" | "ks2";

const ALEVEL_QUESTIONS: SampleQuestion[] = [
  { id: "al-1", grade: "", topic: "algebraic expressions", prompt: "Simplify (3x²y)² × 2x⁻³.", marks: 2, calculator: false, answer: "18xy²", working: "9x⁴y² × 2x⁻³ = 18xy²" },
  { id: "al-2", grade: "", topic: "quadratics", prompt: "Solve 2x² − 5x − 3 = 0.", marks: 2, calculator: false, answer: "x = -1/2 or x = 3", working: "(2x + 1)(x − 3) = 0" },
  { id: "al-3", grade: "", topic: "differentiation", prompt: "Find the gradient of the curve y = x³ − 4x at the point where x = 2.", marks: 2, calculator: false, answer: "8", working: "dy/dx = 3x² − 4 = 12 − 4" },
  { id: "al-4", grade: "", topic: "integration", prompt: "Evaluate ∫₁³ (2x + 1) dx.", marks: 3, calculator: false, answer: "10", working: "[x² + x] from 1 to 3 = 12 − 2" },
  { id: "al-5", grade: "", topic: "straight line graphs", prompt: "The line l has equation y = 3x − 2. Find the equation of the line perpendicular to l that passes through (6, 1).", marks: 3, calculator: false, answer: "y = -x/3 + 3", working: "perpendicular gradient = −1/3; y − 1 = −(x − 6)/3" },
  { id: "al-6", grade: "", topic: "binomial expansion", prompt: "Expand (1 + 2x)³, giving every term.", marks: 3, calculator: false, answer: "1 + 6x + 12x² + 8x³" },
  { id: "al-7", grade: "", topic: "logarithms", prompt: "Solve log₂(x) + log₂(x − 2) = 3.", marks: 3, calculator: false, answer: "x = 4", working: "x(x − 2) = 8 so x² − 2x − 8 = 0; reject x = −2" },
  { id: "al-8", grade: "", topic: "trigonometry", prompt: "In triangle ABC, a = 7 cm, b = 8 cm and angle C = 60°. Find c, to 1 decimal place.", marks: 3, calculator: true, answer: "7.5 cm", working: "c² = 49 + 64 − 2·7·8·cos60° = 57" },
  { id: "al-9", grade: "", topic: "statistical distributions", prompt: "A fair die is rolled 10 times. Find P(exactly 2 sixes), to 3 decimal places.", marks: 3, calculator: true, answer: "0.291", working: "C(10,2)(1/6)²(5/6)⁸ ≈ 0.2907" },
  { id: "al-10", grade: "", topic: "measures of spread", prompt: "For the data 2, 5, 7, 9, 12, find the standard deviation, to 2 decimal places.", marks: 2, calculator: true, answer: "3.41", working: "mean 7; variance = 58/5 = 11.6" },
  { id: "al-11", grade: "", topic: "constant acceleration", prompt: "A particle starts from rest and accelerates uniformly at 4 m s⁻². How far does it travel in 3 seconds?", marks: 2, calculator: false, answer: "18 m", working: "s = ½ × 4 × 3²" },
  { id: "al-12", grade: "", topic: "forces and motion", prompt: "A 2 kg block is pulled horizontally by a 12 N force against 4 N of friction. Find its acceleration.", marks: 2, calculator: false, answer: "4 m s⁻²", working: "F = ma: (12 − 4)/2" },
];

const IGCSE_QUESTIONS: SampleQuestion[] = [
  { id: "ig-1", grade: "3", topic: "fractions", prompt: "Work out 3/4 ÷ 2/5. Give your answer as a mixed number.", marks: 2, calculator: false, answer: "1 7/8", working: "3/4 × 5/2 = 15/8" },
  { id: "ig-2", grade: "4", topic: "inequalities", prompt: "Solve the inequality 5 − 2x ≥ 11.", marks: 2, calculator: false, answer: "x ≤ -3", working: "−2x ≥ 6, divide and flip" },
  { id: "ig-3", grade: "6", topic: "proportion", prompt: "y is inversely proportional to x². When x = 2, y = 9. Find y when x = 6.", marks: 3, calculator: false, answer: "1", working: "k = 9 × 4 = 36; y = 36/36" },
  { id: "ig-4", grade: "5", topic: "standard form", prompt: "Calculate (4.2 × 10⁵) ÷ (2 × 10²). Give your answer in standard form.", marks: 2, calculator: false, answer: "2.1 × 10³" },
  { id: "ig-5", grade: "4", topic: "sequences", prompt: "The nth term of a sequence is 5n − 3. Is 112 a term in the sequence? Justify your answer.", marks: 2, calculator: false, answer: "Yes, n = 23", working: "5n − 3 = 112 gives 5n = 115" },
  { id: "ig-6", grade: "5", topic: "area of a sector", prompt: "A sector has radius 6 cm and angle 60°. Find its area, to 1 decimal place. (π = 3.14)", marks: 2, calculator: false, answer: "18.8 cm²", working: "60/360 × 3.14 × 36 = 18.84" },
  { id: "ig-7", grade: "5", topic: "simultaneous equations", prompt: "Solve the simultaneous equations 3x + y = 11 and 2x − y = 4.", marks: 3, calculator: false, answer: "x = 3, y = 2", working: "add the equations: 5x = 15" },
  { id: "ig-8", grade: "7", topic: "differentiation", prompt: "Find dy/dx when y = x⁵ − 3x.", marks: 2, calculator: false, answer: "5x⁴ − 3" },
  { id: "ig-9", grade: "4", topic: "compound interest", prompt: "A car worth £12,000 depreciates by 15% each year. Find its value after 2 years, to the nearest pound.", marks: 3, calculator: true, answer: "£8,670", working: "12000 × 0.85²" },
  { id: "ig-10", grade: "5", topic: "probability", prompt: "The probability of rain on Monday is 0.3 and on Tuesday, independently, 0.4. Find the probability it rains on both days.", marks: 2, calculator: false, answer: "0.12", working: "0.3 × 0.4" },
];

const KS2_QUESTIONS: SampleQuestion[] = [
  { id: "k2-1", grade: "KS2", topic: "addition", prompt: "Work out 6,248 + 1,767.", marks: 1, calculator: false, answer: "8,015" },
  { id: "k2-2", grade: "KS2", topic: "multiplication", prompt: "Calculate 34 × 7.", marks: 1, calculator: false, answer: "238" },
  { id: "k2-3", grade: "KS2", topic: "fractions of an amount", prompt: "What is 3/5 of 45?", marks: 1, calculator: false, answer: "27", working: "45 ÷ 5 = 9, 9 × 3 = 27" },
  { id: "k2-4", grade: "KS2", topic: "rounding", prompt: "Round 4,826 to the nearest 100.", marks: 1, calculator: false, answer: "4,800" },
  { id: "k2-5", grade: "KS2", topic: "units", prompt: "A ribbon is 2.5 metres long. How many centimetres is that?", marks: 1, calculator: false, answer: "250 cm" },
  { id: "k2-6", grade: "KS2", topic: "fractions and decimals", prompt: "Write 0.6 as a fraction in its simplest form.", marks: 1, calculator: false, answer: "3/5" },
  { id: "k2-7", grade: "KS2", topic: "time", prompt: "A bus leaves at 08:40 and arrives at 10:15. How long does the journey take?", marks: 2, calculator: false, answer: "1 hour 35 minutes" },
  { id: "k2-8", grade: "KS2", topic: "angles", prompt: "Two angles in a triangle are 50° and 70°. What is the third angle?", marks: 1, calculator: false, answer: "60°", working: "180 − 50 − 70" },
  { id: "k2-9", grade: "KS2", topic: "percentages", prompt: "What is 15% of 400?", marks: 1, calculator: false, answer: "60", working: "10% = 40, 5% = 20" },
  { id: "k2-10", grade: "KS2", topic: "fractions", prompt: "A packet has 24 sweets. Amy eats 1/4 of them and Ben eats 1/8 of them. How many sweets are left?", marks: 2, calculator: false, answer: "15", working: "Amy 6, Ben 3, 24 − 9 = 15" },
];

const QUAL_BANKS: Record<Exclude<QualKey, "gcse">, SampleQuestion[]> = {
  "a-level": ALEVEL_QUESTIONS,
  "as-level": ALEVEL_QUESTIONS, // AS draws from the same bank (it is Year 1 of the course)
  igcse: IGCSE_QUESTIONS,
  ks2: KS2_QUESTIONS,
};

/** Deterministic per-qualification daily set — same 3 questions for everyone on a given day. */
export function dailySetFor(qual: QualKey, date = new Date()): SampleQuestion[] {
  if (qual === "gcse") return dailySet(date);
  const bank = QUAL_BANKS[qual];
  const offset = { "a-level": 101, "as-level": 202, igcse: 303, ks2: 404 }[qual];
  const day = Math.floor(date.getTime() / 86_400_000);
  const picks: SampleQuestion[] = [];
  for (let i = 0; i < Math.min(3, bank.length); i++) {
    picks.push(bank[(day * 7 + i * 53 + offset) % bank.length]);
  }
  return picks;
}

/* ------------------------------------------------------------------ */
/* Question Rush pools — the original runs Rush per qualification      */
/* (GCSE grades 1–8/9; A Level by module). Pools group the banks the   */
/* same way.                                                           */
/* ------------------------------------------------------------------ */

export type RushPool = { key: string; label: string; questions: SampleQuestion[] };

const ALEVEL_MODULE_TOPICS = {
  pure: ["algebraic expressions", "quadratics", "differentiation", "integration", "straight line graphs", "binomial expansion", "logarithms", "trigonometry"],
  stats: ["statistical distributions", "measures of spread"],
  mech: ["constant acceleration", "forces and motion"],
};

export function rushPoolsForQual(qual: QualKey): RushPool[] {
  if (qual === "gcse") {
    const grades = ["1", "2", "3", "4", "5", "6", "7", "8/9"];
    return grades
      .map((g) => ({ key: g, label: `Grade ${g}`, questions: questionsForGrade(g) }))
      .filter((p) => p.questions.length > 0);
  }
  const bank = QUAL_BANKS[qual];
  if (qual === "a-level" || qual === "as-level") {
    const byTopic = (topics: string[]) => bank.filter((q) => topics.some((t) => q.topic === t));
    return [
      { key: `${qual}-all`, label: "All modules", questions: bank },
      { key: `${qual}-pure`, label: "Pure", questions: byTopic(ALEVEL_MODULE_TOPICS.pure) },
      { key: `${qual}-stats`, label: "Statistics", questions: byTopic(ALEVEL_MODULE_TOPICS.stats) },
      { key: `${qual}-mech`, label: "Mechanics", questions: byTopic(ALEVEL_MODULE_TOPICS.mech) },
    ].filter((p) => p.questions.length > 0);
  }
  return [{ key: `${qual}-all`, label: "All topics", questions: bank }];
}

/**
 * Tolerant answer check for short-answer demo questions: case/space
 * insensitive, ignores units, currency and "x =" style prefixes, and
 * accepts numerically-equal answers (5.0 == 5). Good enough for the
 * self-marking demo sets — not a general-purpose grader.
 */
export function isAnswerCorrect(given: string, answer: string): boolean {
  const norm = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/^(x|y|n)\s*=\s*/, "")
      .replace(/[°£$]/g, "")
      .replace(/cm[²2]?|m[²2]?|km\/h|m\/s²|m s⁻²|m s-2|kg/g, "")
      .replace(/\s+/g, "");
  const g = norm(given);
  const a = norm(answer);
  if (!g) return false;
  if (g === a) return true;
  const gn = parseFloat(g.replace(/,/g, ""));
  const an = parseFloat(a.replace(/,/g, ""));
  if (!Number.isNaN(gn) && !Number.isNaN(an) && gn === an) return true;
  return false;
}
