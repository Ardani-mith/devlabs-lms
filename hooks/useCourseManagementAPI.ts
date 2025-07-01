import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TeacherCourse, 
  CourseFormData, 
  CourseStats, 
  NotificationData, 
  CourseManagementConfig,
  UserPermissions,
  YouTube
} from '../app/manage-course/types/course-management';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Course Management Hook with Real API Integration
export const useCourseManagementAPI = () => {
  const { user } = useAuth();
  const [state, setState] = useState({
    courses: [] as TeacherCourse[],
    loading: false,
    submitting: false,
    showCreateForm: false,
    editingCourse: null as TeacherCourse | null,
    deletingCourse: null as TeacherCourse | null,
    notification: null as NotificationData | null,
    formData: {
      title: '',
      description: '',
      thumbnailUrl: '',
      youtubeEmbedUrl: '',
      youtubeVideoId: '',
      youtubeThumbnailFile: null as File | null,
      youtubeThumbnailUrl: '',
      category: 'Web Development',
      level: 'Pemula' as 'Pemula' | 'Menengah' | 'Lanjutan',
      price: 0,
      published: false,
      tags: [],
      lessonsCount: 1,
      totalDurationHours: 1
    } as CourseFormData,
    tagInput: '',
    uploadingThumbnail: false,
    thumbnailPreview: null as string | null
  });

  const config: CourseManagementConfig = {
    itemsPerPage: 12,
    allowedRoles: ['TEACHER', 'ADMIN'],
    categories: ['Web Development', 'Data Science', 'UI/UX Design', 'Digital Marketing', 'Mobile Development'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    youtubeApiKey: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
    enableStats: true
  };

  // Helper function to get auth headers
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }, []);

  // Show notification helper
  const showNotification = useCallback((type: NotificationData['type'], message: string) => {
    const notification: NotificationData = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: Date.now()
    };
    setState(prev => ({ ...prev, notification }));
  }, []);

  // Hide notification
  const hideNotification = useCallback(() => {
    setState(prev => ({ ...prev, notification: null }));
  }, []);

  // Upload YouTube thumbnail to server
  const uploadYouTubeThumbnail = useCallback(async (file: File): Promise<string> => {
    setState(prev => ({ ...prev, uploadingThumbnail: true }));
    
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setState(prev => ({ ...prev, thumbnailPreview: previewUrl }));
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('thumbnail', file);
      formData.append('type', 'youtube-thumbnail');
      
      // Upload to server
      const response = await fetch(`${API_BASE_URL}/upload/thumbnail`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload thumbnail');
      }

      const result = await response.json();
      const uploadedUrl = result.url;
      
      setState(prev => ({
        ...prev,
        formData: {
          ...prev.formData,
          youtubeThumbnailFile: file,
          youtubeThumbnailUrl: uploadedUrl
        },
        uploadingThumbnail: false
      }));
      
      showNotification('success', 'Thumbnail berhasil diunggah!');
      return uploadedUrl;
    } catch (error) {
      setState(prev => ({ ...prev, uploadingThumbnail: false }));
      showNotification('error', 'Gagal mengunggah thumbnail');
      throw error;
    }
  }, [showNotification]);

  // Process YouTube URL
  const processYouTubeUrl = useCallback((url: string, videoId: string) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        youtubeEmbedUrl: url,
        youtubeVideoId: videoId
      }
    }));
  }, []);

  // Handle YouTube video info
  const handleYouTubeVideoInfo = useCallback((videoInfo: YouTube) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        title: prev.formData.title || videoInfo.title,
        description: prev.formData.description || videoInfo.description,
        thumbnailUrl: prev.formData.thumbnailUrl || videoInfo.thumbnailUrl
      }
    }));
  }, []);

  // Fetch courses from API
  const fetchCourses = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const courses = await response.json();
      
      // Filter courses by current user (teacher's courses)
      const teacherCourses = courses.filter((course: any) => 
        course.instructorId === user?.id
      );

      setState(prev => ({ 
        ...prev, 
        courses: teacherCourses,
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      showNotification('error', 'Gagal memuat data kursus');
      console.error('Error fetching courses:', error);
    }
  }, [getAuthHeaders, user?.id, showNotification]);

  // Create course via API
  const createCourse = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, submitting: true }));
    
    try {
      // Validate required fields
      if (!state.formData.title || !state.formData.description) {
        throw new Error('Judul dan deskripsi kursus wajib diisi');
      }

      if (!state.formData.youtubeEmbedUrl && !state.formData.thumbnailUrl) {
        throw new Error('URL YouTube atau thumbnail wajib diisi');
      }

      // Prepare course data for API
      const courseData = {
        title: state.formData.title,
        description: state.formData.description,
        thumbnailUrl: state.formData.youtubeThumbnailUrl || state.formData.thumbnailUrl,
        youtubeEmbedUrl: state.formData.youtubeEmbedUrl,
        youtubeVideoId: state.formData.youtubeVideoId,
        youtubeThumbnailUrl: state.formData.youtubeThumbnailUrl,
        category: state.formData.category,
        level: state.formData.level,
        price: state.formData.price,
        published: state.formData.published,
        tags: state.formData.tags,
        lessonsCount: state.formData.lessonsCount,
        totalDurationHours: state.formData.totalDurationHours,
        isNew: true,
        studentsEnrolled: 0
      };

      // Send to API
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(courseData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal membuat kursus');
      }

      const newCourse = await response.json();
      
      // Update local state
      setState(prev => ({
        ...prev,
        courses: [newCourse, ...prev.courses],
        submitting: false,
        showCreateForm: false,
        formData: {
          title: '',
          description: '',
          thumbnailUrl: '',
          youtubeEmbedUrl: '',
          youtubeVideoId: '',
          youtubeThumbnailFile: null,
          youtubeThumbnailUrl: '',
          category: config.categories[0],
          level: 'Pemula',
          price: 0,
          published: false,
          tags: [],
          lessonsCount: 1,
          totalDurationHours: 1
        },
        tagInput: '',
        thumbnailPreview: null
      }));

      showNotification('success', 'Kursus berhasil dibuat!');
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, submitting: false }));
      showNotification('error', error instanceof Error ? error.message : 'Gagal membuat kursus');
      return false;
    }
  }, [state.formData, getAuthHeaders, showNotification, config.categories]);

  // Update course via API
  const updateCourse = useCallback(async (): Promise<boolean> => {
    if (!state.editingCourse) return false;
    
    setState(prev => ({ ...prev, submitting: true }));
    
    try {
      const courseData = {
        title: state.formData.title,
        description: state.formData.description,
        thumbnailUrl: state.formData.youtubeThumbnailUrl || state.formData.thumbnailUrl,
        youtubeEmbedUrl: state.formData.youtubeEmbedUrl,
        youtubeVideoId: state.formData.youtubeVideoId,
        youtubeThumbnailUrl: state.formData.youtubeThumbnailUrl,
        category: state.formData.category,
        level: state.formData.level,
        price: state.formData.price,
        published: state.formData.published,
        tags: state.formData.tags,
        lessonsCount: state.formData.lessonsCount,
        totalDurationHours: state.formData.totalDurationHours
      };

      const response = await fetch(`${API_BASE_URL}/courses/${state.editingCourse.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(courseData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui kursus');
      }

      const updatedCourse = await response.json();
      
      setState(prev => ({
        ...prev,
        courses: prev.courses.map(course => 
          course.id === state.editingCourse?.id ? updatedCourse : course
        ),
        submitting: false,
        editingCourse: null,
        formData: {
          title: '',
          description: '',
          thumbnailUrl: '',
          youtubeEmbedUrl: '',
          youtubeVideoId: '',
          youtubeThumbnailFile: null,
          youtubeThumbnailUrl: '',
          category: config.categories[0],
          level: 'Pemula',
          price: 0,
          published: false,
          tags: [],
          lessonsCount: 1,
          totalDurationHours: 1
        },
        tagInput: '',
        thumbnailPreview: null
      }));

      showNotification('success', 'Kursus berhasil diperbarui!');
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, submitting: false }));
      showNotification('error', error instanceof Error ? error.message : 'Gagal memperbarui kursus');
      return false;
    }
  }, [state.editingCourse, state.formData, getAuthHeaders, showNotification, config.categories]);

  // Delete course via API
  const deleteCourse = useCallback(async (): Promise<boolean> => {
    if (!state.deletingCourse) return false;
    
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${state.deletingCourse.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus kursus');
      }

      setState(prev => ({
        ...prev,
        courses: prev.courses.filter(course => course.id !== state.deletingCourse?.id),
        deletingCourse: null
      }));

      showNotification('success', 'Kursus berhasil dihapus!');
      return true;
    } catch (error) {
      showNotification('error', 'Gagal menghapus kursus');
      return false;
    }
  }, [state.deletingCourse, getAuthHeaders, showNotification]);

  // Form management functions
  const openCreateForm = useCallback(() => {
    setState(prev => ({ ...prev, showCreateForm: true }));
  }, []);

  const openEditForm = useCallback((course: TeacherCourse) => {
    setState(prev => ({
      ...prev,
      editingCourse: course,
      formData: {
        title: course.title,
        description: course.description,
        thumbnailUrl: course.thumbnailUrl,
        youtubeEmbedUrl: course.youtubeEmbedUrl || '',
        youtubeVideoId: course.youtubeVideoId || '',
        youtubeThumbnailFile: null,
        youtubeThumbnailUrl: course.youtubeThumbnailUrl || '',
        category: course.category,
        level: course.level,
        price: typeof course.price === 'number' ? course.price : 0,
        published: course.published,
        tags: course.tags,
        lessonsCount: course.lessonsCount,
        totalDurationHours: course.totalDurationHours
      }
    }));
  }, []);

  const closeEditForm = useCallback(() => {
    setState(prev => ({
      ...prev,
      editingCourse: null,
      showCreateForm: false,
      formData: {
        title: '',
        description: '',
        thumbnailUrl: '',
        youtubeEmbedUrl: '',
        youtubeVideoId: '',
        youtubeThumbnailFile: null,
        youtubeThumbnailUrl: '',
        category: config.categories[0],
        level: 'Pemula',
        price: 0,
        published: false,
        tags: [],
        lessonsCount: 1,
        totalDurationHours: 1
      },
      tagInput: '',
      thumbnailPreview: null
    }));
  }, []);

  const updateFormData = useCallback((updates: Partial<CourseFormData>) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...updates }
    }));
  }, []);

  // Tag management
  const setTagInput = useCallback((value: string) => {
    setState(prev => ({ ...prev, tagInput: value }));
  }, []);

  const addTag = useCallback(() => {
    const tag = state.tagInput.trim();
    if (tag && !state.formData.tags.includes(tag)) {
      setState(prev => ({
        ...prev,
        formData: {
          ...prev.formData,
          tags: [...prev.formData.tags, tag]
        },
        tagInput: ''
      }));
    }
  }, [state.tagInput, state.formData.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        tags: prev.formData.tags.filter(tag => tag !== tagToRemove)
      }
    }));
  }, []);

  const setDeletingCourse = useCallback((course: TeacherCourse | null) => {
    setState(prev => ({ ...prev, deletingCourse: course }));
  }, []);

  const removeThumbnailPreview = useCallback(() => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        youtubeThumbnailFile: null,
        youtubeThumbnailUrl: ''
      },
      thumbnailPreview: null
    }));
  }, []);

  // Role-based permissions
  const getUserPermissions = useCallback((userRole?: string): UserPermissions => {
    const isAllowed = userRole && config.allowedRoles.includes(userRole);
    
    return {
      canCreateCourse: isAllowed || false,
      canEditCourse: isAllowed || false,
      canDeleteCourse: isAllowed || false,
      canPublishCourse: isAllowed || false,
      canUploadThumbnail: isAllowed || false,
      canManageYouTubeContent: isAllowed || false,
    };
  }, [config.allowedRoles]);

  // Calculate stats
  const stats: CourseStats = {
    totalCourses: state.courses.length,
    totalStudents: state.courses.reduce((sum, course) => sum + (course.studentsEnrolled || 0), 0),
    averageRating: state.courses.reduce((sum, course) => sum + (course.rating || 0), 0) / state.courses.length || 0,
    publishedCourses: state.courses.filter(course => course.published).length
  };

  // Auto-hide notifications
  useEffect(() => {
    if (state.notification) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.notification, hideNotification]);

  // Initial fetch
  useEffect(() => {
    if (user?.id) {
      fetchCourses();
    }
  }, [user?.id, fetchCourses]);

  return {
    // State
    ...state,
    stats,
    config,
    
    // Actions
    createCourse,
    updateCourse,
    deleteCourse,
    fetchCourses,
    
    // Form management
    openCreateForm,
    openEditForm,
    closeEditForm,
    updateFormData,
    
    // Tag management
    setTagInput,
    addTag,
    removeTag,
    
    // UI management
    setDeletingCourse,
    hideNotification,
    
    // YouTube functionality
    uploadYouTubeThumbnail,
    processYouTubeUrl,
    handleYouTubeVideoInfo,
    removeThumbnailPreview,
    
    // Permissions
    getUserPermissions,
  };
}; 