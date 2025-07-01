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
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      // Additional image hosting domains
      {
        protocol: 'https',
        hostname: 'example.com', // For mock uploaded thumbnails
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com', // Pinterest images (used in mock data)
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;