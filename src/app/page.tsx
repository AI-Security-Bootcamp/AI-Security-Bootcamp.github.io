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
          <span>Apply by June 22nd</span>
          <span className="hidden md:inline">•</span>
          <span>Flights, accommodation, and expenses covered</span>
          <span className="hidden md:inline">•</span>
          <span>London, UK (In-person)</span>
          <span className="hidden md:inline">•</span>
          <span>Program runs August 4th-29th</span>
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
            href="https://airtable.com/app5CvqWYtNWVXBzh/pagLyM1S6ZevGYUcB/form"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex-1 text-center"
          >
            Apply Now
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
        <section>
          <p className="text-xl md:text-2xl text-gray-700 text-center">
            AISB is a 4-week long intensive program to bring researchers and engineers up to speed on security fundamentals for AI systems. <a href="https://airtable.com/app5CvqWYtNWVXBzh/pagLyM1S6ZevGYUcB/form" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Applications</a> are open NOW for particpants, instructors, and mentors.
          </p>
        </section>

        {/* What Will I Learn Section */}
        <section>
          <h2 className="text-4xl font-bold mb-12 text-center">What will I learn?</h2>
          <p className="mb-4 text-lg">Note: The program content is preliminary and may change.</p>
          <div className="space-y-12 text-lg">
            {/* Week 0 */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Week 0: Prerequisites</h3>
              <ul className="list-disc space-y-3 text-gray-700 text-lg ml-8">
                <li><span className="font-semibold">Linux Fundamentals:</span> File permissions, process isolation, etc.</li>
                <li><span className="font-semibold">Python:</span> Optional coding exercises</li>
              </ul>
            </div>

            {/* Week 1 */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Week 1: Security Fundamentals</h3>
              <ul className="list-disc space-y-3 text-gray-700 text-lg ml-8">
                <li><span className="font-semibold">Cryptography & Cryptanalysis:</span> Building and attacking encryption and hashing primitives</li>
                <li><span className="font-semibold">Threat Modeling:</span> Information security fundamentals, analyzing systems for vulnerabilities, security mindset</li>
                <li><span className="font-semibold">Penetration Testing:</span> Hands-on attacks on vulnerable systems, cyber kill chain phases, incident response</li>
                <li><span className="font-semibold">Network Security:</span> Building and breaking network and authentication protocols</li>
              </ul>
            </div>

            {/* Week 2 */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Week 2: AI Infrastructure Security</h3>
              <ul className="list-disc space-y-3 text-gray-700 text-lg ml-8">
                <li><span className="font-semibold">Process Isolation &amp; Containerisation:</span> Building Docker from scratch, namespace isolation, container escape techniques</li>
                <li><span className="font-semibold">Supply Chain Security:</span> Weak points in ML development and deployment environments, dependency provenance, defense best practices</li>
                <li><span className="font-semibold">Application Security:</span> XSS, SQL injection, buffer overflows, secure coding practices</li>
                <li><span className="font-semibold">Security Operations:</span> Hands-on building and maintaining cloud environments, monitoring, exploiting misconfigurations</li>
              </ul>
            </div>

            {/* Week 3 */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Week 3: AI-Specific Security</h3>
              <ul className="list-disc space-y-3 text-gray-700 text-lg ml-8">
                <li><span className="font-semibold">Model Training and Inference Basics</span> in PyTorch</li>
                <li><span className="font-semibold">Inference-Time Attacks</span> Adversarial examples, prompt injection, exfiltration attacks</li>
                <li><span className="font-semibold">Training-Time Attacks:</span> Data poisoning, backdoors, checkpoint manipulation</li>
                <li><span className="font-semibold">AI Application Security:</span> Cross-user data exfiltration, MCP, RAG, injection attacks</li>
                <li><span className="font-semibold">AI Infrastructure:</span> GPU isolation and security features, ML pipeline security</li>
              </ul>
            </div>

            {/* Week 4 */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Week 4: Capstone Project</h3>
              <ul className="list-disc space-y-3 text-gray-700 text-lg ml-8">
                <li>Choose your focus: Implement novel security solutions, replicate sophisticated attacks, or conduct authorized penetration testing</li>
                <li>Work with expert mentors on security challenges</li>
                <li>Present findings to cohort and industry professionals</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Who Should Apply Section */}
        <section>
          <h2 className="text-4xl font-bold mb-8 text-center">Who should apply?</h2>
          <div className="text-lg text-gray-700 space-y-4">
            <p>
              Our ideal candidate cares about safe and responsible development of AI systems. They also have some prior experience with deep learning (training/evals) and are comfortable with Python.
            </p>
            <p>
              Some nice cherry-on-tops would include having a cybersecurity background, and C/C++ experience.
            </p>
            <p>
              Candidates must be available to attend the program full time, in person in London.
            </p>
          </div>
        </section>

        {/* FAQs Section */}
        <section>
          <h2 className="text-4xl font-bold mb-12 text-center">FAQs</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">What is the application process like?</h3>
              <p className="text-lg text-gray-700 ml-8">
                Fill out application → do a technical take-home → interview with someone on the team.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">I am a high school or college student. Can I still apply?</h3>
              <p className="text-lg text-gray-700 ml-8">
                We expect to have a mix of students as well as professionals, so you should apply if you fit the background criteria.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">I have other commitments. Can I attend this program part time?</h3>
              <p className="text-lg text-gray-700 ml-8">
                The curriculum and the readings will likely not leave much time for outside commitments, so we would recommend not having other major time commitments during the bootcamp.
              </p>
              <p className="mt-4 text-lg text-gray-700 ml-8">
                Feel free to <a href="mailto:pranav@aisb.dev" className="text-blue-600 hover:underline">reach out</a> if you'd like to discuss your specific circumstances.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">What are the recommended prerequisites?</h3>
              <p className="text-lg text-gray-700 ml-8">
                We recommend having a solid background in deep learning (or completing a program like MLAB or ARENA) and being comfortable with Python. These skills will help you make the most of the hands-on exercises and technical content during the bootcamp. We'll also send preparatory materials a couple of weeks before the program to help you brush up on essentials.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">Can I join this program for some weeks but not others?</h3>
              <p className="text-lg text-gray-700 ml-8">
                For participants: No, given we have limited spaces, we would be more excited to have participants who can commit to the entire four weeks of the program.
              </p>
              <p className="mt-4 text-lg text-gray-700 ml-8">
                For mentors/instructors: Yes, you can participate for specific weeks. Please take a look at our syllabus to see which weeks align with your expertise.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">What will an average day look like?</h3>
              <p className="text-lg text-gray-700 ml-8">
                You'll start the day with a lecture or a deep dive into a significant vulnerability or exploit. After this, you will spend most of your time pair programming to work on the exercises, and reading relevant material. We will plan to wrap up the exercises by dinnertime, after which we'll have some additional reading material to prepare for the next day.
              </p>
              <p className="mt-4 text-lg text-gray-700 ml-8">
                In the last week, you'll work on a capstone project with a mentor - this can be implementing a security solution, replicating a significant cyberattack (in a controlled environment), or trying to break into systems (again, with explicit permission)
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">Does this program cost money?</h3>
              <p className="text-lg text-gray-700 ml-8">
                No. In fact, we will also take care of accommodation, travel, food (lunch/dinner on weekdays), and visas if needed.
              </p>
            </div>

            <div>
            <h3 className="text-2xl font-bold mb-4">I have more questions! Where can I reach out?</h3>
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
