"use client";

import { useState, useEffect } from "react";

const curriculumDays = [
  {
    day: "Day 1",
    title: "Introduction & Threat Modeling",
    topics: [
      "Current threats: misuse (cyberattacks, bio uplift), application security, infrastructure security",
      "Future threats: misalignment, model theft, integrity attacks, governance guarantees",
      "Hands-on: Threat modeling exercises",
    ],
  },
  {
    day: "Day 2",
    title: "Adversarial Attacks, Watermarking & Data Security",
    topics: [
      "Adversarial examples, trojans, weight extraction",
      "Watermarking techniques",
      "Data security for training and inference",
    ],
  },
  {
    day: "Day 3",
    title: "LLM Security",
    topics: [
      "Constitutional classifiers, guardrails, abliteration, model editing",
      "Tokenization vulnerabilities",
      "Prompt injection, jailbreaks",
    ],
  },
  {
    day: "Day 4",
    title: "Infrastructure Security",
    topics: [
      "NVIDIA Container Toolkit exploits, GPU isolation",
      "Confidential computing, sandboxing",
      "Container security fundamentals",
    ],
  },
  {
    day: "Day 5",
    title: "Formal Methods & Analysis",
    topics: [
      "Verification-oriented techniques",
      "RAND report analysis",
      "Output verification approaches",
    ],
  },
  {
    day: "Day 6",
    title: "Data Center Security & ML Stack Threat Modeling",
    topics: [
      "Data center infrastructure (power, cooling, networking, physical security)",
      "ML stack threat modeling",
      "Potential site visit",
    ],
  },
  {
    day: "Day 7",
    title: "AI Control & Hardware Governance",
    topics: [
      "Hardware supply chains",
      "AI control mechanisms",
      "Governance frameworks and policy",
    ],
  },
];

const navSections = [
  { id: "overview", label: "Overview" },
  { id: "curriculum", label: "Curriculum" },
  { id: "who-should-attend", label: "Who Should Attend" },
  { id: "team", label: "Team" },
];

function ShieldIcon() {
  return (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  );
}

