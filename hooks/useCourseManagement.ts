import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TeacherCourse, 
  CourseFormData, 
  CourseStats, 
  NotificationData,
  CourseManagementConfig,
  CourseManagementState 
} from '@/app/manage-course/types/course-management';

const DEFAULT_CONFIG: CourseManagementConfig = {
  enableStats: true,
  enableCRUD: true,
  enableBulkActions: false,
  defaultCategory: 'Web Development',
  categories: [
    'Web Development', 'Data Science', 'UI/UX Design', 
    'Digital Marketing', 'Bahasa', 'Manajemen', 'Bisnis'
  ],
  showDrafts: true,
};

const INITIAL_FORM_DATA: CourseFormData = {
  title: '',
  description: '',
  thumbnailUrl: '',
  category: 'Web Development',
  level: 'Pemula',
  price: 0,
  tags: [],
  published: false
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
    setState(prev => ({ ...prev, notification: { type, message } }));
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
  const createCourse = useCallback(async (formData: CourseFormData) => {
    try {
      setState(prev => ({ ...prev, submitting: true }));
      const courseData = { ...formData, tags: formData.tags.length > 0 ? formData.tags : [] };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      });

      if (response.ok) {
        await fetchCourses();
        resetForm();
        showNotification('success', 'Kursus berhasil dibuat!');
        return { success: true };
      } else {
        const errorData = await response.json();
        showNotification('error', errorData.message || 'Gagal membuat kursus');
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Error creating course:', error);
      showNotification('error', 'Terjadi kesalahan saat membuat kursus');
      return { success: false, error: 'Network error' };
    } finally {
      setState(prev => ({ ...prev, submitting: false }));
    }
  }, [token, fetchCourses, showNotification]);

  // Update course
  const updateCourse = useCallback(async (courseId: string, formData: CourseFormData) => {
    try {
      setState(prev => ({ ...prev, submitting: true }));
      const courseData = { ...formData, tags: formData.tags.length > 0 ? formData.tags : [] };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      });

      if (response.ok) {
        await fetchCourses();
        closeEditForm();
        showNotification('success', 'Kursus berhasil diperbarui!');
        return { success: true };
      } else {
        const errorData = await response.json();
        showNotification('error', errorData.message || 'Gagal memperbarui kursus');
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Error updating course:', error);
      showNotification('error', 'Terjadi kesalahan saat memperbarui kursus');
      return { success: false, error: 'Network error' };
    } finally {
      setState(prev => ({ ...prev, submitting: false }));
    }
  }, [token, fetchCourses, showNotification]);

  // Delete course
  const deleteCourse = useCallback(async (courseId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        await fetchCourses();
        setState(prev => ({ ...prev, deletingCourse: null }));
        showNotification('success', 'Kursus berhasil dihapus!');
        return { success: true };
      } else {
        const errorData = await response.json();
        showNotification('error', errorData.message || 'Gagal menghapus kursus');
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      showNotification('error', 'Terjadi kesalahan saat menghapus kursus');
      return { success: false, error: 'Network error' };
    }
  }, [token, fetchCourses, showNotification]);

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
      formData: {
        title: course.title,
        description: course.description || '',
        thumbnailUrl: course.thumbnailUrl,
        category: course.category,
        level: course.level,
        price: typeof course.price === 'number' ? course.price : 0,
        tags: course.tags || [],
        published: course.published ?? false
      },
      editingCourse: course,
      showCreateForm: false,
    }));
  }, []);

  const closeEditForm = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      editingCourse: null, 
      showCreateForm: false 
    }));
    resetForm();
  }, [resetForm]);

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
    if (state.tagInput.trim() && !state.formData.tags.includes(state.tagInput.trim())) {
      setState(prev => ({
        ...prev,
        formData: {
          ...prev.formData,
          tags: [...prev.formData.tags, prev.tagInput.trim()]
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
  };
}; 