import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
};

module.exports = withPWA(nextConfig);

module.exports = {
  eslint: {
    ignoreDuringBuilds: true, // Desactiva ESLint en el build
  },
};

export default nextConfig;
