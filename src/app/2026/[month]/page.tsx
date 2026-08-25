import { notFound } from "next/navigation";
import {
  cohortMonths2026,
  getCohortsForMonth,
} from "../../../lib/cohorts";
import { CanonicalizeUrl } from "../_components/CanonicalizeUrl";
import { ProgramIndex } from "../_components/ProgramIndex";
import { programPages } from "../_program-pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return cohortMonths2026.map((month) => ({ month }));
}

export default function MonthPrograms({ params }: { params: { month: string } }) {
  const programs = getCohortsForMonth(params.month);
  if (programs.length === 0) notFound();

  if (programs.length === 1) {
    const program = programs[0];
    const ProgramPage = programPages[program.id];
    if (!ProgramPage) notFound();

    return (
      <>
        <CanonicalizeUrl to={program.href} />
        <ProgramPage />
      </>
    );
  }

  const monthLabel = programs[0].monthLabel;
  return (
    <ProgramIndex
      eyebrow="2026 Programs"
      title={`${monthLabel} 2026`}
      description={`Choose from the AISB programs beginning in ${monthLabel} 2026.`}
      programs={programs}
      analyticsLocation={`2026_${params.month}_index`}
    />
  );
}
