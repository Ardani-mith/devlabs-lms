import { BaseContent } from '@/lib/types/content';

export interface TeacherCourse extends BaseContent {
  instructorName?: string;
  level: 'Pemula' | 'Menengah' | 'Lanjutan';
  price: number | "Gratis";
  rating?: number;
  studentsEnrolled: number;
  lessonsCount: number;
  totalDurationHours: number;
  isNew: boolean;
  published?: boolean;
  createdAt?: string;
  tags?: string[];
}

export interface CourseFormData {
  title: string;
  description: string;
  thumbnailUrl: string;
  category: string;
  level: 'Pemula' | 'Menengah' | 'Lanjutan';
  price: number;
  tags: string[];
  published: boolean;
}

export interface CourseStats {
  totalCourses: number;
  totalStudents: number;
  averageRating: number;
  publishedCourses: number;
}

export interface NotificationData {
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface CourseManagementConfig {
  enableStats: boolean;
  enableCRUD: boolean;
  enableBulkActions: boolean;
  defaultCategory: string;
  categories: string[];
  showDrafts: boolean;
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
} 