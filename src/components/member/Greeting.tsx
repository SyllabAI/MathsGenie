"use client";

import { useEffect, useState } from "react";

/** Time-aware greeting, computed client-side to avoid hydration mismatch. */
export default function Greeting({ name }: { name: string }) {
  const [g, setG] = useState("Welcome back");

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const h = new Date().getHours();
      setG(
        h < 5 ? "Good late night" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : h < 21 ? "Good evening" : "Good late night"
      );
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
      {g}, {name}
    </h1>
  );
}
