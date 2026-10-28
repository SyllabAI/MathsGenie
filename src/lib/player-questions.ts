/**
 * Question-player set generator (original /questions/qN pages).
 *
 * Every question is OUR OWN composition: template families with
 * programmatically verified answers, plus the handwritten samples in
 * questions.ts as filler. Nothing is copied from mathsgenie.co.uk.
 * Sets are deterministic per (topic, grade, difficulty) so pagination,
 * progress and the success-rate badges are stable across renders.
 */

import { SAMPLE_QUESTIONS, type SampleQuestion } from "./questions";

export type MarkStep = { code: string; text: string };

export type PlayerQuestion = {
  n: number;
  prompt: string;
  marks: number;
  calculator: boolean;
  answer: string;
  working?: string;
  rate: number; // success-rate badge (%)
  steps: MarkStep[];
};

/* ----------------------------- seeded rng ------------------------------ */

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(rng: () => number, arr: T[]): T => arr[Math.floor(rng() * arr.length)];
const int = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));

const SUP: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
};
const sup = (n: number) => String(n).split("").map((d) => SUP[d]).join("");
const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;

/* ------------------------- template families --------------------------- */

type Gen = (rng: () => number, medium: boolean) => Omit<PlayerQuestion, "n" | "rate">;

type Family = { keys: string[]; gen: Gen };

/** column-addition working shown in the markscheme modal */
function columnWorking(a: number, b: number, op: "+" | "−"): string {
  return `${a}\n${op === "+" ? "+" : "−"} ${b}\n─────`;
}

