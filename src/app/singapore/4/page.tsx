"use client";

import { useState } from "react";

/* ─── Curriculum data ─── */
const curriculum = [
  {
    day: 1,
    title: "Introduction & Threat Modeling",
    items: [
      "Current threats: misuse (cyberattacks, bio uplift), application security, infrastructure security",
      "Future threats: misalignment, model theft, integrity attacks, governance guarantees",
      "Hands-on: Threat modeling exercises",
    ],
  },
  {
    day: 2,
    title: "Adversarial Attacks, Watermarking & Data Security",
    items: [
      "Adversarial examples, trojans, weight extraction",
      "Watermarking techniques",
      "Data security for training and inference",
    ],
  },
  {
    day: 3,
    title: "LLM Security",
    items: [
      "Constitutional classifiers, guardrails, abliteration, model editing",
      "Tokenization vulnerabilities",
      "Prompt injection, jailbreaks",
    ],
  },
  {
    day: 4,
    title: "Infrastructure Security",
    items: [
      "NVIDIA Container Toolkit exploits, GPU isolation",
      "Confidential computing, sandboxing",
      "Container security fundamentals",
    ],
  },
  {
    day: 5,
    title: "Formal Methods & Analysis",
    items: [
      "Verification-oriented techniques",
      "RAND report analysis",
      "Output verification approaches",
    ],
  },
  {
    day: 6,
    title: "Data Center Security & ML Stack Threat Modeling",
    items: [
      "Data center infrastructure (power, cooling, networking, physical security)",
      "ML stack threat modeling",
      "Potential site visit",
    ],
  },
  {
    day: 7,
    title: "AI Control & Hardware Governance",
    items: [
      "Hardware supply chains",
      "AI control mechanisms",
      "Governance frameworks and policy",
    ],
  },
];

/* ─── Info cards data ─── */
const infoCards = [
  { label: "7 Days", sub: "In-Person" },
  { label: "10\u201312", sub: "Participants (curated cohort)" },
  { label: "Senior Level", sub: "Mid-to-late career professionals" },
  { label: "Hands-On Labs", sub: "Red / blue team exercises" },
];

/* ─── Jump-to sections ─── */
const jumpLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Who Should Attend", href: "#who" },
  { label: "Team", href: "#team" },
];

/* ─── Bullet list for "What You'll Learn" ─── */
const learnings = [
  "Understand threat models from current AI systems to future catastrophic misuse and misalignment scenarios",
  "Master foundational attack vectors and defenses across the security stack that scale to advanced AI systems",
  "Gain hands-on experience with security challenges that become critical as AI capabilities increase",
  "Evaluate defensive measures through a GCR lens: which approaches remain effective as systems become more capable?",
  "Explore high-impact career pathways in AI security through GCR-focused fellowships, organizations, and research",
];

/* ─── Team members ─── */
const team = [
  {
    name: "Pranav Gade",
    bio: "Research engineer at Conjecture. Created AISB to bridge AI safety and security, leads curriculum design and program direction.",
  },
  {
    name: "Nitzan Shulman",
    bio: "Head of Cyber Security at Heron AI Security Initiative. 6+ years security research specializing in IoT, robotics, malware and AI security.",
  },
];

