"use client";

import { useEffect } from "react";
import { APPLICATION_URL } from "../../lib/application";

export default function AisfRedirect() {
  useEffect(() => {
    window.location.replace(APPLICATION_URL);
  }, []);

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen flex items-center justify-center font-sans px-6 text-center">
      <p className="text-lg text-neutral-500 dark:text-neutral-400">
        Redirecting to{" "}
        <a href={APPLICATION_URL} className="underline hover:text-[#ef4444] transition-colors">
          the application form
        </a>
        &hellip;
      </p>
    </div>
  );
}
