import { notFound } from "next/navigation";
import { cohorts2026 } from "../../../../lib/cohorts";
import { programPages } from "../../_program-pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return cohorts2026.map((program) => ({
    month: program.month,
    location: program.locationSlug,
  }));
}

export default function Program2026({
  params,
}: {
  params: { month: string; location: string };
}) {
  const program = cohorts2026.find(
    (candidate) =>
      candidate.month === params.month && candidate.locationSlug === params.location,
  );
  if (!program) notFound();

  const ProgramPage = programPages[program.id];
  if (!ProgramPage) notFound();

  return <ProgramPage />;
}
