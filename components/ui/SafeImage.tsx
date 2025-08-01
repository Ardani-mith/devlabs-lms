"use client";

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

/**
 * Utility Functions for Image Handling
 */

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNMTgwIDEzMEgyMjBWMTcwSDE4MFYxMzBaIiBmaWxsPSIjOTQ5N0ExIi8+PHBhdGggZD0iTTE2MCAxOTBIMjQwVjIzMEgxNjBWMTkwWiIgZmlsbD0iIzk0OTdBMSIvPjxwYXRoIGQ9Ik0xNDAgMjUwSDI2MFYyOTBIMTQwVjI1MFoiIGZpbGw9IiM5NDk3QTEiLz48L3N2Zz4=';

/**
 * Extracts YouTube video ID from various URL formats.
 * @param url The YouTube URL.
 * @returns The video ID or null if not found.
 */
function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Gets a high-quality YouTube thumbnail URL from a video ID.
 * @param videoId The YouTube video ID.
 * @returns The thumbnail URL or a placeholder.
 */
function getYouTubeThumbnail(videoId: string | null): string {
  if (!videoId) return PLACEHOLDER_IMAGE;
  // hqdefault.jpg adalah thumbnail berkualitas tinggi yang andal.
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Checks if a URL is a likely image URL (based on extension).
 * @param url The URL to check.
 * @returns True if it's a likely image URL.
 */
function isLikelyImageUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('data:image/')) return true;
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i;
  return imageExtensions.test(url);
}


/**
 * A smart image component that handles YouTube URL conversion and image errors gracefully.
 * It will automatically convert a YouTube link to its thumbnail before rendering.
 */
interface SmartImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
}

export default function SmartImage({ src, alt, ...props }: SmartImageProps) {
  const [currentSrc, setCurrentSrc] = useState(PLACEHOLDER_IMAGE);
  const [error, setError] = useState(false);

  useEffect(() => {
    let finalSrc = PLACEHOLDER_IMAGE;
    if (src) {
      const videoId = extractYouTubeVideoId(src);
      if (videoId) {
        // Jika ini URL YouTube, ubah menjadi URL thumbnail
        finalSrc = getYouTubeThumbnail(videoId);
      } else if (isLikelyImageUrl(src)) {
        // Jika ini sudah URL gambar, gunakan langsung
        finalSrc = src;
      }
      // Jika bukan keduanya, akan tetap menggunakan PLACEHOLDER_IMAGE
    }
    setCurrentSrc(finalSrc);
    setError(false); // Reset status error setiap kali src berubah
  }, [src]);

  const handleError = () => {
    // Jika terjadi error saat memuat gambar (misalnya thumbnail tidak ada),
    // gunakan placeholder yang aman.
    setError(true);
    setCurrentSrc(PLACEHOLDER_IMAGE);
  };

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={handleError}
    />
  );
}