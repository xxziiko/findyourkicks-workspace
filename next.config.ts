import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shopping-phinf.pstatic.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'styles')],
    prependData: `@use "mixins";`,
  },
};

export default nextConfig;
