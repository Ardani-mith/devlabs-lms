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
        hostname: 'img.youtube.com', // YouTube thumbnail domain
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'youtu.be', // YouTube short URLs
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.youtube.com', // YouTube main domain
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'youtube.com', // YouTube without www
        pathname: '/**',
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