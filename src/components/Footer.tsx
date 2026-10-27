import Link from "next/link";
import { SITE } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-2">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-hand text-2xl font-bold">
            Maths<span className="text-accent">Genie</span>
            <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 align-middle text-[10px] font-medium uppercase tracking-wide text-accent">
              Recreation
            </span>
          </p>
          <p className="mt-2 text-sm text-muted">
            A research-driven, data-driven recreation of the new MathsGenie — built
            for learning how the original works. See{" "}
            <Link href="/research" className="text-accent underline">
              the research folder
            </Link>{" "}
            in the repository.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">Tools</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li><Link href="/features/revision-planner" className="hover:text-accent">Revision planner</Link></li>
            <li><Link href="/ask-genie" className="hover:text-accent">Ask Genie AI</Link></li>
            <li><Link href="/features/answer-marking" className="hover:text-accent">Answer marking</Link></li>
            <li><Link href="/gcse/maths/edexcel/predicted-grade-calculator" className="hover:text-accent">Grade calculator</Link></li>
            <li><Link href="/gcse/question-rush" className="hover:text-accent">Question Rush</Link></li>
            <li><Link href="/gcse/daily-greens" className="hover:text-accent">Daily Greens</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">Company</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li>
              <a href={SITE.original} className="hover:text-accent" rel="noopener noreferrer">
                The real MathsGenie →
              </a>
            </li>
            <li>
              <a href="https://github.com/SyllabAI/MathsGenie" className="hover:text-accent" rel="noopener noreferrer">
                GitHub repository
              </a>
            </li>
            <li>
              <a href="https://github.com/SyllabAI/MathsGenie/issues" className="hover:text-accent" rel="noopener noreferrer">
                Ideas + feedback
              </a>
            </li>
            <li>
              <a href="https://www.mathsgenie.co.uk/cookie-policy" className="hover:text-accent" rel="noopener noreferrer">
                Cookie Policy (original)
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        {SITE.attribution}
      </div>
    </footer>
  );
}
