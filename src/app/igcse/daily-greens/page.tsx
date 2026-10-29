import type { Metadata } from "next";
import QualDailyGreens from "@/components/member/QualDailyGreens";

export const metadata: Metadata = {
  title: "IGCSE Daily Greens | MathsGenie",
  description: "A quick IGCSE Maths worksheet each day that targets your weaknesses.",
};

/** /igcse/daily-greens — original: H1 + one-liner + Maths subject card. */
export default function IgcseDailyGreensPage() {
  return (
    <QualDailyGreens
      qual="igcse"
      qualName="IGCSE"
      qualHref="/igcse"
      spec="Spec 4MA1"
      courseHref="/igcse/maths/edexcel"
      courseLabel="Maths Edexcel"
      rushHref="/igcse/question-rush"
    />
  );
}
