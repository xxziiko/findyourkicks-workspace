import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jrigsmyeoxklbottbscz.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
    formats: ['image/webp'],
    deviceSizes: [380],
    imageSizes: [32, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'shared', 'styles')],
    prependData: `@use "../../packages/shared/styles/variables" as *; @use "../../packages/shared/styles/mixins" as *;`,
  },
  output: 'standalone',
};

export default nextConfig;
