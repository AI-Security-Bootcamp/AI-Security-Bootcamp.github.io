import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  EOI_URL,
  findLatestOpenApplicationCohort,
  getLatestProgramDestination,
} from "../../lib/application";
import { CanonicalizeUrl } from "../2026/_components/CanonicalizeUrl";
import { programPages } from "../_program-pages";
import ExpressionOfInterest from "../eoi/page";

export function generateMetadata(): Metadata {
  return { alternates: { canonical: getLatestProgramDestination() } };
}

/**
 * Render the latest open program (or the interest form between campaigns)
 * in the initial HTML, then update the address without another navigation.
 */
export default function ApplyPage() {
  const program = findLatestOpenApplicationCohort();
  const ProgramPage = program ? programPages[program.id] : ExpressionOfInterest;
  if (!ProgramPage) notFound();

  return (
    <>
      <CanonicalizeUrl to={program?.href ?? EOI_URL} />
      <ProgramPage />
    </>
  );
}