/* ─── Accordion component ─── */
function AccordionItem({
  day,
  title,
  items,
}: {
  day: number;
  title: string;
  items: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border border-green-900/60 rounded-md overflow-hidden transition-colors"
      style={{
        background: open
          ? "rgba(0,255,65,0.03)"
          : "rgba(17,17,17,0.6)",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left group cursor-pointer"
      >
        <span className="font-mono text-sm sm:text-base">
          <span className="text-green-400 mr-2">Day&nbsp;{day}:</span>
          <span className="text-gray-200 group-hover:text-green-300 transition-colors">
            {title}
          </span>
        </span>
        <span
          className="text-green-500 text-xl transition-transform duration-300 flex-shrink-0 ml-4"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>

      <div
        className="transition-all duration-300 overflow-hidden"
        style={{ maxHeight: open ? "500px" : "0px", opacity: open ? 1 : 0 }}
      >
        <ul className="px-5 pb-5 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
              <span className="text-green-500 mt-0.5 flex-shrink-0 font-mono">
                &gt;
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── SectionHeading ─── */
function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="font-mono text-2xl sm:text-3xl text-green-400 mb-6 scroll-mt-24"
    >
      <span className="text-cyan-400 mr-2">#</span>
      {children}
    </h2>
  );
}

/* ─── GlowButton ─── */
function GlowButton({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}) {
  const isPrimary = variant === "primary";
  return (
    <a
      href={href}
      className={`inline-block font-mono text-sm sm:text-base px-7 py-3 rounded-md border transition-all duration-300 ${
        isPrimary
          ? "border-green-500 text-green-400 hover:bg-green-500/15 hover:text-green-300"
          : "border-cyan-600 text-cyan-400 hover:bg-cyan-500/15 hover:text-cyan-300"
      }`}
      style={{
        boxShadow: isPrimary
          ? "0 0 18px rgba(0,255,65,0.15), inset 0 0 18px rgba(0,255,65,0.04)"
          : "0 0 18px rgba(0,212,255,0.12), inset 0 0 18px rgba(0,212,255,0.03)",
      }}
    >
      {children}
    </a>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════ */
export default function SingaporeBootcampPage() {
  return (
    <div
      className="min-h-screen text-gray-300 selection:bg-green-500/30 selection:text-green-200"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage:
          "linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      {/* Scan-line overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
        }}
      />

      {/* ── HERO ── */}
      <header className="relative overflow-hidden">
        {/* Top glow accent */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(0,255,65,0.35) 0%, rgba(0,212,255,0.15) 60%, transparent 100%)",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-5 pt-20 pb-16 sm:pt-28 sm:pb-20 text-center">

          {/* Title */}
          <h1 className="font-mono text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-100 leading-tight mb-4">
            AI Security Bootcamp{" "}
            <span className="text-green-400">Singapore</span>
          </h1>

          {/* Subtitle */}
          <p className="font-mono text-base sm:text-lg text-cyan-400 max-w-2xl mx-auto mb-6">
            7-Day Global Catastrophic Risk Intensive for Senior Security
            Professionals
          </p>

          {/* Meta line */}
          <p className="font-mono text-sm text-gray-500 mb-10 flex flex-wrap justify-center gap-x-2 gap-y-1">
            <span>Singapore</span>
            <span className="text-green-700">|</span>
            <span>April 25 &ndash; May 1, 2026</span>
            <span className="text-green-700">|</span>
            <span>In-Person</span>
            <span className="text-green-700">|</span>
            <span className="text-green-400">Fully Funded</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-4">
            <GlowButton href="mailto:pranav@aisb.dev" variant="primary">
              Apply Now
            </GlowButton>
            <GlowButton href="#overview" variant="secondary">
              Learn More
            </GlowButton>
          </div>
        </div>
      </header>

      {/* ── INFO CARDS ── */}
      <section className="max-w-5xl mx-auto px-5 pb-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {infoCards.map((card) => (
            <div
              key={card.label}
              className="border border-green-900/50 rounded-lg px-5 py-5 text-center transition-colors hover:border-green-700/60"
              style={{
                background: "rgba(0,255,65,0.02)",
                boxShadow: "0 0 20px rgba(0,255,65,0.04)",
              }}
            >
              <p className="font-mono text-lg sm:text-xl text-green-400 font-semibold mb-1">
                {card.label}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">{card.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── JUMP-TO NAV ── */}
      <nav
        className="sticky top-0 z-40 border-y border-green-900/40"
        style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-5xl mx-auto px-5 flex items-center gap-6 overflow-x-auto py-3">
          {jumpLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-sm text-gray-500 hover:text-green-400 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── OVERVIEW ── */}
      <section className="max-w-5xl mx-auto px-5 py-16 sm:py-20">
        <SectionHeading id="overview">Overview</SectionHeading>

        <div className="space-y-5 text-gray-400 leading-relaxed max-w-3xl">
          <p>
            As frontier AI systems are deployed in enterprise environments, the
            stakes for security failures extend beyond individual organizations.
            Experienced security practitioners&mdash;the people best positioned
            to secure AI deployments&mdash;face few credible, time-efficient
            pathways to upskill in AI-specific security.
          </p>
          <p>
            AISB Singapore is a curated, practitioner-focused 7-day intensive
            designed to orient mid-to-late career InfoSec professionals to AI
            security topics relevant to advanced and emerging AI systems. The
            program prioritizes capability grounding through hands-on exercises
            over lecture-heavy formats.
          </p>
          <p>
            Participants complete targeted pre-work to establish baseline AI
            fundamentals, followed by an immersive week delivered in a T-shaped
            format: short lectures to align on threat models and priorities, then
            hands-on red/blue exercises that go deep on high-leverage skills.
          </p>
        </div>

        {/* What You'll Learn */}
        <div className="mt-12">
          <h3 className="font-mono text-lg sm:text-xl text-cyan-400 mb-5">
            <span className="text-green-500 mr-2">$</span>What You&apos;ll Learn
          </h3>
          <ul className="space-y-3 max-w-3xl">
            {learnings.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-gray-400">
                <span className="text-green-500 mt-0.5 flex-shrink-0 font-mono">
                  &gt;
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CURRICULUM ── */}
      <section className="max-w-5xl mx-auto px-5 pb-16 sm:pb-20">
        <SectionHeading id="curriculum">Curriculum</SectionHeading>

        <div className="space-y-3 max-w-3xl">
          {curriculum.map((day) => (
            <AccordionItem
              key={day.day}
              day={day.day}
              title={day.title}
              items={day.items}
            />
          ))}
        </div>
      </section>

      {/* ── WHO SHOULD ATTEND ── */}
      <section className="max-w-5xl mx-auto px-5 pb-16 sm:pb-20">
        <SectionHeading id="who">Who Should Attend</SectionHeading>

        <div className="max-w-3xl space-y-5">
          <p className="text-gray-400 leading-relaxed">
            Senior security professionals (10+ years preferred) with backgrounds
            in:
          </p>

          <ul className="space-y-2">
            {[
              "Red teaming",
              "Application security",
              "Infrastructure security",
              "Threat intelligence",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm sm:text-base text-gray-400"
              >
                <span className="text-green-500 font-mono">&gt;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="text-gray-500 text-sm leading-relaxed">
            Selection prioritizes candidates interested in frontier AI risk,
            high-consequence failure modes, or work involving sophisticated
            threat actors.
          </p>

          <div
            className="border border-cyan-800/40 rounded-lg px-5 py-4 mt-4"
            style={{
              background: "rgba(0,212,255,0.03)",
              boxShadow: "0 0 20px rgba(0,212,255,0.04)",
            }}
          >
            <p className="font-mono text-sm text-cyan-400">
              <span className="text-green-500 mr-2">[i]</span>
              The program is fully funded: flights, accommodation, and meals are
              covered.
            </p>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="max-w-5xl mx-auto px-5 pb-16 sm:pb-20">
        <SectionHeading id="team">Team</SectionHeading>

        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl">
          {team.map((member) => (
            <div
              key={member.name}
              className="border border-green-900/50 rounded-lg px-5 py-5 transition-colors hover:border-green-700/60"
              style={{
                background: "rgba(0,255,65,0.02)",
                boxShadow: "0 0 20px rgba(0,255,65,0.04)",
              }}
            >
              <p className="font-mono text-base text-green-400 font-semibold mb-2">
                {member.name}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>

        <div
          className="mt-5 max-w-3xl border border-green-900/40 rounded-lg px-5 py-4"
          style={{ background: "rgba(0,255,65,0.015)" }}
        >
          <p className="text-sm text-gray-500">
            <span className="text-green-600 font-mono mr-2">$</span>
            Local execution supported by the{" "}
            <span className="text-cyan-400">
              Singapore AI Safety Hub (SASH)
            </span>
          </p>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="border-t border-green-900/40">
        <div className="max-w-5xl mx-auto px-5 py-16 text-center">
          <p className="font-mono text-xl sm:text-2xl text-gray-200 mb-3">
            Ready to secure the frontier?
          </p>
          <p className="text-sm text-gray-500 mb-8 max-w-lg mx-auto">
            Applications are reviewed on a rolling basis. Reach out to discuss
            your fit for the program.
          </p>
          <GlowButton href="mailto:pranav@aisb.dev" variant="primary">
            Apply Now
          </GlowButton>
        </div>
      </section>

      {/* ── BOTTOM BAR ── */}
      <footer className="border-t border-green-900/30 py-6">
        <p className="text-center font-mono text-xs text-gray-600">
          &copy; 2026 AI Security Bootcamp &mdash; Singapore
        </p>
      </footer>
    </div>
  );
}
