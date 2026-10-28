"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

/** Global chrome. Footer hidden on app-style member routes (original hides it there). */
const APP_ROUTES = ["/classrooms", "/settings", "/your-plan"];

/**
 * Question-player focus mode (original /questions/qN pages): the standard
 * header/footer disappear and the player renders its own minimal chrome —
 * back arrow + HUD chips header, 64px context icon rail (research 04 §6).
 */
const FOCUS_PATTERN = /\/gcse\/maths\/[^/]+\/[^/]+\/questions\/q\d+$/;

export function SiteHeader() {
  const p = usePathname();
  if (p && FOCUS_PATTERN.test(p)) return null;
  return <Header />;
}

export function SiteFooter() {
  const p = usePathname();
  if (APP_ROUTES.some((r) => p?.startsWith(r))) return null;
  if (p && FOCUS_PATTERN.test(p)) return null;
  return <Footer />;
}
