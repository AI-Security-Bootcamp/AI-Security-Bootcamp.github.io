"use client";

import { useState } from "react";

const curriculumDays = [
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

const sections = [
  { id: "overview", label: "Overview" },
  { id: "curriculum", label: "Curriculum" },
  { id: "who", label: "Who Should Attend" },
  { id: "team", label: "Team" },
];

export default function SingaporePage() {
  const [openDays, setOpenDays] = useState<number[]>([]);

  const toggleDay = (day: number) => {
    setOpenDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="min-h-screen text-white" style={{ background: "#0c0a1d" }}>
      {/* ===== HERO ===== */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #1e1b4b 0%, #1e3a5f 50%, #1e1b4b 100%)",
        }}
      >
        {/* Decorative gradient orbs */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 sm:py-32 text-center">
          {/* Badge */}
          <div className="inline-block mb-8">
            <span
              className="px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full"
              style={{
                border: "1.5px solid transparent",
                backgroundClip: "padding-box, border-box",
                backgroundOrigin: "padding-box, border-box",
                backgroundImage:
                  "linear-gradient(#1e1b4b, #1e1b4b), linear-gradient(135deg, #8b5cf6, #3b82f6)",
                color: "#c4b5fd",
              }}
            >
              GCR-Focused
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            AI Security Bootcamp{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #3b82f6, #8b5cf6)",
              }}
            >
              &mdash; Singapore
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-4">
            7-Day Global Catastrophic Risk Intensive for Senior Security
            Professionals
          </p>

          <p className="text-sm text-slate-400 mb-10 flex flex-wrap justify-center gap-x-3 gap-y-1">
            <span>Singapore</span>
            <span className="text-slate-600">|</span>
            <span>April 25 &ndash; May 1, 2026</span>
            <span className="text-slate-600">|</span>
            <span>In-Person</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-semibold">Fully Funded</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:pranav@aisb.dev"
              className="px-8 py-3 rounded-lg font-semibold text-white text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              }}
            >
              Apply Now
            </a>
            <a
              href="#overview"
              className="px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:bg-white/10"
              style={{
                border: "1.5px solid rgba(139, 92, 246, 0.5)",
                color: "#c4b5fd",
              }}
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ===== INFO CARDS ===== */}
      <section className="max-w-5xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              ),
              title: "7 Days",
              subtitle: "In-Person",
              accent: "#3b82f6",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              ),
              title: "10\u201312 Participants",
              subtitle: "Curated Cohort",
              accent: "#8b5cf6",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              ),
              title: "Senior Level",
              subtitle: "Mid-to-Late Career",
              accent: "#3b82f6",
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L11.42 4.97m-5.1 5.1H21M3 21h18" />
                </svg>
              ),
              title: "Hands-On Labs",
              subtitle: "Red/Blue Team Exercises",
              accent: "#8b5cf6",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="rounded-xl p-5 text-center transition-all duration-300 hover:scale-105"
              style={{
                background: "rgba(30, 27, 75, 0.6)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(139, 92, 246, 0.15)",
              }}
            >
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3"
                style={{ color: card.accent, background: `${card.accent}15` }}
              >
                {card.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{card.title}</h3>
              <p className="text-sm text-slate-400 mt-1">{card.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== JUMP-TO NAV ===== */}
      <nav className="max-w-5xl mx-auto px-6 mt-16 mb-12">
        <div
          className="flex flex-wrap justify-center gap-2 rounded-xl p-2"
          style={{
            background: "rgba(30, 27, 75, 0.5)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(139, 92, 246, 0.12)",
          }}
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="px-5 py-2 rounded-lg text-sm font-medium text-slate-300 transition-colors duration-200 hover:text-white hover:bg-white/5"
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ===== OVERVIEW ===== */}
      <section id="overview" className="max-w-4xl mx-auto px-6 py-16">
        <h2
          className="text-3xl sm:text-4xl font-extrabold mb-8 bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(90deg, #e2e8f0, #94a3b8)",
          }}
        >
          Overview
        </h2>

        <div className="space-y-6 text-slate-300 leading-relaxed text-base sm:text-lg">
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
        <div className="mt-14">
          <h3 className="text-2xl font-bold text-white mb-6">
            What You&rsquo;ll Learn
          </h3>
          <ul className="space-y-4">
            {[
              "Understand threat models from current AI systems to future catastrophic misuse and misalignment scenarios",
              "Master foundational attack vectors and defenses across the security stack that scale to advanced AI systems",
              "Gain hands-on experience with security challenges that become critical as AI capabilities increase",
              "Evaluate defensive measures through a GCR lens: which approaches remain effective as systems become more capable?",
              "Explore high-impact career pathways in AI security through GCR-focused fellowships, organizations, and research",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  }}
                >
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </span>
                <span className="text-slate-300 text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== CURRICULUM ===== */}
      <section id="curriculum" className="max-w-4xl mx-auto px-6 py-16">
        <h2
          className="text-3xl sm:text-4xl font-extrabold mb-10 bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(90deg, #e2e8f0, #94a3b8)",
          }}
        >
          Curriculum
        </h2>

        <div className="space-y-3">
          {curriculumDays.map((day) => {
            const isOpen = openDays.includes(day.day);
            return (
              <div
                key={day.day}
                className="rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background: isOpen
                    ? "rgba(30, 27, 75, 0.7)"
                    : "rgba(30, 27, 75, 0.4)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: isOpen
                    ? "1px solid rgba(139, 92, 246, 0.3)"
                    : "1px solid rgba(139, 92, 246, 0.1)",
                }}
              >
                <button
                  onClick={() => toggleDay(day.day)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors duration-200 hover:bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-md"
                      style={{
                        background:
                          "linear-gradient(135deg, #3b82f620, #8b5cf620)",
                        color: "#a78bfa",
                      }}
                    >
                      Day {day.day}
                    </span>
                    <span className="font-semibold text-white text-base">
                      {day.title}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5">
                    <div
                      className="h-px mb-4"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)",
                      }}
                    />
                    <ul className="space-y-3">
                      {day.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-slate-300 text-sm"
                        >
                          <span
                            className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: "#8b5cf6" }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== WHO SHOULD ATTEND ===== */}
      <section id="who" className="py-16">
        <div
          className="max-w-4xl mx-auto px-6 py-14 rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(30, 27, 75, 0.8), rgba(30, 58, 95, 0.6))",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(139, 92, 246, 0.15)",
          }}
        >
          <h2
            className="text-3xl sm:text-4xl font-extrabold mb-8 bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #e2e8f0, #94a3b8)",
            }}
          >
            Who Should Attend
          </h2>

          <p className="text-slate-300 text-base sm:text-lg mb-6 leading-relaxed">
            Senior security professionals (10+ years preferred) with backgrounds
            in:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {[
              "Red teaming",
              "Application security",
              "Infrastructure security",
              "Threat intelligence",
            ].map((bg, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-lg"
                style={{
                  background: "rgba(59, 130, 246, 0.08)",
                  border: "1px solid rgba(59, 130, 246, 0.15)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  }}
                />
                <span className="text-slate-200 font-medium text-sm">
                  {bg}
                </span>
              </div>
            ))}
          </div>

          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Selection prioritizes candidates interested in frontier AI risk,
            high-consequence failure modes, or work involving sophisticated
            threat actors.
          </p>

          <div
            className="flex items-center gap-3 px-5 py-4 rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <svg
              className="w-5 h-5 text-emerald-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-emerald-300 font-medium text-sm">
              The program is fully funded: flights, accommodation, and meals are
              covered.
            </span>
          </div>
        </div>
      </section>

      {/* ===== TEAM ===== */}
      <section id="team" className="max-w-4xl mx-auto px-6 py-16">
        <h2
          className="text-3xl sm:text-4xl font-extrabold mb-10 bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(90deg, #e2e8f0, #94a3b8)",
          }}
        >
          Team
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Pranav */}
          <div
            className="rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: "rgba(30, 27, 75, 0.5)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(139, 92, 246, 0.15)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                }}
              >
                PG
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Pranav Gade</h3>
                <p className="text-xs text-slate-400">Program Lead</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Research engineer at Conjecture. Created AISB to bridge AI safety
              and security, leads curriculum design and program direction.
            </p>
          </div>

          {/* Nitzan */}
          <div
            className="rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: "rgba(30, 27, 75, 0.5)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(139, 92, 246, 0.15)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                }}
              >
                NS
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">
                  Nitzan Shulman
                </h3>
                <p className="text-xs text-slate-400">Security Lead</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Head of Cyber Security at Heron AI Security Initiative. 6+ years
              security research specializing in IoT, robotics, malware and AI
              security.
            </p>
          </div>
        </div>

        {/* SASH */}
        <div
          className="mt-5 rounded-xl p-5 flex items-center gap-4"
          style={{
            background: "rgba(30, 27, 75, 0.35)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(139, 92, 246, 0.1)",
          }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(59, 130, 246, 0.12)" }}
          >
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
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
          </div>
          <p className="text-slate-400 text-sm">
            Local execution supported by the{" "}
            <span className="text-slate-200 font-medium">
              Singapore AI Safety Hub (SASH)
            </span>
          </p>
        </div>
      </section>

      {/* ===== FOOTER CTA ===== */}
      <section className="py-20">
        <div
          className="max-w-3xl mx-auto px-6 py-14 rounded-2xl text-center"
          style={{
            background:
              "linear-gradient(135deg, #1e1b4b, #1e3a5f)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
          }}
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Ready to apply?
          </h2>
          <p className="text-slate-300 mb-8 max-w-lg mx-auto text-base">
            Join a select cohort of senior security professionals for an
            intensive week focused on the most consequential AI security
            challenges.
          </p>
          <a
            href="mailto:pranav@aisb.dev"
            className="inline-block px-10 py-3.5 rounded-lg font-semibold text-white text-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            }}
          >
            Apply Now
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="max-w-4xl mx-auto px-6 py-8 text-center">
        <div
          className="h-px mb-8"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)",
          }}
        />
        <p className="text-slate-500 text-sm">
          AI Security Bootcamp &mdash; Singapore 2026
        </p>
      </footer>
    </div>
  );
}
