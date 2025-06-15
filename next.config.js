/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ["placeholder.svg"],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
