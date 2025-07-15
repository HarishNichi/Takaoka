const fs = require('fs');
const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/**
 * Dynamically get all rc-* packages in node_modules
 */
function getRcPackages() {
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  return fs
    .readdirSync(nodeModulesPath)
    .filter(name => name.startsWith('rc-'));
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compiler: { styledComponents: true },
  reactStrictMode: true,
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },

   transpilePackages: [
    ...getRcPackages(),
     '@ant-design/icons-svg',
     '@rc-component',
  ],
};

//onditionally add 'output: export' if the API URL matches
if (apiUrl === 'https://takaoka-api.nichi.in/api') {
  nextConfig.output = 'export';
}

// Export the config wrapped with bundle analyzer
module.exports = withBundleAnalyzer(nextConfig);
