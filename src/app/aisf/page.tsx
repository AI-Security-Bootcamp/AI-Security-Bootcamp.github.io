"use client";

import { useEffect } from "react";
import {
  APPLICATION_URL,
  EOI_URL,
  findLatestOpenApplicationCohort,
} from "../../lib/application";

export default function AisfRedirect() {
  // Between application campaigns the form is closed, so send visitors to the interest form.
  const isOpen = findLatestOpenApplicationCohort() !== undefined;
  const destination = isOpen ? APPLICATION_URL : EOI_URL;

  useEffect(() => {
    window.location.replace(destination);
  }, [destination]);

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen flex items-center justify-center font-sans px-6 text-center">
      <p className="text-lg text-neutral-500 dark:text-neutral-400">
        {isOpen ? "Redirecting to" : "Applications are currently closed. Redirecting to"}{" "}
        <a href={destination} className="underline hover:text-[#ef4444] transition-colors">
          {isOpen ? "the application form" : "the expression of interest form"}
        </a>
        &hellip;
      </p>
    </div>
  );
}
