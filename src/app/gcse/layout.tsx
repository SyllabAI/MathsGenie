import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";

/** App-shell layout for /gcse pages: left sidebar + content column. */
export default function GcseLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
