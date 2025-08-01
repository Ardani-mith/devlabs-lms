/**
 * Lesson API Endpoints
 */

import { api } from '../client';
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
  async getCompletionStatus(lessonId: number): Promise<{ isCompleted: boolean; completedAt?: string }> {
    const response = await api.get<{ isCompleted: boolean; completedAt?: string }>(`/lessons/${lessonId}/completion`);
    return response.data;
  },

  /**
   * Update lesson progress (for enrolled users)
   */
  async updateProgress(lessonId: number, progress: number): Promise<{ message: string }> {
    const response = await api.patch<{ message: string }>(`/lessons/${lessonId}/progress`, {
      progress
    });
    return response.data;
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
  }
};

export default lessonEndpoints;
