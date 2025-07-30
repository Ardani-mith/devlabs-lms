// ====================================================================
// Mock Service Layer
// This service layer simulates API calls with realistic delays
// ====================================================================

import {
  mockUsers,
  mockCourses,
  mockLessons,
  mockEnrollments,
  mockDashboardData,
  mockAnalyticsData,
  mockSupportData,
  mockWebinarData,
  mockMessageData,
  mockPaymentData,
  defaultMockUser,
  MockCourse,
  MockLesson,
  MockEnrollment
} from '@/lib/data/mockData';
import { User } from '@/contexts/AuthContext';

// Types for service parameters
interface CourseData {
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  instructorId: number;
  instructorName?: string;
  instructorAvatarUrl?: string;
  thumbnailUrl?: string;
  youtubeThumbnailUrl?: string;
  youtubeEmbedUrl?: string;
  youtubeVideoId?: string;
  lessonsCount?: number;
  totalDurationHours?: number;
  published: boolean;
  tags?: string[];
}

interface LessonData {
  title: string;
  description?: string;
  order: number;
  youtubeVideoId?: string;
  youtubeEmbedUrl?: string;
  youtubeThumbnailUrl?: string;
  duration?: number;
  published?: boolean;
}

interface DashboardData {
  enrolledCourses: MockCourse[];
  recentActivity: unknown[];
  progress: Record<string, number>;
  stats: {
    totalCourses: number;
    completedCourses: number;
    totalHours: number;
  };
}

interface AnalyticsData {
  revenue: number;
  students: number;
  courses: number;
  completion: number;
  chartData: unknown[];
}

interface SupportData {
  faqs: Array<{
    question: string;
    answer: string;
    category: string;
  }>;
  tickets: unknown[];
}

interface WebinarData {
  upcoming: unknown[];
  featured: unknown[];
  categories: string[];
}

interface MessageData {
  conversations: unknown[];
  unreadCount: number;
}

interface PaymentData {
  transactions: unknown[];
  methods: unknown[];
  subscription: unknown;
}

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Local storage keys for mock data persistence
const STORAGE_KEYS = {
  CURRENT_USER: 'mock_current_user',
  COURSES: 'mock_courses',
  LESSONS: 'mock_lessons',
  ENROLLMENTS: 'mock_enrollments'
};

// Helper function to get data from localStorage with fallback
const getStoredData = <T>(key: string, defaultData: T): T => {
  if (typeof window === 'undefined') return defaultData;
  
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  } catch {
    return defaultData;
  }
};

// Helper function to store data in localStorage
const setStoredData = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to store data in localStorage:', error);
  }
};

// ====================================================================
// Authentication Service
// ====================================================================

export class MockAuthService {
  static async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    await delay(800);
    
    // Simple mock authentication
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'password123') {
      const token = `mock_token_${user.id}_${Date.now()}`;
      setStoredData(STORAGE_KEYS.CURRENT_USER, user);
      return { user, token };
    }
    
    return null;
  }

  static async getProfile(token: string): Promise<User | null> {
    await delay(300);
    
    // Extract user ID from mock token
    const tokenParts = token.split('_');
    if (tokenParts.length >= 3 && tokenParts[0] === 'mock' && tokenParts[1] === 'token') {
      const userId = parseInt(tokenParts[2]);
      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        setStoredData(STORAGE_KEYS.CURRENT_USER, user);
        return user;
      }
    }
    
    // Fallback to stored user or default
    return getStoredData(STORAGE_KEYS.CURRENT_USER, defaultMockUser);
  }

  static async updateProfile(userId: number, userData: Partial<User>): Promise<User | null> {
    await delay(600);
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const updatedUser = { ...mockUsers[userIndex], ...userData };
      mockUsers[userIndex] = updatedUser;
      setStoredData(STORAGE_KEYS.CURRENT_USER, updatedUser);
      return updatedUser;
    }
    
    return null;
  }

  static getCurrentUser(): User | null {
    return getStoredData(STORAGE_KEYS.CURRENT_USER, defaultMockUser);
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem('accessToken');
    }
  }
}

// ====================================================================
// Course Service
// ====================================================================

export class MockCourseService {
  static async getCourses(): Promise<MockCourse[]> {
    await delay(600);
    return getStoredData(STORAGE_KEYS.COURSES, mockCourses);
  }

  static async getCourseBySlug(slug: string): Promise<MockCourse | null> {
    await delay(400);
    const courses = getStoredData(STORAGE_KEYS.COURSES, mockCourses);
    return courses.find(course => course.slug === slug) || null;
  }

  static async getCoursesByInstructor(instructorId: number): Promise<MockCourse[]> {
    await delay(300);
    const courses = getStoredData(STORAGE_KEYS.COURSES, mockCourses);
    return courses.filter(course => course.instructorId === instructorId);
  }

