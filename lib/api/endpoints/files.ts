/**
 * File Upload API Endpoints
 */

import { apiClient } from '../client';
import type { FileUploadResponse, UploadProgress } from '../types';

export const fileEndpoints = {
  /**
   * Upload avatar image
   */
  async uploadAvatar(file: File, onProgress?: (progress: UploadProgress) => void): Promise<FileUploadResponse> {
    // You can add progress tracking here if needed
    const response = await apiClient.upload<FileUploadResponse>('/upload/avatar', file);
    return response.data;
  },

  /**
   * Upload course thumbnail
   */
  async uploadCourseThumbnail(file: File, courseId?: number): Promise<FileUploadResponse> {
    const additionalData = courseId ? { courseId: courseId.toString() } : undefined;
    const response = await apiClient.upload<FileUploadResponse>('/upload/course-thumbnail', file, additionalData);
    return response.data;
  },

  /**
   * Upload lesson video
   */
  async uploadLessonVideo(file: File, lessonId?: number): Promise<FileUploadResponse> {
    const additionalData = lessonId ? { lessonId: lessonId.toString() } : undefined;
    const response = await apiClient.upload<FileUploadResponse>('/upload/lesson-video', file, additionalData);
    return response.data;
  },

  /**
   * Upload general file
   */
  async uploadFile(file: File, category: string = 'general'): Promise<FileUploadResponse> {
    const response = await apiClient.upload<FileUploadResponse>('/upload/file', file, { category });
    return response.data;
  },

  /**
   * Delete uploaded file
   */
  async deleteFile(fileUrl: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>('/upload/file', {
      body: JSON.stringify({ fileUrl })
    });
    return response.data;
  },

  /**
   * Get upload presigned URL (for direct S3 upload)
   */
  async getPresignedUrl(filename: string, fileType: string, category: string = 'general'): Promise<{
    presignedUrl: string;
    fileUrl: string;
    fields: Record<string, string>;
  }> {
    const response = await apiClient.post<{
      presignedUrl: string;
      fileUrl: string;
      fields: Record<string, string>;
    }>('/upload/presigned-url', {
      filename,
      fileType,
      category
    });
    return response.data;
  }
};

export default fileEndpoints;
