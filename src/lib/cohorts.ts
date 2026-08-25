export type Cohort = {
  id: string;
  name: string;
  year: string;
  href: string;
  analyticsId: string;
  detail: string;
  description: string;
  startDate: string;
  endDate: string;
  month: string;
  monthLabel: string;
  location: string;
  locationSlug: string;
};

export const editions: Cohort[] = [
  {
    id: "london-dec-2026",
    name: "AISB London",
    year: "2026",
    href: "/2026/dec/london",
    analyticsId: "london_dec_2026",
    detail: "7-day intensive · 20 participants · December 2026",
    description:
      "An intensive London cohort for security professionals shaping how we secure emerging AI systems, from adversarial attacks and LLM security to infrastructure and governance.",
    startDate: "2026-12-06",
    endDate: "2026-12-12",
    month: "dec",
    monthLabel: "December",
    location: "London",
    locationSlug: "london",
  },
  {
    id: "sf-2026",
    name: "AISB San Francisco",
    year: "2026",
    href: "/2026/oct/san-francisco",
    analyticsId: "sf_2026",
    detail: "7-day intensive · 20 participants · October 2026",
    description:
      "An AI security cohort in the Bay Area, home to the frontier AI labs. Threat modelling, adversarial attacks, LLM and infrastructure security.",
    startDate: "2026-10-04",
    endDate: "2026-10-10",
    month: "oct",
    monthLabel: "October",
    location: "San Francisco",
    locationSlug: "san-francisco",
  },
  {
    id: "vegas-2026",
    name: "AISB Vegas",
    year: "2026",
    href: "/2026/aug/vegas",
    analyticsId: "vegas_2026",
    detail: "7-day intensive · 20 participants · August 2026",
    description:
      "A frontier AI security cohort during the Las Vegas summer security calendar. Threat modelling, adversarial attacks, LLM and infrastructure security.",
    startDate: "2026-08-02",
    endDate: "2026-08-08",
    month: "aug",
    monthLabel: "August",
    location: "Las Vegas",
    locationSlug: "vegas",
  },
  {
    id: "london-2026",
    name: "AISB London",
    year: "2026",
    href: "/2026/aug/london",
    analyticsId: "london_2026",
    detail: "7-day intensive · 20 participants · August-September 2026",
    description:
      "An intensive cohort for security professionals shaping how we secure emerging AI systems, from adversarial attacks and LLM security to infrastructure and governance.",
    startDate: "2026-08-30",
    endDate: "2026-09-05",
    month: "aug",
    monthLabel: "August",
    location: "London",
    locationSlug: "london",
  },
  {
    id: "singapore-2026",
    name: "AISB Singapore",
    year: "2026",
    href: "/2026/apr/singapore",
    analyticsId: "singapore_2026",
    detail: "7-day intensive · 16 participants · April 2026",
    description:
      "A focused practitioner cohort run alongside Black Hat Asia. Threat modelling, adversarial attacks, LLM and infrastructure security.",
    startDate: "2026-04-20",
    endDate: "2026-04-26",
    month: "apr",
    monthLabel: "April",
    location: "Singapore",
    locationSlug: "singapore",
  },
  {
    id: "london-2025",
    name: "AISB London",
    year: "2025",
    href: "/2025",
    analyticsId: "london_2025",
    detail: "4-week intensive · 20 participants · August 2025",
    description:
      "The first AISB cohort. Four weeks of security fundamentals, infrastructure, and AI-specific threats \u2014 culminating in a week of capstone projects.",
    startDate: "2025-08-04",
    endDate: "2025-08-29",
    month: "aug",
    monthLabel: "August",
    location: "London",
    locationSlug: "london",
  },
];

export const cohorts2026 = editions
  .filter((cohort) => cohort.year === "2026")
  .sort((a, b) => a.startDate.localeCompare(b.startDate));

export const cohortMonths2026 = Array.from(
  new Set(cohorts2026.map((cohort) => cohort.month)),
);

export function getCohortsForMonth(month: string) {
  return cohorts2026.filter((cohort) => cohort.month === month.toLowerCase());
}
