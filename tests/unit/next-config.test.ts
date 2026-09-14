import assert from 'node:assert/strict';
import { test } from 'vitest';
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from 'next/constants.js';
import nextConfig from '../../next.config.mjs';

test('dev routing avoids Next 14 static-export validation', () => {
  assert.equal(nextConfig(PHASE_DEVELOPMENT_SERVER).output, undefined);
});

test('production still exports directory-style pages for GitHub Pages', () => {
  const config = nextConfig(PHASE_PRODUCTION_BUILD);
  assert.equal(config.output, 'export');
  assert.equal(config.trailingSlash, true);
  assert.equal(config.images?.unoptimized, true);
});
