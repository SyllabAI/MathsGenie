"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

/** Public chrome hidden on member-area routes (which render their own shell). */
export function SiteHeader() {
  const p = usePathname();
  if (p?.startsWith("/dashboard")) return null;
  return <Header />;
}

export function SiteFooter() {
  const p = usePathname();
  if (p?.startsWith("/dashboard")) return null;
  return <Footer />;
}
