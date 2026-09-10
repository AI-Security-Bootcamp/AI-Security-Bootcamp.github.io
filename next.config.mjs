import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

/** @type {(phase: string) => import('next').NextConfig} */
const nextConfig = (phase) => ({
  // Next 14's dev server misreports generateStaticParams as missing when
  // static export is combined with dynamicParams: false. Export on builds.
  output: phase === PHASE_DEVELOPMENT_SERVER ? undefined : 'export',
  // Emit directory-style routes (e.g. brand/index.html) so URLs resolve with or
  // without a trailing slash on GitHub Pages.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
});

export default nextConfig;
