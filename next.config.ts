import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
        pathname: "/**",
      },
    ],
    // Increase timeout for image optimization
    minimumCacheTTL: 60,
    // Allow unoptimized images as fallback
    unoptimized: false,
  },
  // Increase timeout for API routes
  experimental: {
    // Increase timeout for image processing
    proxyTimeout: 30000,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
