"use client";

import { useEffect } from "react";
import {
  findLatestOpenApplicationCohort,
  getLatestProgramDestination,
} from "../../lib/application";

/**
 * Stable, shareable application link. Its destination follows the latest
 * cohort marked as accepting applications in lib/application.ts, or the
 * interest form when none is.
 */
export default function ApplyPage() {
  const isOpen = findLatestOpenApplicationCohort() !== undefined;
  const destination = getLatestProgramDestination();

  useEffect(() => {
    window.location.replace(destination);
  }, [destination]);

  return (
    <main className="min-h-screen grid place-items-center bg-white p-6 text-center text-black">
      <p className="text-sm font-bold uppercase tracking-widest">
        {isOpen
          ? "Taking you to the application for the latest cohort…"
          : "Applications are currently closed. Taking you to the expression of interest form…"}{" "}
        <a className="text-[#ef4444] underline" href={destination}>
          Continue
        </a>
      </p>
    </main>
  );
}
