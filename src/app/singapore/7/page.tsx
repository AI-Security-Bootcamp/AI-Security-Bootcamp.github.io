"use client";

import { useState } from "react";

const curriculumDays = [
  {
    day: "Day 1",
    title: "Introduction & Threat Modeling",
    items: [
      "Current threats: misuse (cyberattacks, bio uplift), application security, infrastructure security",
      "Future threats: misalignment, model theft, integrity attacks, governance guarantees",
      "Hands-on: Threat modeling exercises",
    ],
  },
  {
    day: "Day 2",
    title: "Adversarial Attacks, Watermarking & Data Security",
    items: [
      "Adversarial examples, trojans, weight extraction",
      "Watermarking techniques",
      "Data security for training and inference",
    ],
  },
  {
    day: "Day 3",
    title: "LLM Security",
    items: [
      "Constitutional classifiers, guardrails, abliteration, model editing",
      "Tokenization vulnerabilities",
      "Prompt injection, jailbreaks",
    ],
  },
  {
    day: "Day 4",
    title: "Infrastructure Security",
    items: [
      "NVIDIA Container Toolkit exploits, GPU isolation",
      "Confidential computing, sandboxing",
      "Container security fundamentals",
    ],
  },
  {
    day: "Day 5",
    title: "Formal Methods & Analysis",
    items: [
      "Verification-oriented techniques",
      "RAND report analysis",
      "Output verification approaches",
    ],
  },
  {
    day: "Day 6",
    title: "Data Center Security & ML Stack Threat Modeling",
    items: [
      "Data center infrastructure (power, cooling, networking, physical security)",
      "ML stack threat modeling",
      "Potential site visit",
    ],
  },
  {
    day: "Day 7",
    title: "AI Control & Hardware Governance",
    items: [
      "Hardware supply chains",
      "AI control mechanisms",
      "Governance frameworks and policy",
    ],
  },
];

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
    <div className="border-b-2 border-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 px-0 text-left focus:outline-none group"
      >
        <div className="flex items-baseline gap-6">
          <span className="text-[#ef4444] font-black text-sm uppercase tracking-widest">
            {day}
          </span>
          <span className="text-white font-bold text-lg md:text-xl">
            {title}
          </span>
        </div>
        <span className="text-white text-3xl font-light leading-none select-none">
          {open ? "\u2212" : "+"}
        </span>
      </button>
      {open && (
        <ul className="pb-6 pl-0 space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-4 text-neutral-300">
              <span className="text-[#ef4444] mt-1 text-xs">{"\u25A0"}</span>
              <span className="text-base">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SingaporeBootcampPage() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* ===================== HERO ===================== */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 relative">
        <div className="max-w-5xl">
          <p className="text-[#ef4444] font-black text-sm tracking-[0.3em] uppercase mb-8">
            GCR-FOCUSED
          </p>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-8">
            AI Security
            <br />
            Bootcamp{" "}
            <span className="text-neutral-500">&mdash;</span>{" "}
            Singapore
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-6 leading-relaxed">
            7-Day Global Catastrophic Risk Intensive for Senior Security
            Professionals
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500 font-bold uppercase tracking-widest mb-12">
            <span>Singapore</span>
            <span className="text-[#ef4444]">|</span>
            <span>April 25 &ndash; May 1, 2026</span>
            <span className="text-[#ef4444]">|</span>
            <span>In-Person</span>
            <span className="text-[#ef4444]">|</span>
            <span>Fully Funded</span>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:pranav@aisb.dev"
              className="inline-block bg-[#ef4444] text-white font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-red-600 transition-colors"
            >
              Apply Now
            </a>
            <button
              onClick={() => scrollTo("overview")}
              className="inline-block border-2 border-white text-white font-black text-sm uppercase tracking-widest px-8 py-4 bg-transparent hover:bg-white hover:text-black transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-16 bg-neutral-700" />
        </div>
      </section>

      {/* ===================== INFO CARDS ===================== */}
      <section className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {[
            { label: "7 Days", sub: "In-Person" },
            { label: "10\u201312", sub: "Participants \u00B7 Curated Cohort" },
            { label: "Senior Level", sub: "Mid-to-Late Career Professionals" },
            { label: "Hands-On Labs", sub: "Red / Blue Team Exercises" },
          ].map((card, i) => (
            <div
              key={i}
              className={`border-2 border-white p-8 ${
                i > 0 ? "lg:border-l-0" : ""
              } ${i > 1 ? "sm:border-t-0 lg:border-t-2" : ""} ${
                i === 1 ? "sm:border-l-0 lg:border-l-0" : ""
              } ${i === 2 ? "sm:border-t-0" : ""} ${
                i === 3 ? "sm:border-t-0 sm:border-l-0" : ""
              }`}
            >
              <p className="text-2xl md:text-3xl font-black mb-2">
                {card.label}
              </p>
              <p className="text-sm text-neutral-500 font-bold uppercase tracking-widest">
                {card.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== JUMP-TO NAV ===================== */}
      <nav className="px-6 md:px-16 lg:px-24 py-6 border-t-2 border-white flex flex-wrap gap-8">
        {["Overview", "Curriculum", "Who Should Attend", "Team"].map(
          (item) => (
            <button
              key={item}
              onClick={() =>
                scrollTo(item.toLowerCase().replace(/\s+/g, "-"))
              }
              className="text-sm font-black uppercase tracking-widest text-neutral-500 hover:text-[#ef4444] transition-colors bg-transparent border-none cursor-pointer"
            >
              {item}
            </button>
          )
        )}
      </nav>

      {/* ===================== OVERVIEW ===================== */}
      <section
        id="overview"
        className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-white"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-16 tracking-tight">
          Overview
        </h2>

        <div className="max-w-3xl space-y-8 text-neutral-300 text-base md:text-lg leading-relaxed">
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
        <div className="mt-20">
          <h3 className="text-2xl md:text-3xl font-black mb-10 tracking-tight">
            What You&apos;ll Learn
          </h3>
          <ul className="space-y-5 max-w-3xl">
            {[
              "Understand threat models from current AI systems to future catastrophic misuse and misalignment scenarios",
              "Master foundational attack vectors and defenses across the security stack that scale to advanced AI systems",
              "Gain hands-on experience with security challenges that become critical as AI capabilities increase",
              "Evaluate defensive measures through a GCR lens: which approaches remain effective as systems become more capable?",
              "Explore high-impact career pathways in AI security through GCR-focused fellowships, organizations, and research",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="text-[#ef4444] mt-1.5 text-xs font-black">
                  {"\u25A0"}
                </span>
                <span className="text-neutral-300 text-base md:text-lg leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===================== CURRICULUM ===================== */}
      <section
        id="curriculum"
        className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-white"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-16 tracking-tight">
          Curriculum
        </h2>

        <div className="max-w-3xl border-t-2 border-white">
          {curriculumDays.map((day) => (
            <AccordionItem
              key={day.day}
              day={day.day}
              title={day.title}
              items={day.items}
            />
          ))}
        </div>
      </section>

      {/* ===================== WHO SHOULD ATTEND ===================== */}
      <section
        id="who-should-attend"
        className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-white"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-16 tracking-tight">
          Who Should Attend
        </h2>

        <div className="max-w-3xl">
          <p className="text-neutral-300 text-base md:text-lg leading-relaxed mb-10">
            Senior security professionals (10+ years preferred) with backgrounds
            in:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 mb-10">
            {[
              "Red Teaming",
              "Application Security",
              "Infrastructure Security",
              "Threat Intelligence",
            ].map((bg, i) => (
              <div
                key={i}
                className={`border-2 border-white p-6 ${
                  i % 2 !== 0 ? "sm:border-l-0" : ""
                } ${i >= 2 ? "border-t-0" : ""}`}
              >
                <p className="font-black text-lg">{bg}</p>
              </div>
            ))}
          </div>

          <p className="text-neutral-300 text-base md:text-lg leading-relaxed mb-8">
            Selection prioritizes candidates interested in frontier AI risk,
            high-consequence failure modes, or work involving sophisticated
            threat actors.
          </p>

          <div className="border-l-4 border-[#ef4444] pl-6">
            <p className="text-white font-black text-lg md:text-xl">
              Fully funded: flights, accommodation, and meals are covered.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== TEAM ===================== */}
      <section
        id="team"
        className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-white"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-16 tracking-tight">
          Team
        </h2>

        <div className="max-w-3xl space-y-12">
          {/* Pranav */}
          <div className="border-2 border-white p-8">
            <p className="text-[#ef4444] font-black text-sm uppercase tracking-widest mb-2">
              Program Lead
            </p>
            <h3 className="text-2xl md:text-3xl font-black mb-4">
              Pranav Gade
            </h3>
            <p className="text-neutral-300 text-base md:text-lg leading-relaxed">
              Research engineer at Conjecture. Created AISB to bridge AI safety
              and security, leads curriculum design and program direction.
            </p>
          </div>

          {/* Nitzan */}
          <div className="border-2 border-white p-8">
            <p className="text-[#ef4444] font-black text-sm uppercase tracking-widest mb-2">
              Security Lead
            </p>
            <h3 className="text-2xl md:text-3xl font-black mb-4">
              Nitzan Shulman
            </h3>
            <p className="text-neutral-300 text-base md:text-lg leading-relaxed">
              Head of Cyber Security at Heron AI Security Initiative. 6+ years
              security research specializing in IoT, robotics, malware and AI
              security.
            </p>
          </div>

          {/* SASH */}
          <div className="border-2 border-white p-8">
            <p className="text-[#ef4444] font-black text-sm uppercase tracking-widest mb-2">
              Local Partner
            </p>
            <h3 className="text-2xl md:text-3xl font-black mb-4">
              Singapore AI Safety Hub (SASH)
            </h3>
            <p className="text-neutral-300 text-base md:text-lg leading-relaxed">
              Local execution and logistics support provided by the Singapore AI
              Safety Hub.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== CTA / FOOTER ===================== */}
      <section className="px-6 md:px-16 lg:px-24 py-20 border-t-2 border-white">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 tracking-tight">
            Ready to Apply?
          </h2>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
            Applications are reviewed on a rolling basis. Reach out to express
            interest or ask questions about the program.
          </p>
          <a
            href="mailto:pranav@aisb.dev"
            className="inline-block bg-[#ef4444] text-white font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-red-600 transition-colors"
          >
            Apply Now
          </a>
        </div>
      </section>

      {/* ===================== BOTTOM BAR ===================== */}
      <footer className="px-6 md:px-16 lg:px-24 py-8 border-t-2 border-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-neutral-600 text-sm font-bold uppercase tracking-widest">
          AI Security Bootcamp &mdash; Singapore 2026
        </p>
        <a
          href="mailto:pranav@aisb.dev"
          className="text-neutral-600 text-sm font-bold uppercase tracking-widest hover:text-[#ef4444] transition-colors"
        >
          pranav@aisb.dev
        </a>
      </footer>
    </div>
  );
}