  static async createCourse(courseData: CourseData): Promise<MockCourse | null> {
    await delay(1000);
    
    const courses = getStoredData(STORAGE_KEYS.COURSES, mockCourses);
    const newCourse: MockCourse = {
      id: Math.max(...courses.map(c => c.id)) + 1,
      title: courseData.title,
      description: courseData.description,
      thumbnailUrl: courseData.thumbnailUrl || courseData.youtubeThumbnailUrl || 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      instructorId: courseData.instructorId,
      instructor: {
        name: courseData.instructorName || 'Unknown Instructor',
        avatarUrl: courseData.instructorAvatarUrl || '',
        bio: 'Course instructor',
        title: 'Instructor',
        coursesCount: 1,
        studentsCount: 0,
        rating: 5.0
      },
      category: courseData.category,
      level: courseData.level,
      price: courseData.price,
      published: courseData.published,
      rating: 0,
      lessonsCount: courseData.lessonsCount || 0,
      totalDurationHours: courseData.totalDurationHours || 1,
      isNew: true,
      tags: courseData.tags || [],
      slug: courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      youtubeEmbedUrl: courseData.youtubeEmbedUrl || '',
      youtubeVideoId: courseData.youtubeVideoId || '',
      youtubeThumbnailUrl: courseData.youtubeThumbnailUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      studentsEnrolled: 0,
      _count: {
        enrollments: 0,
        modules: 0
      }
    };

    courses.push(newCourse);
    setStoredData(STORAGE_KEYS.COURSES, courses);
    return newCourse;
  }

  static async updateCourse(id: number, courseData: Partial<CourseData>): Promise<MockCourse | null> {
    await delay(800);
    
    const courses = getStoredData(STORAGE_KEYS.COURSES, mockCourses);
    const courseIndex = courses.findIndex(c => c.id === id);
    
    if (courseIndex !== -1) {
      const updatedCourse = {
        ...courses[courseIndex],
        ...courseData,
        updatedAt: new Date().toISOString()
      };
      courses[courseIndex] = updatedCourse;
      setStoredData(STORAGE_KEYS.COURSES, courses);
      return updatedCourse;
    }
    
    return null;
  }

  static async deleteCourse(id: number): Promise<boolean> {
    await delay(500);
    
    const courses = getStoredData(STORAGE_KEYS.COURSES, mockCourses);
    const filteredCourses = courses.filter(c => c.id !== id);
    
    if (filteredCourses.length < courses.length) {
      setStoredData(STORAGE_KEYS.COURSES, filteredCourses);
      return true;
    }
    
    return false;
  }
}

// ====================================================================
// Lesson Service
// ====================================================================

export class MockLessonService {
  static async getLessonsByCourse(courseId: number): Promise<MockLesson[]> {
    await delay(400);
    const lessons = getStoredData(STORAGE_KEYS.LESSONS, mockLessons);
    return lessons.filter(lesson => lesson.courseId === courseId);
  }

  static async createLesson(courseId: number, lessonData: LessonData): Promise<MockLesson | null> {
    await delay(800);
    
    const lessons = getStoredData(STORAGE_KEYS.LESSONS, mockLessons);
    const newLesson: MockLesson = {
      id: Math.max(...lessons.map(l => l.id), 0) + 1,
      title: lessonData.title,
      content: lessonData.description || '',
      youtubeUrl: lessonData.youtubeEmbedUrl || '',
      youtubeVideoId: lessonData.youtubeVideoId || '',
      duration: lessonData.duration || 10,
      order: lessonData.order || lessons.filter(l => l.courseId === courseId).length + 1,
      moduleId: 1,
      courseId: courseId,
      isPreviewable: false,
      completed: false
    };

    lessons.push(newLesson);
    setStoredData(STORAGE_KEYS.LESSONS, lessons);
    return newLesson;
  }

  static async updateLesson(id: number, lessonData: any): Promise<MockLesson | null> {
    await delay(600);
    
    const lessons = getStoredData(STORAGE_KEYS.LESSONS, mockLessons);
    const lessonIndex = lessons.findIndex(l => l.id === id);
    
    if (lessonIndex !== -1) {
      const updatedLesson = { ...lessons[lessonIndex], ...lessonData };
      lessons[lessonIndex] = updatedLesson;
      setStoredData(STORAGE_KEYS.LESSONS, lessons);
      return updatedLesson;
    }
    
    return null;
  }

  static async deleteLesson(id: number): Promise<boolean> {
    await delay(400);
    
    const lessons = getStoredData(STORAGE_KEYS.LESSONS, mockLessons);
    const filteredLessons = lessons.filter(l => l.id !== id);
    
    if (filteredLessons.length < lessons.length) {
      setStoredData(STORAGE_KEYS.LESSONS, filteredLessons);
      return true;
    }
    
    return false;
  }

