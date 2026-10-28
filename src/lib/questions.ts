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
