import { cohorts2026 } from "../../lib/cohorts";
import { CanonicalizeUrl } from "./_components/CanonicalizeUrl";
import { ProgramIndex } from "./_components/ProgramIndex";
import { programPages } from "./_program-pages";

export default function Programs2026() {
  if (cohorts2026.length === 1) {
    const program = cohorts2026[0];
    const ProgramPage = programPages[program.id];

    return (
      <>
        <CanonicalizeUrl to={program.href} />
        <ProgramPage />
      </>
    );
  }

  return (
    <ProgramIndex
      eyebrow="Programs"
      title="AISB 2026"
      description="Explore every AI Security Bootcamp cohort beginning in 2026."
      programs={cohorts2026}
      analyticsLocation="2026_index"
    />
  );
}
