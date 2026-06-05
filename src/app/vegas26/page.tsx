"use client";

import { useState, useEffect, useMemo } from "react";
import posthog from "posthog-js";

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds, expired: diff === 0 };
}

function CountdownBanner() {
  const deadline = useMemo(() => new Date("2026-06-21T23:59:59"), []);
  const { days, hours, minutes, seconds, expired } = useCountdown(deadline);

  if (expired) return null;

  const units = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Min", value: minutes },
    { label: "Sec", value: seconds },
  ];

  return (
    <div className="flex flex-col gap-2 mb-4">
      <span className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-bold">
        Applications close in
      </span>
      <div className="flex gap-5">
        {units.map((u) => (
          <div key={u.label} className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-black tabular-nums text-[#ef4444]">
              {String(u.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
    title: "Weight Security, Verification & Formal Methods",
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
      "Potential site visit (TBD) to a local data center for a behind-the-scenes look at real-world deployments",
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
    a: "Senior security professionals from across the stack (offensive and defensive, application and infrastructure, detection and response) who have demonstrated interest in AI security. Cohort size is intentionally small (16\u201320) so peer learning is a meaningful part of the experience.",
  },
  {
    q: "What does \"frontier AI security\" mean in practice?",
    a: "It means engaging with the threat models that matter as AI systems become more capable, not just today's enterprise LLM deployments, but the attack surfaces, control mechanisms, and governance challenges that become critical as systems grow more powerful.",
  },
  {
    q: "What does the full application process look like?",
    a: "It's a 3-stage process. Stage 1 is a short CV/application: most of the signal here comes from your GitHub, past projects, and CV. Stage 2 is a technical assessment: a threat modeling exercise (the bulk of the assessment), a small PyTorch exercise, and a brief Python exercise. Stage 3 is a 30-minute interview covering your background, motivation, and short technical questions. We review applications on a rolling basis, so please apply early.",
  },
  {
    q: "Does the program cover accommodation and travel?",
    a: "We will provide accommodation for you in Vegas for the full duration of the program. We have need-based travel support available.",
  },
  {
    q: "What is the time commitment?",
    a: "Full-time attendance from Sunday (Aug 2) through Saturday (Aug 8). We recommend you arrive Saturday Aug 1 and depart Sunday Aug 9. Pre-reading is sent in advance (2 weeks before the bootcamp) and we share extra reading throughout the week.",
  },
  {
    q: "Do I need prior AI/ML experience?",
    a: "No. We provide comprehensive pre-work covering the AI fundamentals you'll need. What matters more is your security experience and curiosity about frontier threat models. If you're comfortable with Python and have depth in any security domain, you'll be able to engage with the material.",
  },
  {
    q: "What happens after the program?",
    a: "Participants join a growing network of AISB alumni across cohorts. We share relevant opportunities in AI security research, fellowship programs, and organizations working on frontier AI security challenges, and make warm intros where they help.",
  },
  {
    q: "I have more questions.",
    a: "Email pranav@aisb.dev.",
  },
];

const testimonials = [
  {
    quote:
      "I came in with a different approach to the AI security problem and left with a deeper understanding of the ideas and opportunities in AI safety.",
    name: "Joshua Bahirvani",
    attribution: "Principal AI Security Engineer @ Zoom, previously: Senior Security Researcher @ Microsoft",
    linkedin: "https://www.linkedin.com/in/jbahirvani15/",
  },
  {
    quote:
      "AISB was a unique opportunity to dedicate my full attention to AI Security. Having access to expert support while being surrounded by such highly capable peers made it an invaluable experience.",
    name: "Nitzan Pomerantz",
    attribution: "Previously: Chief Security Architect @ IDF",
    linkedin: "https://www.linkedin.com/in/nitzan-pomerantz/",
  },
  {
    quote:
      "This program helped to bridge the gap between traditional cyber security and AI security.",
    name: "Ahmad Hatziq",
    attribution: "Software Engineer @ Monetary Authority of Singapore",
    linkedin: "https://www.linkedin.com/in/ahmad-hatziq-74a938171/",
  },
  {
    quote:
      "I came into the bootcamp with a strong foundational background, but the highlight for me was the incredible networking and the caliber of people I met.",
    name: "Uri Ariel Chen",
    attribution: "CEO & Co-founder @ Collider",
    linkedin: "https://www.linkedin.com/in/uri-chen/",
  },
  // Disabled — kept for easy re-enable
  // {
  //   quote: "The AISB Singapore 2026 bootcamp was a great experience.",
  //   quoteCollapsibleMiddle:
  //     "Really loved the in-depth knowledge of instructors as well as exercises that were focused on the practical aspects of understanding the various attacks and defenses for the novel attacks in the AI pipeline, which made the learning feel very real and relevant. It was a good mix of theory and doing.",
  //   quoteEnd: "Definitely recommend it to anyone interested in AI safety and security.",
  //   name: "Bakul Gupta",
  //   attribution: "Product Security Engineer @ LinkedIn",
  //   linkedin: "https://www.linkedin.com/in/bullhacks3/",
  // },
  // {
  //   quote:
  //     "The AI security bootcamp was hugely helpful in working out exactly what I want to work on in AI security / safety. Everyone was so friendly and knowledgeable. Thank you so much for the amazing week!",
  //   name: "Billy Gigurtsis",
  //   attribution: "Lead Security Engineer @ Intropic",
  //   linkedin: "https://www.linkedin.com/in/bgigurtsis/",
  // },
  // {
  //   quote:
  //     "AISB gave me the fundamentals and the direction I was missing to pursue AI security head on.",
  //   name: "Fernando Smith",
  //   attribution: "Cofounder & CTO @ Skip",
  //   linkedin: "https://www.linkedin.com/in/fernando-smith/",
  // },
  // {
  //   quote:
  //     "I have learnt so much from both my peers and instructors. The diverse backgrounds and hands-on sessions are really useful for anyone that wishes to dive deep into the topic.",
  //   name: "Nanzheng Xie",
  //   attribution: "Master's Student @ UC Berkeley, previously: Senior Cybersecurity Specialist @ PUB Singapore",
  //   linkedin: "https://www.linkedin.com/in/nanzheng-xie/",
  // },
];

const affiliationLogos = [
  // Curated affiliations, interleaved so universities/big tech/AI labs/security mix visually.
  // Disabled entries remain (commented) for easy re-enable.
  { src: "/logos/Amazon Web Services_idS5TK0MYh_0.svg", alt: "Amazon Web Services (AWS)" },
  { src: "/logos/Apollo Research_id9k8Tjo3P_0.svg", alt: "Apollo Research" },
  { src: "/logos/Apple_Logo_0.svg", alt: "Apple" },
  { src: "/logos/CERN_idmu7jJEuK_2.svg", alt: "CERN" },
  { src: "/logos/Tel Aviv University.svg", alt: "Tel Aviv University" },
  { src: "/logos/Epoch AI_id_yy1RAHp_1.svg", alt: "Epoch AI" },
  { src: "/logos/IBM.svg", alt: "IBM" },
  { src: "/logos/Georgia Tech_idm_h5bYQz_2.svg", alt: "Georgia Institute of Technology" },
  { src: "/logos/Google_Logo_0.svg", alt: "Google" },
  { src: "/logos/NUS.svg", alt: "National University of Singapore" },
  { src: "/logos/Jane Street_id3GLGPSzf_0.svg", alt: "Jane Street" },
  { src: "/logos/LinkedIn.svg", alt: "LinkedIn" },
  { src: "/logos/Meta_idwdgcJw5c_4.svg", alt: "Meta" },
  { src: "/logos/Microsoft_Logo_0.svg", alt: "Microsoft" },
  { src: "/logos/Intel.svg", alt: "Intel" },
  { src: "/logos/OpenAI_Logo_0.svg", alt: "OpenAI" },
  { src: "/logos/Samsung.svg", alt: "Samsung" },
  { src: "/logos/SaferAI_idJL4whjWU_1.svg", alt: "Safer AI" },
  { src: "/logos/Stanford University_idJUIPPYM3_1.svg", alt: "Stanford University" },
  { src: "/logos/Technion.svg", alt: "Technion: Israel Institute of Technology" },
  { src: "/logos/University of Oxford_Icon_1.svg", alt: "University of Oxford" },
  // { src: "/logos/Zoom.svg", alt: "Zoom" },
  { src: "/logos/Cambridge.png", alt: "University of Cambridge" },
  { src: "/logos/MIT.svg", alt: "Massachusetts Institute of Technology" },
  { src: "/logos/Niantic.svg", alt: "Niantic" },
  { src: "/logos/UC Berkeley.svg", alt: "University of California, Berkeley" },
  { src: "/logos/CSA.svg", alt: "Cyber Security Agency of Singapore" },
  { src: "/logos/MATS.svg", alt: "ML Alignment & Theory Scholars (MATS)" },
  { src: "/logos/Center for AI Safety.svg", alt: "Center for AI Safety" },
  { src: "/logos/Darktrace.svg", alt: "Darktrace" },
  // Disabled (kept for easy re-enable)
  // { src: "/logos/FGV_id4G57V8yv_1.svg", alt: "Fundação Getulio Vargas (FGV)" },
  // { src: "/logos/Fraunhofer-Gesellschaft_idr7l_79Zp_1.svg", alt: "Fraunhofer-Gesellschaft" },
  // { src: "/logos/Helsinki_idgYlvoExA_2.svg", alt: "University of Helsinki" },
  // { src: "/logos/INSA Lyon_idrA1ZnHFE_2.svg", alt: "INSA Lyon" },
  // { src: "/logos/King_s College London_idPXgHZWxe_2.svg", alt: "King's College London" },
  // { src: "/logos/Santa Fe Institute_idLoL6oKVJ_2.svg", alt: "Santa Fe Institute" },
  // { src: "/logos/UC San Diego_idxlKuXNo7_2.svg", alt: "University of California, San Diego" },
  // { src: "/logos/Unibo_idOu3rBjwY_1.svg", alt: "Alma Mater Studiorum: Università di Bologna" },
  // { src: "/logos/University of Washington_id-HgUwUZo_1.svg", alt: "University of Washington" },
  // { src: "/logos/University of Edinburgh.svg", alt: "University of Edinburgh" },
  // { src: "/logos/University of Toronto.svg", alt: "University of Toronto" },
  // { src: "/logos/SUTD.svg", alt: "Singapore University of Technology and Design" },
  // { src: "/logos/METU.svg", alt: "Middle East Technical University" },
  // { src: "/logos/Durham University.svg", alt: "Durham University" },
  // { src: "/logos/Warsaw University of Technology.svg", alt: "Warsaw University of Technology" },
  // { src: "/logos/Bosch.svg", alt: "Bosch" },
  // { src: "/logos/Parity Technologies.svg", alt: "Parity Technologies" },
  // { src: "/logos/Netcraft.svg", alt: "Netcraft" },
  // { src: "/logos/Ping Identity.svg", alt: "Ping Identity" },
  // { src: "/logos/MAS.svg", alt: "Monetary Authority of Singapore" },
  // { src: "/logos/PUB.svg", alt: "PUB, Singapore's National Water Agency" },
  // { src: "/logos/NHS.svg", alt: "NHS" },
  // { src: "/logos/Turkish Aerospace Industries.svg", alt: "Turkish Aerospace Industries" },
];

const SLOT_WORDS = ["Vegas", "2026"];
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
      {SLOT_WORDS.map((word) => (
        <span key={word} className="invisible block whitespace-nowrap h-0" aria-hidden="true">
          {word}
        </span>
      ))}
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

function LogoCarousel() {
  return (
    <div className="pt-6 pb-10 -mx-6 md:-mx-16 lg:-mx-24 overflow-hidden">
      <div className="border-t-2 border-black dark:border-white" />
      <p className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-bold text-center mt-4 mb-4">
        Past participants have been affiliated with
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white dark:from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white dark:from-black to-transparent z-10 pointer-events-none" />
        <div
          className="logo-carousel-track flex items-center gap-12 md:gap-16 w-max"
          style={{ animationDuration: `${affiliationLogos.length * 1.74}s` }}
        >
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
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
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

type Testimonial = {
  quote: string;
  quoteCollapsibleMiddle?: string;
  quoteEnd?: string;
  name: string;
  attribution: string;
  linkedin: string;
};

function TestimonialCard({ t }: { t: Testimonial }) {
  const [expanded, setExpanded] = useState(false);
  const hasCollapsible = Boolean(t.quoteCollapsibleMiddle);

  return (
    <blockquote className="border-2 border-black dark:border-white p-8 flex flex-col gap-6">
      <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed">
        "{t.quote}
        {hasCollapsible && (
          <>
            {" "}
            {expanded ? (
              <>{t.quoteCollapsibleMiddle}</>
            ) : (
              <button
                onClick={() => setExpanded(true)}
                className="text-[#ef4444] font-bold hover:underline focus:outline-none"
                aria-label="Expand quote"
              >
                ...
              </button>
            )}
            {" "}
            {t.quoteEnd}
          </>
        )}
        "
      </p>
      <footer className="mt-auto">
        <p className="font-black text-base md:text-lg">
          <a
            href={t.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#ef4444] transition-colors"
          >
            {t.name}
          </a>
        </p>
        <p className="text-[#ef4444] font-black text-xs uppercase tracking-widest mt-1">
          {t.attribution}
        </p>
      </footer>
    </blockquote>
  );
}

const APPLICATION_URL = "https://airtable.com/appyq1bBRnK6s7AkM/paglvXzxYAiJclCZX/form";

export default function Home() {
  const { isDark, toggle, mounted } = useTheme();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.querySelector("nav");
    const offset = nav instanceof HTMLElement ? nav.offsetHeight : 0;
    const y = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen font-sans transition-colors">
      {mounted && <ThemeToggle isDark={isDark} toggle={toggle} />}

      {/* ===================== HERO ===================== */}
      <section className="min-h-screen flex flex-col px-6 md:px-16 lg:px-24 pt-4 md:pt-6">
        <div className="flex-1 flex flex-col justify-center w-full max-w-5xl">
          <p className="text-[#ef4444] font-black text-sm uppercase tracking-widest mb-3">
            Applications open
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-6">
            AI Security
            <br />
            Bootcamp
            <br />
            <SlotCarousel />
          </h1>

          <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mb-4 leading-relaxed">
            A 7-day intensive program for security professionals shaping how we secure emerging AI systems.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-widest mb-5">
            <span>August 2&ndash;8, 2026</span>
            <span className="text-[#ef4444]">|</span>
            <span>Las Vegas</span>
            <span className="text-[#ef4444]">|</span>
            <span>In-Person</span>
            <span className="text-[#ef4444]">|</span>
            <span>Fully Funded</span>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <a
              href={APPLICATION_URL}
              onClick={() => { posthog.capture("clicked_apply_now", { location: "vegas26_hero" }); window.gtag?.("event", "clicked_apply_now", { location: "vegas26_hero" }); }}
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

          <CountdownBanner />

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-neutral-400 dark:text-neutral-500">
            <span>
              Application Deadline:{" "}
              <span className="text-black dark:text-white font-bold">
                June 21, 2026 (rolling)
              </span>
            </span>
          </div>
        </div>

        {/* ===================== AFFILIATIONS CAROUSEL ===================== */}
        <LogoCarousel />
      </section>

      {/* ===================== JUMP-TO NAV ===================== */}
      <nav className="sticky top-0 z-30 bg-white dark:bg-black px-6 md:px-16 lg:px-24 py-6 border-t-2 border-black dark:border-white flex flex-wrap gap-8">
        {[
          "Overview",
          "The Program",
          "Who Should Attend",
          "Testimonials",
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
                This iteration of AI Security Bootcamp explores the rapidly evolving threat landscape of frontier AI
                systems, equipping security professionals with the knowledge and hands-on skills to secure against
                current and emerging risks.
              </p>
              <p>
                As AI systems become more capable and integrated into critical infrastructure, new attack surfaces and
                failure modes are emerging that traditional security training doesn&apos;t cover. This program is
                designed to fill that gap with an intensive, practitioner-focused curriculum that prepares participants
                to engage with the most pressing AI security challenges we see today, and to grapple with how the risks
                will evolve in the future.
              </p>
              <p>
                Participants complete pre-work before the program to establish baseline ML fundamentals, followed by an
                immersive week delivered through demos, lectures, guest speakers, and hands-on red/blue team exercises that
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
              "Build hands-on capability across the full attack surface: adversarial techniques, infrastructure exploitation, supply chain attacks, agent security, and model-level vulnerabilities",
              "Understand how attacks and defenses scale with AI capability increases",
              "Engage with security challenges that frontier AI organizations are actively working on: problems not yet covered in standard training curricula",
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
              Security professionals ready to secure frontier AI systems at all stages: from user applications, to
              model APIs for developers; and from infrastructure hosting the models, to governance frameworks for
              emerging threats.
            </p>
            <p>
              We want our cohort to span a wide range of expertise. Whether your background is offensive security,
              incident response, threat intelligence, infrastructure, or application security, the AI-specific threat
              models and techniques we cover will push what you already know into new territory.
            </p>
          </div>

          {/* Prerequisites */}
          <div>
            <h3 className="text-[#ef4444] font-black text-sm uppercase tracking-widest mb-6">
              Prerequisites
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed mb-4">
              5+ years of hands-on security experience. No prior AI or ML
              background needed. The pre-work covers what&apos;s necessary.
            </p>
            <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed mb-4">
              Selection prioritizes candidates interested in frontier AI risk, high-consequence failure modes, or work
              involving sophisticated threat actors.
            </p>
            <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed">
              Experience with deep learning frameworks (e.g., PyTorch) is a plus but not required. We want to make this
              accessible to security professionals from a variety of backgrounds, so we provide comprehensive pre-work
              to get everyone up to speed on the AI fundamentals needed to engage with the curriculum.
            </p>
          </div>

          {/* Past Participants */}
          <div>
            <h3 className="text-[#ef4444] font-black text-sm uppercase tracking-widest mb-6">
              Past Participants
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed">
              Past participants have been affiliated with: OpenAI, Google, Meta, Apple, Microsoft, AWS, Intel, Jane
              Street, Stanford, Oxford, Cambridge, MIT, UC Berkeley, Tel Aviv University, CERN, and other leading
              institutions across research, government, and industry.
            </p>
          </div>

          {/* Timing */}
          <div>
            <h3 className="text-[#ef4444] font-black text-sm uppercase tracking-widest mb-6">
              Timing
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed mb-4">
              AISB Vegas runs from Sunday (Aug 2) through Saturday (Aug 8), 2026.
            </p>
            <p className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed">
              The week overlaps with the broader Las Vegas summer security calendar: a strong networking opportunity
              for participants to connect with practitioners and researchers from across the field.
            </p>
          </div>

          {/* Cost and Selection */}
          <div>
            <h3 className="text-[#ef4444] font-black text-sm uppercase tracking-widest mb-6">
              Cost & Selection
            </h3>
            <div className="space-y-6 text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed">
              <p>
                <span className="font-bold text-black dark:text-white">The program is free to attend.</span>{" "}
                Tuition, meals during program hours, materials, and accommodation in Las Vegas are fully covered for
                accepted participants. Need-based travel support is available.
              </p>
              <p>
                Selection is competitive. We will accept 16&ndash;20 participants. What we ask in return is your time:
                full attendance for the seven days, plus pre-reading completed before arrival.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section
        id="testimonials"
        className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-black dark:border-white"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-16 tracking-tight">
          From Past Participants
        </h2>

        <div className="flex flex-col gap-6 max-w-3xl">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
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
            Applications close June 21, 2026. We review on a rolling basis and will prioritize applications we receive
            before the deadline. Early applications are encouraged.
          </p>
          <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
            Reach out to <a href="mailto:pranav@aisb.dev" className="underline hover:text-[#ef4444] transition-colors">pranav@aisb.dev</a> with questions about the program.
          </p>
          <a
            href={APPLICATION_URL}
            onClick={() => { posthog.capture("clicked_apply_now", { location: "vegas26_cta" }); window.gtag?.("event", "clicked_apply_now", { location: "vegas26_cta" }); }}
            className="inline-block bg-[#ef4444] text-white font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-red-600 transition-colors"
          >
            Apply Now
          </a>
        </div>
      </section>

      {/* ===================== BOTTOM BAR ===================== */}
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
          {/* TODO: confirm and add BlueDot Impact's registered charity number, company number, and registered office address. */}
        </p>
        <div className="flex flex-wrap gap-6">
          <a
            href="/"
            className="text-neutral-400 dark:text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
          >
            Home
          </a>
          <a
            href="/singapore"
            className="text-neutral-400 dark:text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
          >
            Singapore 2026
          </a>
          <a
            href="/2025"
            className="text-neutral-400 dark:text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
          >
            London 2025
          </a>
          <a
            href="/staff"
            className="text-neutral-400 dark:text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
          >
            Staff
          </a>
          <a
            href="https://github.com/AI-Security-Bootcamp/aisb-sg/"
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
