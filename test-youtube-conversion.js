// Test YouTube URL conversion
const testUrls = [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://youtu.be/dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s',
  'https://youtube.com/embed/dQw4w9WgXcQ',
  'https://www.youtube.com/embed/dQw4w9WgXcQ'
];

// YouTube URL validation and conversion utilities
const validateYouTubeUrl = (url) => {
  if (!url.trim()) {
    return { isValid: false, error: 'URL is required' };
  }

  // YouTube URL patterns - including embed URLs
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return { isValid: true, videoId: match[1] };
    }
  }

  return { isValid: false, error: 'Invalid YouTube URL format. Please use youtube.com or youtu.be URLs' };
};

// Convert YouTube URL to embed URL
const convertToYouTubeEmbed = (url) => {
  const validation = validateYouTubeUrl(url);
  if (validation.isValid && validation.videoId) {
    return `https://www.youtube.com/embed/${validation.videoId}`;
  }
  return url; // Return original if conversion fails
};

console.log('Testing YouTube URL conversion:');
console.log('=====================================');

testUrls.forEach((url, index) => {
  console.log(`\nTest ${index + 1}:`);
  console.log(`Original: ${url}`);
  
  const validation = validateYouTubeUrl(url);
  console.log(`Valid: ${validation.isValid}`);
  console.log(`Video ID: ${validation.videoId || 'N/A'}`);
  
  const embedUrl = convertToYouTubeEmbed(url);
  console.log(`Embed URL: ${embedUrl}`);
});
