import { editions, type Cohort } from "./cohorts";

export const APPLICATION_URL =
  "https://airtable.com/appyq1bBRnK6s7AkM/paglvXzxYAiJclCZX/form";
export const EOI_URL = "/eoi";

export type ApplicationMode = "apply" | "eoi";
export type ApplicationCohortId =
  | "default"
  | "sf-jan-2027"
  | "london-dec-2026"
  | "sf-2026"
  | "vegas-2026"
  | "london-2026"
  | "singapore-2026"
  | "london-2025";

// This is the single source of truth for whether a cohort is accepting applications.
export const applicationModes: Record<ApplicationCohortId, ApplicationMode> = {
  default: "eoi",
  "sf-jan-2027": "apply",
  "london-dec-2026": "eoi",
  "sf-2026": "eoi",
  "vegas-2026": "eoi",
  "london-2026": "eoi",
  "singapore-2026": "eoi",
  "london-2025": "eoi",
};

export function getApplicationMode(cohortId: ApplicationCohortId): ApplicationMode {
  return applicationModes[cohortId];
}

export function getApplicationDestination(cohortId: ApplicationCohortId): string {
  return getApplicationMode(cohortId) === "apply" ? APPLICATION_URL : EOI_URL;
}

function isApplicationCohortId(cohortId: string): cohortId is ApplicationCohortId {
  return cohortId in applicationModes;
}

/** Returns undefined between application campaigns, so archive CTAs can fall back to updates. */
export function findLatestOpenApplicationCohort(): Cohort | undefined {
  return editions
    .filter(
      (candidate) =>
        isApplicationCohortId(candidate.id) && getApplicationMode(candidate.id) === "apply",
    )
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .at(0);
}

/** The latest open cohort's page, or the interest form between application campaigns. */
export function getLatestProgramDestination(): string {
  return findLatestOpenApplicationCohort()?.href ?? EOI_URL;
}
