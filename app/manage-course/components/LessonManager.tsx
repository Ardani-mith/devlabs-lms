"use client";

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  CheckIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  Bars3Icon,
  XMarkIcon,
  PencilIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useLessonAPI } from '@/hooks/useLessonAPI';

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

interface LessonFormData {
  title: string;
  content?: string;
  youtubeUrl: string;
  youtubeVideoId?: string;
  duration?: number; // in minutes (optional)
  order?: number;
}

interface LessonManagerProps {
  courseId: number;
  onLessonsChange?: (lessons: Lesson[]) => void;
  disabled?: boolean;
}

// YouTube URL validation utility
const validateYouTubeUrl = (url: string): { isValid: boolean; videoId?: string; error?: string } => {
  if (!url.trim()) {
    return { isValid: false, error: 'URL is required' };
  }

  // YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return { isValid: true, videoId: match[1] };
    }
  }

  return { isValid: false, error: 'Invalid YouTube URL format' };
};

const LessonManager: React.FC<LessonManagerProps> = ({ 
  courseId, 
  onLessonsChange, 
  disabled 
}) => {
  const {
    loading,
    error,
    getLessonsByCourse,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLesson,
    extractYouTubeVideoId,
  } = useLessonAPI();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState<LessonFormData>({
    title: '',
    content: '',
    youtubeUrl: '',
    youtubeVideoId: '',
    duration: undefined, // Optional
  });
  const [urlValidation, setUrlValidation] = useState<{ isValid: boolean; error?: string }>({ isValid: true });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load lessons when component mounts or courseId changes
  useEffect(() => {
    if (courseId) {
      loadLessons();
    }
  }, [courseId]);

  const loadLessons = async () => {
    if (!courseId) return;
    
    const fetchedLessons = await getLessonsByCourse(courseId);
    setLessons(fetchedLessons);
    onLessonsChange?.(fetchedLessons);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      youtubeUrl: '',
      youtubeVideoId: '',
      duration: undefined,
    });
    setUrlValidation({ isValid: true });
  };

  const openCreateForm = () => {
    resetForm();
    setEditingLesson(null);
    setShowForm(true);
  };

  const openEditForm = (lesson: Lesson) => {
    setFormData({
      title: lesson.title,
      content: lesson.content || '',
      youtubeUrl: lesson.youtubeUrl,
      youtubeVideoId: lesson.youtubeVideoId || '',
      duration: lesson.duration ? Math.round(lesson.duration / 60) : undefined, // Convert seconds to minutes
    });
    setEditingLesson(lesson);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingLesson(null);
    resetForm();
  };

  const handleYouTubeUrlChange = (url: string) => {
    const validation = validateYouTubeUrl(url);
    setUrlValidation(validation);
    
    if (validation.isValid && validation.videoId) {
      setFormData(prev => ({
        ...prev,
        youtubeUrl: url,
        youtubeVideoId: validation.videoId
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        youtubeUrl: url, 
        youtubeVideoId: undefined 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.youtubeUrl.trim()) {
      showNotification('error', 'Title and YouTube URL are required');
      return;
    }

    if (!urlValidation.isValid) {
      showNotification('error', 'Please enter a valid YouTube URL');
      return;
    }

    // Auto-extract YouTube video ID
    const youtubeVideoId = formData.youtubeVideoId || extractYouTubeVideoId(formData.youtubeUrl);

    const lessonData = {
      ...formData,
      youtubeVideoId: youtubeVideoId || undefined,
      content: formData.content || `Lesson: ${formData.title}`,
    };

    try {
      if (editingLesson) {
        // Update existing lesson
        const updatedLesson = await updateLesson(editingLesson.id, lessonData);
        if (updatedLesson) {
          showNotification('success', 'Lesson updated successfully!');
          await loadLessons(); // Reload lessons
          closeForm();
        } else {
          showNotification('error', 'Failed to update lesson');
        }
      } else {
        // Create new lesson
        const newLesson = await createLesson(courseId, lessonData);
        if (newLesson) {
          showNotification('success', 'Lesson created successfully!');
          await loadLessons(); // Reload lessons
          closeForm();
        } else {
          showNotification('error', 'Failed to create lesson');
        }
      }
    } catch {
      showNotification('error', 'An error occurred while saving the lesson');
    }
  };

  const handleDelete = async () => {
    if (!deletingLesson) return;

    try {
      const success = await deleteLesson(deletingLesson.id);
      if (success) {
        showNotification('success', 'Lesson deleted successfully!');
        await loadLessons(); // Reload lessons
        setDeletingLesson(null);
      } else {
        showNotification('error', 'Failed to delete lesson');
      }
    } catch {
      showNotification('error', 'An error occurred while deleting the lesson');
    }
  };

  const handleReorder = async (lessonId: number, newOrder: number) => {
    try {
      const success = await reorderLesson(lessonId, newOrder);
      if (success) {
        await loadLessons(); // Reload lessons to reflect new order
      } else {
        showNotification('error', 'Failed to reorder lesson');
      }
    } catch {
      showNotification('error', 'An error occurred while reordering lessons');
    }
  };

  const moveLesson = (lesson: Lesson, direction: 'up' | 'down') => {
    const currentIndex = lessons.findIndex(l => l.id === lesson.id);
    if (direction === 'up' && currentIndex > 0) {
      handleReorder(lesson.id, lesson.order - 1);
    } else if (direction === 'down' && currentIndex < lessons.length - 1) {
      handleReorder(lesson.id, lesson.order + 1);
    }
  };

  // Format duration from seconds to readable format
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'No duration';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (videoId?: string): string => {
    if (!videoId) return 'https://via.placeholder.com/320x180?text=No+Thumbnail';
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  const getTotalDuration = () => {
    return lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
  };

  if (loading && lessons.length === 0) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-neutral-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-4 text-white hover:text-gray-200">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-100">
            Course Lessons
          </h3>
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            Add YouTube videos for your course lessons (duration is optional)
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {lessons.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
              </p>
              {getTotalDuration() > 0 && (
                <p className="text-sm text-gray-500 dark:text-neutral-500">
                  ~{Math.round(getTotalDuration() / 3600 * 10) / 10} hours
                </p>
              )}
            </div>
          )}
          
          <button
            onClick={openCreateForm}
            disabled={disabled}
            className="flex items-center px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Lesson
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Lessons List */}
      {lessons.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-lg">
          <PlayIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-neutral-600 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-neutral-200 mb-2">
            No lessons yet
          </h4>
          <p className="text-gray-500 dark:text-neutral-400 mb-4">
            Start by adding your first lesson with a YouTube video
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="border border-gray-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-800"
            >
              {/* Lesson Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bars3Icon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                    Lesson {lesson.order}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Move buttons */}
                  <button
                    onClick={() => moveLesson(lesson, 'up')}
                    disabled={index === 0 || disabled}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <ChevronUpIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveLesson(lesson, 'down')}
                    disabled={index === lessons.length - 1 || disabled}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>
                  
                  {/* Edit button */}
                  <button
                    onClick={() => openEditForm(lesson)}
                    disabled={disabled}
                    className="p-1 text-gray-400 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Edit lesson"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  
                  {/* Remove button */}
                  <button
                    onClick={() => setDeletingLesson(lesson)}
                    disabled={disabled}
                    className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove lesson"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* YouTube Preview */}
              <div className="flex gap-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <img
                    src={getYouTubeThumbnail(lesson.youtubeVideoId)}
                    alt={lesson.title}
                    className="w-32 h-20 object-cover rounded"
                  />
                </div>

                {/* Lesson Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {lesson.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-neutral-400 line-clamp-2">
                    {lesson.content || 'No description'}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-neutral-500">
                    <span>Duration: {formatDuration(lesson.duration)}</span>
                    <a
                      href={lesson.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-purple hover:text-purple-700 dark:text-purple-400"
                    >
                      View on YouTube
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
              </h3>
              <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Lesson Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter lesson title"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-brand-purple dark:bg-neutral-700 dark:text-white"
                  required
                />
              </div>

              {/* YouTube URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  YouTube URL *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={formData.youtubeUrl}
                    onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-purple dark:bg-neutral-700 dark:text-white ${
                      !urlValidation.isValid && formData.youtubeUrl
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-gray-300 dark:border-neutral-600'
                    }`}
                    required
                  />
                  {formData.youtubeVideoId && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
                {!urlValidation.isValid && formData.youtubeUrl && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    {urlValidation.error}
                  </p>
                )}
              </div>

              {/* Duration (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Duration (minutes) - Optional
                </label>
                <input
                  type="number"
                  value={formData.duration || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    duration: e.target.value ? Number(e.target.value) : undefined 
                  }))}
                  placeholder="e.g. 15"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-brand-purple dark:bg-neutral-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                  Leave empty if you don&apos;t want to specify duration
                </p>
              </div>

              {/* Content/Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Describe what students will learn in this lesson..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-brand-purple dark:bg-neutral-700 dark:text-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-brand-purple text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : editingLesson ? 'Update Lesson' : 'Add Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingLesson && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Lesson</h3>
            </div>
            <p className="text-gray-600 dark:text-neutral-400 mb-6">
              Are you sure you want to delete &quot;{deletingLesson.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingLesson(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonManager; 