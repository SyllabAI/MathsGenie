import type { Metadata } from "next";
import { Attribution } from "@/components/Content";
import SubjectGrid from "@/components/gcse/SubjectGrid";

export const metadata: Metadata = {
  title: "GCSE Subjects",
  description:
    "Browse every GCSE subject — Maths rebuilt in full (667-course catalog), all other subjects link through to the original MathsGenie.",
};

export default function GcsePage() {
  return (
    <div className="px-4 py-8 sm:px-8 sm:py-10">
      <SubjectGrid />
      <Attribution href="https://www.mathsgenie.co.uk/gcse" />
    </div>
  );
}