const FAMILIES: Family[] = [
  {
    keys: ["addition", "add"],
    gen: (rng, m) => {
      const a = m ? int(rng, 210, 899) : int(rng, 21, 89);
      const b = m ? int(rng, 210, 899) : int(rng, 21, 89);
      return {
        prompt: `Work out ${a} + ${b}.`,
        marks: 2,
        calculator: false,
        answer: String(a + b),
        working: columnWorking(a, b, "+"),
        steps: [
          { code: "M1", text: "Evidence of column addition with correct alignment or carrying" },
          { code: "A1", text: `Final answer ${a + b}` },
        ],
      };
    },
  },
  {
    keys: ["subtraction", "subtract"],
    gen: (rng, m) => {
      const a = m ? int(rng, 400, 990) : int(rng, 40, 99);
      const b = m ? int(rng, 101, a - 100) : int(rng, 11, a - 10);
      return {
        prompt: `Work out ${a} − ${b}.`,
        marks: 2,
        calculator: false,
        answer: String(a - b),
        working: columnWorking(a, b, "−"),
        steps: [
          { code: "M1", text: "Column subtraction with exchanges handled correctly" },
          { code: "A1", text: `Final answer ${a - b}` },
        ],
      };
    },
  },
  {
    keys: ["multiplication", "multiply", "short multiplication"],
    gen: (rng, m) => {
      const a = m ? int(rng, 23, 89) : int(rng, 12, 39);
      const b = m ? int(rng, 12, 29) : int(rng, 3, 9);
      return {
        prompt: `Calculate ${a} × ${b}.`,
        marks: m ? 2 : 1,
        calculator: false,
        answer: String(a * b),
        working: `${a} × ${b} = ${a * b}`,
        steps: [
          { code: "M1", text: `Valid method, e.g. ${a} × ${b} = (${Math.floor(a / 10) * 10} × ${b}) + (${a % 10} × ${b})` },
          { code: "A1", text: `Final answer ${a * b}` },
        ],
      };
    },
  },
  {
    keys: ["percentages", "percentage of", "percentage"],
    gen: (rng, m) => {
      const p = m ? pick(rng, [15, 35, 12, 45, 65, 85]) : pick(rng, [10, 20, 25, 50]);
      const N = 20 * int(rng, 3, 24);
      return {
        prompt: `Find ${p}% of ${N}.`,
        marks: m ? 2 : 1,
        calculator: false,
        answer: String((p * N) / 100),
        working: `${p}% of ${N} = ${N} ÷ 100 × ${p} = ${(p * N) / 100}`,
        steps: [
          { code: "M1", text: `10% of ${N} = ${N / 10} (or ${N} ÷ 100 × ${p})` },
          { code: "A1", text: `Final answer ${(p * N) / 100}` },
        ],
      };
    },
  },
  {
    keys: ["fractions of an amount", "fraction of"],
    gen: (rng, m) => {
      const b = m ? pick(rng, [3, 4, 5, 8]) : pick(rng, [2, 4, 5, 10]);
      const a = m ? int(rng, 2, b - 1) : 1;
      const N = b * int(rng, 4, 24);
      return {
        prompt: `Work out ${a}/${b} of ${N}.`,
        marks: 2,
        calculator: false,
        answer: String((a * N) / b),
        working: `${N} ÷ ${b} = ${N / b}, then × ${a} = ${(a * N) / b}`,
        steps: [
          { code: "M1", text: `Divides by the denominator: ${N} ÷ ${b} = ${N / b}` },
          { code: "A1", text: `Multiplies by the numerator: ${N / b} × ${a} = ${(a * N) / b}` },
        ],
      };
    },
  },
  {
    keys: ["ratio"],
    gen: (rng, m) => {
      const [r1, r2] = pick(rng, [[1, 2], [2, 3], [3, 4], [2, 5]]);
      const k = int(rng, 3, 12);
      const total = (r1 + r2) * k;
      return {
        prompt: m
          ? `Share ${gbp(total)} in the ratio ${r1}:${r2}. Give the larger share.`
          : `Share ${gbp(total)} in the ratio ${r1}:${r2}.`,
        marks: 2,
        calculator: false,
        answer: gbp(Math.max(r1, r2) * k),
        working: `${r1} + ${r2} = ${r1 + r2} parts, ${total} ÷ ${r1 + r2} = ${k} per part`,
        steps: [
          { code: "M1", text: `${total} ÷ (${r1} + ${r2}) = ${k} per part` },
          { code: "A1", text: `${r1} × ${k} = ${r1 * k} and ${r2} × ${k} = ${r2 * k}` },
        ],
      };
    },
  },
  {
    keys: ["averages", "mean", "averages and range"],
    gen: (rng, m) => {
      const mean = int(rng, 6, 18);
      const deltas = [int(rng, -6, 6), int(rng, -6, 6), int(rng, -6, 6), int(rng, -6, 6)];
      const nums = deltas.map((d) => mean + d);
      nums.push(mean * 5 - nums.reduce((s, x) => s + x, 0));
      return {
        prompt: `Find the mean of ${nums.join(", ")}.`,
        marks: m ? 3 : 2,
        calculator: m,
        answer: String(mean),
        working: `Sum = ${nums.reduce((s, x) => s + x, 0)}, ${nums.reduce((s, x) => s + x, 0)} ÷ 5 = ${mean}`,
        steps: [
          { code: "M1", text: `Adds the values: total ${nums.reduce((s, x) => s + x, 0)}` },
          { code: "M1", text: "Divides by how many values there are (5)" },
          { code: "A1", text: `Mean = ${mean}` },
        ],
      };
    },
  },
  {
    keys: ["area and perimeter", "perimeter", "area"],
    gen: (rng, m) => {
      const l = int(rng, 5, m ? 19 : 12);
      const w = int(rng, 3, m ? 14 : 9);
      if (m) {
        return {
          prompt: `A rectangle measures ${l} cm by ${w} cm. Work out its area and its perimeter.`,
          marks: 3,
          calculator: false,
          answer: `Area ${l * w} cm², perimeter ${2 * (l + w)} cm`,
          working: `Area = ${l} × ${w} = ${l * w} cm²; perimeter = 2 × (${l} + ${w}) = ${2 * (l + w)} cm`,
          steps: [
            { code: "M1", text: `Area = length × width = ${l} × ${w}` },
            { code: "A1", text: `Area = ${l * w} cm²` },
            { code: "A1", text: `Perimeter = ${2 * (l + w)} cm` },
          ],
        };
      }
      return {
        prompt: `A rectangle is ${l} cm by ${w} cm. Find its perimeter.`,
        marks: 1,
        calculator: false,
        answer: `${2 * (l + w)} cm`,
        working: `2 × (${l} + ${w}) = ${2 * (l + w)} cm`,
        steps: [
          { code: "M1", text: `Adds both sides: ${l} + ${w} + ${l} + ${w}` },
          { code: "A1", text: `Perimeter = ${2 * (l + w)} cm` },
        ],
      };
    },
  },
  {
    keys: ["solving equations", "equations", "one step", "two step"],
    gen: (rng, m) => {
      const x = int(rng, 2, 12);
      const a = int(rng, 2, m ? 9 : 5);
      const b = int(rng, 2, 15) * (rng() < 0.4 ? -1 : 1);
      const c = a * x + b;
      if (!m && b > 0) {
        return {
          prompt: `Solve x + ${b} = ${c}.`,
          marks: 1,
          calculator: false,
          answer: "x = " + x,
          working: `x = ${c} − ${b} = ${x}`,
          steps: [{ code: "B1", text: `Subtracts ${b}: x = ${x}` }],
        };
      }
      return {
        prompt: `Solve ${a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${c}.`,
        marks: 2,
        calculator: false,
        answer: "x = " + x,
        working: `${a}x = ${c} ${b < 0 ? "+" : "−"} ${Math.abs(b)} = ${a * x}, so x = ${x}`,
        steps: [
          { code: "M1", text: `Isolates the x term: ${a}x = ${a * x}` },
          { code: "A1", text: `Divides by ${a}: x = ${x}` },
        ],
      };
    },
  },
  {
    keys: ["substitution"],
    gen: (rng, m) => {
      const a = int(rng, 3, 9);
      const b = int(rng, -9, -2);
      const c1 = int(rng, 2, 5);
      const c2 = int(rng, 2, 5);
      const val = c1 * a + c2 * b;
      return {
        prompt: `a = ${a} and b = ${b}. Work out ${c1}a + ${c2}b.`,
        marks: m ? 3 : 2,
        calculator: false,
        answer: String(val),
        working: `${c1} × ${a} = ${c1 * a}, ${c2} × ${b} = ${c2 * b}, ${c1 * a} + (${c2 * b}) = ${val}`,
        steps: [
          { code: "M1", text: `Substitutes both values: ${c1} × ${a} and ${c2} × ${b}` },
          { code: "M1", text: `Handles the negative term: ${c1 * a} + (${c2 * b})` },
          { code: "A1", text: `Answer ${val}` },
        ],
      };
    },
  },
  {
    keys: ["sequences", "nth term"],
    gen: (rng, m) => {
      const d = int(rng, 2, m ? 9 : 6);
      const s = int(rng, 2, 9);
      const c = s - d;
      return {
        prompt: `Find the nth term of the sequence ${s}, ${s + d}, ${s + 2 * d}, ${s + 3 * d}, …`,
        marks: 2,
        calculator: false,
        answer: `${d}n ${c < 0 ? "−" : "+"} ${Math.abs(c)}`,
        working: `Common difference ${d} → ${d}n; ${s} − ${d} = ${c}`,
        steps: [
          { code: "M1", text: `Common difference ${d} identified → ${d}n` },
          { code: "A1", text: `Zero term: ${s} − ${d} = ${c}, so ${d}n ${c < 0 ? "−" : "+"} ${Math.abs(c)}` },
        ],
      };
    },
  },
  {
    keys: ["pythagoras", "pythagoras' theorem"],
    gen: (rng, m) => {
      const t = pick(rng, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]);
      if (m) {
        return {
          prompt: `A right-angled triangle has a hypotenuse of ${t[2]} cm and one side of ${t[1]} cm. Find the other side.`,
          marks: 3,
          calculator: false,
          answer: `${t[0]} cm`,
          working: `${t[2]}² − ${t[1]}² = ${t[2] * t[2] - t[1] * t[1]} = ${t[0]}²`,
          steps: [
            { code: "M1", text: `${t[2]}² − ${t[1]}² = ${t[2] * t[2] - t[1] * t[1]}` },
            { code: "M1", text: "Square roots to find the side" },
            { code: "A1", text: `Side = ${t[0]} cm` },
          ],
        };
      }
      return {
        prompt: `A right-angled triangle has legs ${t[0]} cm and ${t[1]} cm. Find the hypotenuse.`,
        marks: 2,
        calculator: false,
        answer: `${t[2]} cm`,
        working: `${t[0]}² + ${t[1]}² = ${t[0] * t[0] + t[1] * t[1]} = ${t[2]}²`,
        steps: [
          { code: "M1", text: `${t[0]}² + ${t[1]}² = ${t[0] * t[0] + t[1] * t[1]}` },
          { code: "A1", text: `Hypotenuse = ${t[2]} cm` },
        ],
      };
    },
  },
  {
    keys: ["negative numbers", "negatives"],
    gen: (rng, m) => {
      const a = int(rng, 3, m ? 40 : 15);
      const b = int(rng, 3, m ? 40 : 15);
      const kind = int(rng, 0, 2);
      const bank = [
        { p: `Work out −${a} + ${b}.`, v: b - a },
        { p: `Work out −${a} − ${b}.`, v: -(a + b) },
        { p: `Work out ${a} − ${b + a}.`, v: -(b) },
      ];
      const q = bank[kind];
      return {
        prompt: q.p,
        marks: 1,
        calculator: false,
        answer: String(q.v),
        working: q.p.replace("Work out ", "") + " = " + q.v,
        steps: [{ code: "B1", text: `Correct value (${q.v}) using number-line or counter method` }],
      };
    },
  },
  {
    keys: ["rounding"],
    gen: (rng, m) => {
      const n = int(rng, 1000, 9899);
      const to = m ? 100 : pick(rng, [10, 100]);
      const r = Math.round(n / to) * to;
      return {
        prompt: `Round ${n.toLocaleString("en-GB")} to the nearest ${to.toLocaleString("en-GB")}.`,
        marks: 1,
        calculator: false,
        answer: r.toLocaleString("en-GB"),
        working: `Look at the digit after the ${to === 10 ? "tens" : to === 100 ? "hundreds" : "thousands"} column.`,
        steps: [{ code: "B1", text: `${n.toLocaleString("en-GB")} → ${r.toLocaleString("en-GB")}` }],
      };
    },
  },
  {
    keys: ["standard form"],
    gen: (rng, m) => {
      const a = int(rng, 2, 4);
      const b = int(rng, 2, 4);
      const e1 = int(rng, 2, 5);
      const e2 = int(rng, 2, 5);
      let c = a * b;
      let e = e1 + e2;
      if (c >= 10) {
        c = c / 10;
        e += 1;
      }
      return {
        prompt: `Work out (${a} × 10${sup(e1)}) × (${b} × 10${sup(e2)}). Give your answer in standard form.`,
        marks: 2,
        calculator: false,
        answer: `${c} × 10${sup(e)}`,
        working: `${a} × ${b} = ${c}; 10${sup(e1)} × 10${sup(e2)} = 10${sup(e)}`,
        steps: [
          { code: "M1", text: `Multiplies the powers: 10${sup(e1)} × 10${sup(e2)} = 10${sup(e)}` },
          { code: "A1", text: `${c} × 10${sup(e)} (coefficients between 1 and 10)` },
        ],
      };
    },
  },
  {
    keys: ["linear graphs", "gradient", "straight line"],
    gen: (rng, m) => {
      const mGrad = int(rng, 2, 7);
      const c = int(rng, -8, 9);
      const x = int(rng, 2, 10);
      return {
        prompt: `A line has equation y = ${mGrad}x ${c < 0 ? "−" : "+"} ${Math.abs(c)}. What is y when x = ${x}?`,
        marks: m ? 2 : 1,
        calculator: false,
        answer: String(mGrad * x + c),
        working: `y = ${mGrad} × ${x} ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${mGrad * x + c}`,
        steps: [
          { code: "M1", text: `Substitutes x = ${x} into the equation` },
          { code: "A1", text: `y = ${mGrad * x + c}` },
        ],
      };
    },
  },
];

