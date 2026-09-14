import assert from "node:assert/strict";
import { test, afterEach } from "vitest";
import React, { type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ClosedApplications } from "../../src/components/ClosedApplications";
import { applicationModes, findLatestOpenApplicationCohort, type ApplicationCohortId } from "../../src/lib/application";

type NoticeProps = ComponentProps<typeof ClosedApplications>;

const originalModes = { ...applicationModes };
afterEach(() => Object.assign(applicationModes, originalModes));
const render = (cohortId: NoticeProps["cohortId"], props: Partial<NoticeProps> = {}) => renderToStaticMarkup(
  React.createElement(ClosedApplications, { cohortId, location: 'test', ...props }),
);

test('every closed cohort uses the same London notice and preserves its city preference', () => {
  for (const [id, interest] of [
    ['sf-2026', 'san-francisco'], ['vegas-2026', 'vegas'],
    ['london-2026', 'london'], ['singapore-2026', 'singapore'], ['london-2025', 'london'],
  ] as const) {
    const html = render(id);
    assert.match(html, /Applications for this cohort are closed\./);
    assert.match(html, /Now accepting applications for/);
    assert.match(html, /Explore AISB London/);
    assert.match(html, /href="\/2026\/dec\/london"/);
    assert(html.includes(`href="/eoi?interest=${interest}"`));
    assert.doesNotMatch(html, /→|&rarr;|airtable\.com/);
  }
});

test('the recommendation follows the open cohort registry, not hardcoded London copy', () => {
  applicationModes['london-dec-2026'] = 'eoi';
  applicationModes['sf-2026'] = 'apply';
  assert.equal(findLatestOpenApplicationCohort()?.id, 'sf-2026');
  assert.match(render('london-2025'), /Explore AISB San Francisco/);
  assert.match(render('london-2025'), /href="\/2026\/oct\/san-francisco"/);
});

test('multiple open cohorts use the existing latest-cohort ordering', () => {
  applicationModes['sf-2026'] = 'apply';
  assert.equal(findLatestOpenApplicationCohort()?.id, 'london-dec-2026');
});

test('between campaigns, the archive offers updates without claiming applications are open', () => {
  for (const id of Object.keys(applicationModes) as ApplicationCohortId[]) applicationModes[id] = 'eoi';
  assert.equal(findLatestOpenApplicationCohort(), undefined);
  const html = render('london-2025');
  assert.match(html, /Get notified of future cohorts/);
  assert.equal((html.match(/<a /g) || []).length, 1);
  assert.doesNotMatch(html, /Now accepting|Explore AISB/);
});

test('an open program never gets a closed-applications notice', () => {
  assert.equal(render('london-dec-2026'), '');
});

test('the light-only 2025 archive does not inherit dark text styles', () => {
  assert.doesNotMatch(render('london-2025', { forceLight: true }), /dark:/);
});
