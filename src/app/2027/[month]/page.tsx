import { notFound } from "next/navigation";
import {
  cohortMonths2027,
  getCohortsForMonth,
} from "../../../lib/cohorts";
import { CanonicalizeUrl } from "../../2026/_components/CanonicalizeUrl";
import { ProgramIndex } from "../../2026/_components/ProgramIndex";
import { programPages } from "../../_program-pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return cohortMonths2027.map((month) => ({ month }));
}

export default async function MonthPrograms({ params }: { params: Promise<{ month: string }> }) {
  const { month } = await params;
  const programs = getCohortsForMonth(month, "2027");
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
      eyebrow="2027 Programmes"
      title={`${monthLabel} 2027`}
      description={`Choose from the AISB programmes beginning in ${monthLabel} 2027.`}
      programs={programs}
      analyticsLocation={`2027_${month}_index`}
    />
  );
}
