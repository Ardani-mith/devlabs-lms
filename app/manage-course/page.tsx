"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  PlusIcon, PencilIcon, TrashIcon, EyeIcon, UsersIcon, BookOpenIcon,
  ClockIcon, StarIcon, ChartBarIcon, XMarkIcon, CheckIcon, ExclamationTriangleIcon,
  AcademicCapIcon, PlayIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseContext, CourseFormData } from '@/contexts/CourseContext';
import { Course } from '@/lib/types';
import { getProperThumbnailUrl, getYouTubeEmbedUrl, validateYouTubeUrl } from '@/lib/utils/youtube';
import LessonManager from './components/LessonManager';
import SafeImage from '@/components/ui/SafeImage';

// Types
interface CourseStats {
  totalCourses: number;
  totalStudents: number;
  averageRating: number;
  publishedCourses: number;
}

interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
}

// Form validation
const validateForm = (data: CourseFormData): string[] => {
  const errors: string[] = [];
  
  if (data.price < 0) {
    errors.push('Price cannot be negative');
  }

  if (!data.category) {
    errors.push('Category is required');
  }

  if (!data.level) {
    errors.push('Level is required');
  }
  
  return errors;
};

// Main Component
export default function ManageCoursePage() {
  const { user, loginWithCredentials } = useAuth();
  const { loading, createCourse, updateCourse, deleteCourse, getCoursesByInstructor, error: contextError } = useCourseContext();

  // Demo login functionality for testing
  const handleDemoLogin = async (username: string, password: string) => {
    const result = await loginWithCredentials(username, password);
    if (result.success) {
      showNotification('success', `Logged in as ${username}`);
    } else {
      showNotification('error', result.error || 'Login failed');
    }
  };

  // Local state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<Course | null>(null);
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    thumbnailUrl: '',
    youtubeEmbedUrl: '',
    youtubeVideoId: '',
    youtubeThumbnailUrl: '',
    category: 'Web Development',
    level: 'Pemula',
    price: 0,
    published: false,
    tags: [],
    lessonsCount: 1,
    totalDurationHours: 1
  });
  const [tagInput, setTagInput] = useState('');

  // Show notification
  const showNotification = (type: NotificationData['type'], message: string) => {
    const newNotification: NotificationData = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: Date.now()
    };
    setNotification(newNotification);
    setTimeout(() => setNotification(null), 5000);
  };

  // Get teacher's courses
  const courses = useMemo(() => {
    if (!user?.id) return [];
    const teacherCourses = getCoursesByInstructor(user.id.toString());
    console.log('Teacher courses:', teacherCourses);
    return teacherCourses;
  }, [getCoursesByInstructor, user?.id]);

  // Calculate stats
  const stats: CourseStats = useMemo(() => ({
    totalCourses: courses.length,
    totalStudents: courses.reduce((sum, course) => sum + (course.studentsEnrolled || 0), 0),
    averageRating: courses.length > 0 
      ? courses.reduce((sum, course) => sum + (course.rating || 0), 0) / courses.length
      : 0,
    publishedCourses: courses.filter(course => course.published).length
  }), [courses]);

  // Access control
  if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Only teachers and admins can access this page.</p>
      </div>
    );
  }

  // Form handlers
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm(formData);
    if (errors.length > 0) {
      setFormErrors(errors);
      showNotification('error', 'Please fix the form errors before submitting');
      return;
    }
    
    setSubmitting(true);
    setFormErrors([]);
    
    try {
      const result = await createCourse(formData);
      if (result) {
        showNotification('success', 'Course created successfully! It will appear on the courses page.');
        setShowCreateForm(false);
        resetForm();
      } else {
        setFormErrors(['Failed to create course. Please try again.']);
        showNotification('error', 'Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while creating the course';
      setFormErrors([errorMessage]);
      showNotification('error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    
    // Validate form
    const errors = validateForm(formData);
    if (errors.length > 0) {
      setFormErrors(errors);
      showNotification('error', 'Please fix the form errors before submitting');
      return;
    }
    
    setSubmitting(true);
    setFormErrors([]);
    
    try {
      const result = await updateCourse(editingCourse.id.toString(), formData);
      if (result) {
        showNotification('success', 'Course updated successfully! Changes will be visible on the courses page.');
        setEditingCourse(null);
        resetForm();
      } else {
        setFormErrors(['Failed to update course. Please try again.']);
        showNotification('error', 'Failed to update course');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while updating the course';
      setFormErrors([errorMessage]);
      showNotification('error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCourse) return;
    
    setSubmitting(true);
    setFormErrors([]);
    
    try {
      const success = await deleteCourse(deletingCourse.id.toString());
      if (success) {
        showNotification('success', 'Course deleted successfully from database!');
        setDeletingCourse(null);
      } else {
        setFormErrors(['Failed to delete course. Please try again.']);
        showNotification('error', 'Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while deleting the course';
      setFormErrors([errorMessage]);
      showNotification('error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Form helpers
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      thumbnailUrl: '',
      youtubeEmbedUrl: '',
      youtubeVideoId: '',
      youtubeThumbnailUrl: '',
      category: 'Web Development',
      level: 'Pemula',
      price: 0,
      published: false,
      tags: [],
      lessonsCount: 1,
      totalDurationHours: 1
    });
    setTagInput('');
    setFormErrors([]);
  };

  const openCreateForm = () => {
    resetForm();
    setShowCreateForm(true);
  };

  const openEditForm = (course: Course) => {
    setFormData({
      title: course.title,
      description: course.description || '',
      thumbnailUrl: course.thumbnailUrl || '',
      youtubeEmbedUrl: course.youtubeEmbedUrl || '',
      youtubeVideoId: course.youtubeVideoId || '',
      youtubeThumbnailUrl: course.youtubeThumbnailUrl || '',
      category: course.category,
      level: (course.level as "Pemula" | "Menengah" | "Lanjutan") || "Pemula",
      price: typeof course.price === 'number' ? course.price : 0,
      published: course.published || false,
      tags: course.tags || [],
      lessonsCount: course.lessonsCount,
      totalDurationHours: course.totalDurationHours
    });
    setEditingCourse(course);
  };

  const closeForm = () => {
    setShowCreateForm(false);
    setEditingCourse(null);
    resetForm();
  };

  // Tag helpers
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // YouTube video handling
  const handleYouTubeUrlChange = (url: string) => {
    const validation = validateYouTubeUrl(url);
    
    if (validation.isValid && validation.videoId) {
      setFormData(prev => ({
        ...prev,
        youtubeEmbedUrl: getYouTubeEmbedUrl(validation.videoId!),
        youtubeVideoId: validation.videoId!,
        youtubeThumbnailUrl: getProperThumbnailUrl(validation.videoId!)
      }));
      setFormErrors(prev => prev.filter(error => !error.includes('YouTube')));
    } else {
      setFormData(prev => ({
        ...prev,
        youtubeEmbedUrl: '',
        youtubeVideoId: '',
        youtubeThumbnailUrl: ''
      }));
      if (url.trim()) {
        setFormErrors(prev => [...prev.filter(error => !error.includes('YouTube')), validation.error || 'Invalid YouTube URL']);
      }
    }
  };

  // Lesson management
  const handleLessonsChange = (lessons: Lesson[]) => {
    if (!selectedCourseForLessons) return;

    setFormData(prev => ({
      ...prev,
      lessonsCount: lessons.length,
      totalDurationHours: lessons.reduce((total, lesson) => total + lesson.duration / 60, 0)
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-10 p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-2/3 mb-8"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-neutral-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 dark:bg-neutral-700 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (contextError || formErrors.length > 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 dark:text-red-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <ul className="list-disc pl-5 space-y-1">
                  {contextError && <li>{contextError}</li>}
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If a course is selected for lesson management, show the lesson manager
  if (selectedCourseForLessons) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedCourseForLessons(null)}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-neutral-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
          >
            ← Back to Courses
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Lessons: {selectedCourseForLessons.title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              Add and manage YouTube video lessons for this course
            </p>
          </div>
        </div>

        {/* Lesson Manager */}
        <LessonManager 
          key={selectedCourseForLessons.id}
          course={selectedCourseForLessons}
          onClose={() => setSelectedCourseForLessons(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-10 p-4 sm:p-6 lg:p-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {notification.type === 'success' && <CheckIcon className="h-5 w-5 mr-2" />}
              {notification.type === 'error' && <ExclamationTriangleIcon className="h-5 w-5 mr-2" />}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="ml-4 text-white hover:text-gray-200">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-neutral-100 sm:text-5xl">
              Manage Your Courses
            </h1>
            <p className="mt-3 text-base text-gray-600 dark:text-neutral-400 max-w-3xl">
              Create and manage courses with YouTube lessons. Changes will automatically sync with the courses page.
            </p>
          </div>
          <button
            onClick={openCreateForm}
            className="flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-brand-purple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New Course
          </button>
        </div>
      </header>

      {/* Demo Login Section */}
      {!user && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">
            🔐 Demo Login (For Testing)
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
            Please log in with a demo account to test course creation:
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleDemoLogin('dani', '123')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Login as ADMIN (dani)
            </button>
            <button
              onClick={() => handleDemoLogin('teacher', 'password123')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Login as TEACHER
            </button>
          </div>
        </div>
      )}

      {/* Current User Info */}
      {user && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-8">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            ✅ Logged in as: {user.name || user.username}
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            Role: <span className="font-medium">{user.role}</span> • ID: {user.id}
          </p>
        </div>
      )}

      {/* Statistics */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-neutral-400 mb-1">Total Courses</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100">{stats.totalCourses}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-700/30 p-3 rounded-lg">
              <BookOpenIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-neutral-400 mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100">{stats.totalStudents}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-700/30 p-3 rounded-lg">
              <UsersIcon className="h-8 w-8 text-green-500 dark:text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-neutral-400 mb-1">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
                {stats.averageRating.toFixed(1)}
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-700/30 p-3 rounded-lg">
              <StarIcon className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-neutral-400 mb-1">Published Courses</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-neutral-100">{stats.publishedCourses}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-700/30 p-3 rounded-lg">
              <ChartBarIcon className="h-8 w-8 text-brand-purple dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div> */}

      {/* Course Grid */}
      {courses.length === 0 ? (
        <div className="text-center py-16">
          <BookOpenIcon className="mx-auto h-20 w-20 text-gray-300 dark:text-neutral-700" />
          <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-neutral-200">No Courses Yet</h3>
          <p className="mt-2 text-base text-gray-500 dark:text-neutral-400">
            Start by creating your first course with YouTube lessons.
          </p>
          <button
            onClick={openCreateForm}
            className="mt-6 px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-brand-purple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Create First Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-48">
                <SafeImage
                  src={course.thumbnailUrl || course.youtubeThumbnailUrl || getProperThumbnailUrl(course.youtubeEmbedUrl || '') || '/images/course-placeholder.svg'}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                {course.isNew && (
                  <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md animate-pulse">
                    NEW
                  </span>
                )}
                {!course.published && (
                  <span className="absolute top-3 left-3 bg-gray-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                    DRAFT
                  </span>
                )}
              </div>
              
              <div className="p-5">
                <span className="text-xs font-medium text-brand-purple dark:text-purple-400 mb-1 uppercase tracking-wider">
                  {course.category}
                </span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-neutral-100 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-3 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-gray-700 dark:text-neutral-300 my-3">
                  <div className="flex items-center">
                    <UsersIcon className="h-4 w-4 mr-1.5 text-green-500 dark:text-green-400" />
                    <span>{course.studentsEnrolled} Students</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpenIcon className="h-4 w-4 mr-1.5 text-blue-500 dark:text-blue-400" />
                    <span>{course.lessonsCount} Lessons</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1.5 text-orange-500 dark:text-orange-400" />
                    <span>{course.totalDurationHours}h</span>
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 mr-1.5 text-yellow-400 dark:text-yellow-300" />
                    <span>{course.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>

                {course.tags && course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 my-2">
                    {course.tags.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-neutral-700">
                  <span className="text-lg font-bold text-brand-purple dark:text-purple-400">
                    {typeof course.price === 'number' ? `$${course.price}` : course.price}
                  </span>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setSelectedCourseForLessons(course)}
                      className="p-2 text-gray-400 hover:text-purple-500 transition-colors rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      title="Manage Lessons"
                    >
                      <AcademicCapIcon className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="View Course"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => openEditForm(course)}
                      className="p-2 text-gray-400 hover:text-green-500 transition-colors rounded-md hover:bg-green-50 dark:hover:bg-green-900/20"
                      title="Edit Course"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeletingCourse(course)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete Course"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingCourse) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-4">
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </h2>
            
            <form onSubmit={editingCourse ? handleEditSubmit : handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-brand-purple dark:bg-neutral-700 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-brand-purple dark:bg-neutral-700 dark:text-white"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-brand-purple dark:bg-neutral-700 dark:text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-brand-purple dark:bg-neutral-700 dark:text-white"
                  >
                    {['Web Development', 'Data Science', 'UI/UX Design', 'Digital Marketing', 'Languages', 'Management', 'Business'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                    Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as 'Pemula' | 'Menengah' | 'Lanjutan' }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-brand-purple dark:bg-neutral-700 dark:text-white"
                  >
                    <option value="Pemula">Beginner</option>
                    <option value="Menengah">Intermediate</option>
                    <option value="Lanjutan">Advanced</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-brand-purple dark:bg-neutral-700 dark:text-white"
                  min="0"
                />
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-brand-purple dark:bg-neutral-700 dark:text-white"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-gray-200 dark:bg-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-500 transition-colors"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-brand-purple text-white text-xs rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-white hover:text-gray-200"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="published" className="text-sm text-gray-700 dark:text-neutral-300">
                  Publish immediately (will appear on courses page)
                </label>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100">Confirm Delete</h2>
            </div>
            
            <p className="text-gray-600 dark:text-neutral-400 mb-6">
              Are you sure you want to delete <strong>&quot;{deletingCourse.title}&quot;</strong>? 
              This will also delete all associated lessons. This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setDeletingCourse(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}