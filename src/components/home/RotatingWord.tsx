"use client";

import { useEffect, useState } from "react";

const WORDS = [
  { text: "GCSEs", color: "text-ink" },
  { text: "A-Levels", color: "text-ink" },
  { text: "IGCSEs", color: "text-ink" },
  { text: "AS Levels", color: "text-ink" },
];

export default function RotatingWord() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % WORDS.length), 2400);
    return () => clearInterval(id);
  }, []);

  const w = WORDS[i];

  return (
    <span
      className={`relative inline-block overflow-hidden align-baseline ${w.color}`}
      aria-live="polite"
    >
      <span key={w.text} className="word-in inline-block">
        {w.text}
      </span>
    </span>
  );
}
