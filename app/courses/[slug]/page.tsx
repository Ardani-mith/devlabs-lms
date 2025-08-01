"use client";

import React, { useState, useEffect, useMemo, useCallback, use } from "react";
import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import {
  StarIcon as StarIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  BookOpenIcon,
  ChatBubbleLeftEllipsisIcon,
  AcademicCapIcon,
  ArrowDownTrayIcon,
  PaperAirplaneIcon,
  UserCircleIcon as UserAvatarIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  UsersIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  HandThumbUpIcon,
  ChevronLeftIcon,
  EyeIcon,
  LockClosedIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/solid";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";

// Import components and utilities
import CourseHeader from "./components/CourseHeader";
import CourseInfoSidebar from "./components/CourseInfoSidebar";
import { CourseTabs, ModuleAccordion } from "./CourseComponents";
import { CourseDetail, DiscussionComment, Lesson } from "@/lib/types";
import { getLessonNavigation } from "@/lib/utils/courseHelpers";
import { getTestEnrollmentData, generateLessonStatuses, type TestEnrollmentData } from "@/lib/utils/testEnrollment";
import TestControlPanel from "@/components/dev/TestControlPanel";
import DebugConsole from "@/components/dev/DebugConsole";

// Inline styles to replace the removed styles file
const layoutStyles = {
  container: "max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8",
  grid: "lg:grid lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12 items-start",
  contentArea: "lg:col-span-8 xl:col-span-8 min-w-0 space-y-8 mb-8 lg:mb-0",
  sidebarArea: "hidden lg:block lg:col-span-4 xl:col-span-4 relative",
} as const;

const cardStyles = {
  main: "bg-white dark:bg-neutral-800/90 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700/70",
  content: "p-6 sm:p-8",
  section: "space-y-10",
  sidebar: "sticky top-[calc(var(--header-height,4rem)+2rem)] space-y-6",
} as const;

const textStyles = {
  heading: {
    h1: "text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3",
    h2: "text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-5",
    h3: "text-xl sm:text-2xl font-semibold text-gray-800 dark:text-neutral-200 mb-4",
  },
  body: {
    large: "text-lg text-gray-700 dark:text-neutral-300 leading-relaxed",
    normal: "text-base text-gray-600 dark:text-neutral-400 leading-relaxed",
    small: "text-sm text-gray-500 dark:text-neutral-500",
  },
} as const;

const buttonStyles = {
  primary: "px-8 py-3.5 bg-brand-purple text-white font-semibold rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50",
  secondary: "px-6 py-3 border-2 border-neutral-300 dark:border-neutral-600 text-base font-medium rounded-lg text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700/50 transition-colors focus:outline-none focus:ring-4 focus:ring-neutral-400/50",
  success: "px-8 py-3.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50",
} as const;

// Backend response interfaces
interface BackendLesson {
  id: number;
  title: string;
  content?: string;
  youtubeUrl: string;
  youtubeVideoId?: string;
  duration?: number; // in seconds
  order: number;
}

interface BackendModule {
  id: number;
  title: string;
  lessons: BackendLesson[];
}

interface BackendCourseData {
  modules: BackendModule[];
  [key: string]: unknown;
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [courseData, setCourseData] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [newComment, setNewComment] = useState("");
  const [testEnrollmentData, setTestEnrollmentData] = useState<TestEnrollmentData>();
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  // Initialize test enrollment data on component mount
  useEffect(() => {
    const initialTestData = getTestEnrollmentData(slug);
    setTestEnrollmentData(initialTestData);
    console.log('Initial test enrollment data:', initialTestData);
  }, [slug]);

  // Computed properties that consider test enrollment data
  const effectiveEnrollmentData = useMemo(() => {
    if (process.env.NODE_ENV === 'development' && testEnrollmentData) {
      return {
        isEnrolled: testEnrollmentData.isEnrolled,
        userProgress: testEnrollmentData.userProgress,
        completedLessons: testEnrollmentData.completedLessons || [],
      };
    }
    return {
      isEnrolled: courseData?.isEnrolled || false,
      userProgress: courseData?.userProgress || 0,
      completedLessons: [],
    };
  }, [testEnrollmentData?.isEnrolled, testEnrollmentData?.userProgress, testEnrollmentData?.completedLessons, courseData?.isEnrolled, courseData?.userProgress]);

  const isCourseCompleted = useMemo(
    () => effectiveEnrollmentData.userProgress === 100,
    [effectiveEnrollmentData.userProgress]
  );

  // Memoize the enrollment change handler to prevent re-renders
  const handleEnrollmentChange = useCallback((data: TestEnrollmentData) => {
    setTestEnrollmentData(data);
    console.log('Test enrollment data changed:', data);
  }, []);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch course data from backend API using correct endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300'}/courses/${slug}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Course not found: ${response.status}`);
        }

        const courseData = await response.json();
        console.log('Fetched course data from API:', courseData);

        // Transform backend course data to CourseDetail interface
        const convertedCourse: CourseDetail = {
            slug: (courseData as unknown as { slug: string }).slug,
            title: (courseData as unknown as { title: string }).title,
            description: (courseData as unknown as { description: string }).description || 'Course description',
            tagline: (courseData as unknown as { description: string }).description,
            instructorName: (courseData as unknown as { instructor?: { name?: string } }).instructor?.name || 'Unknown Instructor',
            instructorAvatar: (courseData as unknown as { instructor?: { avatarUrl?: string } }).instructor?.avatarUrl,
            instructorBio: (courseData as unknown as { instructor?: { bio?: string } }).instructor?.bio || 'Experienced instructor',
            instructorTitle: (courseData as unknown as { instructor?: { title?: string } }).instructor?.title || 'Course Instructor',
            instructorCoursesCount: (courseData as unknown as { instructor?: { coursesCount?: number } }).instructor?.coursesCount || 1,
            instructorStudentsCount: (courseData as unknown as { instructor?: { studentsCount?: number } }).instructor?.studentsCount || 0,
            instructorRating: (courseData as unknown as { instructor?: { rating?: number } }).instructor?.rating || 4.5,
            thumbnailUrl: (courseData as unknown as { thumbnailUrl: string }).thumbnailUrl || '',
            bannerUrl: (courseData as unknown as { thumbnailUrl: string }).thumbnailUrl || '',
            rating: (courseData as unknown as { rating?: number }).rating || 4.5,
            reviewCount: (courseData as unknown as { reviewCount?: number }).reviewCount || 0,
            studentCount: (courseData as unknown as { studentsEnrolled?: number }).studentsEnrolled || 0,
            studentsEnrolled: (courseData as unknown as { studentsEnrolled?: number }).studentsEnrolled || 0,
            userProgress: 0, // This would come from user progress API
            isEnrolled: (courseData as unknown as { isEnrolled?: boolean }).isEnrolled || false, // Check if user is enrolled
            lastAccessedLessonUrl: undefined,
            lastAccessedLessonTitle: undefined,
            price: (courseData as unknown as { price?: number }).price || 0,
            originalPrice: undefined,
            fullDescription: (courseData as unknown as { description?: string }).description || 'No description available',
            whatYouWillLearn: ['Course content to be loaded from modules'],
            targetAudience: ['Students interested in ' + ((courseData as unknown as { category?: string }).category || 'this topic')],
            prerequisites: ['Basic understanding of the topic'],
            skillsYouWillGain: (courseData as unknown as { tags?: string[] }).tags || [],
            toolsYouWillUse: [],
            language: 'Bahasa Indonesia',
            totalLessons: (courseData as unknown as { lessonsCount?: number }).lessonsCount || 0,
            totalVideoHours: Math.floor(((courseData as unknown as { totalDurationHours?: number }).totalDurationHours || 1) * 0.8),
            totalDurationHours: (courseData as unknown as { totalDurationHours?: number }).totalDurationHours || 1,
            estimatedHours: (courseData as unknown as { totalDurationHours?: number }).totalDurationHours || 1,
            hasCertificate: true,
            category: (courseData as unknown as { category?: string }).category || 'General',
            level: ((courseData as unknown as { level?: string }).level || 'Pemula') as "Pemula" | "Menengah" | "Lanjutan" | "Semua Level",
            updatedAt: (courseData as unknown as { updatedAt?: string }).updatedAt || new Date().toISOString(),
            lastUpdated: (courseData as unknown as { updatedAt?: string }).updatedAt || new Date().toISOString(),
            modules: courseData.modules?.map((module: BackendModule, moduleIndex: number) => ({
              ...module,
              id: module.id.toString(),
              lessons: module.lessons?.map((lesson: BackendLesson, lessonIndex: number) => {
                // Ensure lesson has valid ID
                const lessonId = lesson.id ? lesson.id.toString() : `temp_${moduleIndex}_${lessonIndex}`;
                
                console.log(`Processing lesson: ${lesson.title}, ID: ${lessonId}`);
                
                return {
                  id: lessonId,
                  title: lesson.title,
                  type: "video" as const,
                  durationMinutes: lesson.duration ? Math.round(lesson.duration / 60) : undefined,
                  status: "selanjutnya" as const, // Default status
                  url: lesson.youtubeUrl || "#",
                  videoUrl: lesson.youtubeUrl || "",
                  // First lesson of first module is always previewable, plus random preview lessons
                  isPreviewable: (moduleIndex === 0 && lessonIndex === 0) || Math.random() > 0.7
                };
              }).filter(lesson => lesson.id !== null && lesson.id !== 'undefined') || [] // Filter out invalid lessons
            })) || [],
            discussions: [],
            faq: [],
            certificateUrl: `/certificates/${(courseData as unknown as { slug: string }).slug}`,
            relatedCourses: courseData.relatedCourses || []
          };

          setCourseData(convertedCourse);
        } catch (error) {
          console.error('Error fetching course:', error);
          setError(error instanceof Error ? error.message : 'Failed to fetch course');
          setCourseData(null);
        } finally {
          setLoading(false);
        }
      };

      fetchCourseData();
    }, [slug]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !courseData) return;
    
    const comment: DiscussionComment = {
      id: `d${Date.now()}`,
      userName: "Siswa Saat Ini",
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      userRole: "Siswa",
      timestamp: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) + " " + new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: newComment,
      likes: 0,
      replies: [],
    };        setCourseData((prev: CourseDetail | null) =>
          prev ? { ...prev, discussions: [comment, ...(prev.discussions || [])] } : null
        );
    setNewComment("");
  };

  const markLessonComplete = async (lessonId: string) => {
    if (!courseData || !activeLesson) return;
    
    setIsMarkingComplete(true);
    try {
      // API call to mark lesson complete
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300'}/courses/${courseData.slug}/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // Update local state
        setCourseData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            modules: prev.modules.map(module => ({
              ...module,
              lessons: module.lessons.map(lesson =>
                lesson.id === lessonId 
                  ? { ...lesson, status: 'selesai' as const }
                  : lesson
              )
            }))
          };
        });

        // Move to next lesson automatically
        const navigation = getLessonNavigation(courseData.modules, activeLesson);
        if (navigation.nextLesson && navigation.nextLesson.status !== 'terkunci') {
          setActiveLesson(navigation.nextLesson);
        }
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    } finally {
      setIsMarkingComplete(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height,8rem))] p-8 text-center bg-gray-50 dark:bg-neutral-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-purple mb-6"></div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-200">
          Memuat Kursus...
        </h1>
        <p className="text-gray-500 dark:text-neutral-400 mt-3">
          Sedang mengambil data kursus dari server.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height,8rem))] p-8 text-center bg-gray-50 dark:bg-neutral-900">
        <BookOpenIcon className="h-28 w-28 text-red-300 dark:text-red-700 mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-200">
          Kursus Tidak Ditemukan
        </h1>
        <p className="text-gray-500 dark:text-neutral-400 mt-3">
          {error}
        </p>
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => window.location.reload()}
            className="px-7 py-3 bg-gray-600 text-white font-semibold text-sm rounded-lg hover:bg-gray-700 transition-colors shadow-md"
          >
            Coba Lagi
          </button>
          <Link
            href="/courses"
            className="px-7 py-3 bg-brand-purple text-white font-semibold text-sm rounded-lg hover:bg-purple-700 transition-colors shadow-md"
          >
            Kembali ke Daftar Kursus
          </Link>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height,8rem))] p-8 text-center bg-gray-50 dark:bg-neutral-900">
        <BookOpenIcon className="h-28 w-28 text-gray-300 dark:text-neutral-700 mb-6 animate-pulse" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-200">
          Mencari Kursus...
        </h1>
        <p className="text-gray-500 dark:text-neutral-400 mt-3">
          Jika halaman tidak muncul, kursus dengan slug &quot;{slug}&quot; mungkin tidak ada.
        </p>
        <Link
          href="/courses"
          className="mt-8 px-7 py-3 bg-brand-purple text-white font-semibold text-sm rounded-lg hover:bg-purple-700 transition-colors shadow-md"
        >
          Kembali ke Daftar Kursus
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-neutral-900 text-text-light-primary dark:text-text-dark-primary">
      <CourseHeader course={courseData} testEnrollmentData={testEnrollmentData} />        <CourseTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasCertificate={courseData.hasCertificate ?? false}
          isEnrolled={effectiveEnrollmentData.isEnrolled}
          isCourseCompleted={isCourseCompleted}
        />

      <div className={layoutStyles.container}>
        <div className={layoutStyles.grid}>
          <div className={layoutStyles.contentArea}>
            {activeTab === "Overview" && (
              <div className={`${cardStyles.main} ${cardStyles.content} ${cardStyles.section}`}>
                <section id="description">
                  <h2 className={textStyles.heading.h2}>Deskripsi Lengkap Kursus</h2>
                  <article className="prose prose-base sm:prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                    {courseData.fullDescription}
                  </article>
                </section>

                <section id="what-you-will-learn" className="pt-8 border-t border-gray-200 dark:border-neutral-700/70">
                  <h3 className={textStyles.heading.h2}>Apa yang akan Anda Pelajari?</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {courseData.whatYouWillLearn?.map((obj: string, i: number) => (
                      <li key={i} className="flex items-start text-gray-700 dark:text-neutral-300 text-sm sm:text-base">
                        <CheckCircleIconSolid className="h-6 w-6 text-green-500 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {courseData.skillsYouWillGain && courseData.skillsYouWillGain.length > 0 && (
                  <section id="skills" className="pt-8 border-t border-gray-200 dark:border-neutral-700/70">
                    <h3 className={textStyles.heading.h3}>Keahlian yang Akan Anda Dapatkan</h3>
                    <div className="flex flex-wrap gap-2.5">
                      {courseData.skillsYouWillGain.map((skill) => (
                        <span key={skill} className="px-3.5 py-1.5 text-xs sm:text-sm font-medium bg-sky-100 text-sky-800 dark:bg-sky-700/40 dark:text-sky-200 rounded-full shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {courseData.toolsYouWillUse && courseData.toolsYouWillUse.length > 0 && (
                  <section id="tools" className="pt-8 border-t border-gray-200 dark:border-neutral-700/70">
                    <h3 className={textStyles.heading.h3}>Tools yang Akan Digunakan</h3>
                    <div className="flex flex-wrap gap-2.5">
                      {courseData.toolsYouWillUse.map((tool) => (
                        <span key={tool} className="px-3.5 py-1.5 text-xs sm:text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-700/40 dark:text-indigo-200 rounded-full flex items-center shadow-sm">
                          <SparklesIcon className="h-4 w-4 mr-1.5" />
                          {tool}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 pt-8 border-t border-gray-200 dark:border-neutral-700/70">
                  <section id="target-audience">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4 flex items-center">
                      <UsersIcon className="h-6 w-6 mr-2 text-blue-500" />
                      Untuk Siapa Kursus Ini?
                    </h3>
                    <ul className="space-y-2 text-gray-700 dark:text-neutral-300 text-sm">
                      {courseData.targetAudience?.map((aud: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <ChevronRightIcon className="h-5 w-5 text-blue-400 mr-1.5 mt-0.5 flex-shrink-0" />
                          {aud}
                        </li>
                      ))}
                    </ul>
                  </section>
                  
                  <section id="prerequisites">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4 flex items-center">
                      <ShieldCheckIcon className="h-6 w-6 mr-2 text-orange-500" />
                      Prasyarat Kursus
                    </h3>
                    <ul className="space-y-2 text-gray-700 dark:text-neutral-300 text-sm">
                      {courseData.prerequisites?.map((pre: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <ChevronRightIcon className="h-5 w-5 text-orange-400 mr-1.5 mt-0.5 flex-shrink-0" />
                          {pre}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                {/* Instructor Profile */}
                <section id="instructor-profile" className="pt-10 border-t border-gray-200 dark:border-neutral-700/70">
                  <h2 className={textStyles.heading.h2}>Tentang Pengajar</h2>
                  <div className="flex flex-col md:flex-row items-start gap-6 p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-neutral-800/50 dark:via-neutral-700/80 dark:to-neutral-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700">
                    {courseData.instructorAvatar && (
                      <SafeImage
                        src={courseData.instructorAvatar}
                        alt={courseData.instructorName}
                        width={150}
                        height={150}
                        className="rounded-full object-cover shadow-xl flex-shrink-0 border-4 border-white dark:border-neutral-600 mx-auto md:mx-0"
                      />
                    )}
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-bold text-brand-purple dark:text-purple-400">
                        {courseData.instructorName}
                      </h3>
                      {courseData.instructorTitle && (
                        <p className="text-sm font-medium text-gray-600 dark:text-neutral-400 mt-0.5">
                          {courseData.instructorTitle}
                        </p>
                      )}
                      <p className="text-sm text-gray-700 dark:text-neutral-300 mt-3 leading-relaxed">
                        {courseData.instructorBio}
                      </p>
                    </div>
                  </div>
                </section>

                {/* FAQ Section */}
                {courseData.faq && courseData.faq.length > 0 && (
                  <section id="faq" className="pt-10 border-t border-gray-200 dark:border-neutral-700/70">
                    <h2 className={textStyles.heading.h2}>Pertanyaan Umum (FAQ)</h2>
                    <div className="space-y-4">
                      {courseData.faq.map((item, index) => (
                        <div key={index} className="border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800/70 shadow-sm">
                          <details className="group">
                            <summary className="flex justify-between items-center p-4 font-medium cursor-pointer list-none hover:bg-gray-50 dark:hover:bg-neutral-700/50 rounded-t-lg">
                              <span className="text-gray-800 dark:text-neutral-100">{item.question}</span>
                            </summary>
                            <div className="p-4 border-t border-gray-200 dark:border-neutral-700 text-sm text-gray-600 dark:text-neutral-300 leading-relaxed">
                              {item.answer}
                            </div>
                          </details>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {activeTab === "Materi Pembelajaran" && (
              <div className="space-y-6">
                {/* Info banner for non-enrolled users */}
                {!effectiveEnrollmentData.isEnrolled && (
                  <div className="bg-gradient-to-r from-brand-purple/10 to-purple-600/10 dark:from-purple-900/20 dark:to-purple-800/20 border border-brand-purple/20 dark:border-purple-600/30 rounded-2xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <BookOpenIcon className="h-8 w-8 text-brand-purple dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-2">
                          Preview Kurikulum Kursus
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-neutral-300 mb-4">
                          Beberapa materi tersedia untuk preview. Daftar untuk mengakses semua konten lengkap, 
                          termasuk video pembelajaran, latihan, dan sertifikat kelulusan.
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-neutral-400">
                          <div className="flex items-center space-x-1">
                            <EyeIcon className="h-4 w-4 text-green-500" />
                            <span>Preview tersedia</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <LockClosedIcon className="h-4 w-4 text-gray-400" />
                            <span>Perlu daftar</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress banner for enrolled users */}
                {effectiveEnrollmentData.isEnrolled && effectiveEnrollmentData.userProgress > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <PlayCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-2">
                          Progress Pembelajaran Anda
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-neutral-300 mb-3">
                          Anda telah menyelesaikan {effectiveEnrollmentData.completedLessons.length} dari {courseData.totalLessons} pelajaran 
                          ({effectiveEnrollmentData.userProgress}% selesai)
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${effectiveEnrollmentData.userProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className={`${cardStyles.main} ${cardStyles.content} flex flex-col sm:flex-row justify-between items-start sm:items-center`}>
                  <h2 className={`${textStyles.heading.h2} mb-2 sm:mb-0`}>Kurikulum Kursus</h2>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-gray-600 dark:text-neutral-300">
                      {courseData.totalLessons} pelajaran
                    </p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      Total {courseData.totalDurationHours} jam estimasi
                    </p>
                  </div>
                </div>
                {courseData.modules.map((mod) => (
                  <ModuleAccordion
                    key={mod.id}
                    module={mod}
                    courseSlug={slug}
                    initialCollapsed={mod.isCollapsedInitially}
                    isEnrolled={effectiveEnrollmentData.isEnrolled}
                  />
                ))}
              </div>
            )}

            {activeTab === "Diskusi" && (
              <div className={`${cardStyles.main} ${cardStyles.content} space-y-8`}>
                <h2 className={textStyles.heading.h2}>Forum Diskusi Kursus</h2>
                
                <form onSubmit={handleCommentSubmit} className="mb-10 p-5 bg-gray-100 dark:bg-neutral-700/60 rounded-xl shadow-inner">
                  <label htmlFor="comment-input" className="block text-sm font-semibold text-gray-700 dark:text-neutral-200 mb-2">
                    Punya pertanyaan atau ingin berbagi?
                  </label>
                  <textarea
                    id="comment-input"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tulis pertanyaan atau komentar Anda di sini..."
                    rows={4}
                    className="w-full p-3.5 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 text-sm shadow-sm"
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-7 py-2.5 bg-brand-purple text-white font-semibold text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <PaperAirplaneIcon className="h-5 w-5 mr-2 transform -rotate-45" />
                      Kirim
                    </button>
                  </div>
                </form>

                <div className="space-y-8">
                  {(courseData.discussions?.length ?? 0) > 0 ? (
                    courseData.discussions?.map((comment: DiscussionComment) => (
                      <div key={comment.id} className="flex items-start space-x-4 p-1">
                        {comment.userAvatar ? (
                          <SafeImage
                            src={comment.userAvatar}
                            alt={comment.userName}
                            width={48}
                            height={48}
                            className="rounded-full object-cover flex-shrink-0 shadow-md border-2 border-white dark:border-neutral-600"
                          />
                        ) : (
                          <UserAvatarIcon className="h-12 w-12 text-gray-400 dark:text-neutral-500 flex-shrink-0 rounded-full bg-gray-200 dark:bg-neutral-700 p-1.5 border-2 border-white dark:border-neutral-600" />
                        )}
                        <div className="flex-1 bg-gray-50 dark:bg-neutral-700/60 p-4 rounded-xl shadow-md">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-semibold text-sm text-gray-800 dark:text-neutral-100">
                              {comment.userName}
                              {comment.userRole === "Pengajar" && (
                                <span className="ml-2 text-xs bg-brand-purple text-white px-2 py-0.5 rounded-full font-medium shadow-sm">
                                  Pengajar
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-neutral-400">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
                            {comment.text}
                          </p>
                          <div className="mt-3 flex items-center space-x-4">
                            <button className="flex items-center text-xs text-gray-500 dark:text-neutral-400 hover:text-brand-purple dark:hover:text-purple-400 transition-colors">
                              <HandThumbUpIcon className="h-4 w-4 mr-1" />
                              ({comment.likes || 0}) Suka
                            </button>
                            <button className="flex items-center text-xs text-gray-500 dark:text-neutral-400 hover:text-brand-purple dark:hover:text-purple-400 transition-colors">
                              <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4 mr-1" />
                              Balas
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <ChatBubbleLeftEllipsisIcon className="h-16 w-16 text-gray-300 dark:text-neutral-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-neutral-400">
                        Belum ada diskusi untuk kursus ini.
                      </p>
                      <p className="text-sm text-gray-400 dark:text-neutral-500 mt-1">
                        Jadilah yang pertama memulai diskusi atau bertanya!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "Tugas & Kuis" && (
              <div className={`${cardStyles.main} ${cardStyles.content} text-center min-h-[300px] flex flex-col justify-center items-center`}>
                <QuestionMarkCircleIcon className="h-20 w-20 text-gray-300 dark:text-neutral-600 mx-auto mb-5" />
                <h2 className={textStyles.heading.h2}>Tugas & Kuis</h2>
                <p className="text-gray-600 dark:text-neutral-400 mt-2 max-w-md mx-auto">
                  Segera hadir! Bagian ini akan menampilkan semua tugas dan kuis yang perlu Anda kerjakan.
                </p>
              </div>
            )}

            {activeTab === "Sertifikat" && (
              <div className={`${cardStyles.main} ${cardStyles.content} text-center min-h-[400px] flex flex-col justify-center items-center`}>
                <AcademicCapIcon className="h-20 w-20 text-brand-purple dark:text-purple-400 mx-auto mb-5" />
                <h2 className={textStyles.heading.h2}>Sertifikat Kelulusan</h2>
                {isCourseCompleted && courseData.hasCertificate && courseData.certificateUrl ? (
                  <>
                    <p className="text-gray-600 dark:text-neutral-300 mt-2 mb-8 max-w-md mx-auto">
                      Selamat! Anda telah berhasil menyelesaikan semua materi kursus ini. Anda berhak mendapatkan sertifikat kelulusan.
                    </p>
                    <Link
                      href={courseData.certificateUrl}
                      className={`group inline-flex items-center ${buttonStyles.success} text-base`}
                    >
                      <ArrowDownTrayIcon className="h-6 w-6 mr-2.5 transition-transform duration-200 group-hover:scale-110" />
                      Unduh Sertifikat Anda
                    </Link>
                  </>
                ) : courseData.hasCertificate ? (
                  <p className="text-gray-600 dark:text-neutral-400 mt-2 max-w-md mx-auto">
                    Selesaikan{" "}
                    <span className="font-semibold">{100 - (courseData.userProgress ?? 0)}%</span>{" "}
                    sisa materi kursus untuk membuka dan mengunduh sertifikat kelulusan Anda.
                  </p>
                ) : (
                  <p className="text-gray-600 dark:text-neutral-400 mt-2 max-w-md mx-auto">
                    Mohon maaf, kursus ini saat ini tidak menyediakan sertifikat kelulusan.
                  </p>
                )}
              </div>
            )}

            {/* Related Courses */}
            {courseData.relatedCourses && courseData.relatedCourses.length > 0 && (activeTab === "Overview" || isCourseCompleted) && (
              <section className="mt-12 pt-10 border-t border-gray-200 dark:border-neutral-700/70">
                <h2 className={textStyles.heading.h2}>Anda Mungkin Juga Tertarik Dengan</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                  {courseData.relatedCourses.slice(0, 2).map((related) => (
                    <Link
                      key={related.slug}
                      href={`/courses/${related.slug}`}
                      className={`group block ${cardStyles.main} p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                    >
                      <div className="relative w-full h-36 sm:h-40 rounded-lg overflow-hidden mb-3">
                        <SafeImage
                          src={related.thumbnailUrl || '/placeholder-course.jpg'}
                          alt={related.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-xs font-medium text-brand-purple dark:text-purple-400 mb-0.5 uppercase tracking-wider">
                        {related.category}
                      </span>
                      <h4 className="font-semibold text-md text-gray-800 dark:text-neutral-100 group-hover:text-brand-purple dark:group-hover:text-purple-300 line-clamp-2 transition-colors">
                        {related.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                        oleh {related.instructorName}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-xs">
                          <StarIconSolid className="h-4 w-4 text-yellow-400 mr-0.5" />
                          {related.rating?.toFixed(1)}
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                          {(related.price ?? 0) === 0 ? "Gratis" : `Rp${related.price?.toLocaleString("id-ID")}`}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className={layoutStyles.sidebarArea}>
            <CourseInfoSidebar
              courseData={courseData}
              isCourseCompleted={isCourseCompleted}
              testEnrollmentData={testEnrollmentData}
            />
          </aside>
        </div>
      </div>

      {/* Lesson Navigation */}
      {activeLesson && (
        <div className="flex justify-between items-center mt-12 border-t border-neutral-800 pt-8 px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => {
              const navigation = getLessonNavigation(courseData.modules, activeLesson);
              if (navigation.previousLesson) setActiveLesson(navigation.previousLesson);
            }}
            disabled={!getLessonNavigation(courseData.modules, activeLesson).previousLesson}
            className="px-7 py-3 bg-neutral-700 rounded-lg text-sm font-semibold hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <ChevronLeftIcon className="h-4 w-4"/> Pelajaran Sebelumnya
          </button>
          
          <div className="flex gap-3">
            {activeLesson.status !== 'selesai' && (
              <button 
                onClick={() => markLessonComplete(String(activeLesson.id))}
                disabled={isMarkingComplete}
                className="px-7 py-3 bg-green-600 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-green-500/30 disabled:opacity-50"
              >
                {isMarkingComplete ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircleIconSolid className="h-4 w-4"/> Tandai Selesai
                  </>
                )}
              </button>
            )}
            
            <button 
              onClick={() => {
                const navigation = getLessonNavigation(courseData.modules, activeLesson);
                if (navigation.nextLesson && navigation.nextLesson.status !== 'terkunci') {
                  setActiveLesson(navigation.nextLesson);
                }
              }}
              disabled={!getLessonNavigation(courseData.modules, activeLesson).nextLesson || getLessonNavigation(courseData.modules, activeLesson).nextLesson?.status === 'terkunci'}
              className="px-7 py-3 bg-brand-purple rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lanjutkan <ChevronRightIcon className="h-4 w-4"/>
            </button>
          </div>
        </div>
      )}

      {/* Development Test Panel */}
      <TestControlPanel 
        courseSlug={slug} 
        onEnrollmentChange={handleEnrollmentChange}
      />
      
      {/* Debug Console Utilities */}
      <DebugConsole courseSlug={slug} />
    </div>
  );
} 