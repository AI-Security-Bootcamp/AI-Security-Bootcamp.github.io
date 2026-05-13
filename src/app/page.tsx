"use client";

import { useState, useEffect, useRef } from "react";
import posthog from "posthog-js";

const editions = [
  {
    name: "AISB Singapore",
    year: "2026",
    href: "/singapore",
    detail: "7-day intensive · 16 participants · April 2026",
    description:
      "A focused practitioner cohort run alongside Black Hat Asia. Threat modelling, adversarial attacks, LLM and infrastructure security.",
  },
  {
    name: "AISB London",
    year: "2025",
    href: "/2025",
    detail: "4-week intensive · 20 participants · August 2025",
    description:
      "The first AISB cohort. Four weeks of security fundamentals, infrastructure, and AI-specific threats \u2014 culminating in a week of capstone projects.",
  },
];

const faqs = [
  {
    q: "What is AISB?",
    a: "The AI Security Bootcamp is an intensive, in-person program for security professionals working at the frontier of AI \u2014 the attack surfaces, control mechanisms, and governance challenges that become critical as AI systems grow more capable. We run cohorts in different cities; each is fully funded for accepted participants.",
  },
  {
    q: "Who else will be in the room?",
    a: "Senior security professionals from across the stack \u2014 offensive and defensive, application and infrastructure, detection and response. Cohort sizes are intentionally small so peer learning is a meaningful part of the experience. We aim to bring security professionals and researchers working on frontier AI systems together.",
  },
  {
    q: "What does \u201cfrontier AI security\u201d mean in practice?",
    a: "It means engaging with the threat models that matter as AI systems become more capable \u2014 not just today\u2019s enterprise LLM deployments, but the attack surfaces, control mechanisms, and governance challenges that become critical as systems grow more powerful.",
  },
  {
    q: "How are participants selected?",
    a: "Selection is competitive. Each cohort runs its own application process, typically including a coding test and a short interview. Selection prioritises candidates with substantial security experience and an interest in frontier AI risk, high-consequence failure modes, or work involving sophisticated threat actors.",
  },
  {
    q: "Does the program cover accommodation and travel?",
    a: "Accommodation is included for all in-person cohorts. We have limited travel support available for those who need it. Program costs are fully covered for accepted participants.",
  },
  {
    q: "What happens after the program?",
    a: "Participants join a network of AISB alumni across cohorts. We share relevant opportunities in AI security research, fellowship programs, and organisations working on frontier AI security challenges.",
  },
  {
    q: "How do I apply or stay informed about future cohorts?",
    a: "Submit an expression of interest and we\u2019ll keep you in the loop on upcoming editions. Or email pranav@aisb.dev with any questions.",
  },
];

const affiliationLogos = [
  { src: "/logos/Amazon Web Services_idS5TK0MYh_0.svg", alt: "Amazon Web Services (AWS)" },
  { src: "/logos/Apollo Research_id9k8Tjo3P_0.svg", alt: "Apollo Research" },
  { src: "/logos/Apple_Logo_0.svg", alt: "Apple" },
  { src: "/logos/CERN_idmu7jJEuK_2.svg", alt: "CERN" },
  { src: "/logos/Epoch AI_id_yy1RAHp_1.svg", alt: "Epoch AI" },
  { src: "/logos/FGV_id4G57V8yv_1.svg", alt: "Fundação Getulio Vargas (FGV)" },
  { src: "/logos/Fraunhofer-Gesellschaft_idr7l_79Zp_1.svg", alt: "Fraunhofer-Gesellschaft" },
  { src: "/logos/Georgia Tech_idm_h5bYQz_2.svg", alt: "Georgia Institute of Technology" },
  { src: "/logos/Google_Logo_0.svg", alt: "Google" },
  { src: "/logos/Helsinki_idgYlvoExA_2.svg", alt: "University of Helsinki" },
  { src: "/logos/INSA Lyon_idrA1ZnHFE_2.svg", alt: "INSA Lyon" },
  { src: "/logos/Jane Street_id3GLGPSzf_0.svg", alt: "Jane Street" },
  { src: "/logos/King_s College London_idPXgHZWxe_2.svg", alt: "King's College London" },
  { src: "/logos/Meta_idwdgcJw5c_4.svg", alt: "Meta" },
  { src: "/logos/Microsoft_Logo_0.svg", alt: "Microsoft" },
  { src: "/logos/OpenAI_Logo_0.svg", alt: "OpenAI" },
  { src: "/logos/SaferAI_idJL4whjWU_1.svg", alt: "Safer AI" },
  { src: "/logos/Santa Fe Institute_idLoL6oKVJ_2.svg", alt: "Santa Fe Institute" },
  { src: "/logos/Stanford University_idJUIPPYM3_1.svg", alt: "Stanford University" },
  { src: "/logos/UC San Diego_idxlKuXNo7_2.svg", alt: "University of California, San Diego" },
  { src: "/logos/Unibo_idOu3rBjwY_1.svg", alt: "Alma Mater Studiorum — Università di Bologna" },
  { src: "/logos/University of Oxford_Icon_1.svg", alt: "University of Oxford" },
  { src: "/logos/University of Washington_id-HgUwUZo_1.svg", alt: "University of Washington" },
];

