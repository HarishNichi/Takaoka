const fs = require('fs');
const path = require('path');

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

// Conditionally add 'output: export' if the API URL matches
// if (apiUrl === 'https://rakurakuapi.nichi.in/api') {
//   nextConfig.output = 'export';
// }

module.exports = nextConfig;
