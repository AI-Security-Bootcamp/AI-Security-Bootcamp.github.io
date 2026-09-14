import assert from "node:assert/strict";
import { test, afterEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { editions } from "../../src/lib/cohorts";
import { getCityProgramSlugs, getLatestCityProgram } from "../../src/lib/city-programs";
import CityProgram, { generateStaticParams, generateMetadata } from "../../src/app/[city]/page";

const originalEditions = [...editions];
afterEach(() => editions.splice(0, editions.length, ...originalEditions));

test('city shortcuts render the latest registered cohort, including closed cohorts', () => {
  const expected = {
    london: '/2026/dec/london',
    sf: '/2026/oct/san-francisco',
    'san-francisco': '/2026/oct/san-francisco',
    vegas: '/2026/aug/vegas',
    singapore: '/2026/apr/singapore',
  };
  assert.deepEqual(generateStaticParams().map(({ city }) => city).sort(), Object.keys(expected).sort());
  for (const [city, href] of Object.entries(expected)) {
    assert.equal(getLatestCityProgram(city)?.href, href);
    assert.equal(generateMetadata({ params: { city } }).alternates?.canonical, href);
    const html = renderToStaticMarkup(React.createElement(CityProgram, { params: { city } }));
    assert.match(html, /<h1/);
    if (city === 'london') assert.match(html, /Dec 6-12, 2026/);
    else assert.match(html, /Applications for this cohort are closed/);
  }
});

test('selection uses start dates, not registry ordering or the current application campaign', () => {
  const snapshot = [...editions];
  assert.equal(getLatestCityProgram('london')?.id, 'london-dec-2026');
  assert.deepEqual(editions, snapshot, 'lookup must not reorder the shared registry');
  editions.reverse();
  const nextLondon = { ...snapshot[0], id: 'london-2027', href: '/2027/jan/london', startDate: '2027-01-10' };
  editions.push(nextLondon);
  assert.equal(getLatestCityProgram('london'), nextLondon);
  assert.equal(getLatestCityProgram('vegas')?.id, 'vegas-2026');
});

test('Singapore advances when a newer cohort is added', () => {
  const nextSingapore = { ...getLatestCityProgram('singapore')!, id: 'singapore-2027', href: '/2027/apr/singapore', startDate: '2027-04-20' };
  editions.push(nextSingapore);
  assert.equal(getLatestCityProgram('singapore'), nextSingapore);
  assert.equal(generateMetadata({ params: { city: 'singapore' } }).alternates?.canonical, nextSingapore.href);
});

test('a city with only a past program still resolves and renders across years', () => {
  const pastLondon = editions.find(({ id }) => id === 'london-2025')!;
  editions.splice(0, editions.length, pastLondon);
  assert.equal(getLatestCityProgram('london'), pastLondon);
  const html = renderToStaticMarkup(React.createElement(CityProgram, { params: { city: 'london' } }));
  assert.match(html, /<h1/);
  assert.match(html, /Applications for this cohort are closed/);
  assert.deepEqual(getCityProgramSlugs(), ['london']);
});

test('new cities receive routes automatically from the cohort registry', () => {
  const berlin = { ...editions[0], id: 'berlin-2027', locationSlug: 'berlin', href: '/2027/jan/berlin', startDate: '2027-01-10' };
  editions.push(berlin);
  assert(generateStaticParams().some(({ city }) => city === 'berlin'));
  assert.equal(getLatestCityProgram('berlin'), berlin);
});

test('unknown routes do not resolve to an unrelated program', () => {
  for (const city of ['unknown-city', 'las-vegas', 'constructor', 'toString']) {
    assert.equal(getLatestCityProgram(city), undefined);
    assert.throws(() => CityProgram({ params: { city } }), /NEXT_NOT_FOUND/);
  }
});
