"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

/** Global chrome. Footer hidden on app-style member routes (original hides it there). */
const APP_ROUTES = ["/classrooms", "/settings", "/your-plan"];

export function SiteHeader() {
  return <Header />;
}

export function SiteFooter() {
  const p = usePathname();
  if (APP_ROUTES.some((r) => p?.startsWith(r))) return null;
  return <Footer />;
}
