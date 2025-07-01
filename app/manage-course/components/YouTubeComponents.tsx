"use client";

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  PlayIcon,
  XMarkIcon,
  PhotoIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { YouTubeEmbedProps, YouTube } from '../types/course-management';

// YouTube Video Embed Component
export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoId,
  width = 560,
  height = 315,
  autoplay = false,
  controls = true,
  modestbranding = true
}) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&controls=${controls ? 1 : 0}&modestbranding=${modestbranding ? 1 : 0}`;

  return (
    <div className="relative" style={{ width, height }}>
      <iframe
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-lg"
      />
    </div>
  );
};

// YouTube Thumbnail Upload Component
interface YouTubeThumbnailUploadProps {
  currentThumbnail?: string;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  uploading?: boolean;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  preview?: string | null;
}

export const YouTubeThumbnailUpload: React.FC<YouTubeThumbnailUploadProps> = ({
  currentThumbnail,
  onFileSelect,
  onRemove,
  uploading = false,
  maxSize = 2,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  preview
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      setError(`Format file tidak didukung. Gunakan: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`);
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Ukuran file terlalu besar. Maksimal ${maxSize}MB`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileSelect = useCallback((file: File) => {
    if (validateFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect, maxSize, allowedTypes]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const displayThumbnail = preview || currentThumbnail;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
        Thumbnail YouTube Kustom
      </label>
      
      {displayThumbnail ? (
        <div className="relative">
          <div className="relative w-full h-40 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-neutral-600">
            <Image
              src={displayThumbnail}
              alt="YouTube Thumbnail"
              fill
              className="object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onRemove}
            disabled={uploading}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-brand-purple bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-300 dark:border-neutral-600 hover:border-gray-400 dark:hover:border-neutral-500'
          }`}
        >
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-neutral-500" />
          <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
            Klik atau seret file thumbnail di sini
          </p>
          <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
            Format: JPEG, PNG, WebP (maks. {maxSize}MB)
          </p>
          {uploading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-neutral-800/80 flex items-center justify-center rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileSelect(file);
          }
        }}
        className="hidden"
      />
      
      <p className="text-xs text-gray-500 dark:text-neutral-500">
        Thumbnail kustom akan menggantikan thumbnail default YouTube
      </p>
    </div>
  );
};

// YouTube URL Input with Preview
interface YouTubeUrlInputProps {
  value: string;
  onChange: (url: string, videoId: string) => void;
  onVideoInfo?: (video: YouTube) => void;
  loading?: boolean;
  error?: string;
}

export const YouTubeUrlInput: React.FC<YouTubeUrlInputProps> = ({
  value,
  onChange,
  onVideoInfo,
  loading = false,
  error
}) => {

  // Extract YouTube video ID from URL
  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleUrlChange = async (newUrl: string) => {
    const videoId = extractVideoId(newUrl);
    
    if (videoId) {
      onChange(newUrl, videoId);
      
      // Simulate fetching video info (in real app, use YouTube API)
      if (onVideoInfo) {
        const mockVideoInfo: YouTube = {
          videoId,
          title: 'Sample YouTube Video',
          description: 'Video description would be fetched from YouTube API',
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          duration: '10:30',
          publishedAt: new Date().toISOString()
        };
        onVideoInfo(mockVideoInfo);
      }
    } else {
      onChange(newUrl, '');
    }
  };

  const videoId = extractVideoId(value);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
          URL Video YouTube
        </label>
        <div className="relative">
          <input
            type="url"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent dark:bg-neutral-700 dark:text-white transition-shadow ${
              error 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-300 dark:border-neutral-600'
            }`}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-purple"></div>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
            <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
            {error}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
          Masukkan URL YouTube yang valid (youtube.com atau youtu.be)
        </p>
      </div>

      {/* Video Preview */}
      {videoId && (
        <div className="border border-gray-200 dark:border-neutral-600 rounded-lg p-4">
          <div className="flex items-center text-green-600 dark:text-green-400 text-sm mb-3">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Video YouTube berhasil dideteksi
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Video Thumbnail Preview */}
            <div className="relative">
              <Image
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="YouTube Video Thumbnail"
                width={320}
                height={180}
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                <PlayIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            
            {/* Video Info */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">
                Video ID: {videoId}
              </p>
              <p className="text-xs text-gray-600 dark:text-neutral-400">
                Video akan diembed menggunakan iframe YouTube
              </p>
              <div className="text-xs text-gray-500 dark:text-neutral-500">
                <p>• Autoplay: Disabled</p>
                <p>• Controls: Enabled</p>
                <p>• Responsive: Yes</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Role Permission Guard Component
interface RoleGuardProps {
  allowedRoles: string[];
  userRole?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  userRole,
  children,
  fallback
}) => {
  const hasPermission = userRole && allowedRoles.includes(userRole);

  if (!hasPermission) {
    return (
      fallback || (
        <div className="text-center p-8 border border-gray-200 dark:border-neutral-600 rounded-lg">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-neutral-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-neutral-100">
            Akses Terbatas
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
            Anda tidak memiliki izin untuk mengakses fitur ini.
            <br />
            Hanya <span className="font-medium">{allowedRoles.join(' dan ')}</span> yang dapat membuat kursus.
          </p>
        </div>
      )
    );
  }

  return <>{children}</>;
}; 