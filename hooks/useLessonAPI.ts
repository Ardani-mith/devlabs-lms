import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Lesson {
  id: number;
  title: string;
  content?: string;
  youtubeUrl: string;
  youtubeVideoId?: string;
  duration?: number; // in seconds
  order: number;
  moduleId: number;
}

interface CreateLessonData {
  title: string;
  content?: string;
  youtubeUrl: string;
  youtubeVideoId?: string;
  duration?: number; // in minutes (optional)
  order?: number;
}

interface UpdateLessonData extends Partial<CreateLessonData> {
  id?: number;
}

export const useLessonAPI = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300';

  const getAuthHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }, [token]);

  // Extract YouTube video ID from URL
  const extractYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Get lessons for a specific course
  const getLessonsByCourse = useCallback(async (courseId: number): Promise<Lesson[]> => {
    if (!token) {
      setError('Authentication required');
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/lessons/course/${courseId}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lessons');
      }

      const lessons = await response.json();
      return lessons;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch lessons';
      setError(errorMessage);
      console.error('Error fetching lessons:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, getAuthHeaders, token]);

  // Create a new lesson
  const createLesson = useCallback(async (courseId: number, lessonData: CreateLessonData): Promise<Lesson | null> => {
    if (!token) {
      setError('Authentication required');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Auto-extract YouTube video ID if not provided
      const youtubeVideoId = lessonData.youtubeVideoId || extractYouTubeVideoId(lessonData.youtubeUrl);

      const payload = {
        ...lessonData,
        youtubeVideoId,
        duration: lessonData.duration, // Keep duration in minutes (backend will convert)
      };

      const response = await fetch(`${API_BASE_URL}/lessons/course/${courseId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create lesson');
      }

      const newLesson = await response.json();
      return newLesson;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create lesson';
      setError(errorMessage);
      console.error('Error creating lesson:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, getAuthHeaders, token]);

  // Update a lesson
  const updateLesson = useCallback(async (lessonId: number, lessonData: UpdateLessonData): Promise<Lesson | null> => {
    if (!token) {
      setError('Authentication required');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Auto-extract YouTube video ID if URL is provided
      const youtubeVideoId = lessonData.youtubeVideoId || 
        (lessonData.youtubeUrl ? extractYouTubeVideoId(lessonData.youtubeUrl) : undefined);

      const payload = {
        ...lessonData,
        youtubeVideoId,
        duration: lessonData.duration, // Keep duration in minutes
      };

      const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update lesson');
      }

      const updatedLesson = await response.json();
      return updatedLesson;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update lesson';
      setError(errorMessage);
      console.error('Error updating lesson:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, getAuthHeaders, token]);

  // Delete a lesson
  const deleteLesson = useCallback(async (lessonId: number): Promise<boolean> => {
    if (!token) {
      setError('Authentication required');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete lesson');
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete lesson';
      setError(errorMessage);
      console.error('Error deleting lesson:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, getAuthHeaders, token]);

  // Reorder lessons
  const reorderLesson = useCallback(async (lessonId: number, newOrder: number): Promise<boolean> => {
    if (!token) {
      setError('Authentication required');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}/reorder`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ newOrder })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reorder lesson');
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder lesson';
      setError(errorMessage);
      console.error('Error reordering lesson:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, getAuthHeaders, token]);

  return {
    loading,
    error,
    getLessonsByCourse,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLesson,
    extractYouTubeVideoId,
  };
};
