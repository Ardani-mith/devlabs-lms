// Shared type definitions for the LMS application

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'USER';
  name?: string;
  avatarUrl?: string;
  bio?: string;
  department?: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  instructorName: string;
  instructorAvatarUrl?: string;
  instructorId?: string;
  category: string;
  lessonsCount: number;
  totalDurationHours: number;
  level: string;
  rating: number;
  studentsEnrolled: number;
  price: number | string;
  courseUrl: string;
  isNew?: boolean;
  published?: boolean;
  tags?: string[];
  youtubeEmbedUrl?: string;
  youtubeVideoId?: string;
  youtubeThumbnailUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Course Detail Types (for individual course pages)
export interface Lesson {
  id: string;
  title: string;
  type: "video" | "bacaan" | "kuis" | "tugas" | "interaktif";
  durationMinutes?: number;
  status: "selesai" | "terkunci" | "sedang_dipelajari" | "selanjutnya";
  url: string;
  isPreviewable?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  isCollapsedInitially?: boolean;
}

export interface DiscussionReply {
  id: string;
  userName: string;
  userAvatar?: string;
  userRole: "Siswa" | "Pengajar";
  timestamp: string;
  text: string;
  likes?: number;
}

export interface DiscussionComment {
  id: string;
  userName: string;
  userAvatar?: string;
  userRole: "Siswa" | "Pengajar";
  timestamp: string;
  text: string;
  replies?: DiscussionReply[];
  likes?: number;
}

export interface CourseDetail {
  slug: string;
  title: string;
  tagline?: string;
  instructorName: string;
  instructorAvatar?: string;
  instructorBio?: string;
  instructorTitle?: string;
  instructorCoursesCount?: number;
  instructorStudentsCount?: number;
  instructorRating?: number;
  description: string;
  fullDescription?: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  category: string;
  level: string;
  rating: number;
  reviewCount?: number;
  studentsEnrolled: number;
  studentCount?: number;
  price: number | string;
  originalPrice?: number;
  modules: Module[];
  discussionComments?: DiscussionComment[];
  discussions?: DiscussionComment[];
  isEnrolled?: boolean;
  progress?: number;
  userProgress?: number;
  certificateUrl?: string;
  hasCertificate?: boolean;
  estimatedHours: number;
  totalLessons?: number;
  totalDurationHours?: number;
  totalVideoHours?: number;
  language: string;
  lastUpdated: string;
  updatedAt?: string;
  lastAccessedLessonUrl?: string;
  lastAccessedLessonTitle?: string;
  prerequisites?: string[];
  learningOutcomes?: string[];
  whatYouWillLearn?: string[];
  skillsYouWillGain?: string[];
  toolsYouWillUse?: string[];
  targetAudience?: string[];
  faq?: Array<{ question: string; answer: string; }>;
  relatedCourses?: Course[];
  tags?: string[];
}

export interface StatCardData {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  href?: string;
}

export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  roles: Array<'ADMIN' | 'INSTRUCTOR' | 'USER'>;
}

export interface NewsItem {
  id: number;
  title: string;
  date: string;
  new: boolean;
  category: string;
  image?: string;
  excerpt?: string;
  href?: string;
}

export interface ActivityItem {
  id: number;
  text: string;
  time: string;
  icon: React.ElementType;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface NotificationItem {
  id: number;
  text: string;
  type: 'deadline' | 'feedback' | 'info' | 'warning';
  icon: React.ElementType;
  timestamp?: string;
}

export interface QuickAccessLink {
  title: string;
  icon: React.ElementType;
  href: string;
  description?: string;
}

// Form related types
export interface FormFieldProps {
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ElementType;
  required?: boolean;
  className?: string;
  error?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

// API related types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Filter types
export interface CourseFilters {
  searchTerm: string;
  category: string;
  level: string;
  instructor?: string;
  tags?: string[];
}

export interface SortOptions {
  field: 'title' | 'rating' | 'price' | 'date' | 'popularity';
  order: 'asc' | 'desc';
}

// Re-export new content system types
export * from './content';