"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { getApplicationMode } from "./application";

const MOBILE_APPLY_FLAG = "signup-sf-mobile-apply-v1";
const SF_APPLICATION_DEADLINE = "2026-11-07T23:59:59-12:00";
type Variant = "control" | "test";

/** Assign once per eligible SF page load, without cookies or browser storage. */
export function useMobileApplyExperiment() {
  const [variant, setVariant] = useState<Variant>();
  const exposed = useRef(false);

  useEffect(() => {
    if (getApplicationMode("sf-jan-2027") !== "apply" || Date.now() > Date.parse(SF_APPLICATION_DEADLINE)) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    let assigned: Variant | undefined;
    const read = () => {
      if (assigned) return;
      const value = posthog.getFeatureFlag(MOBILE_APPLY_FLAG, { send_event: false });
      if (value === "control" || value === "test") {
        assigned = value;
        setVariant(value);
      }
    };
    const unsubscribe = posthog.onFeatureFlags(read);
    read();
    return unsubscribe;
  }, []);

  // Record exposure after React commits the assigned UI. Missing/disabled flags
  // retain the normal page and are never counted as control exposures.
  useEffect(() => {
    if (!variant || exposed.current) return;
    exposed.current = true;
    posthog.capture("signup_experiment_exposed", {
      experiment: MOBILE_APPLY_FLAG,
      variant,
      page: "sf",
      [`$feature/${MOBILE_APPLY_FLAG}`]: variant,
      mobile_apply_variant: variant,
    });
  }, [variant]);

  return variant;
}
