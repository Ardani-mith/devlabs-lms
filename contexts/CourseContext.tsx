"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { useAuth } from './AuthContext';
import { Course } from '@/lib/types';
import { apiClient } from '@/lib/utils/apiUtils';

export interface CourseFormData {
  title: string;
  description: string;
  thumbnailUrl: string;
  youtubeEmbedUrl: string;
  youtubeVideoId: string;
  youtubeThumbnailUrl: string;
  category: string;
  level: "Pemula" | "Menengah" | "Lanjutan";
  price: number;
  published: boolean;
  tags: string[];
  lessonsCount: number;
  totalDurationHours: number;
}

interface CourseContextType {
  courses: Course[];
  loading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  createCourse: (courseData: CourseFormData) => Promise<Course | null>;
  updateCourse: (id: string, courseData: Partial<CourseFormData>) => Promise<Course | null>;
  deleteCourse: (id: string) => Promise<boolean>;
  getCoursesByInstructor: (instructorId: string) => Course[];
  getPublishedCourses: () => Course[];
  refreshCourses: () => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: ReactNode;
}

const DEFAULT_THUMBNAIL = '/images/course-placeholder.svg';
const DEFAULT_AVATAR = '/images/avatar-placeholder.svg';

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchCoursesRef = useRef<(() => Promise<void>) | null>(null);

  // Transform backend course data to frontend Course interface
  const transformBackendCourse = useCallback((backendCourse: any): Course => {
    try {
      return {
        id: backendCourse.id?.toString() || '',
        slug: backendCourse.slug || backendCourse.id?.toString() || '',
        title: backendCourse.title || 'Untitled Course',
        description: backendCourse.description || 'No description available',
        thumbnailUrl: backendCourse.thumbnailUrl || backendCourse.youtubeThumbnailUrl || DEFAULT_THUMBNAIL,
        instructorName: backendCourse.instructor?.name || backendCourse.instructorName || 'Unknown Instructor',
        instructorAvatarUrl: backendCourse.instructor?.avatarUrl || backendCourse.instructorAvatarUrl || DEFAULT_AVATAR,
        instructorId: backendCourse.instructorId?.toString() || backendCourse.instructor?.id?.toString() || '0',
        category: backendCourse.category || 'Uncategorized',
        level: backendCourse.level || 'Pemula',
        price: backendCourse.price || 0,
        published: Boolean(backendCourse.published),
        rating: backendCourse.rating || 0,
        studentsEnrolled: backendCourse.studentsEnrolled || backendCourse._count?.enrollments || 0,
        lessonsCount: backendCourse.lessonsCount || backendCourse._count?.lessons || 0,
        totalDurationHours: backendCourse.totalDurationHours || 0,
        courseUrl: `/courses/${backendCourse.slug || backendCourse.id}`,
        isNew: Boolean(backendCourse.isNew),
        tags: Array.isArray(backendCourse.tags) ? backendCourse.tags : [],
        youtubeEmbedUrl: backendCourse.youtubeEmbedUrl || '',
        youtubeVideoId: backendCourse.youtubeVideoId || '',
        youtubeThumbnailUrl: backendCourse.youtubeThumbnailUrl || '',
        createdAt: backendCourse.createdAt || new Date().toISOString(),
        updatedAt: backendCourse.updatedAt || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error transforming course:', error);
      // Return a safe default course object
      return {
        id: Date.now().toString(),
        title: 'Error Loading Course',
        description: 'There was an error loading this course.',
        thumbnailUrl: DEFAULT_THUMBNAIL,
        instructorName: 'Unknown',
        instructorId: '0',
        category: 'Uncategorized',
        level: "Pemula",
        price: 0,
        published: false,
        rating: 0,
        studentsEnrolled: 0,
        lessonsCount: 0,
        totalDurationHours: 0,
        courseUrl: '/courses/error',
        tags: [],
        slug: 'error',
        youtubeEmbedUrl: '',
        youtubeVideoId: '',
        youtubeThumbnailUrl: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }, []);

  // Fetch all courses from backend API
  const fetchCourses = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 CourseContext: Fetching courses from API...');
      const backendCourses = await apiClient.get('/courses');
      console.log('✅ CourseContext: Fetched courses from API:', backendCourses);
      
      if (!Array.isArray(backendCourses)) {
        throw new Error('Invalid course data received');
      }
      
      const transformedCourses = backendCourses
        .map(transformBackendCourse)
        .filter(course => course !== null) as Course[];
      
      setCourses(transformedCourses);
    } catch (error) {
      console.error('❌ CourseContext: Error fetching courses:', error);
      
      // Enhanced error handling for different error types
      let errorMessage = 'Failed to load courses';
      
      if (error instanceof Error) {
        if (error.message.includes('429')) {
          errorMessage = 'Server is busy. Please wait a moment and try again.';
        } else if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
          errorMessage = 'Server is temporarily unavailable. Please try again later.';
        } else if (error.message.includes('Network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [transformBackendCourse]);

  // Update ref with latest fetchCourses
  fetchCoursesRef.current = fetchCourses;

  // Create new course with validation
  const createCourse = useCallback(async (courseData: CourseFormData): Promise<Course | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    if (!token) {
      setError('No authentication token found. Please log in again.');
      return null;
    }

    // Validate required fields
    if (!courseData.title || !courseData.description) {
      setError('Title and description are required');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const createdCourse = await apiClient.post('/courses', courseData, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      const newCourse = transformBackendCourse(createdCourse);
      setCourses(prev => [...prev, newCourse]);
      return newCourse;
    } catch (error) {
      console.error('❌ CourseContext: Error creating course:', error);
      
      // Enhanced error handling
      let errorMessage = 'Failed to create course';
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = 'Authentication required. Please log in to create courses.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Permission denied. Only teachers and admins can create courses.';
        } else if (error.message.includes('400')) {
          errorMessage = 'Invalid course data provided.';
        } else if (error.message.includes('429')) {
          errorMessage = 'Server is busy. Please wait a moment and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, token, transformBackendCourse]);

  // Update course with validation
  const updateCourse = useCallback(async (id: string, courseData: Partial<CourseFormData>): Promise<Course | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    if (!token) {
      setError('No authentication token found. Please log in again.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert string ID to number for backend API
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error('Invalid course ID format');
      }

      const updatedCourse = await apiClient.put(`/courses/${numericId}`, courseData, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      const transformedCourse = transformBackendCourse(updatedCourse);
      setCourses(prev => prev.map(course => course.id === id ? transformedCourse : course));
      return transformedCourse;
    } catch (error) {
      console.error('❌ CourseContext: Error updating course:', error);
      
      // Enhanced error handling
      let errorMessage = 'Failed to update course';
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = 'Authentication required. Please log in to update courses.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Permission denied. Only teachers and admins can update courses.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Course not found. It may have been deleted or you may not have permission to edit it.';
        } else if (error.message.includes('400')) {
          errorMessage = 'Invalid course data provided.';
        } else if (error.message.includes('429')) {
          errorMessage = 'Server is busy. Please wait a moment and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, token, transformBackendCourse]);

  // Delete course with confirmation
  const deleteCourse = useCallback(async (id: string): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    if (!token) {
      setError('No authentication token found. Please log in again.');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert string ID to number for backend API
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error('Invalid course ID format');
      }

      await apiClient.delete(`/courses/${numericId}`, {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      setCourses(prev => prev.filter(course => course.id !== id));
      return true;
    } catch (error) {
      console.error('❌ CourseContext: Error deleting course:', error);
      
      // Enhanced error handling
      let errorMessage = 'Failed to delete course';
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = 'Authentication required. Please log in to delete courses.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Permission denied. Only teachers and admins can delete courses.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Course not found. It may have been already deleted.';
        } else if (error.message.includes('429')) {
          errorMessage = 'Server is busy. Please wait a moment and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  // Get courses by instructor
  const getCoursesByInstructor = useCallback((instructorId: string): Course[] => {
    return courses.filter(course => course.instructorId === instructorId);
  }, [courses]);

  // Get published courses
  const getPublishedCourses = useCallback((): Course[] => {
    return courses.filter(course => course.published);
  }, [courses]);

  // Refresh courses
  const refreshCourses = useCallback(() => {
    if (fetchCoursesRef.current) {
      fetchCoursesRef.current();
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const value = {
    courses,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCoursesByInstructor,
    getPublishedCourses,
    refreshCourses
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourseContext = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourseContext must be used within a CourseProvider');
  }
  return context;
};