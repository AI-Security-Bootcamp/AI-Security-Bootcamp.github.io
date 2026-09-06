export const APPLICATION_URL =
  "https://airtable.com/appyq1bBRnK6s7AkM/paglvXzxYAiJclCZX/form";
export const EOI_URL = "/eoi";

export type ApplicationMode = "apply" | "eoi";
export type ApplicationCohortId =
  | "default"
  | "london-dec-2026"
  | "sf-2026"
  | "vegas-2026"
  | "london-2026"
  | "singapore-2026";

// This is the single source of truth for whether a cohort is accepting applications.
export const applicationModes: Record<ApplicationCohortId, ApplicationMode> = {
  default: "eoi",
  "london-dec-2026": "apply",
  "sf-2026": "apply",
  "vegas-2026": "eoi",
  "london-2026": "eoi",
  "singapore-2026": "eoi",
};

export function getApplicationMode(cohortId: ApplicationCohortId): ApplicationMode {
  return applicationModes[cohortId];
}

export function getApplicationDestination(cohortId: ApplicationCohortId): string {
  return getApplicationMode(cohortId) === "apply" ? APPLICATION_URL : EOI_URL;
}
