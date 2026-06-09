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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-black mb-4 tracking-tight">{title}</h2>
      <div className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
}

const linkClass = "underline hover:text-[#ef4444] transition-colors";

export default function TermsOfUse() {
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
      <section className="px-6 md:px-16 lg:px-24 pt-20 pb-12">
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.95] tracking-tight mb-6">
            Terms of Use<span className="text-[#ef4444]">.</span>
          </h1>
          <p className="text-sm uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold">
            Last updated 9 June 2026
          </p>
        </div>
      </section>

      {/* Body */}
      <div className="px-6 md:px-16 lg:px-24 pb-20 border-t-2 border-black dark:border-white pt-16">
        <div className="max-w-3xl">
          <Section title="About these terms">
            <p>
              These Terms of Use govern your use of the AI Security Bootcamp website at aisb.dev (the
              &ldquo;Site&rdquo;) and your participation in our application process and programs. By
              using the Site or applying to a program, you agree to these terms. If you do not agree,
              please do not use the Site.
            </p>
          </Section>

          <Section title="Who we are">
            <p>
              The AI Security Bootcamp (&ldquo;AISB&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a
              program fiscally sponsored by{" "}
              <a href="https://bluedot.org" target="_blank" rel="noopener noreferrer" className={linkClass}>
                BlueDot Impact
              </a>
              .
            </p>
          </Section>

          <Section title="Using the Site">
            <p>You agree to use the Site lawfully and not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>use the Site in any way that breaches applicable laws or regulations;</li>
              <li>attempt to gain unauthorised access to, interfere with, or disrupt the Site or its underlying systems;</li>
              <li>scrape, harvest, or collect data from the Site except as expressly permitted; or</li>
              <li>introduce malware or otherwise misuse the Site.</li>
            </ul>
          </Section>

          <Section title="Applications and participation">
            <p>
              Eligibility, selection, and admission to any cohort are at our discretion, and applying
              does not guarantee a place. You agree to provide accurate and complete information in your
              application and during the program. We may change, postpone, or cancel a cohort, or modify
              the curriculum, schedule, location, or staff, and we may withdraw a place or remove a
              participant where reasonably necessary, including for breach of these terms or any program
              code of conduct.
            </p>
          </Section>

          <Section title="Intellectual property">
            <p>
              Unless stated otherwise, the content on this Site &mdash; including text, design, logos,
              and brand assets &mdash; belongs to AISB, or is used with permission.
              Our brand assets are made available on our{" "}
              <a href="/brand" className={linkClass}>
                brand page
              </a>{" "}
              for the uses described there. Course materials may be made available under their own
              licence terms (for example, the curriculum published on our public code repository), which
              govern your use of those materials.
            </p>
          </Section>

          <Section title="Your submissions">
            <p>
              You keep ownership of the materials you submit to us. By submitting them, you grant us a
              licence to use them for the purposes of running, evaluating, and improving our programs, as
              described in our{" "}
              <a href="/privacy" className={linkClass}>
                Privacy Policy
              </a>
              . You are responsible for the content you submit and confirm you have the right to share
              it.
            </p>
          </Section>

          <Section title="Third-party links and services">
            <p>
              The Site links to and relies on third-party websites and services. We are not responsible
              for the content, availability, or practices of those third parties, and your use of them is
              subject to their own terms and policies.
            </p>
          </Section>

          <Section title="Disclaimers">
            <p>
              The Site and its content are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
              without warranties of any kind, whether express or implied, to the fullest extent
              permitted by law. We do not warrant that the Site will be uninterrupted, error-free, or
              free of harmful components.
            </p>
          </Section>

          <Section title="Limitation of liability">
            <p>
              To the fullest extent permitted by law, AISB and BlueDot Impact will not be liable for any
              indirect, incidental, special, or consequential damages, or any loss of data, arising out
              of or in connection with your use of the Site.
            </p>
          </Section>

          <Section title="Privacy">
            <p>
              Our{" "}
              <a href="/privacy" className={linkClass}>
                Privacy Policy
              </a>{" "}
              explains how we collect and use personal information, including how we share information
              with BlueDot Impact and other third parties. By using the Site you also acknowledge that
              policy.
            </p>
          </Section>

          <Section title="Changes to these terms">
            <p>
              We may update these terms from time to time. When we do, we will revise the &ldquo;last
              updated&rdquo; date above and post the new version on this page. Your continued use of the
              Site after changes take effect means you accept the updated terms.
            </p>
          </Section>

          <Section title="Governing law">
            <p>
              These terms are governed by the laws of England and Wales, and the courts of England and
              Wales will have jurisdiction over any dispute, unless mandatory local law provides
              otherwise.
            </p>
          </Section>

          <Section title="Contact us">
            <p>
              Questions about these terms? Contact us at{" "}
              <a href="mailto:pranav@aisb.dev" className={linkClass}>
                pranav@aisb.dev
              </a>
              .
            </p>
          </Section>
        </div>
      </div>

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
            href="/privacy"
            className="text-neutral-400 dark:text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
          >
            Privacy Policy
          </a>
        </div>
      </footer>
    </div>
  );
}
