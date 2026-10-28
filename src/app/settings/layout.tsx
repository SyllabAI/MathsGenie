import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";

/** Settings keeps the app rail on the original logged-in pages. */
export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
