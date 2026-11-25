/** @type {import('next').NextConfig} */
module.exports = {
  // Static HTML export for GitHub Pages; build.sh copies out/ to ../spa-next/.
  output: 'export',
  basePath: '/spa-next',
  // /spa-next/products/1/index.html, so a reload or deep link returns 200.
  trailingSlash: true,
  images: { unoptimized: true },
};
