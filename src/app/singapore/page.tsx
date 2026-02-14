"use client";

import { useState, useEffect } from "react";

const curriculumDays = [
  {
    day: "Day 1",
    title: "Introduction & Threat Modeling",
    items: [
      "Current threat landscape: frameworks, misuse (e.g., to assist cyberattacks), application security, infrastructure security",
      "Future threat models: misalignment, model theft and tampering, integrity attacks (backdoors, trojans), governance guarantees",
      "Mapping threat models to attacks, defenses, and follow-up pathways",
      "Threat modeling exercise against an AI deployment, which we will attack and defend in future days",
    ],
  },
  {
    day: "Day 2",
    title: "Adversarial Attacks, Watermarking & Data Security",
    items: [
      "Adversarial examples and attacks on image models",
      "Trojans, backdoors, and fine-tuning attacks on open-source models",
      "Model weight extraction attacks",
      "Watermarking techniques and detection",
      "Data security: weight security, training data protection, inference-time data handling",
    ],
  },
  {
    day: "Day 3",
    title: "LLM Security",
    items: [
      "Jailbreaks, prompt injection, and RAG injection",
      "Guardrails: Constitutional classifiers and linear probes for input and output monitoring",
      "Abliteration and model editing techniques",
      "Tokenization vulnerabilities",
      "MCP (Model Context Protocol) security",
    ],
  },
  {
    day: "Day 4",
    title: "Infrastructure Security",
    items: [
      "NVIDIA Container Toolkit exploits and case studies",
      "GPU isolation and confidential computing",
      "Sandbox design: containment, escape vectors, and design considerations",
    ],
  },
  {
    day: "Day 5",
    title: "Weight security, Verification & Formal Methods",
    items: [
      "RAND report analysis and policy implications",
      "Output verification using formal methods",
      "Detecting and defending against rogue deployments",
    ],
  },
  {
    day: "Day 6",
    title: "Data Center Security & ML Stack Threat Modeling",
    items: [
      "Data center infrastructure: power, networking, physical security",
      "ML stack threat modeling end-to-end",
      "Personnel security considerations for AI deployments",
      "(Potential site visit - TBD) to a local data center for a behind-the-scenes look at real-world deployments",
    ],
  },
  {
    day: "Day 7",
    title: "AI Control & Hardware Governance",
    items: [
      "AI control mechanisms and policy",
      "Hardware supply chains and governance frameworks",
      "Securing against treaty violations and governance guarantees",
    ],
  },
];

const faqs = [
  {
    q: "Who else will be in the room?",
    a: "Senior security professionals from across the stack\u2014offensive and defensive, application and infrastructure, detection and response. Cohort size is intentionally small (10\u201312) so that peer learning is a meaningful part of the experience. We aim to bring security professionals and researchers working on frontier AI systems together.",
  },
  {
    q: "What does \u201cfrontier AI security\u201d mean in practice?",
    a: "It means engaging with the threat models that matter as AI systems become more capable\u2014not just today\u2019s enterprise LLM deployments, but the attack surfaces, control mechanisms, and governance challenges that become critical as systems grow more powerful.",
  },
  {
    q: "What does the full application process look like?",
    a: "It\u2019s a 3-step process. First, you submit an application. The second stage is a short (30-60min) coding test. The last step is a 30-minute interview. We review submissions on a rolling basis, so please apply early!",
  },
  {
    q: "Does the program cover accommodation and travel?",
    a: "Accommodation is included for all international participants. We have limited travel support available for those who need it\u2014indicate this in your application and we\u2019ll do our best to accommodate. Program costs are fully covered regardless.",
  },
  {
    q: "What is the time commitment?",
    a: "Full-time attendance for seven days (10am - 6pm), April 20 through 26. Pre-reading will be sent in advance (should take ~16-20 hours), and we'll have extra reading materials to familiarize yourself with the day's contents as well.",
  },
  {
    q: "What happens after the program?",
    a: "Participants join a network of AISB alumni across cohorts. We\u2019ll share relevant opportunities in AI security research, fellowship programs, and organizations working on frontier AI security challenges.",
  },
  {
    q: "I have more questions.",
    a: "Email pranav@aisb.dev.",
  },
];

