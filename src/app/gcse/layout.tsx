import type { ReactNode } from "react";
import AppSidebar from "@/components/AppSidebar";

/** App-shell layout for /gcse pages: left sidebar + content column. */
export default function GcseLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl">
      <AppSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
