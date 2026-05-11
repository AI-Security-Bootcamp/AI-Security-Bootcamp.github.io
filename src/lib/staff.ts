export type StaffAppearance = {
  name: string;
  role: string;
  bio: string;
  image: string | null;
};

export type Programme = {
  name: string;
  slug: string;
  staff: StaffAppearance[];
};

const pranav: StaffAppearance = {
  name: "Pranav Gade",
  role: "Program Lead",
  bio: "Research engineer at Conjecture. Created AISB to bridge AI safety and security; leads curriculum design and program direction across all editions.",
  image: "/pranav.png",
};

const jan: StaffAppearance = {
  name: "Jan Michelfeit",
  role: "Security Lead",
  bio: "Security lead at Conjecture. Designs AISB\u2019s hands-on labs and capstone projects, drawing on 10+ years securing complex systems and ML infrastructure.",
  image: "/jan.png",
};

const david: StaffAppearance = {
  name: "David Williams-King",
  role: "Curriculum",
  bio: "Research Manager at ERA, upskilling fellows in technical AI safety research. PhD from Columbia in systems and security; previously CTO and cofounder of cybersecurity insurance startup Elpha Secure.",
  image: "/david.png",
};

const nitzan: StaffAppearance = {
  name: "Nitzan Shulman",
  role: "Security Lead",
  bio: "Head of Cyber Security at Heron AI Security Initiative. 6+ years of security research specialising in IoT, robotics, malware, and AI security.",
  image: "/nitzan.png",
};

const jinglin: StaffAppearance = {
  name: "Jinglin Li",
  role: "Operations",
  bio: "Software engineer and educator. Keeps AISB running smoothly across editions.",
  image: "/jinglin.png",
};

const frantisek: StaffAppearance = {
  name: "Frantisek Drahota",
  role: "Operations",
  bio: "Builds bridges between communities, perspectives, and worldviews to foster collaboration on meaningful projects. Helped run operations for AISB London 2025.",
  image: "/frantisek.png",
};

const valerie: StaffAppearance = {
  name: "Valerie Pang",
  role: "Operations",
  bio: "Program Manager at Singapore AI Safety Hub. Helped run operations for AISB Singapore 2026.",
  image: "/valerie.png",
};

const raymund: StaffAppearance = {
  name: "Raymund Ed Dominic Bermejo",
  role: "Project Manager",
  bio: "Finds, vets, and orchestrates world-class teams to tackle major AI risks. Affiliated with Singapore AI Safety Hub. Project manager for AISB Singapore 2026.",
  image: "/raymund.png",
};

// Programmes — listed in reverse chronological order. Each programme owns its own staff list;
// duplicates across programmes are intentional (people who staffed multiple cohorts).
export const programmes: Programme[] = [
  {
    name: "Singapore 2026",
    slug: "singapore",
    staff: [pranav, jan, david, nitzan, valerie, raymund],
  },
  {
    name: "London 2025",
    slug: "2025",
    staff: [pranav, jan, david, nitzan, jinglin, frantisek],
  },
];

export function getProgramme(slug: string): Programme | undefined {
  return programmes.find((p) => p.slug === slug);
}
