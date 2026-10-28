import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";

/** The original shows the same app rail on /ask-genie. */
export default function AskGenieLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
