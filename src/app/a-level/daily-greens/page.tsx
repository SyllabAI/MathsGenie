import type { Metadata } from "next";
import QualDailyGreens from "@/components/member/QualDailyGreens";

export const metadata: Metadata = {
  title: "A Level Daily Greens | MathsGenie",
  description: "A quick A-Level Maths worksheet each day that targets your weaknesses.",
};

/** /a-level/daily-greens — original: H1 + one-liner + Maths subject card. */
export default function ALevelDailyGreensPage() {
  return (
    <QualDailyGreens
      qual="a-level"
      qualName="A Level"
      qualHref="/a-level"
      spec="Spec 9MA0"
      courseHref="/a-level/maths/edexcel"
      courseLabel="Maths Edexcel"
      rushHref="/a-level/question-rush"
    />
  );
}
