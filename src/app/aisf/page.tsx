"use client";

import { useEffect } from "react";

const DESTINATION = "https://airtable.com/appyq1bBRnK6s7AkM/paglvXzxYAiJclCZX/form";

export default function AisfRedirect() {
  useEffect(() => {
    window.location.replace(DESTINATION);
  }, []);

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen flex items-center justify-center font-sans px-6 text-center">
      <p className="text-lg text-neutral-500 dark:text-neutral-400">
        Redirecting to{" "}
        <a href={DESTINATION} className="underline hover:text-[#ef4444] transition-colors">
          the application form
        </a>
        &hellip;
      </p>
    </div>
  );
}
