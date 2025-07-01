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
      // Anda bisa menambahkan konfigurasi untuk domain lain di sini
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   pathname: '/images/**',
      // },
    ],
  },
};

export default nextConfig;