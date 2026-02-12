"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const curriculum = [
  {
    day: 1,
    title: "Introduction & Threat Modeling",
    topics: [
      "Threat models from current AI systems to catastrophic misuse and misalignment",
      "STRIDE methodology applied to AI systems",
      "Adversary capability modeling for AI-specific threats",
      "Current threats: misuse, application security, infrastructure security",
      "Future threats: misalignment, model theft, integrity attacks, governance violations",
    ],
  },
  {
    day: 2,
    title: "Adversarial Attacks, Watermarking & Data Security",
    topics: [
      "Crafting adversarial examples against image classifiers",
      "Watermarking techniques for model outputs",
      "Trojans and backdoor attacks on ML models",
      "Data poisoning and integrity attacks",
      "Fine-tuning attacks on open source models",
    ],
  },
  {
    day: 3,
    title: "LLM Security",
    topics: [
      "Constitutional classifiers and linear probes",
      "Guardrails: input & output classifiers",
      "Abliteration and model editing techniques",
      "Jailbreaks and prompt injection",
      "Tokenization vulnerabilities",
      "Model weight extraction attacks",
    ],
  },
  {
    day: 4,
    title: "Infrastructure Security",
    topics: [
      "NVIDIA Container Toolkit exploit case studies",
      "GPU isolation techniques",
      "Confidential computing for AI workloads",
      "Sandbox design considerations",
      "Container security and escape prevention",
    ],
  },
  {
    day: 5,
    title: "Formal Methods & RAND Report Analysis",
    topics: [
      "Verification-oriented techniques for AI systems",
      "Formal methods for output verification",
      "Analysis of RAND report on AI security",
      "MCP (Model Context Protocol) security",
      "RAG injection attacks and defenses",
    ],
  },
  {
    day: 6,
    title: "Data Center Security & ML Stack Threat Modeling",
    topics: [
      "Data center infrastructure: power, cooling, networking, physical security",
      "ML stack threat modeling",
      "Hardware supply chain security",
      "Weight security, data security, deployment security",
      "Personnel security considerations",
      "Potential data center site visit",
    ],
  },
  {
    day: 7,
    title: "AI Control & Hardware Governance",
    topics: [
      "AI control mechanisms and frameworks",
      "Hardware governance for AI systems",
      "Detecting and defending against rogue deployments",
      "Follow-up pathways: fellowships, organizations, research directions",
      "Career pathways in AI security (MATS, Heron Fellowship, and more)",
    ],
  },
];

const faqs = [
  {
    question: "What is the time commitment?",
    answer:
      "The program runs for 7 full days from April 25 to May 1, 2026. This follows Black Hat Asia (April 21-24) and overlaps with DEFCON Singapore (April 28-30), creating natural travel synergies.",
  },
  {
    question: "Is the program free?",
    answer:
      "Yes. AISB Singapore is fully subsidized. Accommodation, flights (for those without employer-sponsored travel), and meals are covered.",
  },
  {
    question: "Who should apply?",
    answer:
      "We're looking for 10\u201312 senior security professionals with backgrounds in red teaming, application security, infrastructure security, or threat intelligence. Ideal candidates are technical practitioners (not management/C-suite) with interest in frontier AI risk and high-consequence failure modes.",
  },
  {
    question: "What are the prerequisites?",
    answer:
      "Participants should be mid-to-late career InfoSec professionals with sufficient technical depth in security. Prior AI/ML experience is not required \u2014 the program is designed to orient experienced security practitioners to AI-specific threat models.",
  },
  {
    question: "How does this relate to the main AISB program?",
    answer:
      "AISB Singapore builds on the AI-specific security content from AISB Week 3, adapted for senior practitioners who can\u2019t commit to the full 4-week program. It\u2019s a compressed intensive focused on the AI security topics most relevant to high-stakes deployments.",
  },
  {
    question: "What happens after the program?",
    answer:
      "The program includes discussion of follow-up pathways including relevant organizations, fellowships (such as MATS and Heron Fellowship), applied research collaborations, and security roles focused on frontier AI systems.",
  },
  {
    question: "I have more questions!",
    answer: "Email us at pranav@aisb.dev \u2014 we\u2019re happy to chat.",
  },
];

const sections = ["overview", "curriculum", "instructors", "faqs"] as const;

