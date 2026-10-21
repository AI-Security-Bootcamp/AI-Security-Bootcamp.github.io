"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { getApplicationMode } from "./application";

export const SIGNUP_FLAGS = {
  home: "signup-home-decision-info-v1",
  sf: "signup-sf-decision-info-v1",
  mobile: "signup-sf-mobile-apply-v1",
} as const;
export const SF_APPLICATION_DEADLINE = "2026-11-07T23:59:59-12:00";
type Variant = "control" | "test";
type Variants = { information?: Variant; mobile?: Variant };

/** Assign once per page load, without adding cookies or browser storage. */
export function useSignupExperiments(page: "home" | "sf") {
  const [variants, setVariants] = useState<Variants>({});
  const exposed = useRef(new Set<string>());

  useEffect(() => {
    if (getApplicationMode("sf-jan-2027") !== "apply" || Date.now() > Date.parse(SF_APPLICATION_DEADLINE)) return;
    const mobileAtLoad = window.matchMedia("(max-width: 767px)").matches;
    const assigned: Variants = {};
    const read = () => {
      const information = posthog.getFeatureFlag(SIGNUP_FLAGS[page], { send_event: false });
      const mobile = page === "sf" && mobileAtLoad
        ? posthog.getFeatureFlag(SIGNUP_FLAGS.mobile, { send_event: false }) : undefined;
      let changed = false;
      if (!assigned.information && (information === "control" || information === "test")) {
        assigned.information = information;
        changed = true;
      }
      if (!assigned.mobile && (mobile === "control" || mobile === "test")) {
        assigned.mobile = mobile;
        changed = true;
      }
      if (changed) setVariants({ ...assigned });
    };
    const unsubscribe = posthog.onFeatureFlags(read);
    read();
    return unsubscribe;
  }, [page]);

  // Record exposure after React commits the assigned UI. Missing/disabled flags
  // retain the normal page and are never counted as control exposures.
  useEffect(() => {
    const assignments = [[SIGNUP_FLAGS[page], variants.information], [SIGNUP_FLAGS.mobile, variants.mobile]] as const;
    for (const [key, variant] of assignments) {
      if (!variant || exposed.current.has(key)) continue;
      exposed.current.add(key);
      posthog.capture("signup_experiment_exposed", {
        experiment: key,
        variant,
        page,
        [`$feature/${key}`]: variant,
        information_variant: variants.information,
        mobile_apply_variant: variants.mobile,
      });
    }
  }, [page, variants]);

  return variants;
}
