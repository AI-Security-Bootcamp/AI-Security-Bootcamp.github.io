"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import type { Cohort } from "../../../lib/cohorts";

function useTheme() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setIsDark(
      saved === "dark" ||
        (saved !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches),
    );
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark, mounted]);

  return { isDark, mounted, toggle: () => setIsDark((value) => !value) };
}

function ThemeToggle({ isDark, toggle }: { isDark: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="fixed top-6 right-6 z-50 flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest rounded-full border-2 border-neutral-300 dark:border-neutral-600 bg-white/80 dark:bg-black/80 backdrop-blur text-neutral-700 dark:text-neutral-300 hover:border-[#ef4444] hover:text-[#ef4444] transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}

export function ProgramIndex({
  eyebrow,
  title,
  description,
  programs,
  analyticsLocation,
}: {
  eyebrow: string;
  title: string;
  description: string;
  programs: Cohort[];
  analyticsLocation: string;
}) {
  const { isDark, mounted, toggle } = useTheme();

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen font-sans transition-colors">
      {mounted && <ThemeToggle isDark={isDark} toggle={toggle} />}

      <header className="px-6 md:px-16 lg:px-24 pt-10 pb-16 border-b-2 border-black dark:border-white">
        <a
          href="/"
          className="inline-block text-sm font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 hover:text-[#ef4444] mb-16 transition-colors"
        >
          &larr; Home
        </a>
        <div className="max-w-4xl">
          <p className="text-[#ef4444] font-black text-sm uppercase tracking-widest mb-3">
            {eyebrow}
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.95] tracking-tight mb-6">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>
      </header>

      <main className="px-6 md:px-16 lg:px-24 py-16 md:py-20">
        <div className="max-w-5xl grid gap-6 md:grid-cols-2">
          {programs.map((program) => (
            <a
              key={program.id}
              href={program.href}
              onClick={() => {
                posthog.capture("clicked_edition", {
                  edition: program.analyticsId,
                  location: analyticsLocation,
                });
              }}
              className="group border-2 border-black dark:border-white p-6 md:p-8 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              <p className="text-[#ef4444] font-black text-xs uppercase tracking-widest mb-3">
                {program.monthLabel} {program.year} &middot; {program.location}
              </p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4">
                {program.name}
              </h2>
              <p className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-300 dark:group-hover:text-neutral-600 mb-4">
                {program.detail}
              </p>
              <p className="text-neutral-600 dark:text-neutral-300 group-hover:text-neutral-200 dark:group-hover:text-neutral-700 leading-relaxed">
                {program.description}
              </p>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
