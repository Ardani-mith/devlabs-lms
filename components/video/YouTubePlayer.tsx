"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { convertYouTubeToEmbed } from '@/lib/utils/youtube';
import { Play, Pause, Volume2, CheckCircle, Clock } from 'lucide-react';

interface YouTubePlayerProps {
  videoUrl: string;
  title: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  className?: string;
  duration?: number;
}

export function YouTubePlayer({ 
  videoUrl, 
  title, 
  onProgress, 
  onComplete, 
  className = "",
  duration = 0
}: YouTubePlayerProps) {
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isWatching, setIsWatching] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showCompleteButton, setShowCompleteButton] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    console.log('🎥 YouTubePlayer received videoUrl:', videoUrl);
    
    if (!videoUrl) {
      setError("URL video tidak tersedia");
      setIsLoading(false);
      return;
    }

    try {
      const converted = convertYouTubeToEmbed(videoUrl);
      console.log('🎥 Converted embed URL:', converted);
      
      if (converted) {
        // Add parameters for better learning experience
        const enhancedUrl = `${converted}?rel=0&modestbranding=1&showinfo=0&enablejsapi=1`;
        console.log('🎥 Enhanced embed URL:', enhancedUrl);
        setEmbedUrl(enhancedUrl);
        setError("");
      } else {
        console.log('❌ Could not convert YouTube URL:', videoUrl);
        setError("URL YouTube tidak valid");
      }
    } catch (err) {
      console.error("❌ YouTube embed error:", err);
      setError("Gagal memuat video");
    } finally {
      setIsLoading(false);
    }
  }, [videoUrl]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Start watching simulation
  const startWatching = useCallback(() => {
    if (isWatching) return;
    
    setIsWatching(true);
    startTimeRef.current = Date.now();
    
    intervalRef.current = setInterval(() => {
      setWatchTime(prev => {
        const newWatchTime = prev + 1;
        const newProgress = duration > 0 ? Math.min((newWatchTime / (duration * 60)) * 100, 100) : Math.min(newWatchTime / 60 * 10, 100);
        
        setProgress(newProgress);
        
        // Show complete button when 80% watched or 5+ minutes
        if (newProgress >= 80 || newWatchTime >= 300) {
          setShowCompleteButton(true);
        }
        
        return newWatchTime;
      });
    }, 1000);
  }, [isWatching, duration]);

  // Separate effect to handle progress callback to avoid setState during render
  const progressRef = useRef<number>(0);
  
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    // Use setTimeout to defer the callback to avoid setState during render
    if (onProgress && progressRef.current > 0) {
      const timeoutId = setTimeout(() => {
        onProgress(progressRef.current);
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
  }, [progress, onProgress]);

  // Stop watching
  const stopWatching = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsWatching(false);
  }, []);

  // Handle manual completion
  const handleComplete = useCallback(() => {
    setProgress(100);
    setShowCompleteButton(false);
    stopWatching();
    
    // Defer the completion callback to avoid setState during render
    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 0);
  }, [onComplete, stopWatching]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (error) {
    return (
      <div className={`bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700 rounded-xl p-8 text-center ${className}`}>
        <div className="text-red-500 dark:text-red-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 mb-3">
          Video Tidak Dapat Dimuat
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-6 max-w-md mx-auto">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className={`relative bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-2xl ${className}`}>
      {/* Loading State */}
      {(isLoading || (!embedUrl && !error)) && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/20 border-t-blue-500 mx-auto mb-6"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-lg font-medium">Memuat video...</p>
            <p className="text-sm text-gray-400 mt-1">Tunggu sebentar</p>
          </div>
        </div>
      )}
      
      {/* Video Container */}
      <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
        {embedUrl && !error ? (
          <>
            <iframe
              src={embedUrl}
              title={title}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={handleIframeLoad}
            />
            
            {/* Click overlay to start tracking */}
            {!isWatching && (
              <div 
                className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer hover:bg-black/20 transition-colors"
                onClick={startWatching}
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
            )}
          </>
        ) : error ? (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center text-white">
              <p className="text-red-400 mb-2">❌ {error}</p>
              <p className="text-sm text-gray-400">Video tidak dapat dimuat</p>
            </div>
          </div>
        ) : null}
      </div>
      
      {/* Video Controls & Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
        {/* Progress Bar */}
        {isWatching && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Video Info */}
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-white text-sm font-semibold truncate mb-1">
              {title}
            </h3>
            <div className="flex items-center space-x-4 text-xs text-gray-300">
              {isWatching && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{Math.floor(watchTime / 60)}:{(watchTime % 60).toString().padStart(2, '0')}</span>
                </div>
              )}
              {duration > 0 && (
                <div className="flex items-center space-x-1">
                  <Volume2 className="w-3 h-3" />
                  <span>{duration} menit</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-4">
            {showCompleteButton && (
              <button
                onClick={handleComplete}
                className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors duration-200"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Selesai
              </button>
            )}
            
            {isWatching ? (
              <button
                onClick={stopWatching}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <Pause className="w-4 h-4 text-white" />
              </button>
            ) : (
              <button
                onClick={startWatching}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <Play className="w-4 h-4 text-white ml-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
