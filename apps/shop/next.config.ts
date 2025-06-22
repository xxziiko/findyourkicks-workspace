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
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'shared', 'styles')],
    prependData: `@use "../../packages/shared/styles/variables" as *; @use "../../packages/shared/styles/mixins" as *;`,
  },
  output: 'standalone',
};

export default nextConfig;
