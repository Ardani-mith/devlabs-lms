import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TeacherCourse, 
  CourseFormData, 
  CourseStats, 
  NotificationData,
  CourseManagementConfig,
  CourseManagementState,
  UserPermissions,
  YouTube
} from '@/app/manage-course/types/course-management';

const DEFAULT_CONFIG: CourseManagementConfig = {
  itemsPerPage: 12,
  allowedRoles: ['TEACHER', 'ADMIN'],
  categories: [
    'Web Development', 'Data Science', 'UI/UX Design', 
    'Digital Marketing', 'Bahasa', 'Manajemen', 'Bisnis'
  ],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  youtubeApiKey: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
  enableStats: true
};

const INITIAL_FORM_DATA: CourseFormData = {
  title: '',
  description: '',
  thumbnailUrl: '',
  youtubeEmbedUrl: '',
  youtubeVideoId: '',
  youtubeThumbnailFile: null,
  youtubeThumbnailUrl: '',
  category: 'Web Development',
  level: 'Pemula',
  price: 0,
  tags: [],
  published: false,
  lessonsCount: 1,
  totalDurationHours: 1
};

export const useCourseManagement = (config: Partial<CourseManagementConfig> = {}) => {
  const { user, token } = useAuth();
  const mergedConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);
  
  const [state, setState] = useState<CourseManagementState>({
    courses: [],
    loading: true,
    submitting: false,
    showCreateForm: false,
    editingCourse: null,
    deletingCourse: null,
    notification: null,
    formData: INITIAL_FORM_DATA,
    tagInput: '',
    stats: {
      totalCourses: 0,
      totalStudents: 0,
      averageRating: 0,
      publishedCourses: 0
    },
    config: mergedConfig,
    uploadingThumbnail: false,
    thumbnailPreview: null
  });

  // Computed statistics
  const stats = useMemo<CourseStats>(() => ({
    totalCourses: state.courses.length,
    totalStudents: state.courses.reduce((sum, course) => sum + course.studentsEnrolled, 0),
    averageRating: state.courses.length > 0 
      ? state.courses.reduce((sum, course) => sum + (course.rating || 0), 0) / state.courses.length
      : 0,
    publishedCourses: state.courses.filter(course => course.published).length,
  }), [state.courses]);

  // Auto-hide notifications
  useEffect(() => {
    if (state.notification) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, notification: null }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.notification]);

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

  // Fetch teacher's courses
  const fetchCourses = useCallback(async () => {
    if (!user || !token) return;

    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const allCourses = await response.json();
        const teacherCourses = allCourses.filter((course: TeacherCourse) => 
          course.instructorName === user?.name || course.instructorName === user?.username
        );
        setState(prev => ({ ...prev, courses: teacherCourses }));
      } else {
        showNotification('error', 'Gagal memuat data kursus');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      showNotification('error', 'Terjadi kesalahan saat memuat data');
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user, token, showNotification]);

  // Create course
  const createCourse = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, submitting: true }));
    
    try {
      // Validate required fields
      if (!state.formData.title || !state.formData.description) {
        throw new Error('Title and description are required');
      }

      if (!state.formData.youtubeEmbedUrl && !state.formData.thumbnailUrl) {
        throw new Error('YouTube URL or thumbnail URL is required');
      }

      // Create new course object
      const newCourse: TeacherCourse = {
        id: Date.now().toString(),
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
        isNew: true,
        tags: state.formData.tags,
        studentsEnrolled: 0,
        lessonsCount: state.formData.lessonsCount,
        totalDurationHours: state.formData.totalDurationHours,
        rating: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        instructorName: 'Current User', // Should come from auth context
        instructorId: 'current-user-id'
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setState(prev => ({
        ...prev,
        courses: [newCourse, ...prev.courses],
        stats: {
          ...prev.stats,
          totalCourses: prev.stats.totalCourses + 1,
          publishedCourses: newCourse.published ? prev.stats.publishedCourses + 1 : prev.stats.publishedCourses
        },
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
          category: mergedConfig.categories[0],
          level: 'Pemula',
          price: 0,
          published: false,
          tags: [],
          lessonsCount: 1,
          totalDurationHours: 1
        },
        tagInput: '',
        thumbnailPreview: null,
        notification: {
          id: Date.now().toString(),
          type: 'success',
          message: 'Kursus berhasil dibuat!',
          timestamp: Date.now()
        }
      }));

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        submitting: false,
        notification: {
          id: Date.now().toString(),
          type: 'error',
          message: error instanceof Error ? error.message : 'Gagal membuat kursus',
          timestamp: Date.now()
        }
      }));
      return false;
    }
  }, [state.formData, mergedConfig]);

  // Update course
  const updateCourse = useCallback(async (): Promise<boolean> => {
    if (!state.editingCourse) return false;
    
    setState(prev => ({ ...prev, submitting: true }));
    
    try {
      const updatedCourse: TeacherCourse = {
        ...state.editingCourse,
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
        updatedAt: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

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
          category: mergedConfig.categories[0],
          level: 'Pemula',
          price: 0,
          published: false,
          tags: [],
          lessonsCount: 1,
          totalDurationHours: 1
        },
        tagInput: '',
        thumbnailPreview: null,
        notification: {
          id: Date.now().toString(),
          type: 'success',
          message: 'Kursus berhasil diperbarui!',
          timestamp: Date.now()
        }
      }));

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        submitting: false,
        notification: {
          id: Date.now().toString(),
          type: 'error',
          message: 'Gagal memperbarui kursus',
          timestamp: Date.now()
        }
      }));
      return false;
    }
  }, [state.editingCourse, state.formData, mergedConfig]);

  // Delete course
  const deleteCourse = useCallback(async (): Promise<boolean> => {
    if (!state.deletingCourse) return false;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setState(prev => ({
        ...prev,
        courses: prev.courses.filter(course => course.id !== state.deletingCourse?.id),
        stats: {
          ...prev.stats,
          totalCourses: prev.stats.totalCourses - 1,
          publishedCourses: state.deletingCourse?.published ? prev.stats.publishedCourses - 1 : prev.stats.publishedCourses
        },
        deletingCourse: null,
        notification: {
          id: Date.now().toString(),
          type: 'success',
          message: 'Kursus berhasil dihapus!',
          timestamp: Date.now()
        }
      }));

      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        notification: {
          id: Date.now().toString(),
          type: 'error',
          message: 'Gagal menghapus kursus',
          timestamp: Date.now()
        }
      }));
      return false;
    }
  }, [state.deletingCourse]);

  // Form management
  const resetForm = useCallback(() => {
    setState(prev => ({
      ...prev,
      formData: INITIAL_FORM_DATA,
      tagInput: '',
      editingCourse: null,
      showCreateForm: false,
    }));
  }, []);

  const openCreateForm = useCallback(() => {
    resetForm();
    setState(prev => ({ ...prev, showCreateForm: true }));
  }, [resetForm]);

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
        category: mergedConfig.categories[0],
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
  }, [mergedConfig]);

  const setDeletingCourse = useCallback((course: TeacherCourse | null) => {
    setState(prev => ({ ...prev, deletingCourse: course }));
  }, []);

  // Form data updates
  const updateFormData = useCallback((updates: Partial<CourseFormData>) => {
    setState(prev => ({ 
      ...prev, 
      formData: { ...prev.formData, ...updates } 
    }));
  }, []);

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

  const hideNotification = useCallback(() => {
    setState(prev => ({ ...prev, notification: null }));
  }, []);

  // YouTube functionality
  const uploadYouTubeThumbnail = useCallback(async (file: File): Promise<string> => {
    setState(prev => ({ ...prev, uploadingThumbnail: true }));
    
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setState(prev => ({ ...prev, thumbnailPreview: previewUrl }));
      
      // Simulate upload to server
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, upload file to server/cloud storage
      const formData = new FormData();
      formData.append('thumbnail', file);
      
      // Mock successful upload response
      const uploadedUrl = `https://example.com/thumbnails/${Date.now()}_${file.name}`;
      
      setState(prev => ({
        ...prev,
        formData: {
          ...prev.formData,
          youtubeThumbnailFile: file,
          youtubeThumbnailUrl: uploadedUrl
        },
        uploadingThumbnail: false
      }));
      
      return uploadedUrl;
    } catch (error) {
      setState(prev => ({
        ...prev,
        uploadingThumbnail: false,
        notification: {
          id: Date.now().toString(),
          type: 'error',
          message: 'Gagal mengunggah thumbnail',
          timestamp: Date.now()
        }
      }));
      throw error;
    }
  }, []);

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

  const handleYouTubeVideoInfo = useCallback((videoInfo: YouTube) => {
    // Auto-populate form fields if they're empty
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        title: prev.formData.title || videoInfo.title,
        description: prev.formData.description || videoInfo.description,
        thumbnailUrl: prev.formData.thumbnailUrl || videoInfo.thumbnailUrl,
        totalDurationHours: prev.formData.totalDurationHours || 1 // Could parse from videoInfo.duration
      }
    }));
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
    const isAllowed = userRole && mergedConfig.allowedRoles.includes(userRole);
    
    return {
      canCreateCourse: isAllowed || false,
      canEditCourse: isAllowed || false,
      canDeleteCourse: isAllowed || false,
      canPublishCourse: isAllowed || false,
      canUploadThumbnail: isAllowed || false,
      canManageYouTubeContent: isAllowed || false,
    };
  }, [mergedConfig.allowedRoles]);

  // Initial fetch
  useEffect(() => {
    if (user && token) {
      fetchCourses();
    }
  }, [user, token, fetchCourses]);

  return {
    // State
    ...state,
    stats,
    config: mergedConfig,
    
    // Actions
    createCourse,
    updateCourse,
    deleteCourse,
    fetchCourses,
    
    // Form management
    openCreateForm,
    openEditForm,
    closeEditForm,
    resetForm,
    updateFormData,
    
    // Tag management
    setTagInput,
    addTag,
    removeTag,
    
    // UI management
    setDeletingCourse,
    hideNotification,
    showNotification,
    
    // YouTube functionality
    uploadYouTubeThumbnail,
    processYouTubeUrl,
    handleYouTubeVideoInfo,
    removeThumbnailPreview,
    
    // Permissions
    getUserPermissions,
  };
}; 