/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Domain configuration
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://panel.snowhost.cloud',
  },
  // Base path if needed
  // basePath: '',
  // Asset prefix for CDN if needed
  // assetPrefix: 'https://panel.snowhost.cloud',
}

export default nextConfig;
