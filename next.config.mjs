/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure we can serve static files from the uploads directory
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add any other configuration options here
};

export default nextConfig;
