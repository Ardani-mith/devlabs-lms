/**
 * API Endpoints Index
 * Central export for all API endpoint modules
 */

export { authEndpoints, default as auth } from './auth';
export { courseEndpoints, default as courses } from './courses';
export { lessonEndpoints, default as lessons } from './lessons';
export { enrollmentEndpoints, default as enrollments } from './enrollments';
export { fileEndpoints, default as files } from './files';

// Import for unified object
import { authEndpoints } from './auth';
import { courseEndpoints } from './courses';
import { lessonEndpoints } from './lessons';
import { enrollmentEndpoints } from './enrollments';
import { fileEndpoints } from './files';

// Create a unified API object for easier access
export const apiEndpoints = {
  auth: authEndpoints,
  courses: courseEndpoints,
  lessons: lessonEndpoints,
  enrollments: enrollmentEndpoints,
  files: fileEndpoints,
};

export default apiEndpoints;

// Re-export the API client for direct access
export { api, apiClient } from '../client';
