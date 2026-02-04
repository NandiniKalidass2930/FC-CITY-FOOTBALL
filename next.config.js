import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  
  /* Performance optimizations */
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  
  
  /* Image optimization */
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Allow Sanity CDN images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
        port: '',
      },
    ],
    // Disable image optimization for external domains to avoid private IP resolution issues
    // Sanity CDN already provides optimized images via urlFor helper
    unoptimized: false,
    // Custom loader for Sanity images (optional - can use unoptimized instead)
    loader: undefined,
  },
  
  /* Experimental features for performance */
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    optimizeCss: true,
  },
  
  /* Transpile Sanity packages */
  transpilePackages: ['next-sanity', 'sanity', '@sanity/vision', '@sanity/structure'],
  
  /* Headers for security and performance */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/sanity/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ],
      },
    ];
  },
  
  /* Webpack configuration to restrict module resolution */
  webpack: (config, { isServer }) => {
    // Restrict module resolution to the project directory
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ];
    return config;
  },
  
  /* Turbopack configuration to fix workspace root detection */
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
