/**
 * @api - Centralized API Layer
 * 
 * This module provides a unified API interface for the LMS application.
 * All API-related functionality is organized here for easy discovery and use.
 * 
 * @example
 * // Using endpoints directly
 * import { apiEndpoints } from '@/lib/api';
 * const courses = await apiEndpoints.courses.getAll();
 * 
 * @example
 * // Using React hooks
 * import { useCourses, useAuth } from '@/lib/api';
 * const { courses, isLoading } = useCourses();
 * 
 * @example
 * // Using the low-level API client
 * import { api } from '@/lib/api';
 * const response = await api.get('/courses');
 */

// ====================================================================
// Core API Client
// ====================================================================
export { api, apiClient, ApiClient } from './client';

// ====================================================================
// Type Definitions
// ====================================================================
export type * from './types';

// ====================================================================
// API Endpoints
// ====================================================================
export { 
  apiEndpoints,
  authEndpoints,
  courseEndpoints,
  lessonEndpoints,
  enrollmentEndpoints,
  fileEndpoints
} from './endpoints';

// ====================================================================
// React Hooks
// ====================================================================
export {
  // Auth hooks
  useLogin,
  useRegister,
  useProfile,
  useLogout,
  usePasswordReset,
  
  // Course hooks
  useCourses,
  useCourse,
  useCourseBySlug,
  useCourseManagement,
  useCourseSearch,
  
  // Lesson hooks
  useCourseLessons,
  useLesson,
  useLessonManagement,
  useLessonProgress,
  useLessonNavigation
} from './hooks';

// ====================================================================
// Quick Access API Object
// ====================================================================
export { apiEndpoints as endpoints } from './endpoints';

// ====================================================================
// Default Export - Most commonly used functionality
// ====================================================================
import { api, apiClient } from './client';
import { apiEndpoints } from './endpoints';

export default {
  // Direct API access
  api,
  client: apiClient,
  
  // Organized endpoints
  endpoints: apiEndpoints,
  
  // Quick access to auth
  auth: apiEndpoints.auth,
  
  // Quick access to courses
  courses: apiEndpoints.courses,
  
  // Quick access to lessons
  lessons: apiEndpoints.lessons
};