function BeakerIcon() {
  return (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.251.023.501.05.75.082m-.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export default function SingaporeBootcamp() {
  const [openDays, setOpenDays] = useState<Record<number, boolean>>({});
  const [activeSection, setActiveSection] = useState<string>("overview");

  const toggleDay = (index: number) => {
    setOpenDays((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const expandAll = () => {
    const allOpen: Record<number, boolean> = {};
    curriculumDays.forEach((_, i) => {
      allOpen[i] = true;
    });
    setOpenDays(allOpen);
  };

  const collapseAll = () => {
    setOpenDays({});
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = navSections.map((s) => ({
        id: s.id,
        el: document.getElementById(s.id),
      }));
      const scrollY = window.scrollY + 140;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i].el;
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sections[i].id);
          return;
        }
      }
      setActiveSection("overview");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ========== TOP BAR ========== */}
      <div className="bg-[#0f3460] border-b border-[#1a3a6e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-sm">
          <a href="/" className="font-bold tracking-wide text-white hover:text-blue-200 transition">
            AISB
          </a>
          <a
            href="mailto:pranav@aisb.dev"
            className="text-blue-200 hover:text-white transition"
          >
            pranav@aisb.dev
          </a>
        </div>
      </div>

      {/* ========== HERO SECTION ========== */}
      <header
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
              AI Security Bootcamp
              <span className="block text-blue-300">Singapore</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              7-Day Global Catastrophic Risk Intensive for Senior Security
              Professionals
            </p>

            {/* Meta info pills */}
            <div className="flex flex-wrap gap-3 mb-10 text-sm">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5">
                <MapPinIcon />
                Singapore
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5">
                <CalendarIcon />
                April 25 &ndash; May 1, 2026
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5">
                In-Person
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full px-4 py-1.5 font-medium">
                Fully Funded
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:pranav@aisb.dev"
                className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-base shadow-lg shadow-blue-500/25"
              >
                Apply Now
              </a>
              <button
                onClick={() => scrollTo("overview")}
                className="inline-flex items-center justify-center border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-base"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========== INFO CARDS ========== */}
      <section className="bg-[#16213e] border-y border-[#1a3a6e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-[#1a1a2e]/80 border border-[#2a2a4e] rounded-xl p-6 text-center hover:border-blue-500/40 transition-colors">
              <div className="flex justify-center mb-3 text-blue-400">
                <CalendarIcon />
              </div>
              <div className="text-2xl font-bold mb-1">7 Days</div>
              <div className="text-sm text-gray-400">In-Person</div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#1a1a2e]/80 border border-[#2a2a4e] rounded-xl p-6 text-center hover:border-blue-500/40 transition-colors">
              <div className="flex justify-center mb-3 text-blue-400">
                <UsersIcon />
              </div>
              <div className="text-2xl font-bold mb-1">10&ndash;12 Participants</div>
              <div className="text-sm text-gray-400">Curated Cohort</div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#1a1a2e]/80 border border-[#2a2a4e] rounded-xl p-6 text-center hover:border-blue-500/40 transition-colors">
              <div className="flex justify-center mb-3 text-blue-400">
                <BriefcaseIcon />
              </div>
              <div className="text-2xl font-bold mb-1">Senior Level</div>
              <div className="text-sm text-gray-400">
                Mid-to-Late Career Professionals
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#1a1a2e]/80 border border-[#2a2a4e] rounded-xl p-6 text-center hover:border-blue-500/40 transition-colors">
              <div className="flex justify-center mb-3 text-blue-400">
                <BeakerIcon />
              </div>
              <div className="text-2xl font-bold mb-1">Hands-On Labs</div>
              <div className="text-sm text-gray-400">
                Red/Blue Team Exercises
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== STICKY JUMP-TO NAV ========== */}
      <nav className="sticky top-0 z-50 bg-[#1a1a2e]/95 backdrop-blur-md border-b border-[#2a2a4e] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-0 scrollbar-hide">
            {navSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={`whitespace-nowrap px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeSection === section.id
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ========== MAIN CONTENT ========== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {/* ---------- OVERVIEW ---------- */}
        <section id="overview">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">Overview</h2>
          <div className="w-16 h-1 bg-blue-500 rounded mb-10" />

          <div className="max-w-4xl space-y-6 text-gray-300 leading-relaxed text-lg">
            <p>
              As frontier AI systems are deployed in enterprise environments,
              the stakes for security failures extend beyond individual
              organizations. Experienced security practitioners &mdash; the
              people best positioned to secure AI deployments &mdash; face few
              credible, time-efficient pathways to upskill in AI-specific
              security.
            </p>
            <p>
              AISB Singapore is a curated, practitioner-focused 7-day intensive
              designed to orient mid-to-late career InfoSec professionals to AI
              security topics relevant to advanced and emerging AI systems. The
              program prioritizes capability grounding through hands-on
              exercises over lecture-heavy formats.
            </p>
            <p>
              Participants complete targeted pre-work to establish baseline AI
              fundamentals, followed by an immersive week delivered in a
              T-shaped format: short lectures to align on threat models and
              priorities, then hands-on red/blue exercises that go deep on
              high-leverage skills.
            </p>
          </div>

          {/* What You'll Learn */}
          <div className="mt-14">
            <h3 className="text-2xl font-bold mb-6">What You&apos;ll Learn</h3>
            <div className="space-y-4">
              {[
                "Understand threat models from current AI systems to future catastrophic misuse and misalignment scenarios",
                "Master foundational attack vectors and defenses across the security stack that scale to advanced AI systems",
                "Gain hands-on experience with security challenges that become critical as AI capabilities increase",
                "Evaluate defensive measures through a GCR lens: which approaches remain effective as systems become more capable?",
                "Explore high-impact career pathways in AI security through GCR-focused fellowships, organizations, and research",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircleIcon />
                  <span className="text-gray-300 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- CURRICULUM ---------- */}
        <section id="curriculum">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-2">
            <h2 className="text-3xl sm:text-4xl font-bold">Curriculum</h2>
            <div className="flex gap-3 text-sm">
              <button
                onClick={expandAll}
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Expand All
              </button>
              <span className="text-gray-600">|</span>
              <button
                onClick={collapseAll}
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Collapse All
              </button>
            </div>
          </div>
          <div className="w-16 h-1 bg-blue-500 rounded mb-10" />

          <div className="space-y-3">
            {curriculumDays.map((day, index) => (
              <div
                key={index}
                className="border border-[#2a2a4e] rounded-lg overflow-hidden bg-[#1a1a2e]/60 hover:border-[#3a3a5e] transition-colors"
              >
                <button
                  onClick={() => toggleDay(index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="inline-block bg-[#0f3460] text-blue-300 text-xs font-bold tracking-wide uppercase px-3 py-1 rounded">
                      {day.day}
                    </span>
                    <span className="text-lg font-semibold">{day.title}</span>
                  </div>
                  <ChevronDownIcon open={!!openDays[index]} />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openDays[index]
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <div className="px-6 pb-5 pl-[5.5rem]">
                    <ul className="space-y-2">
                      {day.topics.map((topic, tIndex) => (
                        <li
                          key={tIndex}
                          className="flex items-start gap-2 text-gray-300"
                        >
                          <span className="text-blue-400 mt-2 flex-shrink-0">
                            <svg
                              className="w-1.5 h-1.5"
                              fill="currentColor"
                              viewBox="0 0 6 6"
                            >
                              <circle cx="3" cy="3" r="3" />
                            </svg>
                          </span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- WHO SHOULD ATTEND ---------- */}
        <section id="who-should-attend">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">
            Who Should Attend
          </h2>
          <div className="w-16 h-1 bg-blue-500 rounded mb-10" />

          <div className="grid md:grid-cols-2 gap-10">
            {/* Left: Description */}
            <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
              <p>
                Senior security professionals (10+ years preferred) with
                backgrounds in:
              </p>
              <ul className="space-y-3 ml-1">
                {[
                  "Red teaming",
                  "Application security",
                  "Infrastructure security",
                  "Threat intelligence",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <ShieldIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                Selection prioritizes candidates interested in frontier AI risk,
                high-consequence failure modes, or work involving sophisticated
                threat actors.
              </p>
            </div>

            {/* Right: Funding box */}
            <div className="flex items-start">
              <div className="bg-gradient-to-br from-[#0f3460] to-[#1a1a2e] border border-blue-500/20 rounded-xl p-8 w-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">&#9992;</span>
                  <h3 className="text-xl font-bold">Fully Funded Program</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  The program is fully funded: flights, accommodation, and meals
                  are covered. We want to remove financial barriers so the best
                  candidates can attend regardless of their circumstances.
                </p>
                <a
                  href="mailto:pranav@aisb.dev"
                  className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg shadow-blue-500/25"
                >
                  Apply Now
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- TEAM ---------- */}
        <section id="team">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">Team</h2>
          <div className="w-16 h-1 bg-blue-500 rounded mb-10" />

          <div className="grid md:grid-cols-2 gap-6">
            {/* Pranav Gade */}
            <div className="bg-[#1a1a2e]/80 border border-[#2a2a4e] rounded-xl p-6 hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-[#0f3460] flex items-center justify-center text-blue-300 font-bold text-xl flex-shrink-0">
                  PG
                </div>
                <div>
                  <h3 className="text-lg font-bold">Pranav Gade</h3>
                  <p className="text-sm text-blue-400">Program Lead</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Research engineer at Conjecture. Created AISB to bridge AI
                safety and security, leads curriculum design and program
                direction.
              </p>
            </div>

            {/* Nitzan Shulman */}
            <div className="bg-[#1a1a2e]/80 border border-[#2a2a4e] rounded-xl p-6 hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-[#0f3460] flex items-center justify-center text-blue-300 font-bold text-xl flex-shrink-0">
                  NS
                </div>
                <div>
                  <h3 className="text-lg font-bold">Nitzan Shulman</h3>
                  <p className="text-sm text-blue-400">Security Lead</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Head of Cyber Security at Heron AI Security Initiative. 6+ years
                security research specializing in IoT, robotics, malware and AI
                security.
              </p>
            </div>

            {/* SASH */}
            <div className="bg-[#1a1a2e]/80 border border-[#2a2a4e] rounded-xl p-6 hover:border-blue-500/30 transition-colors md:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-[#0f3460] flex items-center justify-center text-blue-300 flex-shrink-0">
                  <MapPinIcon />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    Singapore AI Safety Hub (SASH)
                  </h3>
                  <p className="text-sm text-blue-400">Local Execution Partner</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Local execution supported by the Singapore AI Safety Hub (SASH),
                providing on-the-ground logistics, venue coordination, and
                connections to the regional AI safety community.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-[#2a2a4e] bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="font-bold text-xl mb-1">
                AI Security Bootcamp
              </div>
              <p className="text-sm text-gray-500">
                Singapore &middot; April 25 &ndash; May 1, 2026
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="mailto:pranav@aisb.dev"
                className="text-gray-400 hover:text-white transition text-sm"
              >
                pranav@aisb.dev
              </a>
              <a
                href="/"
                className="text-gray-400 hover:text-white transition text-sm"
              >
                aisb.dev
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
