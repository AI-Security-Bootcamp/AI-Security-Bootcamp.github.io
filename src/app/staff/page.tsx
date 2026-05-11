"use client";

import { useState, useEffect } from "react";
import { programmes, type StaffAppearance } from "../../lib/staff";

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
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

function StaffCard({ member }: { member: StaffAppearance }) {
  return (
    <div className="border-2 border-black dark:border-white p-8 flex items-start gap-6">
      {member.image ? (
        <img
          src={member.image}
          alt={member.name}
          className="w-20 h-20 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 flex items-center justify-center text-xs font-black tracking-widest text-neutral-400 dark:text-neutral-500">
          {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-xl md:text-2xl font-black mb-3">{member.name}</h3>
        <div className="text-neutral-600 dark:text-neutral-300 text-base leading-relaxed space-y-3">
          {member.bio.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StaffPage() {
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
            Staff<span className="text-[#ef4444]">.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed">
            Everyone who has helped run AISB cohorts &mdash; grouped by programme.
          </p>
        </div>
      </section>

      {/* Programme sections */}
      {programmes.map((programme) => (
        <section
          key={programme.slug}
          className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-black dark:border-white"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-10 tracking-tight">
            {programme.name}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 max-w-5xl">
            {programme.staff.map((member) => (
              <StaffCard key={`${programme.slug}-${member.name}`} member={member} />
            ))}
          </div>
        </section>
      ))}

      {/* Footer */}
      <footer className="px-6 md:px-16 lg:px-24 py-8 border-t-2 border-black dark:border-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-neutral-400 dark:text-neutral-600 text-sm font-bold tracking-widest">
          &copy; AI Security Bootcamp
        </p>
        <div className="flex flex-wrap gap-6">
          <a
            href="/"
            className="text-neutral-400 dark:text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
          >
            Home
          </a>
          <a
            href="/2025"
            className="text-neutral-400 dark:text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
          >
            London 2025
          </a>
          <a
            href="/singapore"
            className="text-neutral-400 dark:text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
          >
            Singapore 2026
          </a>
        </div>
      </footer>
    </div>
  );
}
