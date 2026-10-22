"use client";

import { ApplicationCta } from "./ApplicationCta";

export function MobileApply() {
  return (
    <>
      {/* Keep the last content and footer links clear of the fixed button. */}
      <div aria-hidden="true" className="h-[calc(5.5rem+env(safe-area-inset-bottom))] md:hidden" />
      <div data-testid="mobile-apply" className="fixed bottom-0 inset-x-0 z-40 border-t-2 border-black dark:border-white bg-white dark:bg-black px-6 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
        <ApplicationCta
          cohortId="sf-jan-2027"
          location="sf27_mobile_sticky"
          className="flex min-h-[52px] items-center justify-center bg-[#ef4444] text-white font-black text-sm uppercase tracking-widest px-6 py-3 hover:bg-red-600 transition-colors focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef4444]"
        />
      </div>
    </>
  );
}
