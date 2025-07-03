"use client";

import Image from 'next/image';
import { useState } from 'react';
import { getProperThumbnailUrl } from '@/lib/utils/youtube';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
  onError?: () => void;
}

export default function SafeImage({ 
  src, 
  alt, 
  fill, 
  className, 
  width, 
  height, 
  fallbackSrc,
  onError 
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(() => getProperThumbnailUrl(src, fallbackSrc));
  const [hasError, setHasError] = useState(false);

  const defaultFallback = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop';

  const handleError = () => {
    if (!hasError) {
      console.warn(`Image failed to load: ${imgSrc}, falling back to default`);
      setHasError(true);
      setImgSrc(fallbackSrc || defaultFallback);
      onError?.();
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      unoptimized={hasError} // Use unoptimized for fallback images
    />
  );
} 