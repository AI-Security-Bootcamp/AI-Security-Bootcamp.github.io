"use client";

import posthog from "posthog-js";
import {
  EOI_URL,
  findLatestOpenApplicationCohort,
  getApplicationMode,
  type ApplicationCohortId,
} from "../lib/application";
import { editions } from "../lib/cohorts";

const BUTTON_CLASS_NAME =
  "inline-flex min-h-[52px] items-center bg-[#ef4444] text-white font-black text-sm uppercase tracking-widest px-6 py-4 hover:bg-red-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ef4444]";

type ClosedApplicationsProps = {
  cohortId: Exclude<ApplicationCohortId, "default">;
  /** Existing analytics placement, e.g. sf26_hero or singapore_cta. */
  location: string;
  className?: string;
  /** The standalone 2025 archive has a light-only design. */
  forceLight?: boolean;
};

/** Shared notice and next steps for a closed cohort, in its hero or closing section. */
export function ClosedApplications({
  cohortId,
  location,
  className = "",
  forceLight = false,
}: ClosedApplicationsProps) {
  if (getApplicationMode(cohortId) !== "eoi") return null;

  const nextCohort = findLatestOpenApplicationCohort();
  const sourceCohort = editions.find((cohort) => cohort.id === cohortId);
  const interest = sourceCohort?.locationSlug;
  const updatesHref = interest ? `${EOI_URL}?interest=${encodeURIComponent(interest)}` : EOI_URL;

  return (
    <div data-testid="closed-applications" data-cohort={cohortId} className={`max-w-2xl ${className}`}>
      <p className={`text-base text-neutral-600 leading-relaxed mb-4 ${forceLight ? "" : "dark:text-neutral-300"}`}>
        Applications for this cohort are closed.
        {nextCohort && (
          <>
            <br />
            Now accepting applications for{" "}
            <span className={`font-bold text-black ${forceLight ? "" : "dark:text-white"}`}>
              {nextCohort.name}
            </span>.
          </>
        )}
      </p>
      {nextCohort && (
        <a
          href={nextCohort.href}
          onClick={() => {
            posthog.capture("clicked_edition", {
              edition: nextCohort.analyticsId,
              location,
              source_cohort: cohortId,
            });
          }}
          className={BUTTON_CLASS_NAME}
        >
          Explore {nextCohort.name}
        </a>
      )}
      <div className={nextCohort ? "mt-2" : undefined}>
        <a
          href={updatesHref}
          onClick={() => {
            posthog.capture("clicked_expression_of_interest", {
              location,
              source_cohort: cohortId,
              interest,
            });
          }}
          className={nextCohort
            ? `inline-flex min-h-[44px] items-center py-2 text-sm text-neutral-600 underline underline-offset-4 hover:text-[#ef4444] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ef4444] ${forceLight ? "" : "dark:text-neutral-400 dark:hover:text-[#ef4444]"}`
            : BUTTON_CLASS_NAME}
        >
          Get notified of future cohorts
        </a>
      </div>
    </div>
  );
}
