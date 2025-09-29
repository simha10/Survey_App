import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/assignments/:path*',
        destination: `${BACKEND_URL}/api/assignments/:path*`,
      },
    ];
  },
};

export default nextConfig;
