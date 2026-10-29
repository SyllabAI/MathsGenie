import type { Metadata } from "next";
import QualDailyGreens from "@/components/member/QualDailyGreens";

export const metadata: Metadata = {
  title: "AS Level Daily Greens | MathsGenie",
  description: "A quick AS-Level Maths worksheet each day that targets your weaknesses.",
};

/** /as-level/daily-greens — original: H1 + one-liner + Maths subject card. */
export default function AsLevelDailyGreensPage() {
  return (
    <QualDailyGreens
      qual="as-level"
      qualName="AS Level"
      qualHref="/as-level"
      spec="Spec 8MA0"
      courseHref="/as-level/maths/edexcel"
      courseLabel="Maths Edexcel"
    />
  );
}
