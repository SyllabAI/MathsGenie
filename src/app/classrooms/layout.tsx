import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";

/** Member shell for /classrooms: same app rail as the original. */
export default function ClassroomsLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
