"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // deferred: read persistent choice after mount (SSR renders the banner hidden)
    const t = setTimeout(() => {
      try {
        if (!localStorage.getItem("mg-cookies")) setShow(true);
      } catch {
        setShow(true);
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;
  if (pathname?.startsWith("/paper/")) return null;

  function choose(v: string) {
    try { localStorage.setItem("mg-cookies", v); } catch {}
    setShow(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-panel p-3 shadow-lg">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-2">
        <p className="text-sm text-muted">
          This recreation stores preferences (theme, streaks) in your browser only —
          no tracking. The original site uses cookie tracking technologies; see its{" "}
          <a
            href="https://www.mathsgenie.co.uk/cookie-policy"
            className="text-accent underline"
            rel="noopener noreferrer"
          >
            Cookie Policy
          </a>
          .
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => choose("reject")}
            className="rounded-full border border-line px-4 py-1.5 text-sm font-medium hover:bg-paper-2"
          >
            Reject optional
          </button>
          <button
            onClick={() => choose("allow")}
            className="rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-paper hover:opacity-90"
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