function LogoCarousel() {
  return (
    <div className="pb-10 -mx-6 md:-mx-16 lg:-mx-24 overflow-hidden">
      <div className="border-t-2 border-black dark:border-white" />
      <p className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-bold text-center mt-4 mb-4">
        Past participants have been affiliated with
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white dark:from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white dark:from-black to-transparent z-10 pointer-events-none" />
        <div className="logo-carousel-track flex items-center gap-12 md:gap-16 w-max">
          {[...affiliationLogos, ...affiliationLogos].map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              title={logo.alt}
              className="h-8 md:h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity dark:invert dark:hue-rotate-180"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

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

function CohortsCarousel({ items }: { items: typeof editions }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 8);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
      setShowArrows(scrollWidth > clientWidth + 8);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items.length]);

  const scrollByOne = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const cardWidth = card ? card.clientWidth : 480;
    el.scrollBy({ left: dir * (cardWidth + 32), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((edition) => (
          <a
            key={edition.href}
            href={edition.href}
            className="block border-2 border-black dark:border-white p-8 hover:border-[#ef4444] dark:hover:border-[#ef4444] transition-colors group flex-shrink-0 snap-start w-[85vw] sm:w-[460px] md:w-[520px]"
          >
            <h3 className="text-2xl md:text-3xl font-black mb-2 group-hover:text-[#ef4444] transition-colors">
              {edition.name}{" "}
              <span className="text-neutral-400 dark:text-neutral-500">{edition.year}</span>
            </h3>
            <p className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-bold mb-6">
              {edition.detail}
            </p>
            <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed mb-6">
              {edition.description}
            </p>
            <span className="text-sm font-black uppercase tracking-widest text-black dark:text-white group-hover:text-[#ef4444] transition-colors">
              Read more &rarr;
            </span>
          </a>
        ))}
      </div>

      {showArrows && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => scrollByOne(-1)}
            disabled={!canScrollLeft}
            aria-label="Previous cohort"
            className="w-12 h-12 flex items-center justify-center border-2 border-black dark:border-white text-black dark:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#ef4444] hover:border-[#ef4444] dark:hover:text-[#ef4444] dark:hover:border-[#ef4444] transition-colors text-xl"
          >
            &larr;
          </button>
          <button
            onClick={() => scrollByOne(1)}
            disabled={!canScrollRight}
            aria-label="Next cohort"
            className="w-12 h-12 flex items-center justify-center border-2 border-black dark:border-white text-black dark:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:text-[#ef4444] hover:border-[#ef4444] dark:hover:text-[#ef4444] dark:hover:border-[#ef4444] transition-colors text-xl"
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b-2 border-black dark:border-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 px-0 text-left focus:outline-none"
      >
        <span className="text-black dark:text-white font-bold text-base md:text-lg pr-8">
          {q}
        </span>
        <span className="text-black dark:text-white text-3xl font-light leading-none select-none flex-shrink-0">
          {open ? "\u2212" : "+"}
        </span>
      </button>
      {open && (
        <p className="pb-6 text-neutral-600 dark:text-neutral-300 text-base leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
}

const teamFeatured = [
  {
    name: "Pranav Gade",
    role: "Program Lead",
    image: "/pranav.png",
    bio: "Research engineer at Conjecture. Created AISB to bridge AI safety and security; leads curriculum design and program direction.",
  },
  {
    name: "Jan Michelfeit",
    role: "Security Lead",
    image: "/jan.png",
    bio: "Security lead at Conjecture. Designs AISB\u2019s hands-on labs and capstone projects, drawing on 10+ years securing complex systems and ML infrastructure.",
  },
  {
    name: "David Williams-King",
    role: "Curriculum",
    image: "/david.png",
    bio: "Research Manager at ERA, upskilling fellows in technical AI safety research. PhD from Columbia in systems and security; previously CTO and cofounder of cybersecurity insurance startup Elpha Secure.",
  },
  {
    name: "Nitzan Shulman",
    role: "Security Lead, Singapore 2026",
    image: "/nitzan.png",
    bio: "Head of Cyber Security at Heron AI Security Initiative. 6+ years of security research specialising in IoT, robotics, malware, and AI security.",
  },
];

export default function Home() {
  const { isDark, toggle, mounted } = useTheme();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen font-sans transition-colors">
      {mounted && <ThemeToggle isDark={isDark} toggle={toggle} />}

      {/* ===================== HERO ===================== */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-10">
        <div className="max-w-5xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-8">
            AI Security
            <br />
            Bootcamp
          </h1>

          <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mb-6 leading-relaxed">
            Training professionals to shape how we secure frontier AI systems.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-widest mb-10">
            <span>Adversarial ML</span>
            <span className="text-[#ef4444]">|</span>
            <span>LLM Security</span>
            <span className="text-[#ef4444]">|</span>
            <span>Infrastructure &amp; Governance</span>
          </div>

          <div className="flex flex-col items-start gap-4 mb-12">
            <a
              href="/eoi"
              onClick={() => { posthog.capture("clicked_expression_of_interest", { location: "hero" }); window.gtag?.("event", "clicked_expression_of_interest", { location: "hero" }); }}
              className="inline-block bg-[#ef4444] text-white font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-red-600 transition-colors"
            >
              Expression of Interest
            </a>
            <a
              href="/2025"
              onClick={() => { posthog.capture("clicked_edition", { edition: "london_2025", location: "hero" }); window.gtag?.("event", "clicked_edition", { edition: "london_2025", location: "hero" }); }}
              className="inline-block border-2 border-black dark:border-white text-black dark:text-white font-black text-sm uppercase tracking-widest px-8 py-4 bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              AISB London 2025
            </a>
            <a
              href="/singapore"
              onClick={() => { posthog.capture("clicked_edition", { edition: "singapore_2026", location: "hero" }); window.gtag?.("event", "clicked_edition", { edition: "singapore_2026", location: "hero" }); }}
              className="inline-block border-2 border-black dark:border-white text-black dark:text-white font-black text-sm uppercase tracking-widest px-8 py-4 bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              AISB Singapore 2026
            </a>
          </div>
        </div>

        {/* ===================== AFFILIATIONS CAROUSEL ===================== */}
        <LogoCarousel />
      </section>

      {/* ===================== JUMP-TO NAV ===================== */}
      <nav className="px-6 md:px-16 lg:px-24 py-6 border-t-2 border-black dark:border-white flex flex-wrap gap-8">
        {[
          { label: "About", id: "about" },
          { label: "Past Cohorts", id: "cohorts" },
          { label: "Team", id: "team" },
          { label: "FAQs", id: "faqs" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="text-sm font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 hover:text-[#ef4444] transition-colors bg-transparent border-none cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* ===================== ABOUT ===================== */}
      <section
        id="about"
        className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-black dark:border-white"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-16 tracking-tight">
          About
        </h2>

        <div className="max-w-3xl space-y-6 text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed">
          <p>
            AISB exists to fill a gap. As AI systems become more capable and integrated into critical
            infrastructure, new attack surfaces and failure modes are emerging that traditional security
            training doesn&apos;t cover. We bring together experienced security professionals and
            equip them with the threat models, techniques, and hands-on skills needed to engage with
            the most pressing AI security challenges.
          </p>
          <p>
            Each cohort is small and intensive &mdash; designed so peer learning between practitioners
            is a meaningful part of the experience. Participants come from offensive security,
            incident response, threat intelligence, infrastructure, and application security
            backgrounds &mdash; the AI-specific material we cover pushes that experience into new
            territory.
          </p>
          <p>
            We run cohorts in different cities, partnering with local AI safety and security
            organisations. The program is fully funded for accepted participants &mdash; the cost is
            your time.
          </p>
        </div>
      </section>

      {/* ===================== PAST COHORTS ===================== */}
      <section
        id="cohorts"
        className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-black dark:border-white"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-16 tracking-tight">
          Past Cohorts
        </h2>

        <CohortsCarousel items={editions} />

        <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg leading-relaxed mt-12 max-w-3xl">
          Submit an{" "}
          <a href="/eoi" className="underline hover:text-[#ef4444] transition-colors">
            expression of interest
          </a>{" "}
          to stay up to date with future cohorts.
        </p>
      </section>

      {/* ===================== TEAM ===================== */}
      <section
        id="team"
        className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-black dark:border-white"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
          Team
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg leading-relaxed mb-16 max-w-3xl">
          AISB is led by a small core team that designs the curriculum and runs the program across
          editions. See the{" "}
          <a href="/staff" className="underline hover:text-[#ef4444] transition-colors">
            full staff list
          </a>{" "}
          for everyone who has helped run AISB cohorts.
        </p>

        <div className="grid gap-6 md:grid-cols-2 max-w-5xl">
          {teamFeatured.map((member) => (
            <div
              key={member.name}
              className="border-2 border-black dark:border-white p-8 flex items-start gap-6"
            >
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
              <div>
                <h3 className="text-xl md:text-2xl font-black mb-3">{member.name}</h3>
                <p className="text-neutral-600 dark:text-neutral-300 text-base leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        <a
          href="/staff"
          className="inline-block mt-10 text-sm font-black uppercase tracking-widest text-black dark:text-white hover:text-[#ef4444] transition-colors"
        >
          See full staff &rarr;
        </a>
      </section>

      {/* ===================== FAQs ===================== */}
      <section
        id="faqs"
        className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-black dark:border-white"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-16 tracking-tight">
          FAQs
        </h2>

        <div className="max-w-3xl border-t-2 border-black dark:border-white">
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-black dark:border-white">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 tracking-tight">
            Stay in the loop.
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg leading-relaxed mb-4 max-w-xl">
            Future cohorts will be announced as they&apos;re scheduled. Submit an expression of
            interest and we&apos;ll let you know first.
          </p>
          <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
            Reach out to <a href="mailto:pranav@aisb.dev" className="underline hover:text-[#ef4444] transition-colors">pranav@aisb.dev</a> for any questions about the program.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/eoi"
              onClick={() => { posthog.capture("clicked_expression_of_interest", { location: "cta_section" }); window.gtag?.("event", "clicked_expression_of_interest", { location: "cta_section" }); }}
              className="inline-block bg-[#ef4444] text-white font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-red-600 transition-colors"
            >
              Expression of Interest
            </a>
            <a
              href="/staff"
              className="inline-block border-2 border-black dark:border-white text-black dark:text-white font-black text-sm uppercase tracking-widest px-8 py-4 bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              Meet the team
            </a>
          </div>
        </div>
      </section>

      {/* ===================== BOTTOM BAR ===================== */}
      <footer className="px-6 md:px-16 lg:px-24 py-8 border-t-2 border-black dark:border-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-neutral-400 dark:text-neutral-600 text-sm font-bold tracking-widest">
          &copy; AI Security Bootcamp
        </p>
        <div className="flex flex-wrap gap-6">
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
          <a
            href="/staff"
            className="text-neutral-400 dark:text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
          >
            Staff
          </a>
          <a
            href="https://github.com/pranavgade20/aisb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 dark:text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
