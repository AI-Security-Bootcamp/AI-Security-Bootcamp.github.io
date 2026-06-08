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

type Asset = {
  title: string;
  subtitle: string;
  file: string; // base name in /public/brand, without extension
  bg: "light" | "dark";
};

const logos: Asset[] = [
  { title: "Primary logo", subtitle: "On light backgrounds", file: "aisb-logo-light", bg: "light" },
  { title: "Primary logo", subtitle: "On dark backgrounds", file: "aisb-logo-dark", bg: "dark" },
  { title: "Logo — transparent", subtitle: "For your own light backgrounds", file: "aisb-logo-on-light", bg: "light" },
  { title: "Logo — transparent", subtitle: "For your own dark backgrounds", file: "aisb-logo-on-dark", bg: "dark" },
];

const icons: Asset[] = [
  { title: "Icon — circle", subtitle: "Light", file: "aisb-icon-circle-light", bg: "light" },
  { title: "Icon — circle", subtitle: "Dark", file: "aisb-icon-circle-dark", bg: "dark" },
  { title: "Icon — square", subtitle: "Light", file: "aisb-icon-square-light", bg: "light" },
  { title: "Icon — square", subtitle: "Dark", file: "aisb-icon-square-dark", bg: "dark" },
];

const colors = [
  { name: "AISB Red", hex: "#EF4444" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
];

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

function AssetCard({ asset }: { asset: Asset }) {
  return (
    <div className="border-2 border-black dark:border-white flex flex-col">
      <div
        className={`flex items-center justify-center p-12 ${
          asset.bg === "dark" ? "bg-neutral-900" : "bg-neutral-100"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/brand/${asset.file}.svg`}
          alt={`${asset.title} (${asset.subtitle})`}
          className="max-h-32 w-auto object-contain"
        />
      </div>
      <div className="border-t-2 border-black dark:border-white p-6">
        <p className="text-[#ef4444] font-black text-xs uppercase tracking-widest mb-1">
          {asset.subtitle}
        </p>
        <h3 className="text-lg font-black mb-4">{asset.title}</h3>
        <div className="flex gap-3">
          <DownloadButton href={`/brand/${asset.file}.svg`} label="SVG" />
          <DownloadButton href={`/brand/${asset.file}.png`} label="PNG" />
        </div>
      </div>
    </div>
  );
}

function ColorSwatch({ name, hex }: { name: string; hex: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(hex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      onClick={copy}
      className="border-2 border-black dark:border-white flex flex-col text-left group"
      aria-label={`Copy ${name} hex ${hex}`}
    >
      <div className="h-28" style={{ backgroundColor: hex }} />
      <div className="border-t-2 border-black dark:border-white p-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-black text-sm">{name}</p>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs uppercase tracking-widest font-bold">
            {hex}
          </p>
        </div>
        <span className="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 group-hover:text-[#ef4444] transition-colors">
          {copied ? "Copied" : "Copy"}
        </span>
      </div>
    </button>
  );
}

export default function BrandPage() {
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
            Brand<span className="text-[#ef4444]">.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed">
            Logos, icons, and colours for the AI Security Bootcamp. Download the
            format you need &mdash; SVG for print and scaling, PNG for everything else.
            Please don&apos;t stretch, recolour, or alter the marks.
          </p>
        </div>
      </section>

      {/* Logos */}
      <section className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-black dark:border-white">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-10 tracking-tight">
          Logos
        </h2>
        <div className="grid gap-6 md:grid-cols-2 max-w-5xl">
          {logos.map((asset) => (
            <AssetCard key={asset.file} asset={asset} />
          ))}
        </div>
      </section>

      {/* Icons */}
      <section className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-black dark:border-white">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-10 tracking-tight">
          Icons
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl">
          {icons.map((asset) => (
            <AssetCard key={asset.file} asset={asset} />
          ))}
        </div>
      </section>

      {/* Colours */}
      <section className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-black dark:border-white">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-10 tracking-tight">
          Colours
        </h2>
        <div className="grid gap-6 sm:grid-cols-3 max-w-3xl">
          {colors.map((color) => (
            <ColorSwatch key={color.hex} name={color.name} hex={color.hex} />
          ))}
        </div>
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
