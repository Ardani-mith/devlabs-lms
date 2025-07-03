/**
 * YouTube URL utility functions
 */

/**
 * Extract video ID from various YouTube URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // Handle different YouTube URL formats
  const patterns = [
    // youtu.be/VIDEO_ID
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // youtube.com/v/VIDEO_ID
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Get YouTube thumbnail URL from video ID
 */
export function getYouTubeThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'maxres'): string {
  const qualityMap = {
    default: 'default.jpg',
    medium: 'mqdefault.jpg', 
    high: 'hqdefault.jpg',
    standard: 'sddefault.jpg',
    maxres: 'maxresdefault.jpg'
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality] || qualityMap.maxres}`;
}

/**
 * Convert any YouTube URL to proper thumbnail URL
 */
export function convertYouTubeUrlToThumbnail(url: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'maxres'): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  
  return getYouTubeThumbnailUrl(videoId, quality);
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
    'ui-avatars.com'
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
  if (!url) return false;
  
  // Check for common non-image paths
  const nonImagePaths = [
    '/login', '/api/', '/auth/', '/admin/', '/dashboard/',
    '.html', '.php', '.aspx', '.jsp', '/logout', '/signin',
    '/signup', '/register', '/profile', '/settings'
  ];
  
  return nonImagePaths.some(path => url.toLowerCase().includes(path));
}

/**
 * Get proper thumbnail URL from any URL (handles YouTube conversion)
 */
export function getProperThumbnailUrl(url: string, fallbackUrl?: string): string {
  const defaultFallback = fallbackUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop';
  
  if (!url) {
    return defaultFallback;
  }

  // If it's clearly not an image URL (like login pages, API endpoints), return fallback
  if (isNonImageUrl(url)) {
    console.warn(`Non-image URL detected: ${url}, using fallback`);
    return defaultFallback;
  }

  // If it's a YouTube URL, convert to thumbnail
  if (isYouTubeUrl(url)) {
    const thumbnailUrl = convertYouTubeUrlToThumbnail(url);
    if (thumbnailUrl) {
      return thumbnailUrl;
    }
  }

  // If it's a valid image URL, return it
  if (isValidImageUrl(url)) {
    return url;
  }

  // For any other case, try to determine if it's safe to use
  try {
    const urlObj = new URL(url);
    // If it has a suspicious path or no image extension, use fallback
    if (isNonImageUrl(urlObj.pathname) || urlObj.pathname === '/') {
      console.warn(`Suspicious URL detected: ${url}, using fallback`);
      return defaultFallback;
    }
    
    // Otherwise, assume it's an image URL and let it try
    return url;
  } catch {
    // If URL parsing fails, use fallback
    console.warn(`Invalid URL detected: ${url}, using fallback`);
    return defaultFallback;
  }
} 