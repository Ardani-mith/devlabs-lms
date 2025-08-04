"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Clock, BookOpen, Play, ChevronRight } from 'lucide-react';
import { YouTubePlayer } from '@/components/video/YouTubePlayer';
import { apiClient } from '@/lib/utils/apiUtils';
import { Course, Lesson } from '@/lib/types';
import { useLessonProgress } from '@/lib/api/hooks/useLessons';

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
  const [lastProgressUpdate, setLastProgressUpdate] = useState(0);

  const { getLessonProgress, updateProgress, isLoading: progressLoading, error: progressError } = useLessonProgress(Number(lessonId));

  // Helper function to get all lessons from course modules
  const getAllLessons = (course: Course | null): Lesson[] => {
    if (!course?.modules) return [];
    return course.modules.flatMap(module => module.lessons);
  };

  // Fetch lesson and course data
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (!isMounted || !slug || !lessonId) return;
      
      try {
        setLoading(true);
        setError("");

        // Fetch course data from backend API (direct response)
        const courseResponse = await apiClient.get(`/courses/${slug}`);
        if (courseResponse && isMounted) {
          setCourse(courseResponse);
        }

        // Fetch lesson data from Next.js API route (wrapped response)
        try {
          const lessonApiResponse = await fetch(`/api/lessons/${lessonId}`);
          const lessonResponse = await lessonApiResponse.json();
          
          if (lessonResponse.success && lessonResponse.data && isMounted) {
            console.log('🎥 Lesson data received:', lessonResponse.data);
            setLesson(lessonResponse.data);
          } else {
            throw new Error("Lesson not found or invalid response");
          }
        } catch (lessonError: any) {
          // If lesson not found, check if we can find it from course modules
          if (courseResponse?.modules && isMounted) {
            const allLessons = courseResponse.modules.flatMap((module: any) => module.lessons);
            const foundLesson = allLessons.find((l: any) => l.id.toString() === lessonId);
            
            if (foundLesson) {
              console.log('🎥 Lesson found from course modules:', foundLesson);
              setLesson(foundLesson);
            } else {
              throw new Error(`Lesson dengan ID ${lessonId} tidak ditemukan dalam kursus ini`);
            }
          } else {
            throw new Error(`Lesson dengan ID ${lessonId} tidak ditemukan`);
          }
        }

      } catch (err: any) {
        if (isMounted) {
          console.error("Error fetching lesson data:", err);
          setError(err.message || "Failed to load lesson");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [slug, lessonId]);

  // Separate effect for progress loading with delay
  useEffect(() => {
    let isMounted = true;

    const fetchProgress = async () => {
      if (!isMounted || !lessonId) return;
      
      try {
        const progressData = await getLessonProgress();
        if (progressData && isMounted) {
          setProgress(progressData);
        }
      } catch {
        // Silently handle progress errors - not critical
      }
    };

    // Delay progress fetch to avoid rapid calls
    const progressTimeoutId = setTimeout(fetchProgress, 500);

    return () => {
      isMounted = false;
      if (progressTimeoutId) {
        clearTimeout(progressTimeoutId);
      }
    };
  }, [lessonId, getLessonProgress]);

  // Handle video progress updates with debouncing
  const handleVideoProgress = async (progressPercent: number) => {
    if (!lesson) return;

    // Debounce progress updates - only update every 5 seconds
    const now = Date.now();
    if (now - lastProgressUpdate < 5000) {
      // Update local state immediately for UI responsiveness
      setProgress(prev => prev ? {
        ...prev,
        progress: progressPercent,
        watchTime: Math.floor(progressPercent * (lesson.duration || 0) / 100),
        lastWatched: new Date().toISOString()
      } : null);
      return;
    }

    setLastProgressUpdate(now);

    try {
      await updateProgress(progressPercent);

      // Update local state
      setProgress(prev => prev ? {
        ...prev,
        progress: progressPercent,
        watchTime: Math.floor(progressPercent * (lesson.duration || 0) / 100),
        lastWatched: new Date().toISOString()
      } : null);

    } catch (error: any) {
      // Handle progress update error silently - not critical for user experience
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

  // Navigate to specific lesson
  const handleNavigateToLesson = (newLessonId: string) => {
    router.push(`/courses/${slug}/lessons/${newLessonId}`);
  };

  // Navigate to next lesson
  const handleNextLesson = () => {
    if (!course) return;
    
    const allLessons = getAllLessons(course);
    const currentIndex = allLessons.findIndex(l => l.id.toString() === lessonId);
    
    if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      router.push(`/courses/${slug}/lessons/${nextLesson.id}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/20 border-t-blue-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Memuat Lesson
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Mohon tunggu sebentar...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToCourse}
                className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Kursus</span>
              </button>
              
              {course && (
                <div className="hidden sm:block">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {course.title}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {progress && (
                <div className="flex items-center space-x-3 text-sm">
                  <div className="flex items-center space-x-2">
                    {progress.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-blue-500" />
                    )}
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      {progress.completed ? 'Selesai' : `${Math.round(progress.progress)}% Selesai`}
                    </span>
                  </div>
                  {!progress.completed && (
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.progress}%` }}
                      ></div>
                    </div>
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
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              {(() => {
                const videoUrl = lesson.videoUrl || lesson.youtubeUrl || (lesson.youtubeVideoId ? `https://www.youtube.com/watch?v=${lesson.youtubeVideoId}` : null);
                console.log('🎥 Final video URL for player:', videoUrl);
                
                return videoUrl ? (
                  <YouTubePlayer
                    videoUrl={videoUrl}
                    title={lesson.title}
                    duration={lesson.duration}
                    onProgress={handleVideoProgress}
                    onComplete={handleLessonComplete}
                    className="w-full"
                  />
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <div className="bg-white/50 dark:bg-gray-600/50 rounded-full p-6 mb-4 mx-auto w-fit">
                        <Play className="w-12 h-12" />
                      </div>
                      <p className="text-lg font-medium mb-2">Video tidak tersedia</p>
                      <p className="text-sm opacity-75">Mohon hubungi instruktur</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Lesson Info */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-8 mt-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                    {lesson.title}
                  </h1>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                    {lesson.duration && (
                      <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{lesson.duration} menit</span>
                      </div>
                    )}
                    {lesson.type && (
                      <div className="flex items-center space-x-2 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full">
                        <BookOpen className="w-4 h-4 text-purple-500" />
                        <span className="font-medium capitalize">{lesson.type}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {progress?.completed && (
                  <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-700 dark:text-green-300 font-medium">Selesai</span>
                  </div>
                )}
              </div>
              
              {lesson.description && (
                <div className="prose dark:prose-invert prose-blue max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                    {lesson.description}
                  </p>
                </div>
              )}

              {/* Next Lesson Button */}
              {(() => {
                const allLessons = getAllLessons(course);
                const currentIndex = allLessons.findIndex(l => l.id.toString() === lessonId);
                const nextLesson = currentIndex !== -1 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
                
                return nextLesson ? (
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleNextLesson}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <span>Lesson Selanjutnya: {nextLesson.title}</span>
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                ) : null;
              })()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Lesson Navigation */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Daftar Lesson
              </h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getAllLessons(course).map((l, index) => {
                  const isCurrentLesson = l.id.toString() === lessonId;
                  const lessonIndex = index + 1;
                  
                  return (
                    <button
                      key={l.id}
                      onClick={() => handleNavigateToLesson(l.id.toString())}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                        isCurrentLesson
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold text-sm ${isCurrentLesson ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          Lesson {lessonIndex}
                        </h3>
                        {isCurrentLesson && (
                          <div className="bg-white/20 px-2 py-1 rounded-full">
                            <span className="text-xs font-medium">Saat ini</span>
                          </div>
                        )}
                      </div>
                      
                      <p className={`text-sm font-medium mb-2 ${isCurrentLesson ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                        {l.title}
                      </p>
                      
                      <div className="flex items-center space-x-3 text-xs">
                        {l.duration && (
                          <div className={`flex items-center space-x-1 ${isCurrentLesson ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                            <Clock className="w-3 h-3" />
                            <span>{l.duration} menit</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Course Info */}
            {course && (
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Tentang Kursus
                </h2>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {course.title}
                  </h3>
                  
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
