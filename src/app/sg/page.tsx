"use client";

import { useState } from 'react';
import Link from 'next/link';

const faqItems = [
  {
    question: "Why are GCR threat models relevant?",
    answer: `Frontier AI is turning into a general-purpose capability layer: systems that can plan, write code, use tools, and operate across environments. That shifts the security problem from "protect one app" to containing a scalable capability that can be misused or fail with outsized blast radius (automation of offensive workflows, amplified social engineering, unsafe behavior in high-stakes deployments, supply-chain compromise at a new layer).

Today's AI incidents may look conventional, but the trajectory is predictable: broader deployment, tighter coupling to infrastructure, and stronger incentives for sophisticated adversaries. If you expect to be dealing with this in 2–5 years, you should build the threat-model intuition now — what breaks, what controls still work, and where standard security assumptions stop holding.`
  },
  {
    question: "What's different from the first AISB cohort?",
    answer: "The first AISB ran for 4 weeks in London targeting researchers and early-career engineers. AISB Singapore is specifically designed for senior security professionals who can't take month-long training leave. We've compressed the curriculum to focus on the most critical AI-specific security challenges and removed foundational security content that experienced practitioners already know."
  },
  {
    question: "Do I need prior AI/ML experience?",
    answer: "Not necessarily. We provide targeted pre-work to establish AI fundamentals. What matters more is your security experience and curiosity about frontier threat models. If you're comfortable with Python and have deep experience in any security domain (red teaming, infra security, appsec, threat intel), you'll be able to engage with the material."
  },
  {
    question: "Is this program right for managers and executives?",
    answer: "This program is specifically designed for technical practitioners, not management or C-suite. The hands-on exercises assume you're comfortable diving into code and infrastructure. If you're a technical leader who still operates at the practitioner level, it may be a fit."
  },
  {
    question: "What are the costs?",
    answer: "There is no tuition to attend. Meals, snacks, and workspace are provided. For context, high-quality, practitioner-grade security trainings often cost a few thousand USD per day; this program is fully subsidized for accepted participants because we want selection to be based on fit and potential impact, not budget. Travel and housing support is available on a needs basis, and we'll follow up for a rough budget estimate if you're accepted (especially if your employer isn't sponsoring)."
  },
  {
    question: "Why Singapore? Why these dates?",
    answer: "We're anchoring the program in Singapore during the same week as a major regional security conference and adjacent practitioner gatherings (April 20–26). That timing lets experienced security folks already planning to be in Singapore — or with teammates in town — add a deeper, hands-on AI security sprint with little to no extra international travel. It's a deliberately convenient window: a high concentration of relevant practitioners, minimal incremental logistics, and better odds that participants can seriously grapple with these frontier, high-consequence threat models — topics that are still new even for seasoned security teams — alongside current industry conversations."
  },
  {
    question: "Will there be future cohorts?",
    answer: "Yes. We're continuing to refine the curriculum and explore different formats. Based on the success of this cohort, we plan to run future iterations and potentially develop modular, reusable training materials. We're also exploring partnerships with organizations like MATS and Heron Fellowship for longer-term skill development pathways."
  },
  {
    question: "What happens after the bootcamp?",
    answer: "After the program, we provide structured pathways: recommended research threads and open problems, warm intros to communities and teams working on GCR-relevant AI security and safety, and guidance toward deeper commitments (including guidance on joining fellowships such as MATS or Heron where appropriate). You'll leave with a clear map of \"what to do next,\" plus an alumni channel where collaboration, research opportunities, and relevant roles get circulated."
  }
];

