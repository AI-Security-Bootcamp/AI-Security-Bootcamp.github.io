"use client";

import Link from 'next/link';

const projects = [
  {
    name: "Andrew",
    title: "MCP Protector Proxy",
    description: "A security layer for the Model Context Protocol (MCP) that provides tool inspection, permission controls, sanitization against prompt injection, and rate limiting.",
    link: "https://github.com/PR0VIDENCE/mcp_protector_proxy",
  },
  {
    name: "Chris",
    title: "TAR Poison",
    description: "Data poisoning attacks on Support Vector Machines used in legal document discovery for Technology Assisted Review.",
    link: "https://github.com/christopear/tarpoison",
  },
  {
    name: "Diana & Leo",
    title: "Chasseur",
    description: "Catching misbehaving coding agents red-handed through local deployment of EDR to detect and mitigate suspicious command execution attempts.",
    link: "https://github.com/le0kar0ub1/Chasseur",
  },
  {
    name: "Ethan",
    title: "Breaking Taylor Unswift",
    description: "Demonstrates weight extraction from Taylor series-obfuscated neural networks, undermining model exfiltration protections.",
    link: "https://drive.google.com/file/d/1aw2g9bjm2cmbltH8gpaNMaU0pI6m3VL_/view?usp=sharing",
  },
  {
    name: "Irakli",
    title: "PicoCTF Evals",
    description: "Implementation of capture-the-flag evaluations using the inspect evals framework for AI security testing.",
    link: "https://github.com/iraklishali/evals_playground",
  },
  {
    name: "Jaeho",
    title: "Autonomy caps for Agents governance",
    description: "Policy framework proposing autonomy caps for AI agents in government systems with practical usage guidelines.",
    link: "https://docs.google.com/document/d/1L7RSmU2k5PtQKI7dsozD8yD6rjHBcy1TCl1CEtKEw-4/edit?usp=sharing",
  },
  {
    name: "Jakub",
    title: "ML Supply Chain Attacks",
    description: "Proof-of-concept pickle file payload injection and MD5 hash collision attacks on ML model distribution.",
    link: "https://github.com/kryjak/pickle_md5_collisions",
  },
  {
    name: "Jord",
    title: "Red-teaming Activation Monitors",
    description: "Adversarial attacks on AI monitoring systems via spurious correlations and backdoor trigger coordination.",
    link: "https://github.com/Jordine/aisb-final-project/",
  },
  {
    name: "Juan",
    title: "Watermark Stealing Replication",
    description: "Replication of watermark stealing attacks on machine learning models with interactive Streamlit demo.",
    link: "https://github.com/juanbelieni/watermark-stealing-replication",
  },
  {
    name: "Katie",
    title: "ML Supply Chain Vulnerabilities",
    description: "Paper replication exploring attack scenarios in outsourced training and transfer learning.",
    link: "https://github.com/katiepreed/AISB",
  },
  {
    name: "Leo",
    title: "Immune",
    description: "Malware detection using static binary analysis features to identify malicious software.",
    link: "https://github.com/le0kar0ub1/Immune",
  },
  {
    name: "Lorenzo",
    title: "Adversarial Attack Detector",
    description: "Using linear probes to detect and analyze adversarial attacks on neural networks.",
    link: "https://github.com/Venn1998/Adversarial_Attacks_detector",
  },
  {
    name: "Rhita",
    title: "Audio Attacks on Whisper",
    description: "Adversarial attacks on OpenAI's Whisper automatic speech recognition model.",
    link: "https://github.com/rameziane/audio-attacks",
  },
  {
    name: "Sam",
    title: "Here Comes the Worm",
    description: "AI security research exploring worm-like behavior in AI systems.",
    link: "https://github.com/stetef/Here-comes-the-worm-aisb/",
  },
];

