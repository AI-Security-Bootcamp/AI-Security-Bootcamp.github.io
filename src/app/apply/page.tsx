"use client";

import { useEffect } from "react";
import { getLatestOpenApplicationCohort } from "../../lib/application";

/**
 * Stable, shareable application link. Its destination follows the latest
 * cohort marked as accepting applications in lib/application.ts.
 */
export default function ApplyPage() {
  const destination = getLatestOpenApplicationCohort().href;

  useEffect(() => {
    window.location.replace(destination);
  }, [destination]);

  return (
    <main className="min-h-screen grid place-items-center bg-white p-6 text-center text-black">
      <p className="text-sm font-bold uppercase tracking-widest">
        Taking you to the application for the latest cohort…{" "}
        <a className="text-[#ef4444] underline" href={destination}>
          Continue
        </a>
      </p>
    </main>
  );
}
