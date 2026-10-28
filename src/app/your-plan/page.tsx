import type { Metadata } from "next";
import PricingDark from "@/components/member/PricingDark";

export const metadata: Metadata = { title: "Pricing" };

/** /your-plan — dark pricing page (original renders it on a black theme). */
export default function YourPlanPage() {
  return <PricingDark />;
}
