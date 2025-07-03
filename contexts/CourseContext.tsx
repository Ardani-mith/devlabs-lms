"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { useAuth } from './AuthContext';
import { getProperThumbnailUrl } from '@/lib/utils/youtube';

// Types
interface ApiCourseResponse {
  id: number;
  title: string;
  description: string;
  thumbnailUrl?: string;
  instructorId: number;
  instructor?: {
    name: string;
    avatarUrl?: string;
  };
  category: string;
  level: string;
  price: number;
  published: boolean;
  rating?: number;
  lessonsCount?: number;
  totalDurationHours?: number;
  isNew?: boolean;
  tags?: string[];
  slug: string;
  youtubeEmbedUrl?: string;
  youtubeVideoId?: string;
  youtubeThumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    enrollments: number;
    modules: number;
  };
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  instructorName: string;
  instructorAvatarUrl?: string;
  instructorId: string;
  category: string;
  level: "Pemula" | "Menengah" | "Lanjutan" | "Semua Level";
  price: number | "Gratis";
  published: boolean;
  rating?: number;
  studentsEnrolled: number;
  lessonsCount: number;
  totalDurationHours: number;
  courseUrl?: string;
  isNew?: boolean;
  tags: string[];
  slug: string;
  youtubeEmbedUrl?: string;
  youtubeVideoId?: string;
  youtubeThumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface CourseFormData {
  title: string;
  description: string;
  thumbnailUrl: string;
  youtubeEmbedUrl?: string;
  youtubeVideoId?: string;
  youtubeThumbnailUrl?: string;
  category: string;
  level: "Pemula" | "Menengah" | "Lanjutan";
  price: number;
  published: boolean;
  tags: string[];
  lessonsCount: number;
  totalDurationHours: number;
}

