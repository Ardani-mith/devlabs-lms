// Quick test for YouTube URL conversion
const testUrl = "https://youtu.be/yOIO5h3ENIw?si=0Qj2NW-7ly5ZQiFg";

// Simulate the functions from our utility
function isYouTubeUrl(url) {
  if (!url) return false;
  return /(?:youtube\.com|youtu\.be)/.test(url);
}

function extractYouTubeVideoId(url) {
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

function getYouTubeThumbnail(videoId, quality = 'hq') {
  if (!videoId) return '/images/course-placeholder.svg';

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

// Test the conversion
console.log('Original URL:', testUrl);
console.log('Is YouTube URL:', isYouTubeUrl(testUrl));
console.log('Extracted Video ID:', extractYouTubeVideoId(testUrl));
console.log('Thumbnail URL:', getYouTubeThumbnail(extractYouTubeVideoId(testUrl), 'maxres'));
