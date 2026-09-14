import type { ReactNode } from "react";
import { HeroFilm } from "./HeroFilm";

export function ProgramHero({
  children,
  affiliations,
}: {
  children: ReactNode;
  affiliations: ReactNode;
}) {
  return (
    <section
      data-testid="program-hero"
      className="flex flex-col px-6 pt-[max(4rem,env(safe-area-inset-top))] md:min-h-screen md:px-16 md:pt-10 lg:px-24"
    >
      <div className="grid w-full max-w-[88rem] items-center gap-6 md:flex-1 md:gap-10 md:py-12 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:py-16 xl:grid-cols-[1.1fr_1.15fr]">
        <div className="min-w-0">{children}</div>
        <div className="min-w-0">
          <HeroFilm />
        </div>
      </div>
      {affiliations}
    </section>
  );
}
