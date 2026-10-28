import type { Metadata } from "next";
import ALevelHub from "@/components/a-level/ALevelHub";
import { Attribution } from "@/components/Content";

export const metadata: Metadata = {
  title: "A Level Subjects | MathsGenie",
  description:
    "Browse every A-Level subject — Maths rebuilt in full (44 topics across pure, statistics and mechanics), all other subjects link through to the original MathsGenie.",
};

/** /a-level — subject picker with 3D deck cards (original hub layout). */
export default function ALevelPage() {
  return (
    <>
      <ALevelHub />
      <Attribution href="https://www.mathsgenie.co.uk/a-level" />
    </>
  );
}
