import { BaseContent } from '@/lib/types/content';

export interface TeacherCourse extends BaseContent {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  // YouTube specific fields
  youtubeEmbedUrl?: string;
  youtubeVideoId?: string;
  youtubeThumbnailFile?: File | null;
  youtubeThumbnailUrl?: string;
  category: string;
  level: 'Pemula' | 'Menengah' | 'Lanjutan';
  price: number | 'Gratis';
  published: boolean;
  isNew: boolean;
  tags: string[];
  studentsEnrolled: number;
  lessonsCount: number;
  totalDurationHours: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
  instructorName: string;
  instructorId: string;
}

export interface CourseFormData {
  title: string;
  description: string;
  thumbnailUrl: string;
  // YouTube specific fields
  youtubeEmbedUrl: string;
  youtubeVideoId: string;
  youtubeThumbnailFile: File | null;
  youtubeThumbnailUrl: string;
  category: string;
  level: 'Pemula' | 'Menengah' | 'Lanjutan';
  price: number;
  published: boolean;
  tags: string[];
  lessonsCount: number;
  totalDurationHours: number;
}

export interface CourseStats {
  totalCourses: number;
  totalStudents: number;
  averageRating: number;
  publishedCourses: number;
}

export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: number;
}

export interface CourseManagementConfig {
  itemsPerPage: number;
  allowedRoles: string[];
  categories: string[];
  maxFileSize: number; // for YouTube thumbnail upload in bytes
  allowedImageTypes: string[];
  youtubeApiKey?: string; // for YouTube integration
  enableStats: boolean; // for showing statistics grid
}

export interface CourseManagementState {
  courses: TeacherCourse[];
  loading: boolean;
  submitting: boolean;
  showCreateForm: boolean;
  editingCourse: TeacherCourse | null;
  deletingCourse: TeacherCourse | null;
  notification: NotificationData | null;
  formData: CourseFormData;
  tagInput: string;
  stats: CourseStats;
  config: CourseManagementConfig;
  // File upload states
  uploadingThumbnail: boolean;
  thumbnailPreview: string | null;
}

export interface YouTube {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  publishedAt: string;
}

export interface YouTubeEmbedProps {
  videoId: string;
  width?: number;
  height?: number;
  autoplay?: boolean;
  controls?: boolean;
  modestbranding?: boolean;
}

// Role-based access interface
export interface UserPermissions {
  canCreateCourse: boolean;
  canEditCourse: boolean;
  canDeleteCourse: boolean;
  canPublishCourse: boolean;
  canUploadThumbnail: boolean;
  canManageYouTubeContent: boolean;
} 