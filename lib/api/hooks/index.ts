/**
 * API Hooks Index
 * Central export for all React hooks
 */

// Auth hooks
export {
  useLogin,
  useRegister,
  useProfile,
  useLogout,
  usePasswordReset
} from './useAuth';

// Course hooks
export {
  useCourses,
  useCourse,
  useCourseBySlug,
  useCourseManagement,
  useCourseSearch
} from './useCourses';

// Lesson hooks
export {
  useCourseLessons,
  useLesson,
  useLessonManagement,
  useLessonProgress,
  useLessonNavigation
} from './useLessons';

// Re-export types for convenience
export type {
  Lesson,
  Enrollment,
  LoginRequest,
  RegisterRequest,
  CreateCourseRequest,
  UpdateCourseRequest,
  CreateLessonRequest,
  UpdateLessonRequest,
  CourseFilters,
  ApiResponse,
  ApiError
} from '../types';

// Re-export global types
export type {
  User,
  Course
} from '@/lib/types';
