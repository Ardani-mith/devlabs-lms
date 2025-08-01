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
import { Course } from '@/lib/types';
import SafeImage from '@/components/ui/SafeImage';
import { lessonEndpoints } from '@/lib/api/endpoints/lessons';
import type { Lesson as ApiLesson } from '@/lib/api/types';

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
  id?: number; // Optional ID for temporary lessons
}

interface LessonManagerProps {
  course: Course;
  onClose: () => void;
}

// YouTube URL validation and conversion utilities
const validateYouTubeUrl = (url: string): { isValid: boolean; videoId?: string; error?: string } => {
  if (!url.trim()) {
    return { isValid: false, error: 'URL is required' };
  }

  // YouTube URL patterns - including embed URLs
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return { isValid: true, videoId: match[1] };
    }
  }

  return { isValid: false, error: 'Invalid YouTube URL format. Please use youtube.com or youtu.be URLs' };
};

// Convert YouTube URL to embed URL
const convertToYouTubeEmbed = (url: string): string => {
  const validation = validateYouTubeUrl(url);
  if (validation.isValid && validation.videoId) {
    return `https://www.youtube.com/embed/${validation.videoId}`;
  }
  return url; // Return original if conversion fails
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
  } else {
    const validation = validateYouTubeUrl(data.videoUrl);
    if (!validation.isValid) {
      errors.push(validation.error || 'Invalid YouTube URL format');
    }
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

  // Component lifecycle logging
  useEffect(() => {
    console.log('🏗️ LessonManager MOUNTED');
    console.log('🏗️ Course:', course);
    console.log('🏗️ Initial state:', {
      lessons: [],
      currentLesson: {
        title: '',
        description: '',
        videoUrl: '',
        duration: 30
      },
      errors: [],
      submitting: false
    });

    return () => {
      console.log('🏗️ LessonManager UNMOUNTING');
      console.log('🏗️ Final lessons state:', lessons);
      console.log('🏗️ Final lessons count:', lessons.length);
    };
  }, []);

  // Debug: Monitor state changes
  useEffect(() => {
    console.log('📊 Lessons state updated:', lessons);
    console.log('📊 Lessons count:', lessons.length);
    
    // Force component re-render indicator
    if (lessons.length > 0) {
      console.log('🎨 UI should now show', lessons.length, 'lesson(s)');
      console.log('🎨 Lessons data for UI:', lessons.map((l, i) => ({
        index: i,
        title: l.title,
        id: l.id || 'no-id'
      })));
    }
  }, [lessons]);

  useEffect(() => {
    console.log('📝 Current lesson state updated:', currentLesson);
  }, [currentLesson]);

  useEffect(() => {
    if (errors.length > 0) {
      console.log('❌ Errors updated:', errors);
    }
  }, [errors]);

  useEffect(() => {
    console.log('⏳ Submitting state changed:', submitting);
    if (submitting) {
      console.log('⏳ Save process is now in progress...');
    } else {
      console.log('⏳ Save process completed or not started');
    }
  }, [submitting]);

  // Load lessons when component mounts or courseId changes
  useEffect(() => {
    if (course.id) {
      loadLessons();
    }
  }, [course.id]);

  const loadLessons = async () => {
    if (!course.id) return;
    
    console.log('📚 Loading lessons for course:', course.id);
    
    try {
      const fetchedLessons = await lessonEndpoints.getByCourse(Number(course.id));
      console.log('📚 Fetched lessons from API:', fetchedLessons);
      
      // Ensure fetchedLessons is an array (backend returns array directly)
      const lessonsArray = Array.isArray(fetchedLessons) ? fetchedLessons : [];
      
      // Convert backend Lesson format to LessonFormData format
      const formattedLessons: LessonFormData[] = lessonsArray.map((lesson: ApiLesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.content || '', // Map content to description
        videoUrl: lesson.youtubeUrl || '', // Map youtubeUrl to videoUrl
        duration: Math.round((lesson.duration || 0) / 60) // Convert seconds to minutes
      }));
      
      console.log('📚 Formatted lessons for UI:', formattedLessons);
      setLessons(formattedLessons);
    } catch (error) {
      console.error('❌ Failed to load lessons:', error);
      setErrors(['Failed to load existing lessons']);
    }
  };

  const handleAddLesson = () => {
    console.log('🚀 handleAddLesson called');
    console.log('📝 Current lesson data:', currentLesson);
    console.log('📚 Current lessons array before add:', lessons);
    
    // Basic validation
    if (!currentLesson.title.trim()) {
      console.log('❌ Validation failed: Title is required');
      setErrors(['Title is required']);
      return;
    }
    if (!currentLesson.description.trim()) {
      console.log('❌ Validation failed: Description is required');
      setErrors(['Description is required']);
      return;
    }
    if (!currentLesson.videoUrl.trim()) {
      console.log('❌ Validation failed: Video URL is required');
      setErrors(['Video URL is required']);
      return;
    }
    if (currentLesson.duration < 1) {
      console.log('❌ Validation failed: Duration must be at least 1 minute');
      setErrors(['Duration must be at least 1 minute']);
      return;
    }

    console.log('✅ Validation passed');

    // Convert YouTube URL to embed URL before saving
    const embedUrl = convertToYouTubeEmbed(currentLesson.videoUrl);
    console.log('🎥 Original URL:', currentLesson.videoUrl);
    console.log('🎥 Converted embed URL:', embedUrl);
    
    const newLesson = {
      ...currentLesson,
      videoUrl: embedUrl,
      id: Date.now() // Temporary ID for display
    };
    console.log('📋 New lesson object:', newLesson);

    // Add lesson to the list
    const updatedLessons = [...lessons, newLesson];
    console.log('📂 Updated lessons array:', updatedLessons);
    setLessons(updatedLessons);
    
    // Reset form
    const resetLesson = {
      title: '',
      description: '',
      videoUrl: '',
      duration: 30
    };
    console.log('🔄 Resetting form to:', resetLesson);
    setCurrentLesson(resetLesson);
    setErrors([]);
    
    console.log('✅ handleAddLesson completed successfully');
  };

  const handleRemoveLesson = async (index: number) => {
    console.log('🗑️ handleRemoveLesson called for index:', index);
    const lessonToRemove = lessons[index];
    console.log('🗑️ Lesson to remove:', lessonToRemove);
    
    // If this is an existing lesson (has a real ID), delete it from backend
    if (lessonToRemove.id && lessonToRemove.id < 1000000000) {
      console.log('🗑️ Deleting existing lesson from backend:', lessonToRemove.id);
      try {
        await lessonEndpoints.delete(lessonToRemove.id);
        console.log('✅ Lesson deleted from backend successfully');
      } catch (error) {
        console.error('❌ Failed to delete lesson from backend:', error);
        setErrors(['Failed to delete lesson']);
        return;
      }
    } else {
      console.log('🗑️ Removing temporary lesson (not saved to backend)');
    }
    
    // Remove from local state
    const updatedLessons = lessons.filter((_, i) => i !== index);
    console.log('🗑️ Updated lessons after removal:', updatedLessons);
    setLessons(updatedLessons);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('💾 SAVE PROCESS STARTED');
    console.log('💾 Event:', e);
    console.log('💾 Current lessons to save:', lessons);
    console.log('💾 Lessons count:', lessons.length);
    
    if (lessons.length === 0) {
      console.log('❌ SAVE FAILED: No lessons to save');
      setErrors(['Add at least one lesson before saving']);
      return;
    }
    
    setSubmitting(true);
    setErrors([]);
    console.log('💾 Submitting state set to true');
    console.log('💾 Errors cleared');
    
    try {
      console.log('💾 Starting save operation...');
      console.log('💾 Course ID:', course.id);
      console.log('💾 Course title:', course.title);
      console.log('💾 Lessons data to save:', JSON.stringify(lessons, null, 2));
      
      // Save each lesson to the backend
      const savedLessons = [];
      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        console.log(`💾 Saving lesson ${i + 1}/${lessons.length}:`, lesson.title);
        
        // Check if this is a new lesson (no ID or temporary ID) or existing lesson
        const isNewLesson = !lesson.id || lesson.id > 1000000000; // Temporary IDs are timestamps
        
        if (isNewLesson) {
          // Create new lesson
          const createRequest = {
            title: lesson.title,
            content: lesson.description, // Map description to content
            youtubeUrl: lesson.videoUrl, // Map videoUrl to youtubeUrl
            duration: lesson.duration * 60, // Convert minutes to seconds
            order: i + 1, // Set order based on position in array
          };
          
          console.log(`💾 Creating new lesson:`, createRequest);
          const savedLesson = await lessonEndpoints.create(Number(course.id), createRequest);
          console.log(`✅ Created lesson:`, savedLesson);
          savedLessons.push(savedLesson);
        } else {
          // Update existing lesson
          const updateRequest = {
            title: lesson.title,
            content: lesson.description, // Map description to content
            youtubeUrl: lesson.videoUrl, // Map videoUrl to youtubeUrl
            duration: lesson.duration * 60, // Convert minutes to seconds
            order: i + 1, // Update order based on position in array
          };
          
          console.log(`💾 Updating existing lesson ${lesson.id}:`, updateRequest);
          const savedLesson = await lessonEndpoints.update(lesson.id!, updateRequest);
          console.log(`✅ Updated lesson:`, savedLesson);
          savedLessons.push(savedLesson);
        }
      }
      
      console.log('✅ All lessons saved successfully:', savedLessons);
      console.log('✅ SAVE COMPLETED SUCCESSFULLY');
      console.log('✅ Closing lesson manager...');
      onClose();
    } catch (error) {
      console.error('❌ SAVE ERROR:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error
      });
      setErrors([error instanceof Error ? error.message : 'Failed to save lessons']);
    } finally {
      console.log('💾 Save process finally block');
      console.log('💾 Setting submitting to false');
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

  // Temporarily disable loading check for debugging
  // if (loading && lessons.length === 0) {
  //   return (
  //     <div className="space-y-4">
  //       <div className="animate-pulse space-y-4">
  //         <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-1/3"></div>
  //         <div className="space-y-3">
  //           {[...Array(3)].map((_, i) => (
  //             <div key={i} className="h-20 bg-gray-200 dark:bg-neutral-700 rounded"></div>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

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
                  <span className="text-xs text-gray-500 dark:text-neutral-400 ml-2">
                    Will be converted to embed URL automatically
                  </span>
                </label>
                <input
                  type="url"
                  value={currentLesson.videoUrl}
                  onChange={(e) => setCurrentLesson({ ...currentLesson, videoUrl: e.target.value })}
                  className="w-full rounded-md border border-gray-300 dark:border-neutral-600 px-4 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                />
                {/* Preview embed URL if valid YouTube URL is entered */}
                {currentLesson.videoUrl && validateYouTubeUrl(currentLesson.videoUrl).isValid && (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Embed URL that will be saved:</strong>
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-300 font-mono break-all">
                      {convertToYouTubeEmbed(currentLesson.videoUrl)}
                    </p>
                  </div>
                )}
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
              
              {/* Debug: Test buttons */}
              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-neutral-600">
                <p className="text-xs text-gray-500 dark:text-neutral-400 text-center">Debug Tools</p>
                
                <button
                  onClick={() => {
                    console.log('🧪 Debug: Adding test lesson directly to state');
                    const testLesson = {
                      title: `Test Lesson ${Date.now()}`,
                      description: 'This is a test lesson added directly to state for debugging',
                      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                      duration: 5,
                      id: Date.now()
                    };
                    console.log('🧪 Test lesson:', testLesson);
                    setLessons(prev => {
                      const newLessons = [...prev, testLesson];
                      console.log('🧪 Updated lessons array:', newLessons);
                      return newLessons;
                    });
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                >
                  🧪 Add Test Lesson (Direct State)
                </button>
                
                <button
                  onClick={() => {
                    console.log('🔍 Debug: Current component state');
                    console.log('📝 Current lesson:', currentLesson);
                    console.log('📚 Lessons array:', lessons);
                    console.log('❌ Errors:', errors);
                    console.log('⏳ Submitting:', submitting);
                    alert(`Lessons count: ${lessons.length}\nCurrent lesson: ${JSON.stringify(currentLesson, null, 2)}`);
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 border border-green-300 dark:border-green-600 rounded-md shadow-sm text-sm font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40"
                >
                  🔍 Log Current State
                </button>
                
                <button
                  onClick={() => {
                    console.log('🗑️ Debug: Clearing all lessons');
                    setLessons([]);
                    setCurrentLesson({
                      title: '',
                      description: '',
                      videoUrl: '',
                      duration: 30
                    });
                    setErrors([]);
                    console.log('🗑️ All state cleared');
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 border border-red-300 dark:border-red-600 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40"
                >
                  🗑️ Clear All Lessons
                </button>
              </div>
            </div>
          </div>

          {/* Lessons list */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Added Lessons ({lessons.length})
            </h3>
            
            {/* Debug info in UI */}
            <div className="text-xs bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-2">
              <strong>🐛 Debug Info:</strong><br/>
              - Lessons array length: {lessons.length}<br/>
              - Render condition: {lessons.length > 0 ? 'Show lessons' : 'Show empty state'}<br/>
              - Current timestamp: {Date.now()}
            </div>
            
            {/* Always show this section */}
            <div className="min-h-[100px] border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg p-4">
              {lessons.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    ✅ Found {lessons.length} lesson(s) to display:
                  </p>
                  {lessons.map((lesson, index) => {
                    console.log(`🎨 Rendering lesson ${index}:`, lesson);
                    return (
                      <div
                        key={lesson.id || index}
                        className="flex items-start space-x-4 p-4 bg-white dark:bg-neutral-800 rounded-lg border-2 border-green-500 dark:border-green-400 shadow-lg"
                        style={{ 
                          minHeight: '100px',
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          border: '2px solid #22c55e'
                        }}
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
                          <div className="mt-2 text-xs text-gray-400 dark:text-neutral-500">
                            <strong>Embed URL:</strong> <span className="font-mono">{lesson.videoUrl}</span>
                          </div>
                          <div className="mt-1 text-xs text-blue-500">
                            🐛 Debug - ID: {lesson.id || 'no-id'}, Index: {index}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveLesson(index)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-neutral-400">
                  <p>❌ No lessons in state array. Add your first lesson above.</p>
                  <p className="text-xs mt-2">This area will update when lessons.length {'>'}  0</p>
                  <p className="text-xs mt-1 text-red-500">Current lessons.length = {lessons.length}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 py-4 border-t border-gray-200 dark:border-neutral-700 flex justify-end space-x-4">
          <button
            onClick={() => {
              console.log('🚫 CANCEL BUTTON CLICKED');
              console.log('🚫 Current lessons that will be lost:', lessons);
              console.log('🚫 Lessons count:', lessons.length);
              console.log('🚫 Calling onClose...');
              onClose();
            }}
            className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancel
          </button>
          <button
            onClick={(e) => {
              console.log('🔘 SAVE BUTTON CLICKED');
              console.log('🔘 Event:', e);
              console.log('🔘 Button disabled?', submitting || lessons.length === 0);
              console.log('🔘 Submitting state:', submitting);
              console.log('🔘 Lessons count:', lessons.length);
              console.log('🔘 About to call handleSubmit...');
              handleSubmit(e);
            }}
            disabled={submitting || lessons.length === 0}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-purple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {submitting ? 'Saving...' : 'Save Lessons'}
          </button>
        </div>
      </div>
    </div>
  );
} 