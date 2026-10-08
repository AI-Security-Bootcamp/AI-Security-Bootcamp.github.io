import { cohorts2027 } from "../../lib/cohorts";
import { CanonicalizeUrl } from "../2026/_components/CanonicalizeUrl";
import { ProgramIndex } from "../2026/_components/ProgramIndex";
import { programPages } from "../_program-pages";

export default function Programs2027() {
  if (cohorts2027.length === 1) {
    const program = cohorts2027[0];
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
      title="AISB 2027"
      description="Explore every AI Security Bootcamp cohort beginning in 2027."
      programs={cohorts2027}
      analyticsLocation="2027_index"
    />
  );
}
