import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import { FilmCursor } from "@/components/effects/film-cursor";
import { InkSpillToggle } from "@/components/theme/ink-spill-toggle";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Grain } from "@/components/ui/grain";
import { themeInitScript } from "@/lib/theme/cookie";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Achyuth Sreenath — AI Engineer, Bengaluru",
  description:
    "AI engineer building agentic systems, RAG and voice AI that ship to production. Resume, case studies and a chatbot you can question.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f3ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        {/* Restores the theme from the cookie before first paint; pages stay static. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="label sr-only fixed left-4 top-4 z-[80] rounded-[var(--radius-sm)] bg-fg px-3 py-2 text-bg focus:not-sr-only"
        >
          Skip to content
        </a>
        <ThemeProvider>
          {children}
          {/* The theme switch lives in the top-right corner on every page. */}
          <div className="fixed right-4 top-4 z-[60] md:right-6 md:top-6">
            <InkSpillToggle className="glass" />
          </div>
          <FilmCursor />
        </ThemeProvider>
        <Grain />
      </body>
    </html>
  );
}