export default function Cohort2025() {
  return (
    <div className="min-h-screen bg-white text-gray-900 px-4 py-8 md:px-8 lg:px-16">
      {/* Navigation */}
      <nav className="max-w-4xl mx-auto mb-8">
        <Link href="/sg" className="text-blue-600 hover:underline">
          &larr; Back to AISB Singapore 2026
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          AISB London 2025
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          August 4-29, 2025 &bull; London, UK &bull; 20 Participants
        </p>
        <p className="text-lg text-gray-600">
          4-week intensive program &bull; In-person &bull; Fully funded
        </p>
      </header>

      {/* Bootcamp Image */}
      <div className="max-w-4xl mx-auto mb-16">
        <img
          src="/2025.jpg"
          alt="AI Security Bootcamp 2025 Cohort"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>

      {/* Description */}
      <section className="max-w-4xl mx-auto mb-16">
        <p className="text-xl text-gray-700 text-center mb-6">
          The inaugural AI Security Bootcamp brought together 20 researchers and engineers for four intensive weeks of training in security fundamentals, AI infrastructure security, and AI-specific threats. The program culminated in a week of capstone projects where participants explored cutting-edge security research.
        </p>
        <p className="text-xl text-gray-700 text-center">
          The curriculum is available <a href="https://github.com/pranavgade20/aisb" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">on GitHub</a> for self-study.
        </p>
      </section>

      {/* What Participants Learned Section */}
      <section className="max-w-4xl mx-auto mb-20">
        <h2 className="text-4xl font-bold mb-12 text-center">Curriculum</h2>
        <div className="space-y-12 text-lg">
          {/* Week 1 */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Week 1: Security Fundamentals</h3>
            <ul className="list-disc space-y-3 text-gray-700 text-lg ml-8">
              <li><span className="font-semibold">Fundamentals of Cryptography:</span> Stream ciphers (LCG), block ciphers (DES, SPN), hashing (MD5), message authentication (HMAC), public-key cryptography (RSA), cryptanalysis (crib dragging, meet-in-the-middle, padding oracle attacks)</li>
              <li><span className="font-semibold">Network Security:</span> Traffic analysis with Wireshark, HTTP/HTTPS man-in-the-middle interception, certificate pinning, NFQUEUE, covert channels (DNS, ICMP)</li>
              <li><span className="font-semibold">Threat Modeling:</span> STRIDE methodology, attack trees, adversary capability modeling</li>
              <li><span className="font-semibold">Penetration Testing:</span> Network reconnaissance, enumeration, password cracking, Metasploit exploitation, privilege escalation, persistence</li>
            </ul>
          </div>

          {/* Week 2 */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Week 2: Infrastructure Security</h3>
            <ul className="list-disc space-y-3 text-gray-700 text-lg ml-8">
              <li><span className="font-semibold">Containerization:</span> Container fundamentals (chroot, cgroups, namespaces), network isolation, container escapes, syscall monitoring</li>
              <li><span className="font-semibold">Supply Chain Security:</span> Pickle deserialization attacks, dependency confusion, model provenance</li>
              <li><span className="font-semibold">Reverse Engineering:</span> Ghidra, buffer overflow, crafting shellcode exploits, bypassing stack canaries</li>
              <li><span className="font-semibold">Application & Cloud Security:</span> XSS, CSRF, SSRF, SQL injection, command injection (OWASP Top 10), cloud Identity and Access Management</li>
            </ul>
          </div>

          {/* Week 3 */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Week 3: AI-Specific Security</h3>
            <ul className="list-disc space-y-3 text-gray-700 text-lg ml-8">
              <li><span className="font-semibold">Adversarial ML:</span> Crafting adversarial examples, attacks on image classifier, watermarking, trojans</li>
              <li><span className="font-semibold">LLM Security:</span> Tokenization, prompt injection, model weight extraction attacks, model editing, abliteration</li>
              <li><span className="font-semibold">GPU & Datacenter Security:</span> Nvidia container toolkit exploits, GPU isolation, confidential computing</li>
              <li><span className="font-semibold">AI Application Security:</span> MCP (Model Context Protocol) security, RAG injection, hardware supply chain</li>
            </ul>
          </div>

          {/* Week 4 */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Week 4: Capstone Project</h3>
            <ul className="list-disc space-y-3 text-gray-700 text-lg ml-8">
              <li>Implement novel security solutions, replicate sophisticated attacks, or conduct security research</li>
              <li>Work with expert mentors on cutting-edge AI security challenges</li>
              <li>Present findings to cohort and industry professionals</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Capstone Projects */}
      <section className="max-w-4xl mx-auto mb-20">
        <h2 className="text-4xl font-bold mb-12 text-center">Capstone Projects</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <span className="text-sm text-gray-500">{project.name}</span>
              </div>
              <p className="text-gray-600">{project.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-4xl mx-auto mb-20">
        <h2 className="text-4xl font-bold mb-12 text-center">Team</h2>
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="flex items-center gap-6">
            <img
              src="/pranav.png"
              alt="Pranav Gade"
              className="w-24 h-24 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <h3 className="text-2xl font-bold mb-4">Pranav Gade</h3>
              <p className="text-lg text-gray-700">
                Research engineer at Conjecture. Created AISB to bridge AI safety and security, and leads curriculum design and program direction.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <img
              src="/jan.png"
              alt="Jan Michelfeit"
              className="w-24 h-24 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <h3 className="text-2xl font-bold mb-4">Jan Michelfeit</h3>
              <p className="text-lg text-gray-700">
                Security lead at Conjecture. Designs AISB's hands-on labs and capstone projects, drawing on 10+ years securing complex systems and ML infrastructure.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <img
              src="/nitzan.png"
              alt="Nitzan Shulman"
              className="w-24 h-24 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <h3 className="text-2xl font-bold mb-4">Nitzan Shulman</h3>
              <p className="text-lg text-gray-700">
                Head of Cyber Security at Heron AI Security Initiative. 6+ years doing security research specializing in IOT, Robotics, Malware and AI security.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <img
              src="/jinglin.png"
              alt="Jinglin Li"
              className="w-24 h-24 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <h3 className="text-2xl font-bold mb-4">Jinglin Li</h3>
              <p className="text-lg text-gray-700">
                Software engineer and educator. Keeps AISB running smoothly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Acknowledgments */}
      <section className="max-w-4xl mx-auto">
        <hr className="border-gray-300 mb-12" />
        <h2 className="text-3xl font-bold mb-8 text-center">Acknowledgments</h2>
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg text-gray-700 text-center">
            This program was supported by{" "}
            <a
              href="https://www.openphilanthropy.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Open Philanthropy
            </a>
          </p>
          <a
            href="https://www.openphilanthropy.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src="/open_phil.webp"
              alt="Open Philanthropy Logo"
              className="h-12 w-auto"
            />
          </a>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-16"></div>
    </div>
  );
}
