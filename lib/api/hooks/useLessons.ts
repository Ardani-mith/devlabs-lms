/**
 * Lesson Management React Hooks
 */

import { useState, useCallback, useEffect } from 'react';
import { lessonEndpoints } from '../endpoints/lessons';
import type { Lesson, CreateLessonRequest, UpdateLessonRequest } from '../types';

// ====================================================================
// Course Lessons Hook
// ====================================================================

interface UseCourseLessonsReturn {
  lessons: Lesson[];
  isLoading: boolean;
  error: string | null;
  refreshLessons: () => Promise<void>;
}

export function useCourseLessons(courseId: number | null): UseCourseLessonsReturn {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLessons = useCallback(async () => {
    if (!courseId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const lessonsData = await lessonEndpoints.getByCourse(courseId);
      setLessons(lessonsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load lessons');
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  const refreshLessons = useCallback(() => loadLessons(), [loadLessons]);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  return { lessons, isLoading, error, refreshLessons };
}

// ====================================================================
// Single Lesson Hook
// ====================================================================

interface UseLessonReturn {
  lesson: Lesson | null;
  isLoading: boolean;
  error: string | null;
  refreshLesson: () => Promise<void>;
}

export function useLesson(id: number | null): UseLessonReturn {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLesson = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const lessonData = await lessonEndpoints.getById(id);
      setLesson(lessonData);
    } catch (err: any) {
      setError(err.message || 'Failed to load lesson');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const refreshLesson = useCallback(() => loadLesson(), [loadLesson]);

  useEffect(() => {
    loadLesson();
  }, [loadLesson]);

  return { lesson, isLoading, error, refreshLesson };
}

// ====================================================================
// Lesson Management Hook (for Teachers/Admins)
// ====================================================================

interface UseLessonManagementReturn {
  createLesson: (courseId: number, data: CreateLessonRequest) => Promise<Lesson>;
  updateLesson: (id: number, data: UpdateLessonRequest) => Promise<Lesson>;
  deleteLesson: (id: number) => Promise<void>;
  reorderLessons: (courseId: number, lessonIds: number[]) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useLessonManagement(): UseLessonManagementReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createLesson = useCallback(async (courseId: number, data: CreateLessonRequest): Promise<Lesson> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const lesson = await lessonEndpoints.create(courseId, data);
      return lesson;
    } catch (err: any) {
      setError(err.message || 'Failed to create lesson');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateLesson = useCallback(async (id: number, data: UpdateLessonRequest): Promise<Lesson> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const lesson = await lessonEndpoints.update(id, data);
      return lesson;
    } catch (err: any) {
      setError(err.message || 'Failed to update lesson');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteLesson = useCallback(async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await lessonEndpoints.delete(id);
    } catch (err: any) {
      setError(err.message || 'Failed to delete lesson');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reorderLessons = useCallback(async (courseId: number, lessonIds: number[]): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await lessonEndpoints.reorder(courseId, lessonIds);
    } catch (err: any) {
      setError(err.message || 'Failed to reorder lessons');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
    isLoading,
    error
  };
}

// ====================================================================
// Lesson Progress Hook
// ====================================================================

interface UseLessonProgressReturn {
  isCompleted: boolean;
  completedAt: string | null;
  markCompleted: () => Promise<void>;
  updateProgress: (progress: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useLessonProgress(lessonId: number | null): UseLessonProgressReturn {
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCompletionStatus = useCallback(async () => {
    if (!lessonId) return;
    
    try {
      const status = await lessonEndpoints.getCompletionStatus(lessonId);
      setIsCompleted(status.isCompleted);
      setCompletedAt(status.completedAt || null);
    } catch (err: any) {
      // Don't set error for this, as it might be normal for unenrolled users
      console.warn('Failed to load lesson completion status:', err);
    }
  }, [lessonId]);

  const markCompleted = useCallback(async () => {
    if (!lessonId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await lessonEndpoints.markCompleted(lessonId);
      setIsCompleted(true);
      setCompletedAt(new Date().toISOString());
    } catch (err: any) {
      setError(err.message || 'Failed to mark lesson as completed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [lessonId]);

  const updateProgress = useCallback(async (progress: number) => {
    if (!lessonId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await lessonEndpoints.updateProgress(lessonId, progress);
    } catch (err: any) {
      setError(err.message || 'Failed to update lesson progress');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    loadCompletionStatus();
  }, [loadCompletionStatus]);

  return {
    isCompleted,
    completedAt,
    markCompleted,
    updateProgress,
    isLoading,
    error
  };
}

// ====================================================================
// Lesson Navigation Hook
// ====================================================================

interface UseLessonNavigationReturn {
  nextLesson: Lesson | null;
  previousLesson: Lesson | null;
  isLoading: boolean;
  error: string | null;
  goToNext: () => void;
  goToPrevious: () => void;
}

export function useLessonNavigation(
  currentLessonId: number | null,
  onNavigate?: (lesson: Lesson) => void
): UseLessonNavigationReturn {
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [previousLesson, setPreviousLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNavigation = useCallback(async () => {
    if (!currentLessonId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const [next, previous] = await Promise.all([
        lessonEndpoints.getNextLesson(currentLessonId),
        lessonEndpoints.getPreviousLesson(currentLessonId)
      ]);
      
      setNextLesson(next);
      setPreviousLesson(previous);
    } catch (err: any) {
      setError(err.message || 'Failed to load lesson navigation');
    } finally {
      setIsLoading(false);
    }
  }, [currentLessonId]);

  const goToNext = useCallback(() => {
    if (nextLesson && onNavigate) {
      onNavigate(nextLesson);
    }
  }, [nextLesson, onNavigate]);

  const goToPrevious = useCallback(() => {
    if (previousLesson && onNavigate) {
      onNavigate(previousLesson);
    }
  }, [previousLesson, onNavigate]);

  useEffect(() => {
    loadNavigation();
  }, [loadNavigation]);

  return {
    nextLesson,
    previousLesson,
    isLoading,
    error,
    goToNext,
    goToPrevious
  };
}
