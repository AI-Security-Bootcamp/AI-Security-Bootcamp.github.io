import { BrandMark, QrBlock, Sheet, SheetFooter, SheetHeader, SquareBulletList } from "./_components";

const cohorts = [
  ["AISB San Francisco", "2026", "20 participants · October 2026"],
  ["AISB Vegas", "2026", "20 participants · August 2026"],
  ["AISB London", "2026", "20 participants · September 2026"],
  ["AISB Singapore", "2026", "16 participants · April 2026"],
];

const curriculum = [
  {
    day: "Day 1",
    title: "Introduction & Threat Modeling",
    items: [
      "Current threat landscape: frameworks, misuse, application security, infrastructure security",
      "Future threat models: misalignment, model theft and tampering, integrity attacks, governance guarantees",
      "Mapping threat models to attacks, defenses, and follow-up pathways",
      "Threat modeling exercise against an AI deployment",
    ],
  },
  {
    day: "Day 2",
    title: "Adversarial Attacks, Watermarking & Data Security",
    items: [
      "Adversarial examples and attacks on image models",
      "Trojans, backdoors, and fine-tuning attacks on open-source models",
      "Model weight extraction attacks",
      "Watermarking techniques and detection",
      "Data security: weight security, training data protection, inference-time data handling",
    ],
  },
  {
    day: "Day 3",
    title: "LLM Security",
    items: [
      "Jailbreaks, prompt injection, and RAG injection",
      "Guardrails: Constitutional classifiers and linear probes",
      "Abliteration and model editing techniques",
      "Tokenization vulnerabilities",
      "MCP (Model Context Protocol) security",
    ],
  },
  {
    day: "Day 4",
    title: "Infrastructure Security",
    items: [
      "NVIDIA Container Toolkit exploits and case studies",
      "GPU isolation and confidential computing",
      "Sandbox design: containment, escape vectors, and design considerations",
    ],
  },
  {
    day: "Day 5",
    title: "Weight Security, Verification & Formal Methods",
    items: [
      "Securing AI Model Weights report analysis and policy implications",
      "Output verification using formal methods",
      "Detecting and defending against rogue deployments",
    ],
  },
  {
    day: "Day 6",
    title: "Data Center Security & ML Stack Threat Modeling",
    items: [
      "Data center infrastructure: power, networking, physical security",
      "ML stack threat modeling end-to-end",
      "Personnel security considerations for AI deployments",
      "Potential site visit (TBD) to a local data center",
    ],
  },
  {
    day: "Day 7",
    title: "AI Control & Hardware Governance",
    items: [
      "AI control mechanisms and policy",
      "Hardware supply chains and governance frameworks",
      "Securing against treaty violations and governance guarantees",
    ],
  },
];