export default function Singapore() {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());
  const [expandedFaqs, setExpandedFaqs] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const toggleFaq = (index: number) => {
    setExpandedFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100">
      {/* Top bar */}
      <nav className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition text-sm"
          >
            &larr; aisb.dev
          </Link>
          <a
            href="mailto:pranav@aisb.dev"
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-semibold text-sm transition"
          >
            Apply Now
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
              New Program
            </span>
            <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm">
              7-Day Intensive
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            AI Security Bootcamp
            <span className="block text-red-500">Singapore</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-3xl">
            A curated, practitioner-focused intensive designed to orient senior
            security professionals to AI security topics relevant to advanced and
            emerging AI systems.
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-slate-400 mb-10">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              April 25 – May 1, 2026
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              10–12 Participants
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Fully Subsidized
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:pranav@aisb.dev"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded font-semibold transition text-lg"
            >
              Apply Now
            </a>
            <button
              onClick={() => scrollToSection("overview")}
              className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-8 py-3 rounded font-semibold transition text-lg"
            >
              Learn More
            </button>
          </div>
        </div>
      </header>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {[
            { id: "overview", label: "Overview" },
            { id: "curriculum", label: "Curriculum" },
            { id: "instructors", label: "Instructors" },
            { id: "faqs", label: "FAQs" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`px-4 py-3 text-sm font-medium transition whitespace-nowrap border-b-2 ${
                activeSection === id
                  ? "border-red-500 text-white"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Overview Section */}
      <section id="overview" className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">The Challenge</h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                There is a growing shortage of AI security professionals who can
                operate credibly at the intersection of cybersecurity and modern
                AI systems. Experienced security practitioners — the people best
                positioned to secure AI deployments — face few credible,
                time-efficient pathways to upskill.
              </p>
              <p className="text-lg text-slate-400 leading-relaxed mt-4">
                As frontier AI systems are deployed in enterprise environments,
                the stakes for security failures extend beyond individual
                organizations. AI-specific failure modes — model weight theft,
                data compromise, deployment misuse, and attacks by highly
                resourced or nation-state actors — are not well covered by
                conventional security training, despite their potential for
                large-scale harm.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Our Approach</h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                AISB Singapore is a curated, practitioner-focused 7-day
                intensive designed to orient mid-to-late career InfoSec
                professionals to AI security topics relevant to advanced and
                emerging AI systems. Delivered in a{" "}
                <strong className="text-white">T-shaped format</strong>: short
                lectures to align on threat models and priorities, then hands-on
                red/blue exercises that go deep on a smaller set of high-leverage
                skills.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6">Learning Objectives</h2>
              <div className="space-y-4">
                {[
                  "Understanding threat models from current AI systems to future catastrophic misuse and misalignment scenarios",
                  "Mastering foundational attack vectors and defenses across the security stack that scale to advanced AI systems",
                  "Gaining hands-on experience with security challenges that become critical as AI capabilities increase",
                  "Evaluating defensive measures through a GCR lens: which approaches remain effective as systems become more capable?",
                  "Pursuing high-impact careers in AI security through GCR-focused fellowships, organizations, and research directions",
                ].map((objective, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <p className="text-slate-300 pt-1">{objective}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Program Details</h3>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-slate-500 uppercase tracking-wider text-xs">
                    Dates
                  </dt>
                  <dd className="text-white mt-1">April 25 – May 1, 2026</dd>
                </div>
                <div>
                  <dt className="text-slate-500 uppercase tracking-wider text-xs">
                    Duration
                  </dt>
                  <dd className="text-white mt-1">7 Days</dd>
                </div>
                <div>
                  <dt className="text-slate-500 uppercase tracking-wider text-xs">
                    Location
                  </dt>
                  <dd className="text-white mt-1">Singapore</dd>
                </div>
                <div>
                  <dt className="text-slate-500 uppercase tracking-wider text-xs">
                    Cohort Size
                  </dt>
                  <dd className="text-white mt-1">10–12 Participants</dd>
                </div>
                <div>
                  <dt className="text-slate-500 uppercase tracking-wider text-xs">
                    Skill Level
                  </dt>
                  <dd className="text-white mt-1">Senior / Advanced</dd>
                </div>
                <div>
                  <dt className="text-slate-500 uppercase tracking-wider text-xs">
                    Cost
                  </dt>
                  <dd className="text-white mt-1">Fully Subsidized</dd>
                </div>
                <div>
                  <dt className="text-slate-500 uppercase tracking-wider text-xs">
                    Format
                  </dt>
                  <dd className="text-white mt-1">In-Person, Full-Time</dd>
                </div>
              </dl>
              <a
                href="mailto:pranav@aisb.dev"
                className="block w-full bg-red-600 hover:bg-red-700 text-white text-center px-6 py-3 rounded font-semibold transition mt-6"
              >
                Apply Now
              </a>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3">Timing</h3>
              <p className="text-sm text-slate-400">
                Follows{" "}
                <strong className="text-slate-200">Black Hat Asia</strong>{" "}
                (April 21-24) and overlaps with{" "}
                <strong className="text-slate-200">DEFCON Singapore</strong>{" "}
                (April 28-30), creating natural travel synergies for
                participants.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3">Who Should Apply</h3>
              <ul className="text-sm text-slate-400 space-y-2">
                <li className="flex gap-2">
                  <span className="text-red-500">&#8250;</span> Red team
                  operators
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">&#8250;</span> Application
                  security engineers
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">&#8250;</span> Infrastructure
                  security specialists
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">&#8250;</span> Threat
                  intelligence analysts
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section
        id="curriculum"
        className="bg-slate-900/50 border-y border-slate-800"
      >
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            7-Day Curriculum
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Technical content selected to give experienced security
            practitioners exposure to AI-specific threat models they are unlikely
            to encounter in standard enterprise security work.
          </p>

          <div className="max-w-3xl mx-auto space-y-3">
            {curriculum.map((day) => (
              <div
                key={day.day}
                className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleDay(day.day)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-red-500 font-bold text-sm w-14">
                      DAY {day.day}
                    </span>
                    <span className="font-semibold">{day.title}</span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform ${
                      expandedDays.has(day.day) ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {expandedDays.has(day.day) && (
                  <div className="px-6 pb-4 border-t border-slate-800">
                    <ul className="space-y-2 mt-4">
                      {day.topics.map((topic, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-slate-400 text-sm"
                        >
                          <span className="text-red-500/60 mt-0.5">&#9656;</span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Topic Categories */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-bold mb-4 text-red-400">
                Threat Models
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-red-500/40">&#9656;</span> Misuse
                  (cyberattacks, bio uplift)
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500/40">&#9656;</span> Application &
                  infrastructure security
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500/40">&#9656;</span> Misalignment
                  scenarios
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500/40">&#9656;</span> Model theft &
                  integrity attacks
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500/40">&#9656;</span> Governance
                  guarantee violations
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-red-400">Attacks</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-red-500/40">&#9656;</span> Jailbreaks &
                  prompt injection
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500/40">&#9656;</span> Adversarial
                  examples & trojans
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500/40">&#9656;</span> Weight
                  extraction
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500/40">&#9656;</span> NVIDIA CTK
                  exploits
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500/40">&#9656;</span> RAG injection
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500/40">&#9656;</span> Supply chain
                  attacks
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-red-400">Defenses</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-red-500/40">&#9656;</span> Watermarking
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500/40">&#9656;</span>{" "}
                  Constitutional classifiers
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500/40">&#9656;</span> Guardrails &
                  classifiers
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500/40">&#9656;</span> GPU isolation
                  & confidential computing
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500/40">&#9656;</span> Sandboxing &
                  formal methods
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500/40">&#9656;</span> MCP security
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section
        id="instructors"
        className="max-w-6xl mx-auto px-4 py-16 md:py-24"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Instructors
        </h2>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-start gap-6 bg-slate-900 border border-slate-800 rounded-lg p-6">
            <img
              src="/pranav.png"
              alt="Pranav Gade"
              className="w-20 h-20 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <h3 className="text-xl font-bold">Pranav Gade</h3>
              <p className="text-red-400 text-sm mb-3">
                Technical Director, AISB
              </p>
              <p className="text-slate-400">
                Research engineer at Conjecture. Created AISB to bridge AI
                safety and security. Leads curriculum design and program
                direction across all AISB iterations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6 bg-slate-900 border border-slate-800 rounded-lg p-6">
            <img
              src="/nitzan.png"
              alt="Nitzan Shulman"
              className="w-20 h-20 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <h3 className="text-xl font-bold">Nitzan Shulman</h3>
              <p className="text-red-400 text-sm mb-3">
                Technical Director, AISB
              </p>
              <p className="text-slate-400">
                Head of Cyber Security at Heron AI Security Initiative. 6+ years
                doing security research specializing in IOT, Robotics, Malware
                and AI security. Co-designed and delivered prior AISB iterations.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-slate-500 text-sm">
              Local execution and institutional linkage supported by the{" "}
              <strong className="text-slate-300">
                Singapore AI Safety Hub (SASH)
              </strong>
            </p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition"
                >
                  <span className="font-semibold pr-4">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform ${
                      expandedFaqs.has(i) ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {expandedFaqs.has(i) && (
                  <div className="px-6 pb-4 border-t border-slate-800">
                    <p className="text-slate-400 mt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Apply?
        </h2>
        <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
          We&apos;re looking for senior security professionals who want to
          operate at the frontier of AI security. Spaces are limited to 10–12
          participants.
        </p>
        <a
          href="mailto:pranav@aisb.dev"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded font-semibold transition text-lg"
        >
          Apply Now
        </a>
        <p className="text-slate-600 text-sm mt-4">
          Questions? Email{" "}
          <a
            href="mailto:pranav@aisb.dev"
            className="text-slate-400 hover:text-white underline"
          >
            pranav@aisb.dev
          </a>
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <p>AI Security Bootcamp</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-slate-400 transition">
              Home
            </Link>
            <Link href="/2025" className="hover:text-slate-400 transition">
              2025 Cohort
            </Link>
            <a
              href="https://github.com/pranavgade20/aisb"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-400 transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
