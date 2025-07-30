/**
 * YouTube URL utility functions
 */

// Base64 encoded placeholder image (1x1 pixel transparent PNG)
const PLACEHOLDER_IMAGE = '/images/course-placeholder.svg';

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    
    // Handle youtube.com URLs
    if (urlObj.hostname.includes('youtube.com')) {
      // Regular watch URLs
      if (urlObj.pathname === '/watch') {
        return urlObj.searchParams.get('v');
      }
      // Shortened /v/ URLs
      if (urlObj.pathname.startsWith('/v/')) {
        return urlObj.pathname.split('/')[2];
      }
      // Embed URLs
      if (urlObj.pathname.startsWith('/embed/')) {
        return urlObj.pathname.split('/')[2];
      }
    }
    
    // Handle youtu.be URLs
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing YouTube URL:', error);
    return null;
  }
}

/**
 * Get YouTube embed URL from video ID
 */
export function getYouTubeEmbedUrl(videoId: string | null): string {
  if (!videoId) return '';
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Get YouTube thumbnail URL with fallback quality options
 */
export function getYouTubeThumbnail(videoId: string | null, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'hq'): string {
  if (!videoId) return PLACEHOLDER_IMAGE;

  const qualityMap = {
    default: '',
    mq: 'mq',
    hq: 'hq',
    sd: 'sd',
    maxres: 'maxresdefault'
  };

  const suffix = qualityMap[quality] ? `${qualityMap[quality]}.jpg` : 'default.jpg';
  return `https://img.youtube.com/vi/${videoId}/${suffix}`;
}

/**
 * Validate YouTube URL and extract video ID
 */
export function validateYouTubeUrl(url: string): { isValid: boolean; videoId?: string; error?: string } {
  if (!url) {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    const videoId = extractYouTubeVideoId(url);
    
    if (!videoId) {
      return { isValid: false, error: 'Invalid YouTube URL format' };
    }

    return { isValid: true, videoId };
  } catch (error) {
    console.error('Error validating YouTube URL:', error);
    return { isValid: false, error: 'Invalid URL format' };
  }
}

/**
 * Check if URL is a YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  
  return /(?:youtube\.com|youtu\.be)/.test(url);
}

/**
 * Check if URL is a valid image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;

  // If it's a data URL, consider it valid
  if (url.startsWith('data:image/')) return true;
  
  // Check for common image extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i;
  if (imageExtensions.test(url)) return true;
  
  // Check for known image hosting domains
  const imageHosts = [
    'images.unsplash.com',
    'img.youtube.com',
    'i.ytimg.com',
    'i.pinimg.com',
    'cdn.pixabay.com',
    'images.pexels.com',
    'via.placeholder.com',
    'picsum.photos',
    'ui-avatars.com',
    'i.pravatar.cc'
  ];
  
  try {
    const hostname = new URL(url).hostname;
    return imageHosts.some(host => hostname.includes(host));
  } catch {
    return false;
  }
}

/**
 * Check if URL looks like a non-image URL (login, API endpoints, etc.)
 */
export function isNonImageUrl(url: string): boolean {
  const nonImagePaths = [
    'youtube.com/watch',
    'youtu.be/',
    'youtube.com/embed/',
    'youtube.com/v/'
  ];
  
  return nonImagePaths.some(path => url.toLowerCase().includes(path));
}

/**
 * Convert any YouTube URL to proper thumbnail URL
 */
export function convertYouTubeUrlToThumbnail(url: string): string {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return PLACEHOLDER_IMAGE;
  
  // This function now correctly uses getYouTubeThumbnail
  return getYouTubeThumbnail(videoId, 'hq');
}

/**
 * Get proper thumbnail URL from any URL (handles YouTube conversion)
 * This is the main, more comprehensive function.
 */
export function getProperThumbnailUrl(url: string, fallbackUrl?: string): string {
  if (!url) {
    return fallbackUrl || PLACEHOLDER_IMAGE;
  }

  // If it's a data URL, return it as is
  if (url.startsWith('data:image/')) {
    return url;
  }

  // If it's a YouTube URL, convert to thumbnail
  if (isYouTubeUrl(url)) {
    return convertYouTubeUrlToThumbnail(url) || fallbackUrl || PLACEHOLDER_IMAGE;
  }

  // If it's a valid image URL, return it
  if (isValidImageUrl(url)) {
    return url;
  }
  
  // If it's clearly not an image URL (like login pages, API endpoints), return fallback
  // This check can be combined or placed before isValidImageUrl if needed
  if (isNonImageUrl(url)) {
    return fallbackUrl || PLACEHOLDER_IMAGE;
  }

  // For any other case, return the fallback
  return fallbackUrl || PLACEHOLDER_IMAGE;
}