export function HomeSheets() {
  return (
    <>
      <Sheet className="home-cover">
        <SheetHeader />
        <div className="hero-block">
          <h1>AI Security<br />Bootcamp</h1>
          <p className="hero-deck">Training professionals to shape how we secure frontier AI systems.</p>
          <p className="topic-line">Adversarial ML <b>|</b> LLM Security <b>|</b> Infrastructure &amp; Governance</p>
        </div>

        <section className="ruled-section compact-section">
          <p>As AI systems become more capable and integrated into critical infrastructure, new attack surfaces and failure modes are emerging that traditional security training doesn&apos;t cover. We bring together experienced security professionals and equip them with the threat models, techniques, and hands-on skills needed to engage with the most pressing AI security challenges.</p>
          <p>AISB runs fully funded programs for security professionals who want to upskill in security for frontier AI systems. The program is an in-person, 7-day intensive focused on attacks and defenses for frontier AI systems. Accommodation is provided and travel support is available.</p>
        </section>

        <section className="sf-callout">
          <div>
            <p className="eyebrow red">Applications open</p>
            <h2>AISB San Francisco <span>2026</span></h2>
            <p className="metadata">7-day intensive · 20 participants · October 2026</p>
            <p>An AI security cohort in the Bay Area, home to the frontier AI labs. Threat modelling, adversarial attacks, LLM and infrastructure security.</p>
            <p className="deadline">Applications close <strong>August 16, 2026</strong></p>
          </div>
          <QrBlock />
        </section>
        <SheetFooter />
      </Sheet>

      <Sheet>
        <SheetHeader />
        <section className="page-title">
          <h1>Small, intensive cohorts.</h1>
          <p>Each cohort is designed so peer learning between practitioners is a meaningful part of the experience. Participants come from offensive security, incident response, threat intelligence, infrastructure, and application security backgrounds; the AI-specific material pushes that experience into new territory.</p>
          <p>We run cohorts in different cities, partnering with local AI safety and security organisations. Our programs are free to attend and fully funded for accepted participants.</p>
        </section>

        <section className="ruled-section cohorts-section">
          <h2>Cohorts</h2>
          <div className="cohort-grid">
            {cohorts.map(([name, year, detail]) => (
              <article className="cohort-card" key={`${name}-${year}`}>
                <h3>{name} <span>{year}</span></h3>
                <p className="metadata">{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ruled-section faq-pair">
          <div>
            <h3>What is AISB?</h3>
            <p>The AI Security Bootcamp is an intensive, in-person program for security professionals working at the frontier of AI. We focus on the attack surfaces, control mechanisms, and governance challenges that become critical as AI systems grow more capable.</p>
          </div>
          <div>
            <h3>Who else will be in the room?</h3>
            <p>Senior security professionals from across the stack: offensive and defensive, application and infrastructure, detection and response. Cohort sizes are intentionally small so peer learning is a meaningful part of the experience.</p>
            <p>Past participants have been affiliated with OpenAI, Anthropic, Nvidia, Google, Meta, Apple, Microsoft, AWS, Intel, Jane Street, Stanford, Oxford, Cambridge, MIT, UC Berkeley, CERN, and national security agencies.</p>
          </div>
        </section>
        <SheetFooter />
      </Sheet>
    </>
  );
}

export function Sf26Sheets() {
  return (
    <>
      <Sheet className="sf-cover">
        <SheetHeader />
        <p className="eyebrow red cover-eyebrow">Applications open</p>
        <h1>AI Security<br />Bootcamp<br />San Francisco</h1>
        <p className="hero-deck">A 7-day intensive program for security professionals shaping how we secure emerging AI systems.</p>
        <p className="topic-line">Oct 4-10, 2026 <b>|</b> San Francisco <b>|</b> In-Person <b>|</b> Fully Funded</p>

        <section className="sf-cover-details">
          <div>
            <h2>Overview</h2>
            <p>AI Security Bootcamp explores the rapidly evolving threat landscape of frontier AI systems, equipping security professionals with the knowledge and hands-on skills to secure against current and emerging risks.</p>
            <p>Participants complete pre-work before the program to establish baseline ML fundamentals, followed by an immersive week delivered through demos, lectures, guest speakers, and hands-on red/blue team exercises.</p>
          </div>
          <div className="apply-panel">
            <QrBlock large />
            <p>Application Deadline<br /><strong>August 16, 2026</strong></p>
          </div>
        </section>

        <div className="fact-grid">
          <section><p className="eyebrow red">Prerequisites</p><p>7+ years of hands-on security experience. No prior AI or ML background needed. The pre-work covers what&apos;s necessary.</p></section>
          <section><p className="eyebrow red">Cost &amp; Selection</p><p><strong>The program is free to attend.</strong> Tuition, meals during program hours, materials, and accommodation in San Francisco are fully covered. Need-based travel support is available.</p></section>
        </div>
        <SheetFooter label="AISB San Francisco · aisb.dev/sf26" />
      </Sheet>

      <Sheet>
        <SheetHeader />
        <div className="program-heading program-heading--curriculum">
          <h1>The Program</h1>
        </div>
        <div className="curriculum-list curriculum-list--all">
          {curriculum.map((day) => (
            <section className="curriculum-day" key={day.day}>
              <div className="curriculum-title"><span>{day.day}</span><h2>{day.title}</h2></div>
              <SquareBulletList>{day.items.map((item) => <li key={item}>{item}</li>)}</SquareBulletList>
            </section>
          ))}
        </div>
        <SheetFooter label="AISB San Francisco · Curriculum" />
      </Sheet>

      <Sheet>
        <SheetHeader />
        <section className="learn-section learn-section--page">
          <h2>What You&apos;ll Learn</h2>
          <SquareBulletList>
            <li>Develop a threat model for frontier AI systems: from current deployments to increasingly capable systems.</li>
            <li>Build hands-on capability across adversarial techniques, infrastructure exploitation, supply chain attacks, agent security, and model-level vulnerabilities.</li>
            <li>Understand how attacks and defenses scale with AI capability increases.</li>
            <li>Engage with security challenges that frontier AI organizations are actively working on.</li>
            <li>Position yourself for roles at AI labs, government programs, and research institutions.</li>
          </SquareBulletList>
        </section>

        <section className="closing-cta">
          <div><p className="eyebrow red">Applications close August 16</p><h2>Ready to apply?</h2><p>Questions about the program: hello@aisb.dev</p></div>
          <QrBlock large />
        </section>
        <SheetFooter label="AISB San Francisco · aisb.dev/sf26" />
      </Sheet>
    </>
  );
}

export function AirgappedEoiSheet() {
  const signupRows = Array.from({ length: 16 }, (_, index) => index + 1);

  return (
      <Sheet className="eoi-sheet">
      <SheetHeader />
      <h1>Airgapped Expression of Interest</h1>

      <table className="signup-grid">
        <colgroup>
          <col className="signup-number" />
          <col className="signup-name" />
          <col className="signup-contact" />
          <col className="signup-background" />
        </colgroup>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email or physical mailing address</th>
            <th>Security background / role</th>
          </tr>
        </thead>
        <tbody>
          {signupRows.map((row) => (
            <tr key={row}>
              <td>{row}</td>
              <td />
              <td />
              <td />
            </tr>
          ))}
        </tbody>
      </table>

      <SheetFooter label="AI Security Bootcamp · hello@aisb.dev" />
    </Sheet>
  );
}

function Sf26MiniFlyer() {
  return (
    <article className="mini-flyer">
      <BrandMark compact />
      <div className="mini-flyer-rule" />
      <p className="eyebrow red">Applications open</p>
      <h2>AI Security<br />Bootcamp<br /><span>San Francisco</span></h2>
      <p className="mini-flyer-deck">A 7-day intensive program for security professionals shaping how we secure emerging AI systems.</p>
      <p className="mini-flyer-meta">Oct 4-10, 2026 · In-person · Fully funded</p>
      <div className="mini-flyer-bottom">
        <div>
          <p>7+ years of hands-on security experience.</p>
          <p>No prior AI or ML background needed.</p>
          <p className="mini-flyer-deadline">Apply by <strong>August 16</strong></p>
          <p className="mini-flyer-email">hello@aisb.dev</p>
        </div>
        <QrBlock />
      </div>
    </article>
  );
}

export function Sf26FlyerSheet() {
  return (
    <Sheet className="flyer-sheet">
      <Sf26MiniFlyer />
      <Sf26MiniFlyer />
      <Sf26MiniFlyer />
      <Sf26MiniFlyer />
    </Sheet>
  );
}
