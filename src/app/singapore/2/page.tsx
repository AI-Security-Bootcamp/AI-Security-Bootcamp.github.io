"use client";

import { useState, useEffect } from "react";

const syllabusData = [
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

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

export default function SingaporeCohort2() {
  const [openDays, setOpenDays] = useState<number[]>([]);
  const [activeSection, setActiveSection] = useState("overview");

  const toggleDay = (index: number) => {
    setOpenDays((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const sections = ["overview", "curriculum", "who-should-attend", "team"];
    const handleScroll = () => {
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom > 120) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "curriculum", label: "Curriculum" },
    { id: "who-should-attend", label: "Who Should Attend" },
    { id: "team", label: "Team" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <header className="relative bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-6">
            GCR-Focused
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-4">
            AI Security Bootcamp{" "}
            <span className="text-blue-600">&mdash; Singapore</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-8">
            7-Day Global Catastrophic Risk Intensive for Senior Security Professionals
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-gray-500 mb-10">
            <span>Singapore</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>April 25 &ndash; May 1, 2026</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span>In-Person</span>
            <span className="hidden sm:inline text-gray-300">|</span>
            <span className="font-medium text-gray-700">Fully Funded</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:pranav@aisb.dev"
              className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Apply Now
            </a>
            <button
              onClick={() => scrollTo("overview")}
              className="inline-flex items-center justify-center border border-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Learn More
            </button>
          </div>
        </div>
      </header>

      {/* Info Cards */}
      <section className="max-w-5xl mx-auto px-6 -mt-4 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "7 Days", sub: "In-Person", icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" },
            { label: "10\u201312 Participants", sub: "Curated Cohort", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
            { label: "Senior Level", sub: "Mid-to-Late Career", icon: "M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" },
            { label: "Hands-On Labs", sub: "Red/Blue Team Exercises", icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-gray-200 bg-white p-5 text-center hover:shadow-md transition-shadow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7 mx-auto mb-3 text-blue-600"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
              </svg>
              <p className="font-semibold text-gray-900 text-sm md:text-base">{card.label}</p>
              <p className="text-xs md:text-sm text-gray-500 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky Jump-To Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeSection === item.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Overview */}
      <section id="overview" className="max-w-3xl mx-auto px-6 pt-20 pb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Overview</h2>

        <div className="space-y-5 text-gray-600 text-base md:text-lg leading-relaxed">
          <p>
            As frontier AI systems are deployed in enterprise environments, the stakes for security
            failures extend beyond individual organizations. Experienced security practitioners
            &mdash; the people best positioned to secure AI deployments &mdash; face few credible,
            time-efficient pathways to upskill in AI-specific security.
          </p>
          <p>
            AISB Singapore is a curated, practitioner-focused 7-day intensive designed to orient
            mid-to-late career InfoSec professionals to AI security topics relevant to advanced and
            emerging AI systems. The program prioritizes capability grounding through hands-on
            exercises over lecture-heavy formats.
          </p>
          <p>
            Participants complete targeted pre-work to establish baseline AI fundamentals, followed
            by an immersive week delivered in a T-shaped format: short lectures to align on threat
            models and priorities, then hands-on red/blue exercises that go deep on high-leverage
            skills.
          </p>
        </div>

        {/* What You'll Learn */}
        <div className="mt-14">
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
                <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-gray-600 text-base md:text-lg leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Curriculum / Syllabus */}
      <section id="curriculum" className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 pt-20 pb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Curriculum</h2>
          <p className="text-gray-500 mb-10 text-base md:text-lg">
            Seven days of intensive, hands-on learning. Click a day to expand the syllabus.
          </p>

          <div className="space-y-3">
            {syllabusData.map((day, index) => {
              const isOpen = openDays.includes(index);
              return (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-white overflow-hidden transition-shadow hover:shadow-sm"
                >
                  <button
                    onClick={() => toggleDay(index)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 rounded-md px-2.5 py-1">
                        {day.day}
                      </span>
                      <span className="font-semibold text-gray-900 text-base md:text-lg">
                        {day.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 border-t border-gray-100">
                      <ul className="mt-4 space-y-3">
                        {day.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400" />
                            <span className="text-gray-600 text-sm md:text-base">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who Should Attend */}
      <section id="who-should-attend" className="max-w-3xl mx-auto px-6 pt-20 pb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Who Should Attend</h2>

        <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
          Senior security professionals (10+ years preferred) with backgrounds in:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {["Red Teaming", "Application Security", "Infrastructure Security", "Threat Intelligence"].map(
            (area) => (
              <div
                key={area}
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm font-medium text-gray-700"
              >
                {area}
              </div>
            )
          )}
        </div>

        <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
          Selection prioritizes candidates interested in frontier AI risk, high-consequence failure
          modes, or work involving sophisticated threat actors.
        </p>

        <div className="rounded-xl border border-blue-200 bg-blue-50 px-6 py-5">
          <p className="text-blue-900 text-sm md:text-base font-medium">
            This program is fully funded: flights, accommodation, and meals are covered.
          </p>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 pt-20 pb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Team</h2>

          <div className="space-y-10">
            {/* Pranav */}
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">PG</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Pranav Gade</h3>
                <p className="text-sm text-blue-600 mb-2">Curriculum & Program Lead</p>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  Research engineer at Conjecture. Created AISB to bridge AI safety and security,
                  leads curriculum design and program direction.
                </p>
              </div>
            </div>

            {/* Nitzan */}
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">NS</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Nitzan Shulman</h3>
                <p className="text-sm text-blue-600 mb-2">Instructor</p>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  Head of Cyber Security at Heron AI Security Initiative. 6+ years security research
                  specializing in IoT, robotics, malware and AI security.
                </p>
              </div>
            </div>

            {/* SASH */}
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-bold text-sm">SASH</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Singapore AI Safety Hub (SASH)
                </h3>
                <p className="text-sm text-blue-600 mb-2">Local Execution Partner</p>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  Local execution and logistics supported by the Singapore AI Safety Hub.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Apply?</h2>
          <p className="text-gray-500 text-base md:text-lg mb-8 max-w-xl mx-auto">
            Seats are limited to 10&ndash;12 participants. Reach out to start your application.
          </p>
          <a
            href="mailto:pranav@aisb.dev"
            className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold px-10 py-3.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span>AI Security Bootcamp &mdash; Singapore</span>
          <span>
            Questions?{" "}
            <a href="mailto:pranav@aisb.dev" className="text-blue-600 hover:underline">
              pranav@aisb.dev
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
