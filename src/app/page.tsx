"use client";


export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 px-4 py-8 md:px-8 lg:px-16">
      {/* Hero Section */}
      <header className="max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-8">
          AI Security Bootcamp
        </h1>
        <div className="text-lg md:text-xl text-gray-600 mb-12 flex flex-wrap justify-center gap-2 md:gap-4">
          <span>4-week intensive program</span>
          <span className="hidden md:inline">•</span>
          <span>London, UK (In-person)</span>
          <span className="hidden md:inline">•</span>
          <span>Fully funded</span>
        </div>
      </header>

      {/* Robot Image and CTA Buttons */}
      <div className="max-w-2xl mx-auto mb-20">
        <div className="max-w-md mx-auto mb-8">
          <img
            src="/robot.png"
            alt="AI Security Robot"
            className="w-full h-auto"
          />
        </div>
        <div className="flex flex-row gap-4 justify-center max-w-md mx-auto w-full">
          <a
            href="/2025"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex-1 text-center"
          >
            View 2025 Cohort
          </a>
          <button
            onClick={() => document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' })}
            className="border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex-1"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto space-y-20" id="learn-more">
        {/* Program Description */}
        <section className="space-y-6">
          <p className="text-xl md:text-2xl text-gray-700 text-center">
            AISB is a 4-week intensive program bringing researchers and engineers up to speed on security fundamentals for AI systems. The first cohort completed the program in August 2025, and we're planning future editions. <a href="mailto:pranav@aisb.dev" className="text-blue-600 hover:underline">Get in touch</a> to stay informed about upcoming programs.
          </p>
          <p className="text-xl md:text-2xl text-gray-700 text-center">
            The curriculum is available <a href="https://github.com/pranavgade20/aisb" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">on GitHub</a> for self-study.
          </p>
        </section>

        {/* What Will I Learn Section */}
        <section>
          <h2 className="text-4xl font-bold mb-12 text-center">What will I learn?</h2>
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
                <li><span className="font-semibold">GPU &amp; Datacenter Security:</span> Nvidia container toolkit exploits, GPU isolation, confidential computing</li>
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

        {/* Who Is This For Section */}
        <section>
          <h2 className="text-4xl font-bold mb-8 text-center">Who is this for?</h2>
          <div className="text-lg text-gray-700 space-y-4">
            <p>
              AISB is designed for researchers and engineers who care about securing the development of AI systems. Ideal participants have prior experience with deep learning (training/evals) and are comfortable with Python.
            </p>
            <p>
              Some C/C++ experience is helpful but not required.
            </p>
            <p>
              The program runs full-time, in-person in London. All expenses including flights, accommodation, and meals are covered.
            </p>
          </div>
        </section>

        {/* FAQs Section */}
        <section>
          <h2 className="text-4xl font-bold mb-12 text-center">FAQs</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Will there be future cohorts?</h3>
              <p className="text-lg text-gray-700 ml-8">
                Yes! We're planning future editions of AISB. <a href="mailto:pranav@aisb.dev" className="text-blue-600 hover:underline">Get in touch</a> to be notified when applications open.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">What are the recommended prerequisites?</h3>
              <p className="text-lg text-gray-700 ml-8">
                We recommend having a solid background in deep learning (or completing a program like MLAB or ARENA) and being comfortable with Python. These skills help participants make the most of the hands-on exercises and technical content.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">What does an average day look like?</h3>
              <p className="text-lg text-gray-700 ml-8">
                Days start with a lecture or deep dive into a significant vulnerability or exploit. Participants then spend most of their time pair programming on exercises and reading relevant material. The final week is dedicated to capstone projects with mentors.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">Does the program cost money?</h3>
              <p className="text-lg text-gray-700 ml-8">
                No. AISB covers accommodation, travel, food (lunch&dinner on weekdays), and visas if needed.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">I have more questions!</h3>
              <p className="text-lg text-gray-700 ml-8">
                Shoot us an <a href="mailto:pranav@aisb.dev" className="text-blue-600 hover:underline">email</a>!
              </p>
            </div>
          </div>

        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-4xl font-bold mb-12 text-center">Meet the Team</h2>
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

        <section>
          <hr className="border-gray-300 mb-12" />
          <h2 className="text-3xl font-bold mb-8 text-center">Acknowledgments</h2>
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg text-gray-700 text-center">
              This program is supported by{" "}
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
      </main>
    </div>
  );
}
