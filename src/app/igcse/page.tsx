import type { Metadata } from "next";
import IgcseHub from "@/components/igcse/IgcseHub";

export const metadata: Metadata = {
  title: "IGCSE Revision — MathsGenie",
  description:
    "Free IGCSE revision resources. Edexcel Maths rebuilt in full: 119 topics by grade with exam-style questions, worksheets and past papers from 2018–2025 with mark schemes.",
};

/** /igcse — subjects landing, mirrors the original's IGCSE hub. */
export default function IgcsePage() {
  return <IgcseHub />;
}
