"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Clock, BookOpen, Play } from 'lucide-react';
import { YouTubePlayer } from '@/components/video/YouTubePlayer';
import { apiClient } from '@/lib/utils/apiUtils';
import { Course, Lesson } from '@/lib/types';

interface LessonProgress {
  id: string;
  lessonId: string;
  userId: string;
  progress: number;
  completed: boolean;
  watchTime: number;
  lastWatched: string;
}

export default function LessonViewer() {
  const params = useParams();
  const router = useRouter();
  const { slug, lessonId } = params;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Helper function to get all lessons from course modules
  const getAllLessons = (course: Course | null): Lesson[] => {
    if (!course?.modules) return [];
    return course.modules.flatMap(module => module.lessons);
  };

  // Fetch lesson and course data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch course data from backend API (direct response)
        const courseResponse = await apiClient.get(`/courses/${slug}`);
        if (courseResponse) {
          setCourse(courseResponse);
        }

        // Fetch lesson data from Next.js API route (wrapped response)
        try {
          console.log(`🔍 Attempting to fetch lesson ID: ${lessonId}`);
          // Use fetch directly for Next.js API routes to avoid baseURL conflict
          const lessonApiResponse = await fetch(`/api/lessons/${lessonId}`);
          const lessonResponse = await lessonApiResponse.json();
          console.log(`📦 Lesson API response:`, lessonResponse);
          
          if (lessonResponse.success && lessonResponse.data) {
            console.log(`✅ Lesson found via API:`, lessonResponse.data);
            setLesson(lessonResponse.data);
          } else {
            throw new Error("Lesson not found or invalid response");
          }
        } catch (lessonError: any) {
          console.warn(`⚠️ Failed to fetch lesson via API:`, lessonError.message);
          
          // If lesson not found, check if we can find it from course modules
          if (courseResponse?.modules) {
            console.log(`🔍 Searching for lesson in course modules...`);
            const allLessons = courseResponse.modules.flatMap((module: any) => module.lessons);
            const foundLesson = allLessons.find((l: any) => l.id.toString() === lessonId);
            
            if (foundLesson) {
              console.log(`✅ Found lesson in course modules:`, foundLesson);
              setLesson(foundLesson);
            } else {
              console.error(`❌ Lesson ${lessonId} not found in course modules`);
              throw new Error(`Lesson dengan ID ${lessonId} tidak ditemukan dalam kursus ini`);
            }
          } else {
            console.error(`❌ No course modules available to search`);
            throw new Error(`Lesson dengan ID ${lessonId} tidak ditemukan`);
          }
        }

        // Fetch lesson progress from Next.js API route (wrapped response)
        try {
          console.log(`📊 Attempting to fetch progress for lesson ID: ${lessonId}`);
          // Use fetch directly for Next.js API routes to avoid baseURL conflict
          const progressApiResponse = await fetch(`/api/lessons/${lessonId}/progress`);
          const progressResponse = await progressApiResponse.json();
          console.log(`📊 Progress API response:`, progressResponse);
          
          if (progressResponse.success && progressResponse.data) {
            console.log(`✅ Progress found:`, progressResponse.data);
            setProgress(progressResponse.data);
          }
        } catch (progressError: any) {
          // Progress might not exist yet, that's ok
          console.log(`ℹ️ No progress data found (this is normal for new lessons):`, progressError.message);
        }

      } catch (err: any) {
        console.error("Error fetching lesson data:", err);
        setError(err.message || "Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };

    if (slug && lessonId) {
      fetchData();
    }
  }, [slug, lessonId]);

  // Handle video progress updates
  const handleVideoProgress = async (progressPercent: number) => {
    if (!lesson) return;

    try {
      console.log(`📊 Updating progress to ${progressPercent}% for lesson ${lessonId}`);
      
      // Use fetch directly for Next.js API routes to avoid baseURL conflict
      const response = await fetch(`/api/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progress: progressPercent,
          watchTime: Math.floor(progressPercent * (lesson.duration || 0) / 100),
          lastWatched: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update progress: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ Progress updated successfully:`, result);

      // Update local state
      setProgress(prev => prev ? {
        ...prev,
        progress: progressPercent,
        watchTime: Math.floor(progressPercent * (lesson.duration || 0) / 100),
        lastWatched: new Date().toISOString()
      } : null);

    } catch (error: any) {
      console.error(`❌ Failed to update progress:`, error.message);
      // Don't throw error to prevent breaking the video player
    }
  };

  // Handle lesson completion
  const handleLessonComplete = async () => {
    if (!lesson) return;

    try {
      await apiClient.post(`/api/lessons/${lessonId}/complete`, {
        completed: true,
        progress: 100,
        completedAt: new Date().toISOString()
      });

      // Update local state
      setProgress(prev => prev ? {
        ...prev,
        progress: 100,
        completed: true,
        lastWatched: new Date().toISOString()
      } : null);

      // Show completion notification
      alert("🎉 Lesson completed! Great job!");

    } catch (error) {
      console.error("Failed to mark lesson as complete:", error);
    }
  };

  // Navigate back to course
  const handleBackToCourse = () => {
    router.push(`/courses/${slug}`);
  };

  // Navigate to next lesson
  const handleNextLesson = () => {
    if (!course?.modules) return;
    
    // Get all lessons from all modules
    const allLessons = getAllLessons(course);
    const currentIndex = allLessons.findIndex((l: any) => l.id.toString() === lessonId);
    const nextLesson = allLessons[currentIndex + 1];
    
    if (nextLesson) {
      router.push(`/courses/${slug}/lessons/${nextLesson.id}`);
    } else {
      // No more lessons, go back to course
      handleBackToCourse();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuat lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <BookOpen className="w-16 h-16 mx-auto mb-4" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Lesson Tidak Ditemukan
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "Lesson yang Anda cari tidak ditemukan atau tidak dapat diakses."}
          </p>
          <button
            onClick={handleBackToCourse}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Kembali ke Kursus
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToCourse}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Kembali ke Kursus</span>
              </button>
              
              {course && (
                <div className="hidden sm:block">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {course.title}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {progress && (
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Progress: {Math.round(progress.progress)}%
                  </span>
                  {progress.completed && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              {lesson.videoUrl ? (
                <YouTubePlayer
                  videoUrl={lesson.videoUrl}
                  title={lesson.title}
                  onProgress={handleVideoProgress}
                  onComplete={handleLessonComplete}
                  className="w-full"
                />
              ) : (
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Play className="w-12 h-12 mx-auto mb-2" />
                    <p>Video tidak tersedia</p>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {lesson.title}
              </h1>
              
              {lesson.description && (
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-400">
                    {lesson.description}
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
                {lesson.duration && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.duration} menit</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Lesson {lesson.order || 1}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            {progress && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Progress Anda
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Kemajuan</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {Math.round(progress.progress)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                  </div>

                  {progress.watchTime > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Waktu Tonton</span>
                      <span className="text-gray-900 dark:text-white">
                        {Math.round(progress.watchTime)} menit
                      </span>
                    </div>
                  )}

                  {progress.completed && (
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Lesson Selesai</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Navigasi
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleBackToCourse}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Kursus</span>
                </button>

                {course?.modules && (
                  <button
                    onClick={handleNextLesson}
                    disabled={!(() => {
                      const allLessons = getAllLessons(course);
                      const currentIndex = allLessons.findIndex((l: any) => l.id.toString() === lessonId);
                      return currentIndex < allLessons.length - 1;
                    })()}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>Lesson Selanjutnya</span>
                  </button>
                )}
              </div>
            </div>

            {/* Course Info */}
            {course && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Tentang Kursus
                </h3>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {course.title}
                  </h4>
                  
                  {course.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {course.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{getAllLessons(course).length || 0} lessons</span>
                    {course.level && <span>Level: {course.level}</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
