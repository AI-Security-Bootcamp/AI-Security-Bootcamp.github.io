import assert from 'node:assert/strict';
import { test } from 'vitest';
import nextConfig from '../../next.config.mjs';

test('production still exports directory-style pages for GitHub Pages', () => {
  assert.equal(nextConfig.output, 'export');
  assert.equal(nextConfig.trailingSlash, true);
  assert.equal(nextConfig.images?.unoptimized, true);
});
