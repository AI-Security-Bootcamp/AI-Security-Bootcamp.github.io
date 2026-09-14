import { editions, type Cohort } from "./cohorts";

const cityAliases: Record<string, string> = {
  sf: "san-francisco",
};

/** Every program location gets a city route, plus familiar alternate names. */
export function getCityProgramSlugs(): string[] {
  const locations = new Set(editions.map((cohort) => cohort.locationSlug));
  const aliases = Object.keys(cityAliases).filter((alias) =>
    locations.has(cityAliases[alias]),
  );
  return [...new Set([...locations, ...aliases])];
}

/** Select by start date across all years, regardless of application status. */
export function getLatestCityProgram(city: string): Cohort | undefined {
  const location = Object.hasOwn(cityAliases, city) ? cityAliases[city] : city;
  return editions
    .filter((cohort) => cohort.locationSlug === location)
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .at(0);
}
