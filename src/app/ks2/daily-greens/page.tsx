import type { Metadata } from "next";
import QualDailyGreens from "@/components/member/QualDailyGreens";

export const metadata: Metadata = {
  title: "Key Stage 2 Daily Greens | MathsGenie",
  description: "A quick KS2 Maths worksheet each day that targets your weaknesses.",
};

/** /ks2/daily-greens — original: H1 + one-liner + Maths subject card. */
export default function Ks2DailyGreensPage() {
  return (
    <QualDailyGreens
      qual="ks2"
      qualName="KS2"
      qualHref="/ks2"
      courseHref="/ks2/maths/sat"
      courseLabel="KS2 SAT"
      rushHref="/ks2/question-rush"
    />
  );
}
