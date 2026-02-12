"use client";

import { useState } from "react";

const curriculumData = [
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
    <div className="border border-[#d6cfc5] rounded-lg overflow-hidden bg-white/60">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 text-left hover:bg-[#f5f0eb]/60 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#7c2d12] bg-[#7c2d12]/10 px-2.5 py-1 rounded">
            {day}
          </span>
          <span className="font-serif text-base sm:text-lg font-semibold text-[#2d2a26]">
            {title}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-[#7c2d12] flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0">
          <ul className="space-y-2 ml-[calc(2.5rem+0.75rem)] sm:ml-[calc(3rem+1rem)]">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[#4a453e]">
                <span className="text-[#9a3412] mt-1.5 flex-shrink-0">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="3" />
                  </svg>
                </span>
                <span className="text-sm sm:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function SingaporeBootcamp() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2d2a26]">
      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#faf8f5] to-[#f5f0eb]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232d2a26' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 text-center">
          {/* Badge */}
          <span className="inline-block bg-[#7c2d12] text-white text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6 sm:mb-8">
            GCR-Focused
          </span>

          {/* Title */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2d2a26] leading-tight mb-4 sm:mb-6">
            AI Security Bootcamp{" "}
            <span className="block sm:inline">— Singapore</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-[#5c564e] max-w-2xl mx-auto mb-6 sm:mb-8">
            7-Day Global Catastrophic Risk Intensive for Senior Security
            Professionals
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm sm:text-base text-[#6b6560] mb-10 sm:mb-12">
            <span>Singapore</span>
            <span className="text-[#c4b9ab]">|</span>
            <span>April 25 – May 1, 2026</span>
            <span className="text-[#c4b9ab]">|</span>
            <span>In-Person</span>
            <span className="text-[#c4b9ab]">|</span>
            <span className="font-semibold text-[#7c2d12]">Fully Funded</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:pranav@aisb.dev"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-[#7c2d12] hover:bg-[#9a3412] text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-base sm:text-lg"
            >
              Apply Now
            </a>
            <button
              onClick={() =>
                document
                  .getElementById("overview")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-[#7c2d12] text-[#7c2d12] hover:bg-[#7c2d12]/5 font-semibold px-8 py-3.5 rounded-lg transition-colors text-base sm:text-lg cursor-pointer"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ==================== INFO CARDS ==================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              ),
              label: "7 Days In-Person",
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              ),
              label: "10\u201312 Participants",
              sub: "Curated cohort",
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              ),
              label: "Senior Level",
              sub: "Mid-to-late career",
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                </svg>
              ),
              label: "Hands-On Labs",
              sub: "Red/blue team exercises",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white border border-[#d6cfc5] rounded-xl p-4 sm:p-6 text-center shadow-sm"
            >
              <div className="text-[#7c2d12] flex justify-center mb-3">
                {card.icon}
              </div>
              <p className="font-serif font-semibold text-[#2d2a26] text-sm sm:text-base">
                {card.label}
              </p>
              {card.sub && (
                <p className="text-xs sm:text-sm text-[#6b6560] mt-1">
                  {card.sub}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ==================== JUMP-TO NAV ==================== */}
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 border-b border-[#d6cfc5] pb-4">
          {[
            { label: "Overview", id: "overview" },
            { label: "Curriculum", id: "curriculum" },
            { label: "Who Should Attend", id: "who" },
            { label: "Team", id: "team" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() =>
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-sm sm:text-base font-medium text-[#7c2d12] hover:text-[#9a3412] hover:bg-[#7c2d12]/5 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ==================== OVERVIEW ==================== */}
      <section
        id="overview"
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
      >
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2d2a26] mb-8 text-center">
          Overview
        </h2>
        <div className="space-y-6 text-[#4a453e] text-base sm:text-lg leading-relaxed">
          <p>
            As frontier AI systems are deployed in enterprise environments, the
            stakes for security failures extend beyond individual organizations.
            Experienced security practitioners -- the people best positioned to
            secure AI deployments -- face few credible, time-efficient pathways to
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
        <div className="mt-12 sm:mt-14">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2d2a26] mb-6">
            What You&apos;ll Learn
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
                <span className="mt-1.5 flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-[#7c2d12]"
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
                </span>
                <span className="text-[#4a453e] text-base sm:text-lg">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ==================== CURRICULUM ==================== */}
      <section
        id="curriculum"
        className="bg-[#f5f0eb] border-y border-[#d6cfc5]"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2d2a26] mb-4 text-center">
            Curriculum
          </h2>
          <p className="text-center text-[#6b6560] mb-10 sm:mb-12 text-sm sm:text-base">
            Click a day to expand details
          </p>
          <div className="space-y-3">
            {curriculumData.map((day) => (
              <AccordionItem
                key={day.day}
                day={day.day}
                title={day.title}
                items={day.items}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHO SHOULD ATTEND ==================== */}
      <section
        id="who"
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
      >
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2d2a26] mb-8 text-center">
          Who Should Attend
        </h2>
        <div className="space-y-6 text-[#4a453e] text-base sm:text-lg leading-relaxed">
          <p>
            Senior security professionals (10+ years preferred) with backgrounds
            in:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              "Red teaming",
              "Application security",
              "Infrastructure security",
              "Threat intelligence",
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white border border-[#d6cfc5] rounded-lg px-5 py-4 flex items-center gap-3"
              >
                <span className="text-[#7c2d12]">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75"
                    />
                  </svg>
                </span>
                <span className="font-medium text-[#2d2a26]">{item}</span>
              </div>
            ))}
          </div>
          <p>
            Selection prioritizes candidates interested in frontier AI risk,
            high-consequence failure modes, or work involving sophisticated
            threat actors.
          </p>
          <div className="bg-[#7c2d12]/5 border border-[#7c2d12]/20 rounded-lg p-5 sm:p-6 mt-4">
            <p className="font-serif font-semibold text-[#7c2d12] text-lg sm:text-xl mb-2">
              Fully Funded
            </p>
            <p className="text-[#4a453e]">
              Flights, accommodation, and meals are covered for all accepted
              participants.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== TEAM ==================== */}
      <section
        id="team"
        className="bg-[#f5f0eb] border-y border-[#d6cfc5]"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2d2a26] mb-10 sm:mb-12 text-center">
            Team
          </h2>
          <div className="space-y-6 sm:space-y-8">
            {/* Pranav */}
            <div className="bg-white border border-[#d6cfc5] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#7c2d12]/10 flex items-center justify-center flex-shrink-0 text-[#7c2d12] font-serif font-bold text-xl sm:text-2xl">
                PG
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2d2a26] mb-2">
                  Pranav Gade
                </h3>
                <p className="text-[#4a453e] text-sm sm:text-base leading-relaxed">
                  Research engineer at Conjecture. Created AISB to bridge AI
                  safety and security, leads curriculum design and program
                  direction.
                </p>
              </div>
            </div>

            {/* Nitzan */}
            <div className="bg-white border border-[#d6cfc5] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#7c2d12]/10 flex items-center justify-center flex-shrink-0 text-[#7c2d12] font-serif font-bold text-xl sm:text-2xl">
                NS
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2d2a26] mb-2">
                  Nitzan Shulman
                </h3>
                <p className="text-[#4a453e] text-sm sm:text-base leading-relaxed">
                  Head of Cyber Security at Heron AI Security Initiative. 6+
                  years security research specializing in IoT, robotics, malware
                  and AI security.
                </p>
              </div>
            </div>

            {/* SASH */}
            <div className="bg-white/60 border border-[#d6cfc5] rounded-xl p-5 sm:p-6 text-center">
              <p className="text-[#6b6560] text-sm sm:text-base">
                Local execution supported by the{" "}
                <span className="font-semibold text-[#2d2a26]">
                  Singapore AI Safety Hub (SASH)
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER CTA ==================== */}
      <section className="bg-gradient-to-b from-[#faf8f5] to-[#f5f0eb]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2d2a26] mb-4">
            Ready to Apply?
          </h2>
          <p className="text-[#6b6560] text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Join a curated cohort of senior security professionals for an
            intensive week focused on AI security and global catastrophic risk.
          </p>
          <a
            href="mailto:pranav@aisb.dev"
            className="inline-flex items-center justify-center bg-[#7c2d12] hover:bg-[#9a3412] text-white font-semibold px-10 py-4 rounded-lg transition-colors text-base sm:text-lg"
          >
            Apply Now
          </a>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-[#d6cfc5] bg-[#f5f0eb]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-[#6b6560]">
          <p>
            AI Security Bootcamp &middot; Singapore &middot; April 25 – May 1,
            2026
          </p>
          <p className="mt-2">
            Questions?{" "}
            <a
              href="mailto:pranav@aisb.dev"
              className="text-[#7c2d12] hover:text-[#9a3412] underline underline-offset-2"
            >
              pranav@aisb.dev
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
