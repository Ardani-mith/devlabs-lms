// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here, jika ada yang sudah ada, biarkan */
  reactStrictMode: true, // Contoh, jika sudah ada

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com', // Untuk thumbnail YouTube
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com', // <<< TAMBAHKAN DOMAIN INI
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;