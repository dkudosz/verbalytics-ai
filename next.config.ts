import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    // Avoid blocking Vercel builds on ESLint plugin resolution issues
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

