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
  getLessonProgress: () => Promise<any>;
  isLoading: boolean;
  error: string | null;
}

export function useLessonProgress(lessonId: number | null): UseLessonProgressReturn {
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce mechanism to prevent multiple calls
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const DEBOUNCE_DELAY = 1000; // 1 second

  // Load progress from backend (using /progress endpoint)
  const loadProgress = useCallback(async () => {
    if (!lessonId) return;
    
    // Debounce to prevent multiple rapid calls
    const now = Date.now();
    if (now - lastFetchTime < DEBOUNCE_DELAY) {
      return;
    }
    setLastFetchTime(now);

    setIsLoading(true);
    setError(null);
    try {
      const progress = await lessonEndpoints.getProgress(lessonId);
      // Assume backend returns { progress: number, isCompleted: boolean, completedAt?: string }
      setIsCompleted(!!progress.isCompleted);
      setCompletedAt(progress.completedAt || null);
    } catch (err: any) {
      // If 404, treat as no progress yet (not an error)
      if (err.status === 404 || err.status === 429 || err.message?.includes('not found')) {
        setIsCompleted(false);
        setCompletedAt(null);
        // Don't set error for 404/429/not found - it's normal for new lessons
        console.log(`No progress found for lesson ${lessonId} - this is normal for new lessons`);
      } else if (err.status === 403 || err.message?.includes('Forbidden')) {
        // Handle 403 - user might not be enrolled or lack permissions
        setIsCompleted(false);
        setCompletedAt(null);
        console.warn(`Access denied for lesson ${lessonId} progress. User might not be enrolled.`);
        // Don't set this as a hard error - lesson can still be viewed
      } else {
        setError(err.message || 'Failed to load lesson progress');
        console.warn('Lesson progress load error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [lessonId, lastFetchTime]);

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
      // Handle 403 forbidden gracefully - user might not be enrolled
      if (err.status === 403 || err.message?.includes('Forbidden')) {
        console.warn(`Access denied for lesson ${lessonId} progress update. User might not be enrolled.`);
        // Don't throw error - let the lesson continue to play
        return;
      }
      setError(err.message || 'Failed to update lesson progress');
      // Don't throw error for progress updates - they're not critical
      console.warn('Progress update failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, [lessonId]);

  const getLessonProgress = useCallback(async () => {
    if (!lessonId) return null;
    
    // Debounce mechanism
    const now = Date.now();
    if (now - lastFetchTime < DEBOUNCE_DELAY) {
      return null;
    }
    
    try {
      const progress = await lessonEndpoints.getProgress(lessonId);
      return progress;
    } catch (err: any) {
      // Handle 404/429/not found gracefully - don't throw error
      if (err.status === 404 || err.status === 429 || err.message?.includes('not found')) {
        console.log(`No progress found for lesson ${lessonId} - returning null`);
        return null; // No progress data yet, this is normal
      }
      // Handle 403 forbidden - user might not be enrolled
      if (err.status === 403 || err.message?.includes('Forbidden')) {
        console.warn(`Access denied for lesson ${lessonId} progress. User might not be enrolled.`);
        return null; // Return null so lesson can still be viewed
      }
      console.warn('Get lesson progress error:', err);
      setError(err.message || 'Failed to get lesson progress');
      return null;
    }
  }, [lessonId, lastFetchTime]);

  // Use effect with cleanup to prevent double calls
  useEffect(() => {
    let isMounted = true;
    
    const fetchProgress = async () => {
      if (isMounted && lessonId) {
        await loadProgress();
      }
    };
    
    fetchProgress();

    return () => {
      isMounted = false;
    };
  }, [lessonId, loadProgress]); // Include loadProgress dependency

  return {
    isCompleted,
    completedAt,
    markCompleted,
    updateProgress,
    getLessonProgress,
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
