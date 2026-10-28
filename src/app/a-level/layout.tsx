import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";

/** App-shell layout for /a-level pages: left sidebar + content column. */
export default function ALevelLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
