/**
 * Enrollment API Endpoints
 */

import { api } from '../client';
import type { 
  Enrollment, 
  EnrollmentRequest
} from '../types';

export const enrollmentEndpoints = {
  /**
   * Enroll in a course
   */
  async enroll(data: EnrollmentRequest): Promise<Enrollment> {
    const response = await api.post<Enrollment>('/enrollments', data);
    return response.data;
  },

  /**
   * Get user's enrollments
   */
  async getUserEnrollments(params?: {
    page?: number;
    limit?: number;
    status?: 'active' | 'completed';
  }): Promise<{
    enrollments: Enrollment[];
    total: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);

    const endpoint = `/enrollments/me${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await api.get<{
      enrollments: Enrollment[];
      total: number;
    }>(endpoint);
    return response.data;
  },

  /**
   * Get enrollment by course ID
   */
  async getByCourse(courseId: number): Promise<Enrollment | null> {
    try {
      const response = await api.get<Enrollment>(`/enrollments/course/${courseId}`);
      return response.data;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Check if user is enrolled in course
   */
  async isEnrolled(courseId: number): Promise<boolean> {
    const enrollment = await this.getByCourse(courseId);
    return enrollment !== null;
  },

  /**
   * Get enrollment progress
   */
  async getProgress(courseId: number): Promise<{
    progress: number;
    completedLessons: number;
    totalLessons: number;
    timeSpent: number;
  }> {
    const response = await api.get<{
      progress: number;
      completedLessons: number;
      totalLessons: number;
      timeSpent: number;
    }>(`/enrollments/course/${courseId}/progress`);
    return response.data;
  },

  /**
   * Unenroll from course
   */
  async unenroll(courseId: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/enrollments/course/${courseId}`);
    return response.data;
  },

  /**
   * Get course students (for instructors)
   */
  async getCourseStudents(courseId: number, params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    students: (Enrollment & { user: any })[];
    total: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const endpoint = `/courses/${courseId}/students${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await api.get<{
      students: (Enrollment & { user: any })[];
      total: number;
    }>(endpoint);
    return response.data;
  },

  /**
   * Get enrollment certificate (if course is completed)
   */
  async getCertificate(courseId: number): Promise<{
    certificateUrl: string;
    issuedAt: string;
  }> {
    const response = await api.get<{
      certificateUrl: string;
      issuedAt: string;
    }>(`/enrollments/course/${courseId}/certificate`);
    return response.data;
  }
};

export default enrollmentEndpoints;
