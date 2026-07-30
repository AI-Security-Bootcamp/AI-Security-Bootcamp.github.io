"use client";

import { useState, useEffect } from "react";

function useTheme() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      setIsDark(saved === "dark");
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark, mounted]);

  const toggle = () => setIsDark((d) => !d);

  return { isDark, toggle, mounted };
}

function ThemeToggle({ isDark, toggle }: { isDark: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="fixed top-6 right-6 z-50 flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest rounded-full border-2 border-neutral-300 dark:border-neutral-600 bg-white/80 dark:bg-black/80 backdrop-blur text-neutral-700 dark:text-neutral-300 hover:border-[#ef4444] hover:text-[#ef4444] dark:hover:border-[#ef4444] dark:hover:text-[#ef4444] transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

function DownloadButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      download
      className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-black dark:border-white text-black dark:text-white font-black text-xs uppercase tracking-widest px-4 py-3 bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
      </svg>
      {label}
    </a>
  );
}

type Doc = {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  label: string;
};

const docs: Doc[] = [
  {
    title: "Schematic",
    subtitle: "KiCad source",
    description:
      "The full badge schematic: panel connector, high-voltage support circuit, Tag-Connect programming target, and the optional J4 header. Opens in KiCad 7 or later (free at kicad.org).",
    href: "/badge0/vegas26-badge.kicad_sch",
    label: "kicad_sch",
  },
  {
    title: "Pinout",
    subtitle: "Programming interface",
    description:
      "Pin allocation for the J3 Tag-Connect programming target and the optional J4 harness, plus the safe power-up and refresh sequence for the panel.",
    href: "/badge0/vegas26-badge-pinout.md",
    label: "Markdown",
  },
];

function DocCard({ doc }: { doc: Doc }) {
  return (
    <div className="border-2 border-black dark:border-white p-6 flex flex-col">
      <p className="text-[#ef4444] font-black text-xs uppercase tracking-widest mb-1">
        {doc.subtitle}
      </p>
      <h3 className="text-lg font-black mb-3">{doc.title}</h3>
      <p className="text-neutral-600 dark:text-neutral-300 text-base leading-relaxed mb-6">
        {doc.description}
      </p>
      <div className="flex gap-3 mt-auto">
        <DownloadButton href={doc.href} label={doc.label} />
      </div>
    </div>
  );
}

export default function Badge0Page() {
  const { isDark, toggle, mounted } = useTheme();

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen font-sans transition-colors">
      {mounted && <ThemeToggle isDark={isDark} toggle={toggle} />}

      {/* Back banner */}
      <a
        href="/"
        className="block w-full bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-3 text-center text-sm text-neutral-500 dark:text-neutral-400 hover:text-[#ef4444] dark:hover:text-[#ef4444] transition-colors"
      >
        <span className="inline-block">&larr;</span> Back to AISB
      </a>

      {/* Hero */}
      <section className="px-6 md:px-16 lg:px-24 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-8">
            Badge0<span className="text-[#ef4444]">.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed mb-4">
            Hello there. Looks like you&apos;ve encountered the AISB Badge0.
            This page is for the schematics of the badge if you want to tinker
            with it, and to tell you more about AISB.
          </p>
          <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed mb-8">
            The badge is a 100 x 145 mm board built around a Waveshare 3.52-inch
            raw black/white e-paper panel. There is no microcontroller, USB
            port, or battery on the badge: a reusable external programmer
            writes each name over SPI through a Tag-Connect target, and the
            image persists after power is removed. The upper PCB stays visible
            for the AISB logo and copper artwork, and a passive two-layer
            pickup coil doubles as an electromagnetic audio sensor.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/"
              className="inline-block bg-[#ef4444] text-white font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-red-600 transition-colors"
            >
              What is AISB
            </a>
            <a
              href="#badge-details"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("badge-details")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-block border-2 border-black dark:border-white text-black dark:text-white font-black text-sm uppercase tracking-widest px-8 py-4 bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              More about the Badge0
            </a>
          </div>
        </div>
      </section>

      {/* Schematics & docs */}
      <section
        id="badge-details"
        className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-black dark:border-white"
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-10 tracking-tight">
          Schematic &amp; Docs
        </h2>
        <div className="border-2 border-black dark:border-white flex flex-col max-w-5xl mb-6">
          <a
            href="/badge0/vegas26-badge-schematic.svg"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white p-4 md:p-6"
            aria-label="Open full-size schematic"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/badge0/vegas26-badge-schematic.svg"
              alt="Badge0 schematic, revision 2: e-paper panel connector, controller contacts, boost converter, and pickup coil"
              className="w-full h-auto"
            />
          </a>
          <div className="border-t-2 border-black dark:border-white p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <p className="text-[#ef4444] font-black text-xs uppercase tracking-widest mb-1">
                Rev 2
              </p>
              <h3 className="text-lg font-black">Full schematic</h3>
            </div>
            <div className="flex gap-3">
              <DownloadButton href="/badge0/vegas26-badge-schematic.svg" label="SVG" />
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 max-w-5xl">
          {docs.map((doc) => (
            <DocCard key={doc.title} doc={doc} />
          ))}
        </div>
        <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg leading-relaxed mt-10 max-w-2xl">
          Questions about
          the design? Email{" "}
          <a
            href="mailto:pranav@aisb.dev"
            className="underline hover:text-[#ef4444] transition-colors"
          >
            pranav@aisb.dev
          </a>
          .
        </p>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-16 lg:px-24 py-8 border-t-2 border-black dark:border-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-neutral-400 dark:text-neutral-600 text-sm font-bold tracking-widest">
          AI Security Bootcamp is fiscally sponsored by{" "}
          <a
            href="https://bluedot.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#ef4444] transition-colors"
          >
            BlueDot Impact
          </a>
          .
        </p>
        <div className="flex flex-wrap gap-6">
          <a
            href="/"
            className="text-neutral-400 dark:text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
          >
            Home
          </a>
          <a
            href="/vegas26"
            className="text-neutral-400 dark:text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
          >
            Vegas 2026
          </a>
          <a
            href="/staff"
            className="text-neutral-400 dark:text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
          >
            Staff
          </a>
          <a
            href="/privacy"
            className="text-neutral-400 dark:text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
          >
            Privacy
          </a>
        </div>
      </footer>
    </div>
  );
}
