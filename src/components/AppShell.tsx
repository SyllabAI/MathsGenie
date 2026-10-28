import type { ReactNode } from "react";
import AppSidebar from "@/components/AppSidebar";

/**
 * App-shell used by every page that shows the left rail on the original
 * (gcse/*, ask-genie, feature-requests): full-width row, rail flush left.
 */
export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full">
      <AppSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
