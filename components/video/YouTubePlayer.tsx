"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { convertYouTubeToEmbed } from '@/lib/utils/youtube';

interface YouTubePlayerProps {
  videoUrl: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  className?: string;
}

export function YouTubePlayer({ 
  videoUrl, 
  title, 
  onProgress, 
  onComplete, 
  className = "" 
}: YouTubePlayerProps) {
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!videoUrl) {
      setError("URL video tidak tersedia");
      setIsLoading(false);
      return;
    }

    try {
      const converted = convertYouTubeToEmbed(videoUrl);
      if (converted) {
        // Add autoplay and other parameters for better learning experience
        const enhancedUrl = `${converted}&autoplay=1&rel=0&modestbranding=1&showinfo=0`;
        setEmbedUrl(enhancedUrl);
        setError("");
      } else {
        setError("URL YouTube tidak valid");
      }
    } catch (err) {
      setError("Gagal memuat video");
      console.error("YouTube embed error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [videoUrl]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Simulate progress tracking (in real implementation, you'd use YouTube API)
  useEffect(() => {
    if (embedUrl && onProgress) {
      const interval = setInterval(() => {
        // Simulate progress - in real app, use YouTube API
        const randomProgress = Math.floor(Math.random() * 100);
        onProgress(randomProgress);
        
        // Simulate completion
        if (randomProgress > 95 && onComplete) {
          onComplete();
          clearInterval(interval);
        }
      }, 10000); // Check every 10 seconds

      return () => clearInterval(interval);
    }
  }, [embedUrl, onProgress, onComplete]);

  if (error) {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center ${className}`}>
        <div className="text-red-600 dark:text-red-400 mb-2">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
          Video Tidak Dapat Dimuat
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {(isLoading || (!embedUrl && !error)) && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Memuat video...</p>
          </div>
        </div>
      )}
      
      <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
        {embedUrl && !error ? (
          <iframe
            src={embedUrl}
            title={title}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={handleIframeLoad}
          />
        ) : error ? (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-center text-white">
              <p className="text-red-400 mb-2">❌ {error}</p>
              <p className="text-sm text-gray-400">Video tidak dapat dimuat</p>
            </div>
          </div>
        ) : null}
      </div>
      
      {/* Video info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <h3 className="text-white text-sm font-medium truncate">
          {title}
        </h3>
      </div>
    </div>
  );
}