  static async reorderLesson(id: number, newOrder: number): Promise<boolean> {
    await delay(300);
    
    const lessons = getStoredData(STORAGE_KEYS.LESSONS, mockLessons);
    const lessonIndex = lessons.findIndex(l => l.id === id);
    
    if (lessonIndex !== -1) {
      lessons[lessonIndex].order = newOrder;
      setStoredData(STORAGE_KEYS.LESSONS, lessons);
      return true;
    }
    
    return false;
  }
}

// ====================================================================
// Enrollment Service
// ====================================================================

export class MockEnrollmentService {
  static async getEnrollmentsByUser(userId: number): Promise<MockEnrollment[]> {
    await delay(400);
    const enrollments = getStoredData(STORAGE_KEYS.ENROLLMENTS, mockEnrollments);
    return enrollments.filter(enrollment => enrollment.userId === userId);
  }

  static async enrollCourse(userId: number, courseId: number): Promise<MockEnrollment | null> {
    await delay(600);
    
    const enrollments = getStoredData(STORAGE_KEYS.ENROLLMENTS, mockEnrollments);
    const courses = getStoredData(STORAGE_KEYS.COURSES, mockCourses);
    
    // Check if already enrolled
    const existingEnrollment = enrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (existingEnrollment) return existingEnrollment;
    
    const course = courses.find(c => c.id === courseId);
    if (!course) return null;
    
    const newEnrollment: MockEnrollment = {
      id: Math.max(...enrollments.map(e => e.id), 0) + 1,
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      completed: false,
      course
    };

    enrollments.push(newEnrollment);
    setStoredData(STORAGE_KEYS.ENROLLMENTS, enrollments);
    return newEnrollment;
  }
}

// ====================================================================
// Dashboard Service
// ====================================================================

export class MockDashboardService {
  static async getDashboardData(userId: number): Promise<any> {
    await delay(500);
    return mockDashboardData;
  }
}

// ====================================================================
// Analytics Service
// ====================================================================

export class MockAnalyticsService {
  static async getAnalyticsData(period: string, teacher: string): Promise<any> {
    await delay(700);
    return mockAnalyticsData;
  }

  static async exportAnalyticsReport(data: any): Promise<Blob> {
    await delay(1500);
    // Return a mock PDF blob
    return new Blob(['Mock PDF Content'], { type: 'application/pdf' });
  }
}

// ====================================================================
// Support Service
// ====================================================================

export class MockSupportService {
  static async getSupportData(): Promise<any> {
    await delay(300);
    return mockSupportData;
  }
}

// ====================================================================
// Webinar Service
// ====================================================================

export class MockWebinarService {
  static async getWebinars(): Promise<any> {
    await delay(400);
    return mockWebinarData;
  }
}

// ====================================================================
// Message Service
// ====================================================================

export class MockMessageService {
  static async getMessages(userId: number): Promise<any> {
    await delay(350);
    return mockMessageData;
  }
}

// ====================================================================
// Payment Service
// ====================================================================

export class MockPaymentService {
  static async getPaymentData(userId: number): Promise<any> {
    await delay(450);
    return mockPaymentData;
  }
}

// ====================================================================
// Teacher Service
// ====================================================================

export class MockTeacherService {
  static async getTeachers(): Promise<any[]> {
    await delay(400);
    
    // Transform mock users to teacher format
    return mockUsers
      .filter(user => user.role === 'TEACHER')
      .map(teacher => ({
        id: teacher.id.toString(),
        name: teacher.name,
        avatarUrl: teacher.avatarUrl,
        expertiseAreas: ['Web Development', 'JavaScript'],
        shortBio: teacher.bio,
        coursesCount: 3,
        lessonsCount: 45,
        rating: 4.8,
        isVerified: true,
        profileUrl: `/teachers/${teacher.id}`
      }));
  }
}

// ====================================================================
// Content Service (Generic)
// ====================================================================

export class MockContentService {
  static async getContent(endpoint: string, filters: any): Promise<any> {
    await delay(500);
    
    // Return different data based on endpoint
    if (endpoint.includes('courses')) {
      const courses = getStoredData(STORAGE_KEYS.COURSES, mockCourses);
      return {
        data: courses.filter(course => course.published),
        meta: {
          total: courses.length,
          hasNext: false,
          hasPrev: false
        }
      };
    }
    
    // Default empty response
    return {
      data: [],
      meta: {
        total: 0,
        hasNext: false,
        hasPrev: false
      }
    };
  }
}

// ====================================================================
// Mock Service Factory
// ====================================================================

export const MockServices = {
  auth: MockAuthService,
  course: MockCourseService,
  lesson: MockLessonService,
  enrollment: MockEnrollmentService,
  dashboard: MockDashboardService,
  analytics: MockAnalyticsService,
  support: MockSupportService,
  webinar: MockWebinarService,
  message: MockMessageService,
  payment: MockPaymentService,
  teacher: MockTeacherService,
  content: MockContentService
};

export default MockServices; 