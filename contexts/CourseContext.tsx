"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { useAuth } from './AuthContext';
import { MockServices } from '@/lib/services/mockService';
import { MockCourse } from '@/lib/data/mockData';

// Frontend Course interface (transformed from MockCourse)
export interface Course {
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
  youtubeEmbedUrl: string;
  youtubeVideoId: string;
  youtubeThumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
}

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
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchCoursesRef = useRef<(() => Promise<void>) | null>(null);

  // Transform MockCourse to frontend Course interface with error handling
  const transformMockCourse = useCallback((mockCourse: MockCourse): Course => {
    try {
      // Ensure required fields have default values
      const transformedCourse: Course = {
        id: (mockCourse.id || Date.now()).toString(),
        title: mockCourse.title || 'Untitled Course',
        description: mockCourse.description || 'No description available',
        thumbnailUrl: mockCourse.thumbnailUrl || DEFAULT_THUMBNAIL,
        instructorName: mockCourse.instructor?.name || 'Unknown Instructor',
        instructorAvatarUrl: mockCourse.instructor?.avatarUrl || DEFAULT_AVATAR,
        instructorId: (mockCourse.instructorId || 0).toString(),
        category: mockCourse.category || 'Uncategorized',
        level: (mockCourse.level as Course['level']) || "Pemula",
        price: mockCourse.price === 0 ? "Gratis" : (mockCourse.price || 0),
        published: Boolean(mockCourse.published),
        rating: mockCourse.rating || 0,
        studentsEnrolled: mockCourse.studentsEnrolled || 0,
        lessonsCount: mockCourse.lessonsCount || 0,
        totalDurationHours: mockCourse.totalDurationHours || 0,
        courseUrl: `/courses/${mockCourse.slug || mockCourse.id}`,
        isNew: Boolean(mockCourse.isNew),
        tags: Array.isArray(mockCourse.tags) ? mockCourse.tags : [],
        slug: mockCourse.slug || mockCourse.id.toString(),
        youtubeEmbedUrl: mockCourse.youtubeEmbedUrl || '',
        youtubeVideoId: mockCourse.youtubeVideoId || '',
        youtubeThumbnailUrl: mockCourse.youtubeThumbnailUrl || '',
        createdAt: mockCourse.createdAt || new Date().toISOString(),
        updatedAt: mockCourse.updatedAt || new Date().toISOString(),
      };

      return transformedCourse;
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
        studentsEnrolled: 0,
        lessonsCount: 0,
        totalDurationHours: 0,
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

  // Fetch all courses using mock service with better error handling
  const fetchCourses = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const mockCourses = await MockServices.course.getCourses();
      if (!Array.isArray(mockCourses)) {
        throw new Error('Invalid course data received');
      }
      
      const transformedCourses = mockCourses
        .map(transformMockCourse)
        .filter(course => course !== null);
      
      setCourses(transformedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch courses');
      // Set empty courses array on error to prevent UI from breaking
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [transformMockCourse]);

  // Update ref with latest fetchCourses
  fetchCoursesRef.current = fetchCourses;

  // Create new course with validation
  const createCourse = useCallback(async (courseData: CourseFormData): Promise<Course | null> => {
    if (!user) {
      setError('User not authenticated');
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
      const mockCourseData = {
        ...courseData,
        instructorId: user.id,
        instructorName: user.name || 'Unknown Instructor',
        instructorAvatarUrl: user.avatarUrl || DEFAULT_AVATAR
      };

      const newMockCourse = await MockServices.course.createCourse(mockCourseData);
      
      if (newMockCourse) {
        const newCourse = transformMockCourse(newMockCourse);
        setCourses(prev => [...prev, newCourse]);
        return newCourse;
      }
      
      throw new Error('Failed to create course');
    } catch (error) {
      console.error('Error creating course:', error);
      setError(error instanceof Error ? error.message : 'Failed to create course');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, transformMockCourse]);

  // Update course with validation
  const updateCourse = useCallback(async (id: string, courseData: Partial<CourseFormData>): Promise<Course | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedMockCourse = await MockServices.course.updateCourse(parseInt(id), courseData);
      
      if (updatedMockCourse) {
        const updatedCourse = transformMockCourse(updatedMockCourse);
        setCourses(prev => prev.map(course => course.id === id ? updatedCourse : course));
        return updatedCourse;
      }
      
      throw new Error('Failed to update course');
    } catch (error) {
      console.error('Error updating course:', error);
      setError(error instanceof Error ? error.message : 'Failed to update course');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, transformMockCourse]);

  // Delete course with confirmation
  const deleteCourse = useCallback(async (id: string): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const success = await MockServices.course.deleteCourse(parseInt(id));
      
      if (success) {
        setCourses(prev => prev.filter(course => course.id !== id));
        return true;
      }
      
      throw new Error('Failed to delete course');
    } catch (error) {
      console.error('Error deleting course:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete course');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

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