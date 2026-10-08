import { notFound } from "next/navigation";
import { cohorts2027 } from "../../../../lib/cohorts";
import { programPages } from "../../../_program-pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return cohorts2027.map((program) => ({
    month: program.month,
    location: program.locationSlug,
  }));
}

export default function Program2027({
  params,
}: {
  params: { month: string; location: string };
}) {
  const program = cohorts2027.find(
    (candidate) =>
      candidate.month === params.month && candidate.locationSlug === params.location,
  );
  if (!program) notFound();

  const ProgramPage = programPages[program.id];
  if (!ProgramPage) notFound();

  return <ProgramPage />;
}
