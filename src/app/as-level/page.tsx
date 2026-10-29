import type { Metadata } from "next";
import AsLevelHub from "@/components/as-level/AsLevelHub";
import { Attribution } from "@/components/Content";

export const metadata: Metadata = {
  title: "AS Level Subjects | MathsGenie",
  description:
    "Browse every AS-Level subject — Maths rebuilt in full (24 topics across pure, statistics and mechanics), all other subjects link through to the original MathsGenie.",
};

/** /as-level — subject picker with 3D deck cards (original hub layout). */
export default function AsLevelPage() {
  return (
    <>
      <AsLevelHub />
      <Attribution href="https://www.mathsgenie.co.uk/as-level" />
    </>
  );
}
