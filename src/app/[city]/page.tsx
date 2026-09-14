import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCityProgramSlugs, getLatestCityProgram } from "../../lib/city-programs";
import { CanonicalizeUrl } from "../2026/_components/CanonicalizeUrl";
import { programPages } from "../_program-pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCityProgramSlugs().map((city) => ({ city }));
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const program = getLatestCityProgram(params.city);
  if (!program) notFound();

  return { alternates: { canonical: program.href } };
}

export default function CityProgram({ params }: { params: { city: string } }) {
  const program = getLatestCityProgram(params.city);
  if (!program) notFound();

  const ProgramPage = programPages[program.id];
  if (!ProgramPage) notFound();

  return (
    <>
      <CanonicalizeUrl to={program.href} />
      <ProgramPage />
    </>
  );
}
