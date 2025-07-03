// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here, jika ada yang sudah ada, biarkan */
  reactStrictMode: true, // Contoh, jika sudah ada

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com', // <<< TAMBAHKAN DOMAIN INI
        pathname: '/api/**',       // Sesuaikan pathname jika perlu, /api/** akan mencakup semua path di bawah /api/
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // <<< ADDED FOR UNSPLASH IMAGES
        pathname: '/**', // Allow all paths under this hostname
      },
      // YouTube domains untuk course thumbnails
      {
        protocol: 'https',
        hostname: 'www.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'youtu.be', // Short YouTube URLs
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com', // YouTube thumbnail images
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com', // YouTube thumbnail images (alternative)
        pathname: '/**',
      },
      // Additional image hosting domains
      {
        protocol: 'https',
        hostname: 'example.com', // Fallback domain
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com', // Pinterest images
        pathname: '/**',
      },
      // Local development IPs (for safety, though these should be filtered out)
      {
        protocol: 'http',
        hostname: '192.168.112.45',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;