/**
 * Central API Type Definitions
 * All API-related types should be defined here for consistency
 */

// ====================================================================
// Base Types
// ====================================================================

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  meta?: {
    pagination?: PaginationMeta;
    filters?: FilterMeta;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FilterMeta {
  appliedFilters: Record<string, any>;
  availableFilters: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  field?: string;
}

// ====================================================================
// Auth Types
// ====================================================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
  expires_in: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  name: string;
  password: string;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  avatarUrl?: string;
}

// ====================================================================
// Course Types
// ====================================================================

// Import Course from global types to avoid duplication
import type { Course, User } from '@/lib/types';

export interface CreateCourseRequest {
  title: string;
  description: string;
  thumbnailUrl?: string;
  price: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  published?: boolean;
}

export interface CourseFilters {
  category?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  instructor?: string;
  search?: string;
}

// ====================================================================
// Lesson Types
// ====================================================================

export interface Lesson {
  id: number;
  title: string;
  content?: string; // Backend uses content, not description
  youtubeUrl?: string; // Backend uses youtubeUrl, not videoUrl
  youtubeVideoId?: string;
  duration?: number; // in seconds (backend format)
  order?: number;
  courseId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonRequest {
  title: string;
  content?: string; // Backend uses content
  youtubeUrl?: string; // Backend uses youtubeUrl
  youtubeVideoId?: string;
  duration?: number; // in seconds
  order?: number;
}

export interface UpdateLessonRequest extends Partial<CreateLessonRequest> {
  id?: number;
}

// ====================================================================
// Enrollment Types
// ====================================================================

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: string;
  progress: number; // percentage 0-100
  completedAt?: string;
  user?: User;
  course?: Course;
}

export interface EnrollmentRequest {
  courseId: number;
}

// ====================================================================
// Payment Types
// ====================================================================

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  courseId: number;
  userId: number;
  createdAt: string;
}

export interface PaymentRequest {
  courseId: number;
  paymentMethodId: string;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  date: string;
  courseName: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
}

// ====================================================================
// Dashboard Types
// ====================================================================

export interface DashboardStats {
  totalCourses: number;
  enrolledCourses: number;
  completedCourses: number;
  totalHoursLearned: number;
  currentStreak: number;
  totalCertificates: number;
}

export interface RecentActivity {
  id: string;
  type: 'course_enrolled' | 'lesson_completed' | 'course_completed' | 'certificate_earned';
  title: string;
  description: string;
  date: string;
  courseId?: number;
  lessonId?: number;
}

// ====================================================================
// Analytics Types
// ====================================================================

export interface LearningProgress {
  courseId: number;
  courseTitle: string;
  progress: number;
  timeSpent: number; // in minutes
  lastAccessed: string;
  completedLessons: number;
  totalLessons: number;
}

export interface WeeklyStats {
  week: string;
  hoursLearned: number;
  lessonsCompleted: number;
  coursesEnrolled: number;
}

// ====================================================================
// Message Types
// ====================================================================

export interface Message {
  id: string;
  senderId: number;
  receiverId: number;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: User;
  receiver?: User;
}

export interface SendMessageRequest {
  receiverId: number;
  subject: string;
  content: string;
}

// ====================================================================
// Support Types
// ====================================================================

export interface SupportTicket {
  id: string;
  userId: number;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface CreateSupportTicketRequest {
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
}

// ====================================================================
// File Upload Types
// ====================================================================

export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
