/**
 * Course API Endpoints
 */

import { api } from '../client';
import { Course } from '@/lib/types';
import type { 
  CreateCourseRequest, 
  UpdateCourseRequest, 
  CourseFilters,
  PaginationMeta
} from '../types';

interface CoursesListResponse {
  courses: Course[];
  meta: PaginationMeta;
}

export const courseEndpoints = {
  /**
   * Get all courses with optional filters and pagination
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    filters?: CourseFilters;
  }): Promise<CoursesListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    // Add filters to search params
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v.toString()));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }

    const endpoint = `/courses${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await api.get<CoursesListResponse>(endpoint);
    return response.data;
  },

  /**
   * Get course by ID
   */
  async getById(id: number): Promise<Course> {
    const response = await api.get<Course>(`/courses/${id}`);
    return response.data;
  },

  /**
   * Get course by slug
   */
  async getBySlug(slug: string): Promise<Course> {
    const response = await api.get<Course>(`/courses/slug/${slug}`);
    return response.data;
  },

  /**
   * Create new course (Teacher/Admin only)
   */
  async create(courseData: CreateCourseRequest): Promise<Course> {
    const response = await api.post<Course>('/courses', courseData);
    return response.data;
  },

  /**
   * Update existing course (Teacher/Admin only)
   */
  async update(id: number, courseData: UpdateCourseRequest): Promise<Course> {
    const response = await api.patch<Course>(`/courses/${id}`, courseData);
    return response.data;
  },

  /**
   * Delete course (Teacher/Admin only)
   */
  async delete(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/courses/${id}`);
    return response.data;
  },

  /**
   * Get courses by instructor
   */
  async getByInstructor(instructorId: number, params?: {
    page?: number;
    limit?: number;
  }): Promise<CoursesListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const endpoint = `/courses/instructor/${instructorId}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await api.get<CoursesListResponse>(endpoint);
    return response.data;
  },

  /**
   * Get featured courses
   */
  async getFeatured(limit?: number): Promise<Course[]> {
    const searchParams = new URLSearchParams();
    if (limit) searchParams.append('limit', limit.toString());

    const endpoint = `/courses/featured${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await api.get<Course[]>(endpoint);
    return response.data;
  },

  /**
   * Get popular courses
   */
  async getPopular(limit?: number): Promise<Course[]> {
    const searchParams = new URLSearchParams();
    if (limit) searchParams.append('limit', limit.toString());

    const endpoint = `/courses/popular${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await api.get<Course[]>(endpoint);
    return response.data;
  },

  /**
   * Get course categories
   */
  async getCategories(): Promise<string[]> {
    const response = await api.get<string[]>('/courses/categories');
    return response.data;
  },

  /**
   * Search courses
   */
  async search(query: string, params?: {
    page?: number;
    limit?: number;
    filters?: CourseFilters;
  }): Promise<CoursesListResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v.toString()));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }

    const response = await api.get<CoursesListResponse>(`/courses/search?${searchParams.toString()}`);
    return response.data;
  },

  /**
   * Publish/unpublish course (Teacher/Admin only)
   */
  async togglePublish(id: number, published: boolean): Promise<Course> {
    const response = await api.patch<Course>(`/courses/${id}/publish`, { published });
    return response.data;
  }
};

export default courseEndpoints;
