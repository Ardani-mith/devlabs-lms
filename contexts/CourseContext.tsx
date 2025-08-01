"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { useAuth } from './AuthContext';
import { Course } from '@/lib/types';

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300'}/courses`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status}`);
      }

      const backendCourses = await response.json();
      
      if (!Array.isArray(backendCourses)) {
        throw new Error('Invalid course data received');
      }
      
      const transformedCourses = backendCourses
        .map(transformBackendCourse)
        .filter(course => course !== null) as Course[];
      
      setCourses(transformedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch courses');
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300'}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in to create courses.');
        }
        if (response.status === 403) {
          throw new Error('Permission denied. Only teachers and admins can create courses.');
        }
        if (response.status === 400) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Invalid course data provided.');
        }
        throw new Error(`Failed to create course: ${response.status}`);
      }

      const newBackendCourse = await response.json();
      const newCourse = transformBackendCourse(newBackendCourse);
      
      setCourses(prev => [...prev, newCourse]);
      return newCourse;
    } catch (error) {
      console.error('Error creating course:', error);
      setError(error instanceof Error ? error.message : 'Failed to create course');
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300'}/courses/${numericId}`, {
        method: 'PATCH', // Backend uses PATCH, not PUT
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in to update courses.');
        }
        if (response.status === 403) {
          throw new Error('Permission denied. Only teachers and admins can update courses.');
        }
        if (response.status === 404) {
          throw new Error('Course not found. It may have been deleted or you may not have permission to edit it.');
        }
        if (response.status === 400) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Invalid course data provided.');
        }
        throw new Error(`Failed to update course: ${response.status}`);
      }

      const updatedBackendCourse = await response.json();
      const updatedCourse = transformBackendCourse(updatedBackendCourse);
      
      setCourses(prev => prev.map(course => course.id === id ? updatedCourse : course));
      return updatedCourse;
    } catch (error) {
      console.error('Error updating course:', error);
      setError(error instanceof Error ? error.message : 'Failed to update course');
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300'}/courses/${numericId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in to delete courses.');
        }
        if (response.status === 403) {
          throw new Error('Permission denied. Only teachers and admins can delete courses.');
        }
        if (response.status === 404) {
          throw new Error('Course not found. It may have been already deleted.');
        }
        throw new Error(`Failed to delete course: ${response.status}`);
      }

      setCourses(prev => prev.filter(course => course.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete course');
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