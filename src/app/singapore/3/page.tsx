"use client";

import { useState } from "react";
import Link from "next/link";

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

export default function SingaporeBootcamp3() {
  const [openDays, setOpenDays] = useState<Record<number, boolean>>({});

  const toggleDay = (index: number) => {
    setOpenDays((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ===== DARK HERO SECTION ===== */}
      <section className="relative bg-[#0f172a] text-white overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />

        {/* Grid pattern decoration */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-20 md:pb-24">
          {/* Back nav */}
          <Link
            href="/"
            className="inline-flex items-center text-slate-400 hover:text-white transition mb-12 text-sm"
          >
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4 tracking-tight">
            AI Security Bootcamp{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Singapore
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-300 text-center max-w-3xl mx-auto mb-8">
            7-Day Global Catastrophic Risk Intensive for Senior Security
            Professionals
          </p>

          {/* Meta info row */}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-sm text-slate-400 mb-10">
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Singapore
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              April 25 – May 1, 2026
            </span>
            <span className="text-slate-600">|</span>
            <span>In-Person</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-medium">Fully Funded</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <a
              href="mailto:pranav@aisb.dev"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition text-center flex-1"
            >
              Apply Now
            </a>
            <button
              onClick={() => scrollTo("overview")}
              className="border border-slate-500 text-slate-200 hover:bg-slate-800 px-8 py-3 rounded-lg font-semibold transition flex-1"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Bottom fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* ===== INFO CARDS ===== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: (
                <svg
                  className="w-7 h-7 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              ),
              label: "7 Days",
              sub: "In-Person",
            },
            {
              icon: (
                <svg
                  className="w-7 h-7 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              ),
              label: "10-12 Participants",
              sub: "Curated Cohort",
            },
            {
              icon: (
                <svg
                  className="w-7 h-7 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              ),
              label: "Senior Level",
              sub: "Mid-to-Late Career",
            },
            {
              icon: (
                <svg
                  className="w-7 h-7 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              ),
              label: "Hands-On Labs",
              sub: "Red/Blue Team Exercises",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 text-center"
            >
              <div className="flex justify-center mb-3">{card.icon}</div>
              <p className="font-semibold text-gray-900 text-lg">{card.label}</p>
              <p className="text-sm text-gray-500">{card.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== JUMP-TO NAV ===== */}
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="border border-gray-200 rounded-lg bg-gray-50 p-3 flex flex-wrap gap-2 justify-center">
          {[
            { label: "Overview", id: "overview" },
            { label: "Curriculum", id: "curriculum" },
            { label: "Who Should Attend", id: "who" },
            { label: "Team", id: "team" },
          ].map((nav) => (
            <button
              key={nav.id}
              onClick={() => scrollTo(nav.id)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-white rounded-md transition"
            >
              {nav.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ===== OVERVIEW ===== */}
      <section id="overview" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 scroll-mt-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Overview
        </h2>

        <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
          <p>
            As frontier AI systems are deployed in enterprise environments, the
            stakes for security failures extend beyond individual organizations.
            Experienced security practitioners — the people best positioned to
            secure AI deployments — face few credible, time-efficient pathways to
            upskill in AI-specific security.
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
          <h3 className="text-2xl font-bold mb-6">What You&apos;ll Learn</h3>
          <ul className="space-y-4">
            {[
              "Understand threat models from current AI systems to future catastrophic misuse and misalignment scenarios",
              "Master foundational attack vectors and defenses across the security stack that scale to advanced AI systems",
              "Gain hands-on experience with security challenges that become critical as AI capabilities increase",
              "Evaluate defensive measures through a GCR lens: which approaches remain effective as systems become more capable?",
              "Explore high-impact career pathways in AI security through GCR-focused fellowships, organizations, and research",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 bg-blue-600 rounded-full shrink-0" />
                <span className="text-gray-700 text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== CURRICULUM ===== */}
      <section
        id="curriculum"
        className="bg-gray-50 py-16 mb-20 scroll-mt-8"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Curriculum
          </h2>
          <p className="text-gray-500 text-center mb-10">
            7 days of structured learning with hands-on exercises each day
          </p>

          <div className="space-y-3">
            {curriculumDays.map((day, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleDay(index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap">
                      {day.day}
                    </span>
                    <span className="font-semibold text-gray-900 text-lg">
                      {day.title}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ml-4 ${
                      openDays[index] ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {openDays[index] && (
                  <div className="px-6 pb-5 border-t border-gray-100">
                    <ul className="mt-4 space-y-3">
                      {day.items.map((item, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-3 text-gray-700"
                        >
                          <span className="mt-2 w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHO SHOULD ATTEND ===== */}
      <section id="who" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 scroll-mt-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Who Should Attend
        </h2>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <p className="text-gray-700 text-lg mb-6">
            Senior security professionals (10+ years preferred) with backgrounds
            in:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {[
              "Red teaming",
              "Application security",
              "Infrastructure security",
              "Threat intelligence",
            ].map((bg, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-gray-50 rounded-lg px-5 py-3"
              >
                <svg
                  className="w-5 h-5 text-blue-600 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-800 font-medium">{bg}</span>
              </div>
            ))}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">
            Selection prioritizes candidates interested in frontier AI risk,
            high-consequence failure modes, or work involving sophisticated
            threat actors.
          </p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 flex items-start gap-3">
            <svg
              className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-emerald-800 font-medium">
              The program is fully funded: flights, accommodation, and meals are
              covered.
            </p>
          </div>
        </div>
      </section>

      {/* ===== TEAM ===== */}
      <section
        id="team"
        className="bg-gray-50 py-16 mb-0 scroll-mt-8"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            Team
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Pranav */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Pranav Gade
              </h3>
              <p className="text-sm text-blue-600 font-medium mb-4">
                Program Lead & Curriculum Design
              </p>
              <p className="text-gray-600 leading-relaxed">
                Research engineer at Conjecture. Created AISB to bridge AI
                safety and security, leads curriculum design and program
                direction.
              </p>
            </div>

            {/* Nitzan */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Nitzan Shulman
              </h3>
              <p className="text-sm text-blue-600 font-medium mb-4">
                Security Research Lead
              </p>
              <p className="text-gray-600 leading-relaxed">
                Head of Cyber Security at Heron AI Security Initiative. 6+ years
                security research specializing in IoT, robotics, malware and AI
                security.
              </p>
            </div>
          </div>

          {/* SASH */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <p className="text-gray-600">
              Local execution supported by the{" "}
              <span className="font-semibold text-gray-900">
                Singapore AI Safety Hub (SASH)
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#0f172a] text-slate-400 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-semibold text-white mb-2">
            AI Security Bootcamp
          </p>
          <p className="text-sm mb-6">Singapore | April 25 – May 1, 2026</p>
          <a
            href="mailto:pranav@aisb.dev"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition text-sm"
          >
            Apply Now
          </a>
          <p className="mt-8 text-xs text-slate-500">
            Questions? Reach out at{" "}
            <a
              href="mailto:pranav@aisb.dev"
              className="text-blue-400 hover:underline"
            >
              pranav@aisb.dev
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
