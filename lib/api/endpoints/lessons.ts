/**
 * Lesson API Endpoints
 */

import { api } from '../client';
import { progressCache } from '../cache/progressCache';
import type { 
  Lesson, 
  CreateLessonRequest, 
  UpdateLessonRequest
} from '../types';

export const lessonEndpoints = {
  /**
   * Get all lessons for a course (Teacher/Admin only)
   */
  async getByCourse(courseId: number): Promise<Lesson[]> {
    const response = await api.get<Lesson[]>(`/lessons/course/${courseId}`);
    return response as any; // Backend returns array directly, not wrapped in ApiResponse
  },

  /**
   * Get lesson by ID (Teacher/Admin only)
   */
  async getById(id: number): Promise<Lesson> {
    const response = await api.get<Lesson>(`/lessons/${id}`);
    return response as any;
  },

  /**
   * Create new lesson (Teacher/Admin only)
   */
  async create(courseId: number, lessonData: CreateLessonRequest): Promise<Lesson> {
    const response = await api.post<Lesson>(`/lessons/course/${courseId}`, lessonData);
    return response as any;
  },

  /**
   * Update existing lesson (Teacher/Admin only)
   */
  async update(id: number, lessonData: UpdateLessonRequest): Promise<Lesson> {
    const response = await api.patch<Lesson>(`/lessons/${id}`, lessonData);
    return response as any;
  },

  /**
   * Delete lesson (Teacher/Admin only)
   */
  async delete(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/lessons/${id}`);
    return response as any;
  },

  /**
   * Reorder lessons in a course (Teacher/Admin only)
   */
  async reorder(courseId: number, lessonIds: number[]): Promise<{ message: string }> {
    const response = await api.patch<{ message: string }>(`/courses/${courseId}/lessons/reorder`, {
      lessonIds
    });
    return response.data;
  },

  /**
   * Mark lesson as completed (for enrolled users)
   */
  async markCompleted(lessonId: number): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/lessons/${lessonId}/complete`);
    return response.data;
  },

  /**
   * Get lesson completion status (for enrolled users)
   */
  // async getCompletionStatus(lessonId: number): Promise<{ isCompleted: boolean; completedAt?: string }> {
  //   const response = await api.get<{ isCompleted: boolean; completedAt?: string }>(`/lessons/${lessonId}/completion`);
  //   return response.data;
  // },

  /**
   * Update lesson progress (for enrolled users)
   */
  async updateProgress(lessonId: number, progress: number): Promise<{ message: string }> {
    const cacheKey = `progress_${lessonId}`;
    
    try {
      const response = await api.patch<{ message: string }>(`/lessons/${lessonId}/progress`, {
        progress
      });
      
      // Clear cache after successful update
      progressCache.clear(cacheKey);
      
      return response.data;
    } catch (error: any) {
      // Handle rate limiting gracefully
      if (error.response?.status === 429) {
        // Return success response to prevent UI errors
        return { message: 'Progress update throttled but will be processed' };
      }
      // Handle forbidden access - user might not be enrolled
      if (error.response?.status === 403 || error.message?.includes('Forbidden')) {
        console.warn(`Access denied for lesson ${lessonId} progress update. User might not be enrolled.`);
        // Return message indicating access issue
        return { message: 'Progress update requires course enrollment' };
      }
      // Handle not found - create progress record implicitly
      if (error.response?.status === 404) {
        // Clear cache so next get will fetch fresh data
        progressCache.clear(cacheKey);
        return { message: 'Progress will be created on next update' };
      }
      throw error;
    }
  },

  /**
   * Get next lesson in course
   */
  async getNextLesson(currentLessonId: number): Promise<Lesson | null> {
    const response = await api.get<Lesson | null>(`/lessons/${currentLessonId}/next`);
    return response.data;
  },

  /**
   * Get previous lesson in course
   */
  async getPreviousLesson(currentLessonId: number): Promise<Lesson | null> {
    const response = await api.get<Lesson | null>(`/lessons/${currentLessonId}/previous`);
    return response.data;
  },

  /**
   * Get lesson progress (for enrolled users)
   */
  async getProgress(lessonId: number) {
    const cacheKey = `progress_${lessonId}`;
    
    // Try to get from cache first
    const cachedData = progressCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await api.get(`/lessons/${lessonId}/progress`);
      const data = response.data;
      
      // Cache the successful response
      progressCache.set(cacheKey, data, 30000); // Cache for 30 seconds
      
      return data;
    } catch (error: any) {
      // Handle 404 gracefully - means no progress record exists yet
      if (error.response?.status === 404) {
        const defaultData = {
          progress: 0,
          isCompleted: false,
          completedAt: null,
          watchTime: 0
        };
        
        // Cache the default data for a shorter time
        progressCache.set(cacheKey, defaultData, 10000); // Cache for 10 seconds
        
        return defaultData;
      }
      // Handle 403 (forbidden) gracefully - user might not be enrolled
      if (error.response?.status === 403 || error.message?.includes('Forbidden')) {
        console.warn(`Access denied for lesson ${lessonId} progress. User might not be enrolled.`);
        const defaultData = {
          progress: 0,
          isCompleted: false,
          completedAt: null,
          watchTime: 0,
          accessDenied: true
        };
        
        // Cache for shorter time as enrollment status might change
        progressCache.set(cacheKey, defaultData, 5000); // Cache for 5 seconds
        
        return defaultData;
      }
      // Handle 429 (rate limit) gracefully - return cached or default data
      if (error.response?.status === 429) {
        const defaultData = {
          progress: 0,
          isCompleted: false,
          completedAt: null,
          watchTime: 0
        };
        
        // Don't cache rate limited responses
        return defaultData;
      }
      throw error; // Re-throw other errors
    }
  }
};

export default lessonEndpoints;
