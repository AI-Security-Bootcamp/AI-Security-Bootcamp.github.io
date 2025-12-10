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
    title: "Singapore AI Governance",
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
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back to Home
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          2025 Cohort
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          August 4-29, 2025 &bull; London, UK &bull; 20 Participants
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
        <p className="text-xl text-gray-700 text-center">
          The inaugural AI Security Bootcamp brought together 20 researchers and engineers for four intensive weeks of training in security fundamentals, AI infrastructure security, and AI-specific threats. The program culminated in a week of capstone projects where participants explored cutting-edge security research.
        </p>
      </section>

      {/* Capstone Projects */}
      <section className="max-w-4xl mx-auto">
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

      {/* Footer spacing */}
      <div className="h-16"></div>
    </div>
  );
}
