import { ComponentType } from 'react';

// Generic content types that can be used for courses, teachers, webinars, etc.

export interface BaseContent {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  category: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  avatarUrl?: string;
  title?: string;
  bio?: string;
  rating?: number;
  studentsCount?: number;
  coursesCount?: number;
}

export interface CourseContent extends BaseContent {
  type: 'course';
  instructorName: string;
  instructorAvatarUrl?: string;
  instructor?: Instructor;
  lessonsCount: number;
  totalDurationHours: number;
  level: "Pemula" | "Menengah" | "Lanjutan" | "Semua Level";
  rating?: number;
  studentsEnrolled?: number;
  price?: number | "Gratis";
  courseUrl?: string;
  enrollmentStatus?: 'enrolled' | 'not_enrolled' | 'completed';
  progress?: number;
}

export interface TeacherContent extends BaseContent {
  type: 'teacher';
  specialization: string;
  experience?: string;
  rating?: number;
  studentsCount?: number;
  coursesCount?: number;
  languages?: string[];
  hourlyRate?: number;
  availability?: 'available' | 'busy' | 'offline';
}

export interface WebinarContent extends BaseContent {
  type: 'webinar';
  hostName: string;
  hostAvatarUrl?: string;
  scheduledAt: string;
  duration: number; // in minutes
  attendeesCount?: number;
  maxAttendees?: number;
  price?: number | "Gratis";
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  registrationUrl?: string;
  meetingUrl?: string;
}

export interface NewsContent extends BaseContent {
  type: 'news';
  authorName: string;
  authorAvatarUrl?: string;
  publishedAt: string;
  readTime?: number; // in minutes
  excerpt?: string;
  contentUrl?: string;
}

// Union type for all content types
export type Content = CourseContent | TeacherContent | WebinarContent | NewsContent;

// Generic filter options
export interface FilterOption {
  id: string;
  label: string;
  value: string;
  count?: number;
}

export interface ContentFilters {
  search?: string;
  category?: string;
  level?: string;
  price?: 'all' | 'free' | 'paid';
  rating?: number;
  status?: string;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'rating' | 'price' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Generic pagination
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ContentResponse<T = Content> {
  data: T[];
  meta: PaginationMeta;
  filters?: {
    categories: FilterOption[];
    levels?: FilterOption[];
    statuses?: FilterOption[];
  };
}

// Content display configuration
export interface ContentDisplayConfig {
  showInstructor?: boolean;
  showRating?: boolean;
  showPrice?: boolean;
  showDuration?: boolean;
  showProgress?: boolean;
  showStatus?: boolean;
  showTags?: boolean;
  maxTags?: number;
  cardVariant?: 'default' | 'compact' | 'detailed';
  gridCols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

// Search and filter configuration
export interface FilterConfig {
  showSearch?: boolean;
  showCategoryFilter?: boolean;
  showLevelFilter?: boolean;
  showPriceFilter?: boolean;
  showRatingFilter?: boolean;
  showStatusFilter?: boolean;
  showSortOptions?: boolean;
  customFilters?: FilterOption[];
  searchPlaceholder?: string;
}

// Page configuration for different content types
export interface ContentPageConfig {
  title: string;
  description?: string;
  contentType: 'course' | 'teacher' | 'webinar' | 'news';
  apiEndpoint: string;
  displayConfig: ContentDisplayConfig;
  filterConfig: FilterConfig;
  emptyState?: {
    icon?: ComponentType<{ className?: string }>;
    title: string;
    description: string;
    actionLabel?: string;
    actionUrl?: string;
  };
} 