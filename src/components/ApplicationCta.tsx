"use client";

import posthog from "posthog-js";
import {
  getApplicationDestination,
  getLatestOpenApplicationCohort,
  getApplicationMode,
  type ApplicationCohortId,
} from "../lib/application";

const BUTTON_CLASS_NAME =
  "inline-block border-2 border-transparent bg-[#ef4444] text-white font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-red-600 transition-colors";
const INLINE_CLASS_NAME = "underline hover:text-[#ef4444] transition-colors";

type ApplicationCtaProps = {
  cohortId: ApplicationCohortId;
  location: string;
  variant?: "button" | "inline";
  destination?: "application" | "latest-program";
  className?: string;
};

export function ApplicationCta({
  cohortId,
  location,
  variant = "button",
  destination = "application",
  className,
}: ApplicationCtaProps) {
  const mode = getApplicationMode(cohortId);
  const isApplying = mode === "apply";
  const href =
    destination === "latest-program"
      ? getLatestOpenApplicationCohort().href
      : getApplicationDestination(cohortId);
  const label =
    variant === "inline"
      ? isApplying
        ? "Apply now"
        : "Submit an expression of interest"
      : isApplying
        ? "Apply Now"
        : "Expression of Interest";

  return (
    <a
      href={href}
      onClick={() => {
        posthog.capture(isApplying ? "clicked_apply_now" : "clicked_expression_of_interest", {
          location,
        });
      }}
      className={className ?? (variant === "inline" ? INLINE_CLASS_NAME : BUTTON_CLASS_NAME)}
    >
      {label}
    </a>
  );
}