/* --------------------------- set assembly ------------------------------ */

function poolFor(grade: string): SampleQuestion[] {
  const grades = ["1", "2", "3", "4", "5", "6", "7", "8/9"];
  const gi = Math.max(0, grades.indexOf(grade));
  for (let i = gi; i >= 0; i--) {
    const pool = SAMPLE_QUESTIONS.filter((q) => q.grade === grades[i]);
    if (pool.length >= 4) return pool;
  }
  return SAMPLE_QUESTIONS;
}

function fromSample(q: SampleQuestion): Omit<PlayerQuestion, "n" | "rate"> {
  return {
    prompt: q.prompt,
    marks: q.marks,
    calculator: q.calculator,
    answer: q.answer,
    working: q.working,
    steps: q.working
      ? [
          { code: "M1", text: q.working },
          { code: "A1", text: `Correct answer: ${q.answer}` },
        ]
      : [
          { code: "M1", text: "Valid method with correct processing throughout" },
          { code: "A1", text: `Correct answer: ${q.answer}` },
        ],
  };
}

/**
 * Build the deterministic question set for a topic player.
 * 15 questions, mixing template-generated items (when the topic matches a
 * family) with handwritten samples so every topic gets a full playable set.
 */
export function playerSet(opts: {
  slug: string;
  title: string;
  grade: string;
  difficulty: "easy" | "medium";
  count?: number;
}): PlayerQuestion[] {
  const { slug, title, grade, difficulty } = opts;
  const count = opts.count ?? 15;
  const medium = difficulty === "medium";
  const rng = mulberry32(hash(`${slug}|${grade}|${difficulty}`));
  const text = `${slug} ${title}`.toLowerCase();

  const matched = FAMILIES.filter((f) => f.keys.some((k) => text.includes(k)));
  const pool = poolFor(grade);

  const items: Omit<PlayerQuestion, "n" | "rate">[] = [];
  if (matched.length) {
    for (let i = 0; i < count; i++) {
      // every 4th slot takes a handwritten sample for variety
      if (i % 4 === 3) items.push(fromSample(pool[(i + hash(slug)) % pool.length]));
      else items.push(matched[i % matched.length].gen(rng, medium));
    }
  } else {
    for (let i = 0; i < count; i++) items.push(fromSample(pool[(i * 7 + hash(difficulty)) % pool.length]));
  }

  return items.slice(0, count).map((it, i) => ({
    ...it,
    n: i + 1,
    rate: (medium ? 18 : 26) + Math.floor(rng() * 56),
  }));
}

export const PLAYER_COUNT = 15;
