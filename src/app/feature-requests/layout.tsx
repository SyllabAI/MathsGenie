import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";

/** The Ideas + feedback board renders inside the app rail shell. */
export default function FeatureRequestsLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
