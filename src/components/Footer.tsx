import Link from "next/link";
import { SITE } from "@/lib/data";

/**
 * Light multi-column footer matching the original's link-grid layout:
 * resource columns + legal column + subject columns + social icons.
 * External entries point at the original site; internal ones at this app.
 */
const O = SITE.original;

const COLS: { title?: string; links: { label: string; href: string; ext?: boolean }[] }[] = [
  {
    links: [
      { label: "Literary Hub", href: `${O}/literary-hub`, ext: true },
      { label: "Free maths course", href: `${O}/gcse/maths/edexcel/scheme-of-learning`, ext: true },
      { label: "A Level past papers", href: `${O}/alevelpapers.php`, ext: true },
      { label: "A Level question bank", href: `${O}/a-level-question-bank`, ext: true },
      { label: "Old MathsGenie", href: "https://old.mathsgenie.co.uk", ext: true },
    ],
  },
  {
    links: [{ label: "Pricing", href: `${O}/pricing`, ext: true }],
  },
  {
    links: [
      { label: "Student ambassadors", href: `${O}/student-ambassadors`, ext: true },
      { label: "Help centre", href: `${O}/help`, ext: true },
      { label: "More resources", href: `${O}/resources.php`, ext: true },
      { label: "Blog", href: `${O}/blog`, ext: true },
      { label: "Student questions", href: `${O}/student-questions`, ext: true },
      { label: "Sitemap", href: `${O}/sitemap`, ext: true },
      { label: "Privacy policy", href: `${O}/privacy-policy`, ext: true },
      { label: "Terms of Service", href: `${O}/terms`, ext: true },
      { label: "Cookie policy", href: `${O}/cookie-policy`, ext: true },
      { label: "Report a bug", href: "https://github.com/SyllabAI/MathsGenie/issues" },
      { label: "Cookie preferences", href: `${O}/cookie-preferences`, ext: true },
    ],
  },
  {
    title: "Subjects",
    links: [
      { label: "Maths", href: "/gcse" },
      { label: "Old Maths", href: "https://old.mathsgenie.co.uk", ext: true },
      { label: "Physics", href: `${O}/gcse/physics`, ext: true },
      { label: "Statistics", href: `${O}/gcse/statistics`, ext: true },
    ],
  },
];

const SUBJECT_COLS: { title: string; subjects: string[] }[] = [
  { title: "GCSE", subjects: ["Maths", "Physics", "Biology", "Chemistry", "English Language", "English Literature", "Computer Science", "Geography", "History"] },
  { title: "IGCSE", subjects: ["Maths", "Biology", "Business", "Chemistry", "Computer Science", "Economics", "English Language", "French", "Physics"] },
  { title: "A Level", subjects: ["Maths", "Biology", "Business", "Chemistry", "Economics", "Physics", "Psychology"] },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper text-ink">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 text-sm md:grid-cols-4">
          {COLS.map((col, i) => (
            <div key={i}>
              {col.title && (
                <h3 className="mb-3 font-title text-base font-bold">{col.title}</h3>
              )}
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.ext ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-muted transition hover:text-ink">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-muted transition hover:text-ink">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* social icons */}
        <div className="mt-10 flex items-center gap-4 text-muted">
          <a href="https://www.instagram.com/mathsgenie" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition hover:text-ink">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a href="https://www.tiktok.com/@mathsgenie" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="transition hover:text-ink">
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
              <path d="M14.5 3h2.6c.2 1.8 1.3 3.2 3.4 3.6v2.7c-1.3 0-2.5-.4-3.5-1v6.2A5.9 5.9 0 1 1 11 8.6v2.9a3 3 0 1 0 3.5 3V3Z" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/company/mathsgenie" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition hover:text-ink">
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
              <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.5c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21h-4V9Z" />
            </svg>
          </a>
        </div>

        {/* subject columns */}
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 text-sm sm:grid-cols-3">
          {SUBJECT_COLS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 font-title text-base font-bold">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.subjects.map((s) => (
                  <li key={s}>
                    <a href={`${O}/gcse`} target="_blank" rel="noopener noreferrer" className="text-muted transition hover:text-ink">
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 border-t border-line pt-6 text-xs leading-relaxed text-muted">
          Educational recreation of mathsgenie.co.uk built for research — original
          content belongs to Maths Genie Ltd and the awarding bodies. No copyrighted
          material is re-hosted; resource links point to the original site.{" "}
          <a href={SITE.original} className="text-accent hover:underline" rel="noopener noreferrer">
            mathsgenie.co.uk
          </a>
        </p>
      </div>
    </footer>
  );
}
