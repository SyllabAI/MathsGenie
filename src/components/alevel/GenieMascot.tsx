/**
 * Baby Genie mascot — self-drawn inline SVG (no original assets).
 * Shared by Teach Genie pages.
 */
export default function GenieMascot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden>
      <path
        d="M48 16c17 0 27 11 27 26 0 6.5-2.2 11.6-5.6 15.2 1.5 2 2.3 4.4 2.3 7C71.7 73.6 61.3 82 48 82s-23.7-8.4-23.7-17.8c0-2.6.8-5 2.3-7C23.2 53.6 21 48.5 21 42c0-15 10-26 27-26Z"
        fill="#2fe4b7"
      />
      <circle cx="39" cy="42" r="4.4" fill="#14171c" />
      <circle cx="57" cy="42" r="4.4" fill="#14171c" />
      <circle cx="40.4" cy="40.6" r="1.4" fill="#fff" />
      <circle cx="58.4" cy="40.6" r="1.4" fill="#fff" />
      <path d="M39 54c5.4 4.2 12.6 4.2 18 0" stroke="#14171c" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <path d="M26 66c-6 2-9 6-8 11 6 1 11-1 14-6" fill="#2fe4b7" />
    </svg>
  );
}
