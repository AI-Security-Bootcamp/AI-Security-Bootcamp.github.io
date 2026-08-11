"use client";

import { useState, useEffect } from "react";

const VISIT_FORM_EMBED_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfR360NeQQiVltfCOdrRR93ZQTTNdL4vPAhx6HbqsmYT8uhrw/viewform?embedded=true";

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

export default function GuestVisit() {
  const { isDark, toggle, mounted } = useTheme();

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen font-sans transition-colors">
      {mounted && <ThemeToggle isDark={isDark} toggle={toggle} />}

      {/* Back link */}
      <a
        href="/"
        className="block w-full bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 py-3 text-center text-sm text-neutral-500 dark:text-neutral-400 hover:text-[#ef4444] dark:hover:text-[#ef4444] transition-colors"
      >
        <span className="inline-block">&larr;</span> Back to main page
      </a>

      <section className="px-6 md:px-16 lg:px-24 py-20">
        <div className="max-w-3xl">
          <p className="text-[#ef4444] font-black text-sm uppercase tracking-widest mb-3">
            London &middot; August 30 to September 5, 2026
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-[0.95] tracking-tight mb-8">
            Visit AISB in London
          </h1>

          <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mb-4 leading-relaxed">
            Our next{" "}
            <a href="/london26" className="underline hover:text-[#ef4444] transition-colors">
              AI Security Bootcamp
            </a>{" "}
            (AISB) is in London: a 7-day intensive program for security professionals shaping how
            we secure emerging AI systems.
          </p>

          <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
            If you&apos;ll be in London and would like to drop by, say hi, and meet the cohort, fill
            in the form below with the dates you&apos;d like to visit.
          </p>

          <div className="border-2 border-black dark:border-white p-6 md:p-8 mb-10 max-w-2xl">
            <p className="text-sm font-black uppercase tracking-widest mb-4">
              Visiting hours
            </p>
            <ul className="space-y-3 text-neutral-600 dark:text-neutral-400 text-base md:text-lg leading-relaxed">
              <li>
                <span className="font-bold text-black dark:text-white">Lunch:</span> 12:30-1:30pm
              </li>
              <li>
                <span className="font-bold text-black dark:text-white">Dinner:</span> from 7pm
              </li>
            </ul>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base leading-relaxed mt-4">
              Between lunch and dinner is deep work time; expect approximately zero
              socialization, so please plan visits around meals.
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base leading-relaxed mt-3">
              Spaces are limited, so please visit earlier in the week if you can. After you submit
              the form, we&apos;ll get in touch to confirm if we have space.
            </p>
          </div>
        </div>

        <div className="max-w-3xl">
          <iframe
            src={VISIT_FORM_EMBED_URL}
            width="100%"
            height="800"
            className="border-2 border-black dark:border-white"
            title="AISB London Guest Visit Form"
          >
            Loading...
          </iframe>
        </div>
      </section>

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
            href="/london26"
            className="text-neutral-400 dark:text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
          >
            London 2026
          </a>
          <a
            href="/eoi"
            className="text-neutral-400 dark:text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
          >
            Expression of Interest
          </a>
          <a
            href="/staff"
            className="text-neutral-400 dark:text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
          >
            Staff
          </a>
        </div>
      </footer>
    </div>
  );
}
