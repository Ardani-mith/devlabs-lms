// Test validasi lesson
const testLesson = {
  title: 'Test Lesson',
  description: 'Test Description',
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  duration: 30
};

const validateLesson = (data) => {
  const errors = [];
  
  if (!data.title?.trim()) {
    errors.push('Lesson title is required');
  }
  
  if (!data.description?.trim()) {
    errors.push('Lesson description is required');
  }
  
  if (!data.videoUrl?.trim()) {
    errors.push('Video URL is required');
  } else {
    // Simplified validation for test
    if (!data.videoUrl.includes('youtube.com') && !data.videoUrl.includes('youtu.be')) {
      errors.push('Invalid YouTube URL');
    }
  }
  
  if (data.duration < 1) {
    errors.push('Duration must be at least 1 minute');
  }
  
  return errors;
};

console.log('Testing lesson validation...');
console.log('Test lesson:', testLesson);
console.log('Validation errors:', validateLesson(testLesson));

// Test empty lesson
const emptyLesson = {
  title: '',
  description: '',
  videoUrl: '',
  duration: 0
};

console.log('\nTesting empty lesson...');
console.log('Empty lesson:', emptyLesson);
console.log('Validation errors:', validateLesson(emptyLesson));
