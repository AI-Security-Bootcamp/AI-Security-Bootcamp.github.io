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

export default function PrivacyPolicy() {
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
            Privacy Policy<span className="text-[#ef4444]">.</span>
          </h1>
          <p className="text-sm uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold">
            Last updated 9 June 2026
          </p>
        </div>
      </section>

      {/* Body */}
      <div className="px-6 md:px-16 lg:px-24 pb-20 border-t-2 border-black dark:border-white pt-16">
        <div className="max-w-3xl">
          <Section title="Who we are">
            <p>
              The AI Security Bootcamp (&ldquo;AISB&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a
              program fiscally sponsored by{" "}
              <a href="https://bluedot.org" target="_blank" rel="noopener noreferrer" className={linkClass}>
                BlueDot Impact
              </a>
              . This policy explains what personal information we collect through this website
              (aisb.dev) and our application and program processes, how we use it, and who we share it
              with.
            </p>
            <p>
              Because AISB operates under BlueDot Impact&apos;s fiscal sponsorship, we might share your
              information with BlueDot Impact, and BlueDot Impact&apos;s{" "}
              <a href="https://bluedot.org/privacy-policy" target="_blank" rel="noopener noreferrer" className={linkClass}>
                Privacy Policy
              </a>{" "}
              also applies to its processing of your information.
            </p>
          </Section>

          <Section title="Information we collect">
            <p>
              We collect personal information when you interact with us &mdash; for example when you
              visit our website, apply to or take part in a program, sign up to hear from us,
              communicate with us by email, messaging and chat platforms, or video and phone calls, take
              part in interviews, surveys, or events, or otherwise engage with AISB, whether online or in
              person. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-bold text-black dark:text-white">Information you provide.</span>{" "}
                Information you choose to share with us through these interactions, such as your contact
                details and any other information you give us as part of your application, communications,
                and participation in our programs and community.
              </li>
              <li>
                <span className="font-bold text-black dark:text-white">Information we collect
                automatically.</span>{" "}
                Technical and usage information about your device and how you interact with our website,
                collected through our privacy-friendly, cookieless analytics.
              </li>
            </ul>
          </Section>

          <Section title="How we use your information">
            <p>We use personal information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>assess applications and run our selection process;</li>
              <li>operate, administer, and deliver our programs and events;</li>
              <li>communicate with you and respond to your enquiries;</li>
              <li>understand and improve our website, programs, and communications;</li>
              <li>keep our community and events safe; and</li>
              <li>comply with our legal and regulatory obligations.</li>
            </ul>
          </Section>

          <Section title="Our lawful bases for processing">
            <p>
              Where the UK or EU GDPR applies, we rely on one or more of the following lawful bases when
              we process your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-bold text-black dark:text-white">Consent</span> &mdash; for
                example, for optional communications, non-essential cookies, and publishing certain
                information about you;
              </li>
              <li>
                <span className="font-bold text-black dark:text-white">Performance of a contract</span>{" "}
                &mdash; to assess your application and to deliver the program to participants;
              </li>
              <li>
                <span className="font-bold text-black dark:text-white">Legitimate interests</span>{" "}
                &mdash; to operate, secure, promote, and improve AISB and to communicate with our
                community, balanced against your rights and interests; and
              </li>
              <li>
                <span className="font-bold text-black dark:text-white">Legal obligation</span> &mdash;
                to comply with applicable laws and regulatory requirements.
              </li>
            </ul>
          </Section>

          <Section title="How we share your information">
            <p>We share personal information in the following ways:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-bold text-black dark:text-white">BlueDot Impact.</span>{" "}
                As our fiscal sponsor and operating partner, BlueDot Impact processes personal
                information on our behalf and in its own right. BlueDot Impact&apos;s{" "}
                <a href="https://bluedot.org/privacy-policy" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Privacy Policy
                </a>{" "}
                applies to that processing.
              </li>
              <li>
                <span className="font-bold text-black dark:text-white">Service providers and other
                third parties.</span>{" "}
                We work with third parties who help us operate AISB, our website, and our programs, and
                we may share personal information with them for those purposes. We may also share
                information with partner organisations we work with to deliver programs, and with other
                third parties where appropriate. Some of these third parties may also process your
                information for their own purposes.
              </li>
              <li>
                <span className="font-bold text-black dark:text-white">Publicity.</span>{" "}
                We may publish information about our staff and participants &mdash; such as names,
                photos, professional affiliations, and testimonials &mdash; and photos or recordings
                from our events, on our website and social media. Where required, we ask for your consent
                first.
              </li>
              <li>
                <span className="font-bold text-black dark:text-white">Legal and safety.</span>{" "}
                We may share information where we believe it is necessary to comply with the law, enforce
                our terms, or protect the rights, property, or safety of AISB, our participants, or
                others.
              </li>
              <li>
                <span className="font-bold text-black dark:text-white">Business transfers.</span>{" "}
                If AISB or its activities are reorganised or transferred, personal information may be
                transferred as part of that process.
              </li>
            </ul>
            <p>We do not sell your personal information.</p>
          </Section>

          <Section title="Cookies and analytics">
            <p>
              We use privacy-friendly analytics (PostHog) to understand how our website is used and to
              improve it. We run it in a cookieless mode, so it does not store cookies on your device or
              track you across other websites. We also use your browser&apos;s local storage for
              essential features, such as remembering your light or dark theme preference. We do not use
              advertising cookies.
            </p>
          </Section>

          <Section title="How long we keep your information">
            <p>
              We keep personal information only for as long as necessary for the purposes in this policy
              &mdash; for example, to maintain our alumni community and records, inform you of future
              programmes, and meet legal and record-keeping obligations (such as keeping financial
              records for the period required by law). We delete or anonymise information when we no
              longer need it, and you can ask us to delete your information at any time using the details
              below.
            </p>
          </Section>

          <Section title="Your rights">
            <p>
              Depending on where you live, you may have rights over your personal information, including
              the right to access, correct, delete, or restrict the processing of your information, to
              object to certain processing, and to data portability. Applicable data protection law,
              including the UK and EU GDPR, may apply to BlueDot Impact&apos;s processing of your
              information. To exercise any of these rights, contact us using the details below. If you
              are in the UK or EEA, you also have the right to lodge a complaint with your local data
              protection authority (in the UK, the Information Commissioner&apos;s Office).
            </p>
          </Section>

          <Section title="Keeping your information secure">
            <p>
              We use appropriate technical and organisational measures to protect personal information,
              and limit access to those who need it. No method of transmission or storage is completely
              secure, so we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="International transfers">
            <p>
              We and our service providers may process personal information in countries other than your
              own. Where personal information is transferred internationally, we rely on appropriate
              safeguards as required by applicable law.
            </p>
          </Section>

          <Section title="Children">
            <p>
              AISB is intended for professionals aged 18 and over. We do not knowingly collect personal
              information from children.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We may update this policy from time to time. When we do, we will revise the &ldquo;last
              updated&rdquo; date above and post the new version on this page.
            </p>
          </Section>

          <Section title="Contact us">
            <p>
              If you have any questions about this policy or how we handle your personal information,
              contact us at{" "}
              <a href="mailto:privacy@aisb.dev" className={linkClass}>
                privacy@aisb.dev
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
            href="/terms"
            className="text-neutral-400 dark:text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
          >
            Terms of Use
          </a>
        </div>
      </footer>
    </div>
  );
}
