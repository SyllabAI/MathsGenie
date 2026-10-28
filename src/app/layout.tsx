import type { Metadata } from "next";
import "./globals.css";
import { Inter, Manrope, Shantell_Sans } from "next/font/google";
import { SiteHeader, SiteFooter } from "@/components/Chrome";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const shantell = Shantell_Sans({
  subsets: ["latin"],
  variable: "--font-shantell",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MathsGenie (Recreation) - Free Online GCSE and A Level Maths Revision",
    template: "%s | MathsGenie Recreation",
  },
  description:
    "An educational recreation of mathsgenie.co.uk built from reverse-engineered data: videos and worksheets for every topic by grade, plus past papers and mark schemes. All resources link back to the original site.",
  metadataBase: new URL("https://github.com/SyllabAI/MathsGenie"),
};

const themeInit = `(function(){try{var t=localStorage.getItem('mg-theme');if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${manrope.variable} ${shantell.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-ink focus:text-paper focus:px-3 focus:py-1.5 focus:rounded-lg"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <CookieBanner />
      </body>
    </html>
  );
}
