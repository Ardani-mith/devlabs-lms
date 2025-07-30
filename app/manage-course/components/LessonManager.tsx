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
import { Course } from '@/contexts/CourseContext';
import SafeImage from '@/components/ui/SafeImage';

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
  description: string;
  videoUrl: string;
  duration: number;
}

interface LessonManagerProps {
  course: Course;
  onClose: () => void;
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

const validateLesson = (data: LessonFormData): string[] => {
  const errors: string[] = [];
  
  if (!data.title?.trim()) {
    errors.push('Lesson title is required');
  }
  
  if (!data.description?.trim()) {
    errors.push('Lesson description is required');
  }
  
  if (!data.videoUrl?.trim()) {
    errors.push('Video URL is required');
  } else if (!data.videoUrl.includes('youtube.com/') && !data.videoUrl.includes('youtu.be/')) {
    errors.push('Only YouTube videos are supported');
  }
  
  if (data.duration < 1) {
    errors.push('Duration must be at least 1 minute');
  }
  
  return errors;
};

export default function LessonManager({ course, onClose }: LessonManagerProps) {
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

  const [lessons, setLessons] = useState<LessonFormData[]>([]);
  const [currentLesson, setCurrentLesson] = useState<LessonFormData>({
    title: '',
    description: '',
    videoUrl: '',
    duration: 30
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Load lessons when component mounts or courseId changes
  useEffect(() => {
    if (course.id) {
      loadLessons();
    }
  }, [course.id]);

  const loadLessons = async () => {
    if (!course.id) return;
    
    // TODO: Fix type mismatch between Lesson and LessonFormData
    // const fetchedLessons = await getLessonsByCourse(Number(course.id));
    // setLessons(fetchedLessons);
  };

  const handleAddLesson = () => {
    const validationErrors = validateLesson(currentLesson);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLessons([...lessons, currentLesson]);
    setCurrentLesson({
      title: '',
      description: '',
      videoUrl: '',
      duration: 30
    });
    setErrors([]);
  };

  const handleRemoveLesson = (index: number) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lessons.length === 0) {
      setErrors(['Add at least one lesson before saving']);
      return;
    }
    
    setSubmitting(true);
    setErrors([]);
    
    try {
      // TODO: Implement lesson saving logic
      onClose();
    } catch (error) {
      console.error('Error saving lessons:', error);
      setErrors([error instanceof Error ? error.message : 'Failed to save lessons']);
    } finally {
      setSubmitting(false);
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Manage Lessons - {course.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Error display */}
          {errors.length > 0 && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XMarkIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Please fix the following errors:
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <ul className="list-disc pl-5 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add new lesson form */}
          <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Add New Lesson
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={currentLesson.title}
                  onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value })}
                  className="w-full rounded-md border border-gray-300 dark:border-neutral-600 px-4 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  placeholder="Enter lesson title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  value={currentLesson.description}
                  onChange={(e) => setCurrentLesson({ ...currentLesson, description: e.target.value })}
                  className="w-full rounded-md border border-gray-300 dark:border-neutral-600 px-4 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Enter lesson description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Video URL (YouTube)
                </label>
                <input
                  type="url"
                  value={currentLesson.videoUrl}
                  onChange={(e) => setCurrentLesson({ ...currentLesson, videoUrl: e.target.value })}
                  className="w-full rounded-md border border-gray-300 dark:border-neutral-600 px-4 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  placeholder="Enter YouTube video URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={currentLesson.duration}
                  onChange={(e) => setCurrentLesson({ ...currentLesson, duration: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-md border border-gray-300 dark:border-neutral-600 px-4 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  min="1"
                />
              </div>
              <button
                onClick={handleAddLesson}
                disabled={submitting}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Lesson
              </button>
            </div>
          </div>

          {/* Lessons list */}
          {lessons.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Added Lessons ({lessons.length})
              </h3>
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700"
                  >
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {lesson.title}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                        {lesson.description}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-neutral-400">
                        <span>{lesson.duration} minutes</span>
                        <a
                          href={lesson.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-purple hover:text-purple-700 dark:text-purple-400"
                        >
                          View Video
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveLesson(index)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-neutral-400">
              No lessons added yet. Add your first lesson above.
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-neutral-700 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || lessons.length === 0}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Lessons'}
          </button>
        </div>
      </div>
    </div>
  );
} 