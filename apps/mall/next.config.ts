import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jrigsmyeoxklbottbscz.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/**',
      },
    ],
  },
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'shared', 'styles')],
    prependData: `@use "@/shared/styles/variables" as *; @use "@/shared/styles/mixins" as *;`,
  },
};

export default nextConfig;
