/**
 * Course Management React Hooks
 */

import { useState, useCallback, useEffect } from 'react';
import { courseEndpoints } from '../endpoints/courses';
import type { CreateCourseRequest, UpdateCourseRequest, CourseFilters } from '../types';
import type { Course } from '@/lib/types';

// ====================================================================
// Courses List Hook
// ====================================================================

interface UseCoursesReturn {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
  refreshCourses: () => Promise<void>;
  loadMore: () => Promise<void>;
  setFilters: (filters: CourseFilters) => void;
  setPage: (page: number) => void;
}

export function useCourses(initialFilters?: CourseFilters, pageSize: number = 12): UseCoursesReturn {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [filters, setFilters] = useState<CourseFilters>(initialFilters || {});

  const loadCourses = useCallback(async (page: number = 1, append: boolean = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await courseEndpoints.getAll({
        page,
        limit: pageSize,
        filters
      });
      
      if (append) {
        setCourses(prev => [...prev, ...response.courses]);
      } else {
        setCourses(response.courses);
      }
      
      setTotalPages(response.meta.totalPages);
      setCurrentPage(response.meta.page);
      setHasNext(response.meta.hasNext);
      setHasPrev(response.meta.hasPrev);
    } catch (err: any) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  }, [filters, pageSize]);

  const refreshCourses = useCallback(() => loadCourses(1, false), [loadCourses]);
  const loadMore = useCallback(() => loadCourses(currentPage + 1, true), [loadCourses, currentPage]);
  const setPage = useCallback((page: number) => loadCourses(page, false), [loadCourses]);

  const updateFilters = useCallback((newFilters: CourseFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  // Load courses when filters change
  useEffect(() => {
    loadCourses(1, false);
  }, [loadCourses]);

  return {
    courses,
    isLoading,
    error,
    totalPages,
    currentPage,
    hasNext,
    hasPrev,
    refreshCourses,
    loadMore,
    setFilters: updateFilters,
    setPage
  };
}

// ====================================================================
// Single Course Hook
// ====================================================================

interface UseCourseReturn {
  course: Course | null;
  isLoading: boolean;
  error: string | null;
  refreshCourse: () => Promise<void>;
}

export function useCourse(id: number | null): UseCourseReturn {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCourse = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const courseData = await courseEndpoints.getById(id);
      setCourse(courseData);
    } catch (err: any) {
      setError(err.message || 'Failed to load course');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const refreshCourse = useCallback(() => loadCourse(), [loadCourse]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  return { course, isLoading, error, refreshCourse };
}

// ====================================================================
// Course by Slug Hook
// ====================================================================

export function useCourseBySlug(slug: string | null): UseCourseReturn {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCourse = useCallback(async () => {
    if (!slug) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const courseData = await courseEndpoints.getBySlug(slug);
      setCourse(courseData);
    } catch (err: any) {
      setError(err.message || 'Failed to load course');
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  const refreshCourse = useCallback(() => loadCourse(), [loadCourse]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  return { course, isLoading, error, refreshCourse };
}

// ====================================================================
// Course Management Hook (for Teachers/Admins)
// ====================================================================

interface UseCourseManagementReturn {
  createCourse: (data: CreateCourseRequest) => Promise<Course>;
  updateCourse: (id: number, data: UpdateCourseRequest) => Promise<Course>;
  deleteCourse: (id: number) => Promise<void>;
  togglePublish: (id: number, published: boolean) => Promise<Course>;
  isLoading: boolean;
  error: string | null;
}

export function useCourseManagement(): UseCourseManagementReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCourse = useCallback(async (data: CreateCourseRequest): Promise<Course> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const course = await courseEndpoints.create(data);
      return course;
    } catch (err: any) {
      setError(err.message || 'Failed to create course');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCourse = useCallback(async (id: number, data: UpdateCourseRequest): Promise<Course> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const course = await courseEndpoints.update(id, data);
      return course;
    } catch (err: any) {
      setError(err.message || 'Failed to update course');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCourse = useCallback(async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await courseEndpoints.delete(id);
    } catch (err: any) {
      setError(err.message || 'Failed to delete course');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const togglePublish = useCallback(async (id: number, published: boolean): Promise<Course> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const course = await courseEndpoints.togglePublish(id, published);
      return course;
    } catch (err: any) {
      setError(err.message || 'Failed to toggle course publication');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createCourse,
    updateCourse,
    deleteCourse,
    togglePublish,
    isLoading,
    error
  };
}

// ====================================================================
// Course Search Hook
// ====================================================================

interface UseCourseSearchReturn {
  searchResults: Course[];
  isLoading: boolean;
  error: string | null;
  search: (query: string, filters?: CourseFilters) => Promise<void>;
  clearSearch: () => void;
}

export function useCourseSearch(): UseCourseSearchReturn {
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, filters?: CourseFilters) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await courseEndpoints.search(query, { filters });
      setSearchResults(response.courses);
    } catch (err: any) {
      setError(err.message || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return { searchResults, isLoading, error, search, clearSearch };
}