interface CourseContextType {
  // State
  courses: Course[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchCourses: () => Promise<void>;
  createCourse: (courseData: CourseFormData) => Promise<Course | null>;
  updateCourse: (id: string, courseData: Partial<CourseFormData>) => Promise<Course | null>;
  deleteCourse: (id: string) => Promise<boolean>;
  
  // Utils
  getCoursesByInstructor: (instructorId: string) => Course[];
  getPublishedCourses: () => Course[];
  refreshCourses: () => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use ref to store latest fetchCourses function for auto-refresh
  const fetchCoursesRef = useRef<(() => Promise<void>) | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300';

  // Helper function to get auth headers
  const getAuthHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }, [token]);

  // Transform API response to match frontend Course interface
  const transformApiCourse = (apiCourse: ApiCourseResponse): Course => {
    // Debug logging for problematic thumbnailUrl
    if (apiCourse.thumbnailUrl && apiCourse.thumbnailUrl.includes('login')) {
      console.warn('⚠️ Suspicious thumbnailUrl detected in course:', {
        courseId: apiCourse.id,
        title: apiCourse.title,
        thumbnailUrl: apiCourse.thumbnailUrl
      });
    }

    return {
      id: apiCourse.id?.toString() || '',
      title: apiCourse.title || '',
      description: apiCourse.description || '',
      thumbnailUrl: getProperThumbnailUrl(apiCourse.thumbnailUrl || ''),
      instructorName: apiCourse.instructor?.name || 'Unknown',
      instructorAvatarUrl: apiCourse.instructor?.avatarUrl,
      instructorId: apiCourse.instructorId?.toString() || '',
      category: apiCourse.category || 'Web Development',
             level: (apiCourse.level as "Pemula" | "Menengah" | "Lanjutan") || 'Pemula',
      price: apiCourse.price || 0,
      published: apiCourse.published || false,
      rating: apiCourse.rating,
      studentsEnrolled: apiCourse._count?.enrollments || 0,
      lessonsCount: apiCourse._count?.modules || apiCourse.lessonsCount || 0,
      totalDurationHours: apiCourse.totalDurationHours || 1,
      courseUrl: `/courses/${apiCourse.slug}`,
      isNew: apiCourse.isNew || false,
      tags: apiCourse.tags || [],
      slug: apiCourse.slug || '',
      youtubeEmbedUrl: apiCourse.youtubeEmbedUrl,
      youtubeVideoId: apiCourse.youtubeVideoId,
      youtubeThumbnailUrl: apiCourse.youtubeThumbnailUrl,
      createdAt: apiCourse.createdAt || new Date().toISOString(),
      updatedAt: apiCourse.updatedAt || new Date().toISOString(),
    };
  };

  // Fetch all courses
  const fetchCourses = useCallback(async () => {
    // Prevent multiple concurrent fetches
    setLoading(prevLoading => {
      if (prevLoading) return prevLoading; // Already loading, don't start another
      return true;
    });
    
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const apiCourses = await response.json();
      const transformedCourses = apiCourses.map(transformApiCourse);
      
      setCourses(transformedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, getAuthHeaders]); // Removed 'loading' dependency

  // Update ref with latest fetchCourses
  fetchCoursesRef.current = fetchCourses;

  // Create new course
  const createCourse = useCallback(async (courseData: CourseFormData): Promise<Course | null> => {
    if (!user || !token) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare data for API
      const apiData = {
        title: courseData.title,
        description: courseData.description,
        thumbnailUrl: courseData.youtubeThumbnailUrl || courseData.thumbnailUrl,
        youtubeEmbedUrl: courseData.youtubeEmbedUrl,
        youtubeVideoId: courseData.youtubeVideoId,
        youtubeThumbnailUrl: courseData.youtubeThumbnailUrl,
        category: courseData.category,
        level: courseData.level,
        price: courseData.price,
        published: courseData.published,
        tags: courseData.tags,
        lessonsCount: courseData.lessonsCount,
        totalDurationHours: courseData.totalDurationHours,
        isNew: true
      };

      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(apiData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create course');
      }

      const newApiCourse = await response.json();
      const newCourse = transformApiCourse(newApiCourse);
      
      // Update local state
      setCourses(prev => [newCourse, ...prev]);
      
      return newCourse;
    } catch (error) {
      console.error('Error creating course:', error);
      setError(error instanceof Error ? error.message : 'Failed to create course');
      return null;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, getAuthHeaders, user, token]);

  // Update course
  const updateCourse = useCallback(async (id: string, courseData: Partial<CourseFormData>): Promise<Course | null> => {
    if (!token) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(courseData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update course');
      }

      const updatedApiCourse = await response.json();
      const updatedCourse = transformApiCourse(updatedApiCourse);
      
      // Update local state
      setCourses(prev => prev.map(course => 
        course.id === id ? updatedCourse : course
      ));
      
      return updatedCourse;
    } catch (error) {
      console.error('Error updating course:', error);
      setError(error instanceof Error ? error.message : 'Failed to update course');
      return null;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, getAuthHeaders, token]);

  // Delete course
  const deleteCourse = useCallback(async (id: string): Promise<boolean> => {
    if (!token) {
      setError('User not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      // Update local state
      setCourses(prev => prev.filter(course => course.id !== id));
      
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete course');
      return false;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, getAuthHeaders, token]);

  // Get courses by instructor
  const getCoursesByInstructor = useCallback((instructorId: string): Course[] => {
    return courses.filter(course => course.instructorId === instructorId);
  }, [courses]);

  // Get published courses
  const getPublishedCourses = useCallback((): Course[] => {
    return courses.filter(course => course.published);
  }, [courses]);

  // Refresh courses manually
  const refreshCourses = useCallback(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Initial fetch on mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Auto-refresh every 30 seconds for realtime updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Use ref to access latest fetchCourses without creating dependency
      if (fetchCoursesRef.current) {
        setLoading(currentLoading => {
          if (!currentLoading) {
            // Only fetch if not currently loading
            fetchCoursesRef.current?.();
          }
          return currentLoading;
        });
      }
    }, 60000); // 60 seconds (1 minute) - reduced frequency to prevent excessive fetching

    return () => clearInterval(interval);
  }, []); // Empty dependency array to prevent re-creation

  const contextValue: CourseContextType = {
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
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
};

// Custom hook to use course context
export const useCourseContext = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourseContext must be used within a CourseProvider');
  }
  return context;
};

// Export types for use in other files
export type { Course, CourseFormData, CourseContextType }; 