const SLOT_WORDS = ["Singapore", "2026"];
const SLOT_INTERVAL = 3000;
const SLOT_DURATION = 600;

function SlotCarousel() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"idle" | "animating">("idle");

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase("animating");
      setTimeout(() => {
        setIndex((i) => (i + 1) % SLOT_WORDS.length);
        setPhase("idle");
      }, SLOT_DURATION);
    }, SLOT_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const next = (index + 1) % SLOT_WORDS.length;

  return (
    <span className="relative inline-block overflow-hidden align-bottom h-[1.2em]">
      {/* Hidden sizer: renders all words to reserve width of the longest */}
      {SLOT_WORDS.map((word) => (
        <span key={word} className="invisible block whitespace-nowrap h-0" aria-hidden="true">
          {word}
        </span>
      ))}
      {/* Current word */}
      <span
        className="absolute left-0 top-0 inline-block text-[#ef4444] whitespace-nowrap"
        style={
          phase === "animating"
            ? {
                animation: `slot-slide-out ${SLOT_DURATION}ms ease-out forwards`,
              }
            : undefined
        }
      >
        {SLOT_WORDS[index]}
      </span>
      {/* Incoming word */}
      {phase === "animating" && (
        <span
          className="absolute left-0 top-0 inline-block text-[#ef4444] whitespace-nowrap"
          style={{
            animation: `slot-slide-in ${SLOT_DURATION}ms ease-out forwards`,
          }}
        >
          {SLOT_WORDS[next]}
        </span>
      )}
    </span>
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

function AccordionItem({
  day,
  title,
  items,
}: {
  day: string;
  title: string;
  items: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b-2 border-black dark:border-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 px-0 text-left focus:outline-none group"
      >
        <div className="flex items-baseline gap-6">
          <span className="text-[#ef4444] font-black text-sm uppercase tracking-widest">
            {day}
          </span>
          <span className="text-black dark:text-white font-bold text-lg md:text-xl">
            {title}
          </span>
        </div>
        <span className="text-black dark:text-white text-3xl font-light leading-none select-none">
          {open ? "\u2212" : "+"}
        </span>
      </button>
      {open && (
        <ul className="pb-6 pl-0 space-y-3">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-4 text-neutral-600 dark:text-neutral-300"
            >
              <span className="text-[#ef4444] mt-1 text-xs">{"\u25A0"}</span>
              <span className="text-base">{item}</span>
            </li>
          ))}
        </ul>
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

export default function SingaporeBootcampPage() {
  const { isDark, toggle, mounted } = useTheme();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen font-sans transition-colors">
      {mounted && <ThemeToggle isDark={isDark} toggle={toggle} />}

      {/* ===================== HERO ===================== */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 relative">
        <div className="max-w-5xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-8">
            AI Security
            <br />
            Bootcamp
            <br />
            <SlotCarousel />
          </h1>

          <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 max-w-2xl mb-6 leading-relaxed">
            A 7-day intensive program for security professionals shaping how we secure emerging AI systems.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-widest mb-8">
            <span>April 20&ndash;26, 2026</span>
            <span className="text-[#ef4444]">|</span>
            <span>Singapore</span>
            <span className="text-[#ef4444]">|</span>
            <span>In-Person</span>
          </div>

          <div className="flex flex-wrap gap-4 mb-10">
            <a
              href="https://airtable.com/appDN6E2sHsMWkHWN/pagLyM1S6ZevGYUcB/form"
              className="inline-block bg-[#ef4444] text-white font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-red-600 transition-colors"
            >
              Apply Now
            </a>
            <button
              onClick={() => scrollTo("overview")}
              className="inline-block border-2 border-black dark:border-white text-black dark:text-white font-black text-sm uppercase tracking-widest px-8 py-4 bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              Learn More
            </button>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-neutral-400 dark:text-neutral-500">
            <span>
              Application Deadline:{" "}
              <span className="text-black dark:text-white font-bold">
                15th March 2026 (rolling)
              </span>
            </span>
            <span>
              Decisions:{" "}
              <span className="text-black dark:text-white font-bold">
                28th March 2026
              </span>
            </span>
          </div>
        </div>

      </section>

      {/* ===================== JUMP-TO NAV ===================== */}
      <nav className="px-6 md:px-16 lg:px-24 py-6 border-t-2 border-black dark:border-white flex flex-wrap gap-8">
        {[
          "Overview",
          "The Program",
          "Who Should Attend",
          "Team",
          "FAQs",
        ].map((item) => (
          <button
            key={item}
            onClick={() => scrollTo(item.toLowerCase().replace(/\s+/g, "-"))}
            className="text-sm font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 hover:text-[#ef4444] transition-colors bg-transparent border-none cursor-pointer"
          >
            {item}
          </button>
        ))}
      </nav>

      {/* ===================== OVERVIEW ===================== */}
      <section
        id="overview"
        className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-black dark:border-white"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-16 tracking-tight">
          Overview
        </h2>

        <div className="max-w-3xl space-y-16">
          <div>
            <div className="space-y-6 text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed">
              <p>
                This iteration of AI Security bootcamp explores the rapidly evolving threat landscape of frontier AI systems,
                equipping security professionals with the knowledge and hands-on skills to secure against current and emerging risks.
              </p>
              <p>
                As AI systems become more capable and integrated into critical infrastructure, new attack surfaces and
                failure modes are emerging that traditional security training doesn&apos;t cover. This program is
                designed to fill that gap, providing an intensive, practitioner-focused curriculum that prepares
                participants to engage with the most pressing AI security challenges we see today, and grapple with
                how the risks will evolve in the future.
              </p>
              <p>
                Participants will complete pre-work before the program to establish
                baseline ML fundamentals, followed by an immersive week delivered through
                demos, lectures, guest speakers, and hands-on red/blue exercises that
                build skills across the modern AI system stack.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== THE PROGRAM ===================== */}
      <section
        id="the-program"
        className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-black dark:border-white"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-16 tracking-tight">
          The Program
        </h2>

        <div className="max-w-3xl border-t-2 border-black dark:border-white">
          {curriculumDays.map((day) => (
            <AccordionItem
              key={day.day}
              day={day.day}
              title={day.title}
              items={day.items}
            />
          ))}
        </div>

        {/* What You'll Learn */}
        <div className="mt-20">
          <h3 className="text-2xl md:text-3xl font-black mb-10 tracking-tight">
            What You&apos;ll Learn
          </h3>
          <ul className="space-y-5 max-w-3xl">
            {[
              "Develop a threat model for frontier AI systems: from current deployments to the security challenges posed by increasingly capable systems",
              "Build hands-on capability across the full attack surface: adversarial techniques, infrastructure exploitation, supply chain attacks, and model-level vulnerabilities",
              "Understand how attacks and defenses scale with AI capability increases",
              "Engage with security challenges that frontier AI organizations are actively working on\u2014problems not yet covered in standard training curricula",
              "Position yourself for high-impact roles at the frontier: AI labs, government programs, and research institutions shaping how the field develops",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="text-[#ef4444] mt-1.5 text-xs font-black">
                  {"\u25A0"}
                </span>
                <span className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===================== WHO SHOULD ATTEND ===================== */}
      <section
        id="who-should-attend"
        className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-black dark:border-white"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-16 tracking-tight">
          Who Should Attend
        </h2>

        <div className="max-w-3xl space-y-16">
          {/* Main description */}
          <div className="space-y-6 text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed">
            <p>
              Security professionals ready to secure frontier AI
              systems at all stages - from user applications, to model APIs for developers;
              and from infrastructure hosting the models, to governance frameworks for
              emerging threats.
            </p>
            <p>
              We want our cohort to span a wide range of expertise - whether your
              background is offensive security, incident response, threat
              intelligence, infrastructure, or application security, the
              AI-specific threat models and techniques we cover will push
              what you already know into new territory.
            </p>
          </div>

          {/* Prerequisites */}
          <div>
            <h3 className="text-[#ef4444] font-black text-sm uppercase tracking-widest mb-6">
              Prerequisites
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed mb-4">
              5+ years of hands-on security experience. No prior AI or ML
              background needed - the pre-work will cover what's necessary.
            </p>
            <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed mb-4">
              Selection prioritizes candidates interested in frontier AI risk,
              high-consequence failure modes, or work involving sophisticated
              threat actors.
            </p>
            <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed">
              Experience with deep learning frameworks (e.g., PyTorch) is a plus but not required.
              We want to make this accessible to security professionals from a variety of backgrounds,
              so we provide comprehensive pre-work to get everyone up to speed on the AI fundamentals
              needed to engage with the curriculum.
            </p>
          </div>

          {/* Timing */}
          <div>
            <h3 className="text-[#ef4444] font-black text-sm uppercase tracking-widest mb-6">
              Timing
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed">
              AISB Singapore runs April 20&ndash;26, overlapping with Black Hat
              Asia (April 21&ndash;24) and just before DEF CON (April
              28&ndash;30). If you&apos;re already planning to attend DEF CON,
              this program fits naturally into the same trip: the bootcamp
              ends just before DEF CON opens.
            </p>
          </div>

          {/* Cost and Selection */}
          <div>
            <h3 className="text-[#ef4444] font-black text-sm uppercase tracking-widest mb-6">
              Cost & Selection
            </h3>
            <div className="space-y-6 text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed">
              <p>
                Accommodation included. Limited travel support
                available&mdash;note this in your application.
              </p>
              <p>
                Selection is competitive&mdash;we accept 10 to 12
                participants. The cost is your time: full attendance for seven
                days and pre-reading completed before arrival.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TEAM ===================== */}
      <section
        id="team"
        className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-black dark:border-white"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-16 tracking-tight">
          Team
        </h2>

        <div className="max-w-3xl space-y-12">
          <div className="border-2 border-black dark:border-white p-8">
            <p className="text-[#ef4444] font-black text-sm uppercase tracking-widest mb-2">
              Program Lead
            </p>
            <h3 className="text-2xl md:text-3xl font-black mb-4">
              Pranav Gade
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed">
              Research engineer at Conjecture. Created AISB to bridge AI safety
              and security, leads curriculum design and program direction.
            </p>
          </div>

          <div className="border-2 border-black dark:border-white p-8">
            <p className="text-[#ef4444] font-black text-sm uppercase tracking-widest mb-2">
              Security Lead
            </p>
            <h3 className="text-2xl md:text-3xl font-black mb-4">
              Nitzan Shulman
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed">
              Head of Cyber Security at Heron AI Security Initiative. 6+ years
              security research specializing in IoT, robotics, malware and AI
              security.
            </p>
          </div>

          <a
            href="https://sash.org.sg"
            target="_blank"
            rel="noopener noreferrer"
            className="block border-2 border-black dark:border-white p-8 hover:border-[#ef4444] transition-colors"
          >
            <p className="text-[#ef4444] font-black text-sm uppercase tracking-widest mb-4">
              Bootcamp Partner
            </p>
            <div className="flex items-center gap-6">
              <img
                src="/sash.png"
                alt="Singapore AI Safety Hub (SASH)"
                className="max-h-24 w-auto flex-shrink-0"
              />
              <div>
                <h3 className="text-2xl md:text-3xl font-black mb-4">
                  Singapore AI Safety Hub (SASH)
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed">
                  Local execution and institutional linkage supported by the
                  Singapore AI Safety Hub.
                </p>
              </div>
            </div>
          </a>
        </div>
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

      {/* ===================== CTA / FOOTER ===================== */}
      <section className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-black dark:border-white">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 tracking-tight">
            Ready to Apply?
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg leading-relaxed mb-4 max-w-xl">
            Applications close 15th March 2026. We review on a rolling
            basis - early applications are encouraged. Let us know in
            your application if you'd like a decision sooner.
          </p>
          <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
            Reach out to <a href="mailto:pranav@aisb.dev" className="underline hover:text-[#ef4444] transition-colors">pranav@aisb.dev</a> to express interest or ask questions about the program.
          </p>
          <a
            href="https://airtable.com/appDN6E2sHsMWkHWN/pagLyM1S6ZevGYUcB/form"
            className="inline-block bg-[#ef4444] text-white font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-red-600 transition-colors"
          >
            Apply Now
          </a>
        </div>
      </section>

      {/* ===================== BOTTOM BAR ===================== */}
      <footer className="px-6 md:px-16 lg:px-24 py-8 border-t-2 border-black dark:border-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-neutral-400 dark:text-neutral-600 text-sm font-bold tracking-widest">
          &copy; AI Security Bootcamp 2026
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
            2025 Cohort
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
