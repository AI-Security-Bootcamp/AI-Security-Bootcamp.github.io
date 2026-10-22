/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Emit directory-style routes (e.g. brand/index.html) so URLs resolve with or
  // without a trailing slash on GitHub Pages.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
