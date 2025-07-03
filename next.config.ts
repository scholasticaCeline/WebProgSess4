import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.worldweatheronline.com'], // ✅ Allow external weather icon domain
  },
}

export default nextConfig;