const weekSchedule = [
  {
    day: "Day 1: Foundations",
    description: "Threat modeling for AI systems. Understanding current and future risk landscapes. GCR framework and security paradigm shifts."
  },
  {
    day: "Day 2: Attacks & Data",
    description: "Adversarial attacks, watermarking techniques, weight security. Hands-on exercises with real attack vectors."
  },
  {
    day: "Day 3: LLM Security",
    description: "Constitutional classifiers, guardrails, model editing, abliteration. Understanding and breaking safety mechanisms."
  },
  {
    day: "Day 4: Infrastructure",
    description: "NVIDIA Container Toolkit exploits, GPU isolation, confidential computing, sandbox design for powerful models."
  },
  {
    day: "Day 5: Verification",
    description: "Formal methods, verification techniques. Case studies and defense evaluation through a GCR lens."
  },
  {
    day: "Day 6: Scale",
    description: "Datacenter and ML stack threat modeling. Hardware governance. Potential facility site visit."
  },
  {
    day: "Day 7: AI Control & Hardware Governance",
    description: "Control frameworks for increasingly capable models, hardware-level governance mechanisms, and structured pathways to deeper engagement (fellowships, research, roles)."
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg mb-4 p-6 transition-all hover:border-red-600 hover:shadow-md ${isOpen ? 'border-red-600' : ''}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-lg font-semibold text-gray-900 flex justify-between items-center"
      >
        <span>{question}</span>
        <span className="text-red-600 text-2xl font-light ml-4 flex-shrink-0">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="mt-4 text-gray-600 leading-relaxed whitespace-pre-line">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* DEFCON Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-3 text-center font-semibold text-sm">
        Adjacent to DEFCON Singapore & Black Hat Asia (April 20 - 26, 2026)
      </div>

      {/* Header */}
      <header className="bg-gradient-to-br from-gray-950 to-gray-900 text-white py-8 border-b-4 border-red-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="text-2xl font-bold tracking-tight">AI SECURITY BOOTCAMP</div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-8">
          <span className="inline-block bg-red-600 text-white px-4 py-2 text-sm font-semibold rounded mb-6 tracking-wide">
            SINGAPORE 2026 • 2ND EDITION
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-950 mb-4 leading-tight">
            Frontier AI Security Training<br />for Senior Practitioners
          </h1>
          <p className="text-xl text-gray-500 mb-8">
            7 days of intensive, hands-on training on the AI security challenges of tomorrow
          </p>

          <div className="flex flex-wrap gap-8 mb-8 text-base">
            <div className="flex items-center gap-2 text-gray-600">
              <strong className="text-gray-900">Dates:</strong> April 20 - 26, 2026
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <strong className="text-gray-900">Location:</strong> Singapore
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <strong className="text-gray-900">Cohort Size:</strong> 10-12 senior professionals
            </div>
          </div>

          <a
            href="https://airtable.com/appDN6E2sHsMWkHWN/pagLyM1S6ZevGYUcB/form"
            className="inline-block bg-red-600 text-white px-10 py-4 text-lg font-semibold rounded-md hover:bg-red-700 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/30"
          >
            Apply Now
          </a>
        </div>
      </section>

      {/* Your Expertise Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-gray-950 mb-6">Your Expertise is Critical</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            The threat models most relevant to high-stakes AI deployments — model weight theft, inference-time attacks, nation-state adversaries operating at the infrastructure layer — are not well-covered by existing training. If your background is red teaming, infra security, or threat intelligence, your instincts transfer directly. This week gives you the AI-specific context to apply them.
          </p>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg my-8">
            <p className="text-gray-700 mb-2">
              <strong className="text-red-600">We need you.</strong> The security community has always been first to identify and mitigate emerging threats. With AI systems rapidly increasing in capability, your skills and experience are more valuable than ever—but the window to get ahead of these risks is closing.
            </p>
          </div>

          <p className="text-lg text-gray-600 leading-relaxed">
            AISB Singapore is a practitioner-focused intensive designed to bring you up to speed on these emerging threats quickly, without the multi-month commitment of traditional programs.
          </p>
        </div>
      </section>

      {/* GCR Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-gray-950 mb-6">What is Global Catastrophic Risk (GCR)?</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Global Catastrophic Risks are events that could cause severe harm to human civilization at a global scale. In the context of AI security, we focus on failure modes that could lead to outcomes beyond localized incidents—scenarios where compromised AI systems enable catastrophic misuse or loss of control.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="bg-white border border-gray-200 p-6 rounded-lg transition-all hover:border-red-600 hover:-translate-y-1 hover:shadow-lg">
              <h4 className="text-xl font-semibold text-gray-950 mb-4">Why GCR Matters for AI Security</h4>
              <ul className="space-y-3">
                <li className="text-gray-600 border-b border-gray-100 pb-3"><span className="text-red-600 font-semibold mr-2">→</span>AI capabilities are advancing rapidly toward transformative impact</li>
                <li className="text-gray-600 border-b border-gray-100 pb-3"><span className="text-red-600 font-semibold mr-2">→</span>Powerful AI systems could be weaponized by sophisticated actors</li>
                <li className="text-gray-600 border-b border-gray-100 pb-3"><span className="text-red-600 font-semibold mr-2">→</span>Infrastructure securing these systems needs to be robust against nation-state attacks</li>
                <li className="text-gray-600"><span className="text-red-600 font-semibold mr-2">→</span>Failure modes in AI deployment can cascade beyond single organizations</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-lg transition-all hover:border-red-600 hover:-translate-y-1 hover:shadow-lg">
              <h4 className="text-xl font-semibold text-gray-950 mb-4">The Security Implications</h4>
              <ul className="space-y-3">
                <li className="text-gray-600 border-b border-gray-100 pb-3"><span className="text-red-600 font-semibold mr-2">→</span>Model weights become high-value targets comparable to nuclear designs</li>
                <li className="text-gray-600 border-b border-gray-100 pb-3"><span className="text-red-600 font-semibold mr-2">→</span>Traditional security assumptions break down with agentic AI</li>
                <li className="text-gray-600 border-b border-gray-100 pb-3"><span className="text-red-600 font-semibold mr-2">→</span>Verification and control mechanisms need to scale to superhuman capabilities</li>
                <li className="text-gray-600"><span className="text-red-600 font-semibold mr-2">→</span>New governance frameworks require security innovation</li>
              </ul>
            </div>
          </div>

          <p className="text-lg text-gray-600 mt-8">
            Learn more:{' '}
            <a href="https://www.anthropic.com/news/frontier-threats-and-opportunities" className="text-red-600 font-semibold hover:underline">Frontier Threats and Opportunities (Anthropic)</a>
            {' • '}
            <a href="https://www.openphilanthropy.org/focus/global-catastrophic-risks/" className="text-red-600 font-semibold hover:underline">Global Catastrophic Risks (Open Philanthropy)</a>
          </p>
        </div>
      </section>

      {/* Program Structure Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-gray-950 mb-6">Program Structure</h2>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg my-8">
            <p className="text-gray-700">
              <strong className="text-red-600">AISB Singapore is the second iteration of our program.</strong> The first cohort ran successfully in London (August 2025) for 20 participants over 4 weeks. This version distills and extends the most advanced week of that curriculum — specifically optimized for senior practitioners who can't take month-long training leave.
            </p>
          </div>

          <h3 className="text-2xl font-semibold text-gray-950 mt-8 mb-4">Who This Is For</h3>
          <p className="text-lg text-gray-600 mb-4 leading-relaxed">
            This program targets mid-to-late career security professionals with backgrounds in:
          </p>
          <ul className="list-disc ml-6 mb-6 text-gray-600 space-y-2">
            <li>Red teaming and penetration testing</li>
            <li>Application security</li>
            <li>Infrastructure and cloud security</li>
            <li>Threat intelligence and detection</li>
          </ul>
          <p className="text-lg text-gray-600 leading-relaxed">
            We're looking for practitioners who are excited about the challenge of securing systems at the frontier of capability—professionals who want to understand how their existing skills translate to protecting AI systems against sophisticated adversaries and catastrophic failure modes.
          </p>

          <h3 className="text-2xl font-semibold text-gray-950 mt-8 mb-4">Format</h3>
          <p className="text-lg text-gray-600 mb-4 leading-relaxed">
            The week follows a T-shaped structure: short lectures establish shared understanding of threat models and priorities, then we go deep with hands-on red/blue exercises focusing on high-leverage defensive techniques. You'll spend most of your time doing, not listening.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Before arriving, participants complete targeted pre-work to establish shared baseline AI fundamentals. This keeps the week focused on advanced, practitioner-level content without sacrificing rigor for those newer to ML contexts.
          </p>
        </div>
      </section>

      {/* Week at a Glance Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-gray-950 mb-8">Week at a Glance</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-8">
            {weekSchedule.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 p-6 rounded-lg transition-all hover:border-red-600 hover:-translate-y-1 hover:shadow-lg"
              >
                <h4 className="text-xl font-semibold text-gray-950 mb-3">{item.day}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-950 mb-6">Core Technical Areas</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 p-6 rounded-lg transition-all hover:border-red-600 hover:-translate-y-1 hover:shadow-lg">
                <h4 className="text-xl font-semibold text-gray-950 mb-4">Attack Vectors & Defenses</h4>
                <ul className="space-y-3">
                  <li className="text-gray-600 border-b border-gray-100 pb-3"><span className="text-red-600 font-semibold mr-2">→</span>Securing internal deployments of powerful models</li>
                  <li className="text-gray-600 border-b border-gray-100 pb-3"><span className="text-red-600 font-semibold mr-2">→</span>Model and weight security against sophisticated exfiltration</li>
                  <li className="text-gray-600 border-b border-gray-100 pb-3"><span className="text-red-600 font-semibold mr-2">→</span>LLM-specific security mechanisms (guardrails, classifiers)</li>
                  <li className="text-gray-600 border-b border-gray-100 pb-3"><span className="text-red-600 font-semibold mr-2">→</span>Infrastructure-level controls (GPU isolation, sandboxing)</li>
                  <li className="text-gray-600"><span className="text-red-600 font-semibold mr-2">→</span>Watermarking and provenance tracking</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-lg transition-all hover:border-red-600 hover:-translate-y-1 hover:shadow-lg">
                <h4 className="text-xl font-semibold text-gray-950 mb-4">Advanced Topics</h4>
                <ul className="space-y-3">
                  <li className="text-gray-600 border-b border-gray-100 pb-3"><span className="text-red-600 font-semibold mr-2">→</span>Formal verification methods for AI systems</li>
                  <li className="text-gray-600 border-b border-gray-100 pb-3"><span className="text-red-600 font-semibold mr-2">→</span>ML stack and datacenter threat modeling</li>
                  <li className="text-gray-600 border-b border-gray-100 pb-3"><span className="text-red-600 font-semibold mr-2">→</span>AI control frameworks and governance</li>
                  <li className="text-gray-600 border-b border-gray-100 pb-3"><span className="text-red-600 font-semibold mr-2">→</span>Hardware governance and supply chain security</li>
                  <li className="text-gray-600"><span className="text-red-600 font-semibold mr-2">→</span>Application-layer topics (prompt injection, RAG injection, MCP security) — covered as illustrative examples, not a dedicated appsec track</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-950 text-gray-300">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-white mb-12">Meet the Team</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl">
              <div className="h-72 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <img
                  src="/pranav.png"
                  alt="Pranav Gade"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-950 mb-1">Pranav Gade</h3>
                <div className="text-red-600 font-semibold text-sm mb-4">Program Director & Lead Instructor</div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Research Engineer at Conjecture specializing in LLM security and distributed training infrastructure. Founded AISB with Open Philanthropy grant. Previously worked on security for AI systems including adversarial attacks, guardrail fine-tuning, and model extraction. Instructor at ARENA and Atlas Fellowship.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl">
              <div className="h-72 bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center">
                <img
                  src="/nitzan.png"
                  alt="Nitzan Shulman"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-950 mb-1">Nitzan Shulman</h3>
                <div className="text-red-600 font-semibold text-sm mb-4">Head of Cyber, Heron AI Security</div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  6+ years in security research specializing in IoT, Robotics, Malware, and AI security. Leads technical content development for AISB. Co-designed the hands-on labs and red team exercises that form the core of the bootcamp curriculum.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl">
              <div className="h-72 bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <span className="text-7xl font-bold text-white">D</span>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-950 mb-1">David</h3>
                <div className="text-red-600 font-semibold text-sm mb-4">Role TBD</div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Bio to be added.
                </p>
              </div>
            </div>
          </div>

          <p className="text-center mt-12 text-gray-400">
            Supported locally by the{' '}
            <a href="https://aisafety.sg" className="text-red-500 hover:underline">Singapore AI Safety Hub (SASH)</a>
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-gray-950 mb-8">Frequently Asked Questions</h2>

          <div>
            {faqItems.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Apply Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-950 mb-6">Apply to AISB Singapore 2026</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Join the next cohort of security professionals securing the future of AI systems.<br />
            Applications close March 15, 2026.<br />
            Decisions communicated by March 28, 2026.<br />
            Travel support details provided upon acceptance.
          </p>
          <a
            href="https://airtable.com/appDN6E2sHsMWkHWN/pagLyM1S6ZevGYUcB/form"
            className="inline-block bg-red-600 text-white px-10 py-4 text-lg font-semibold rounded-md hover:bg-red-700 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/30"
          >
            Submit Application
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-8">
          <p className="mb-4">
            Technical direction: Pranav Gade, Nitzan Shulman, and the AISB core team<br />
            Local execution and support:{' '}
            <a href="https://aisafety.sg" className="text-white hover:underline">Singapore AI Safety Hub (SASH)</a>
          </p>
          <p className="mb-4">
            Open-source curriculum will be made available closer to the bootcamp
          </p>
          <p className="mb-4">
            <Link href="/sg/2025" className="text-white hover:underline">View the 2025 London Cohort →</Link>
          </p>
          <p className="text-sm mt-8">© 2026 AI Security Bootcamp</p>
        </div>
      </footer>
    </div>
  );
}
