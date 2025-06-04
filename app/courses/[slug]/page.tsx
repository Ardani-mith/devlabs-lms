// app/courses/[slug]/page.tsx
// (Pastikan path ini sesuai dengan struktur proyek Anda, misal: app/dashboard/courses/[slug]/page.tsx)

"use client";

import React, { useState, useEffect, use, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  StarIcon as StarIconSolid,
  PlayCircleIcon,
  LockClosedIcon,
  CheckCircleIcon as CheckCircleIconSolid,
  ClockIcon as ClockIconSolid,
  ChevronDownIcon,
  ChevronUpIcon,
  BookOpenIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ChatBubbleLeftEllipsisIcon,
  AcademicCapIcon,
  ArrowDownTrayIcon,
  PaperAirplaneIcon,
  UserCircleIcon as UserAvatarIcon,
  UsersIcon,
  InformationCircleIcon,
  ListBulletIcon,
  PresentationChartLineIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  LightBulbIcon,
  ShareIcon,
  HeartIcon,
  CurrencyDollarIcon,
  LanguageIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  AdjustmentsHorizontalIcon,
  ChevronRightIcon,
  TagIcon,
  PlusIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/solid';
import {
    CheckCircleIcon as CheckCircleIconOutline,
    ClockIcon as ClockIconOutline,
    LockClosedIcon as LockClosedIconOutline,
    NoSymbolIcon,
    ChatBubbleOvalLeftEllipsisIcon,
} from '@heroicons/react/24/outline';

// --- Data Types (Interfaces) ---
interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'bacaan' | 'kuis' | 'tugas' | 'interaktif';
  durationMinutes?: number;
  status: 'selesai' | 'terkunci' | 'sedang_dipelajari' | 'selanjutnya';
  url: string;
  isPreviewable?: boolean;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  isCollapsedInitially?: boolean;
}

interface DiscussionReply {
    id: string;
    userName: string;
    userAvatar?: string;
    userRole: 'Siswa' | 'Pengajar';
    timestamp: string;
    text: string;
    likes?: number;
}

interface DiscussionComment {
  id: string;
  userName: string;
  userAvatar?: string;
  userRole: 'Siswa' | 'Pengajar';
  timestamp: string;
  text: string;
  replies?: DiscussionReply[];
  likes?: number;
}

interface CourseDetail {
  slug: string;
  title: string;
  tagline?: string;
  instructorName: string;
  instructorAvatar?: string;
  instructorBio?: string;
  instructorTitle?: string;
  instructorCoursesCount?: number;
  instructorStudentsCount?: number;
  instructorRating?: number;
  thumbnailUrl: string;
  bannerUrl?: string;
  rating: number;
  reviewCount: number;
  studentCount: number;
  userProgress: number;
  isEnrolled: boolean;
  lastAccessedLessonUrl?: string;
  lastAccessedLessonTitle?: string;
  price?: number;
  originalPrice?: number;
  fullDescription: string;
  whatYouWillLearn: string[];
  targetAudience: string[];
  prerequisites: string[];
  skillsYouWillGain?: string[];
  toolsYouWillUse?: string[];
  language: string;
  totalLessons: number;
  totalVideoHours?: number;
  totalDurationHours: number;
  hasCertificate: boolean;
  category: string;
  level: "Pemula" | "Menengah" | "Lanjutan" | "Semua Level";
  updatedAt: string;
  modules: Module[];
  discussions: DiscussionComment[];
  faq?: { question: string; answer: string }[];
  certificateUrl?: string;
  relatedCourses?: Pick<CourseDetail, 'slug' | 'title' | 'thumbnailUrl' | 'instructorName' | 'rating' | 'category' | 'price'>[];
}

// --- Placeholder Data (Array) ---
const DUMMY_COURSES_DATABASE: CourseDetail[] = [
  {
    slug: "ultimate-web-development-bootcamp-2025",
    title: "Ultimate Web Development Bootcamp 2025",
    tagline: "Menjadi Full-Stack Developer Profesional dari Nol hingga Mahir dalam 12 Minggu!",
    instructorName: "Budi Santoso, M.Kom.",
    instructorAvatar: "https://i.pinimg.com/736x/f4/d3/ca/f4d3ca27e01d6bd08bc1980bdae30b73.jpg",
    instructorTitle: "Lead Web Instructor & Software Architect",
    instructorBio: "Full-stack developer dan instruktur dengan 10+ tahun pengalaman membangun aplikasi web skala besar dan membimbing ribuan siswa. Keahlian utama React, Node.js, dan arsitektur cloud.",
    instructorCoursesCount: 15,
    instructorStudentsCount: 12500,
    instructorRating: 4.9,
    thumbnailUrl: "https://i.pinimg.com/736x/be/23/ef/be23ef97f834d42f46a6c23f73c09934.jpg",
    bannerUrl: "https://i.pinimg.com/736x/5d/a2/63/5da263d41684a1c05ae2ce741f599cee.jpg",
    rating: 4.8,
    reviewCount: 1850,
    studentCount: 12750,
    userProgress: 35,
    isEnrolled: true,
    lastAccessedLessonUrl: "#m2-web/l2-1-web",
    lastAccessedLessonTitle: "Dasar-Dasar CSS3",
    price: 750000,
    originalPrice: 1000000,
    fullDescription: "Kursus komprehensif ini dirancang untuk membawa Anda dari pemula absolut menjadi seorang full-stack web developer yang siap kerja...\n\n**Proyek Utama:** Anda akan membangun aplikasi e-commerce fully-functional dengan fitur admin, payment gateway, dan deployment ke cloud.",
    whatYouWillLearn: [
      "Membangun aplikasi web interaktif dengan React, Next.js, dan TypeScript.",
      "Mengembangkan API backend yang robust dengan Node.js, Express.",
      "Merancang dan mengelola database SQL (PostgreSQL) dan NoSQL (MongoDB).",
      "Menerapkan autentikasi, otorisasi, dan keamanan web.",
    ],
    targetAudience: ["Pemula yang ingin berkarir sebagai Web Developer.", "Desainer yang ingin menguasai Frontend Development."],
    prerequisites: ["Tidak ada prasyarat coding. Hanya kemauan belajar!", "Komputer (Windows/Mac/Linux) & Internet."],
    skillsYouWillGain: ["HTML5", "CSS3", "JavaScript ESNext", "React", "Next.js", "Node.js"],
    toolsYouWillUse: ["VS Code", "Git", "GitHub", "Postman", "Vercel"],
    language: "Bahasa Indonesia",
    totalLessons: 150,
    totalVideoHours: 40,
    totalDurationHours: 85,
    hasCertificate: true,
    category: "Pengembangan Web",
    level: "Semua Level",
    updatedAt: "2025-05-20",
    modules: [
      {
        id: "m1-web", title: "Modul 1: Fondasi Web & HTML Esensial", description: "Memahami cara kerja web dan membangun struktur halaman.", isCollapsedInitially: false, lessons: [
          { id: "l1-1-web", title: "Selamat Datang & Pengenalan Ekosistem Kursus", type: "video", durationMinutes: 7, status: "selesai", url: "#", isPreviewable: true },
          { id: "l1-2-web", title: "Struktur Dasar HTML5 dan Semantic Tags", type: "video", durationMinutes: 18, status: "selesai", url: "#" },
        ]
      },
      {
        id: "m2-web", title: "Modul 2: Styling Modern dengan CSS3 & JavaScript Fundamental", description: "Mempercantik halaman dan menambahkan interaktivitas dasar.", isCollapsedInitially: true, lessons: [
          { id: "l2-1-web", title: "Dasar-Dasar CSS3: Selector, Properti, Box Model", type: "video", durationMinutes: 28, status: "sedang_dipelajari", url: "#m2-web/l2-1-web" },
        ]
      },
    ],
    discussions: [
        { id: "d1-web", userName: "Ani Lestari", userAvatar: "https://i.pinimg.com/736x/46/d8/dd/46d8dd0b665770c3a0b1d161571f5f93.jpg", userRole: "Siswa", timestamp: "2 hari lalu", text: "Apakah ada rekomendasi editor teks?", likes: 5, replies: [
          { id: "d1r1-web", userName: "Budi Santoso, M.Kom.", userAvatar: "https://i.pinimg.com/736x/f4/d3/ca/f4d3ca27e01d6bd08bc1980bdae30b73.jpg", userRole: "Pengajar", timestamp: "1 hari lalu", text: "VS Code sangat populer.", likes: 10 }
        ]},
    ],
    faq: [ {question: "Cocok untuk pemula?", answer: "Ya, sangat cocok!"} ],
    certificateUrl: "/courses/certificates/ultimate-web-development-bootcamp-2025",
    relatedCourses: [
      { slug: "data-science-machine-learning-python", title: "Data Science & Machine Learning", thumbnailUrl: "https://i.pinimg.com/736x/ec/9e/fa/ec9efafdd84f5a8a71e65d9cd3da935e.jpg", instructorName: "Dr. Arini Kusuma", rating: 4.9, category: "Data Science", price: 850000 },
    ],
  },
  {
    slug: "data-science-machine-learning-python",
    title: "Data Science & Machine Learning Mastery dengan Python",
    tagline: "Dari Analisis Data hingga Implementasi Model Machine Learning Canggih.",
    instructorName: "Dr. Arini Kusuma, Ph.D.",
    instructorAvatar: "https://i.pinimg.com/736x/30/ce/7b/30ce7b1af10a76e967c010ead2b62c5a.jpg",
    instructorTitle: "Data Scientist & AI Researcher",
    instructorBio: "Seorang data scientist berpengalaman dengan Ph.D. di bidang AI.",
    instructorCoursesCount: 8,
    instructorStudentsCount: 5200,
    instructorRating: 4.9,
    thumbnailUrl: "https://i.pinimg.com/736x/ec/9e/fa/ec9efafdd84f5a8a71e65d9cd3da935e.jpg",
    bannerUrl: "https://i.pinimg.com/originals/8f/9b/c8/8f9bc89b95f2c2079c69aa4f9dfc6b8c.jpg",
    rating: 4.9,
    reviewCount: 1230,
    studentCount: 8750,
    userProgress: 0,
    isEnrolled: false,
    price: 850000,
    originalPrice: 1250000,
    fullDescription: "Dalam kursus ini, Anda akan menguasai konsep fundamental data science...",
    whatYouWillLearn: ["Memahami alur kerja proyek data science...", /* ... */],
    targetAudience: ["Mahasiswa/Profesional yang ingin berkarir...", /* ... */],
    prerequisites: ["Pemahaman dasar logika pemrograman...", /* ... */],
    skillsYouWillGain: ["Data Analysis", "Data Visualization", "Machine Learning"],
    toolsYouWillUse: ["Python", "Jupyter Notebook", "Pandas"],
    language: "Bahasa Indonesia",
    totalLessons: 120,
    totalVideoHours: 35,
    totalDurationHours: 75,
    hasCertificate: true,
    category: "Data Science",
    level: "Menengah",
    updatedAt: "2025-04-10",
    modules: [
      { id: "ds-m1", title: "Modul 1 (DS): Pengenalan Data Science", description: "Dasar-dasar.", isCollapsedInitially: false, lessons: [/* ... */] },
    ],
    discussions: [/* ... */],
    faq: [/* ... */],
    certificateUrl: "/courses/certificates/data-science-machine-learning-python",
    relatedCourses: [/* ... */],
  },
];

// --- Sub-Komponen ---

const CourseHeader = ({ course }: { course: CourseDetail }) => (
  <div className="relative text-white pt-10 pb-8 md:pt-16 md:pb-12 px-4 sm:px-6 lg:px-8 shadow-2xl overflow-hidden">
    <div className="absolute inset-0">
        <Image
          src={course.bannerUrl || course.thumbnailUrl}
          alt={`${course.title} banner`}
          fill // Menggantikan layout="fill"
          sizes="100vw" // Memberikan hint ke browser tentang ukuran gambar relatif terhadap viewport
          className="object-cover opacity-40 dark:opacity-30 blur-sm scale-110" // object-cover dari Tailwind
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent dark:from-black dark:via-black/80"></div>
    </div>
    <div className="relative max-w-5xl mx-auto z-10">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple dark:text-purple-400 mb-2 bg-white/10 dark:bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md inline-block">{course.category} - {course.level}</p>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 text-shadow-md">{course.title}</h1>
      {course.tagline && <p className="text-lg sm:text-xl text-neutral-200 dark:text-neutral-300 mb-5 max-w-3xl">{course.tagline}</p>}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 text-sm text-neutral-200 dark:text-neutral-300">
        <div className="flex items-center">
          {course.instructorAvatar ? (
            <Image src={course.instructorAvatar} alt={course.instructorName} width={36} height={36} className="rounded-full mr-2.5 border-2 border-neutral-500 object-cover"/>
          ) : (
            <UserAvatarIcon className="h-9 w-9 text-neutral-400 mr-2.5"/>
          )}
          <span>Diajarkan oleh <Link href="#" className="font-semibold hover:underline text-white">{course.instructorName}</Link></span>
        </div>
        <div className="flex items-center">
          <StarIconSolid className="h-5 w-5 text-yellow-400 mr-1" />
          <span className="font-semibold text-white">{course.rating.toFixed(1)}</span>
          <span className="ml-1 text-neutral-300">({course.reviewCount.toLocaleString()} ulasan)</span>
        </div>
        <div className="flex items-center">
          <UsersIcon className="h-5 w-5 text-neutral-300 mr-1" />
          <span className="text-neutral-200">{course.studentCount.toLocaleString()} siswa terdaftar</span>
        </div>
      </div>
      {course.isEnrolled && (
        <div className="mb-7 max-w-md">
          <div className="flex justify-between items-center text-xs text-neutral-200 mb-1">
            <span>Progres Belajar Anda</span>
            <span className="font-semibold">{course.userProgress}%</span>
          </div>
          <div className="w-full bg-white/20 dark:bg-black/30 rounded-full h-3 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-brand-purple h-3 rounded-full transition-all duration-500 ease-out" style={{ width: `${course.userProgress}%` }}></div>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {course.isEnrolled ? (
          <Link href={course.lastAccessedLessonUrl || "#"} className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 border-2 border-transparent text-base font-semibold rounded-lg text-white bg-brand-purple hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50">
            <PlayCircleIcon className="h-6 w-6 mr-2.5" />
            {course.userProgress > 0 ? 'Lanjutkan Belajar' : 'Mulai Belajar Sekarang'}
          </Link>
        ) : (
          <button className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 border-2 border-transparent text-base font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50">
            <CurrencyDollarIcon className="h-6 w-6 mr-2.5" />
            Daftar Kursus (Rp{course.price?.toLocaleString('id-ID') || 'N/A'})
            {course.originalPrice && <span className="ml-2 line-through text-sm opacity-80">Rp{course.originalPrice.toLocaleString('id-ID')}</span>}
          </button>
        )}
        <button className="w-full sm:w-auto flex items-center justify-center px-6 py-3.5 border-2 border-neutral-500/70 text-base font-medium rounded-lg text-white hover:bg-white/10 dark:hover:bg-black/20 transition-colors focus:outline-none focus:ring-4 focus:ring-neutral-500/50">
            <HeartIcon className="h-5 w-5 mr-2"/> Simpan ke Wishlist
        </button>
      </div>
      <p className="text-xs text-neutral-300 dark:text-neutral-400 mt-5">Terakhir diperbarui: {new Date(course.updatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })} • Bahasa: {course.language}</p>
    </div>
  </div>
);

const CourseTabs = ({ activeTab, setActiveTab, hasCertificate, isEnrolled, isCourseCompleted }: { activeTab: string; setActiveTab: (tab: string) => void; hasCertificate: boolean; isEnrolled: boolean; isCourseCompleted: boolean; }) => {
    const baseTabs = ["Overview", "Materi Pembelajaran"];
    if (isEnrolled) { baseTabs.push("Diskusi", "Tugas & Kuis"); }
    if (isEnrolled && hasCertificate) { baseTabs.push("Sertifikat"); }

    return (
        <div className="border-b border-gray-200 dark:border-neutral-700/80 sticky top-[var(--header-height,4rem)] z-20 bg-gray-50/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-sm">
            <nav className="-mb-px flex space-x-5 sm:space-x-8 px-4 sm:px-6 lg:px-8 overflow-x-auto" aria-label="Tabs">
                {baseTabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        disabled={tab === "Sertifikat" && !isCourseCompleted && hasCertificate}
                        className={`whitespace-nowrap py-4 px-1.5 border-b-2 font-semibold text-sm transition-all duration-200 focus:outline-none
                        ${activeTab === tab
                            ? 'border-brand-purple text-brand-purple dark:border-purple-400 dark:text-purple-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:border-neutral-600'
                        }
                        ${tab === "Sertifikat" && !isCourseCompleted && hasCertificate ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
        </div>
    );
};

const LessonItem = ({ lesson, courseSlug }: { lesson: Lesson; courseSlug: string }) => {
    let IconComponent;
    let statusColor = "";
    let StatusIconComponent;

    switch (lesson.type) {
        case 'video': IconComponent = VideoCameraIcon; break;
        case 'bacaan': IconComponent = DocumentTextIcon; break;
        case 'kuis': IconComponent = QuestionMarkCircleIcon; break;
        case 'tugas': IconComponent = PresentationChartLineIcon; break;
        case 'interaktif': IconComponent = SparklesIcon; break;
        default: IconComponent = BookOpenIcon;
    }

    switch (lesson.status) {
        case 'selesai': statusColor = "text-green-500 dark:text-green-400"; StatusIconComponent = CheckCircleIconSolid; break;
        case 'sedang_dipelajari': statusColor = "text-blue-500 dark:text-blue-400"; StatusIconComponent = PlayCircleIcon; break;
        case 'selanjutnya': statusColor = "text-gray-500 dark:text-neutral-400"; StatusIconComponent = ClockIconOutline; break;
        case 'terkunci': statusColor = "text-gray-400 dark:text-neutral-500"; StatusIconComponent = LockClosedIcon; break;
    }
    const lessonLink = lesson.status !== 'terkunci' ? (lesson.url.startsWith("#") ? `#${courseSlug}${lesson.url}` : lesson.url) : '#';

    return (
        <Link href={lessonLink}
            className={`group flex items-center justify-between p-4 rounded-lg transition-all duration-200
            ${lesson.status === 'terkunci' ? 'opacity-70 cursor-not-allowed bg-gray-100 dark:bg-neutral-800/60' : 'hover:bg-gray-100 dark:hover:bg-neutral-700/70 cursor-pointer'}
            ${lesson.status === 'sedang_dipelajari' ? 'bg-blue-50 dark:bg-blue-900/40 border-l-4 border-blue-500 shadow-sm' : ''}
            ${lesson.status === 'selesai' ? 'bg-green-50 dark:bg-green-900/30 opacity-80 hover:opacity-100' : ''}
            `}
        >
            <div className="flex items-center min-w-0">
                <IconComponent className={`h-5 w-5 mr-3.5 flex-shrink-0 ${lesson.status === 'terkunci' ? 'text-gray-400 dark:text-neutral-600' : 'text-brand-purple dark:text-purple-400'}`} />
                <span className={`text-sm font-medium truncate ${lesson.status === 'terkunci' ? 'text-gray-500 dark:text-neutral-500' : 'text-gray-800 dark:text-neutral-100'}`}>{lesson.title}</span>
                {lesson.isPreviewable && lesson.status === 'terkunci' && (
                    <span className="ml-2.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-700/40 dark:text-blue-300 px-2 py-0.5 rounded-full font-semibold">PREVIEW</span>
                )}
            </div>
            <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
                {lesson.durationMinutes && <span className="text-xs text-gray-500 dark:text-neutral-400">{lesson.durationMinutes} mnt</span>}
                {StatusIconComponent && <StatusIconComponent className={`h-5 w-5 ${statusColor}`} />}
            </div>
        </Link>
    );
};

const ModuleAccordion = ({ module: currentModule, courseSlug, initialCollapsed = true }: { module: Module; courseSlug: string; initialCollapsed?: boolean; }) => {
    const [isOpen, setIsOpen] = useState(!initialCollapsed);

    return (
        <div className="border border-gray-200 dark:border-neutral-700/80 rounded-xl overflow-hidden shadow-lg bg-white dark:bg-neutral-800/90 mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-5 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
                aria-expanded={isOpen}
                aria-controls={`module-content-${currentModule.id}`}
            >
                <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-100">{currentModule.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                        {currentModule.lessons.length} materi
                        {currentModule.description && ` • ${currentModule.description}`}
                    </p>
                </div>
                <ChevronDownIcon className={`h-6 w-6 text-gray-500 dark:text-neutral-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div id={`module-content-${currentModule.id}`} className="p-2 sm:p-3 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700/80">
                    <ul className="space-y-2">
                        {currentModule.lessons.map(lesson => <LessonItem key={lesson.id} lesson={lesson} courseSlug={courseSlug} />)}
                    </ul>
                </div>
            )}
        </div>
    );
};

const CourseInfoSidebar = ({ courseData, isCourseCompleted }: { courseData: CourseDetail; isCourseCompleted: boolean; }) => (
    <div className="sticky top-[calc(var(--header-height,4rem)+2rem)] space-y-6">
        <div className="bg-white dark:bg-neutral-800/90 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700/70">
            <h3 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-5">Tentang Kursus Ini</h3>
            <div className="space-y-3.5 text-sm">
                <div className="flex items-center text-gray-700 dark:text-neutral-300">
                    <ListBulletIcon className="h-5 w-5 mr-3 text-brand-purple dark:text-purple-400 flex-shrink-0"/>
                    <span className="font-medium">{courseData.totalLessons}</span><span className="ml-1">total pelajaran</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-neutral-300">
                    <ClockIconSolid className="h-5 w-5 mr-3 text-brand-purple dark:text-purple-400 flex-shrink-0"/>
                    <span className="font-medium">{courseData.totalDurationHours}</span><span className="ml-1">jam estimasi belajar</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-neutral-300">
                    <AdjustmentsHorizontalIcon className="h-5 w-5 mr-3 text-brand-purple dark:text-purple-400 flex-shrink-0"/>
                    <span>Level <span className="font-medium">{courseData.level}</span></span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-neutral-300">
                    <AcademicCapIcon className="h-5 w-5 mr-3 text-brand-purple dark:text-purple-400 flex-shrink-0"/>
                    <span>{courseData.hasCertificate ? "Sertifikat Kelulusan Tersedia" : "Tidak ada sertifikat"}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-neutral-300">
                    <LanguageIcon className="h-5 w-5 mr-3 text-brand-purple dark:text-purple-400 flex-shrink-0"/>
                    <span>Bahasa <span className="font-medium">{courseData.language}</span></span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-neutral-300">
                    <CalendarDaysIcon className="h-5 w-5 mr-3 text-brand-purple dark:text-purple-400 flex-shrink-0"/>
                    <span>Update: <span className="font-medium">{new Date(courseData.updatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</span></span>
                </div>
            </div>
        </div>

        {courseData.isEnrolled && (
            <div className="bg-white dark:bg-neutral-800/90 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700/70">
                <h3 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-4">Progres Belajar Anda</h3>
                <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-3 mb-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-brand-purple h-3 rounded-full transition-all duration-500 ease-out" style={{ width: `${courseData.userProgress}%` }}></div>
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-neutral-200 mb-4 text-right">{courseData.userProgress}% Selesai</p>
                
                {courseData.lastAccessedLessonTitle && courseData.userProgress < 100 && (
                    <Link href={courseData.lastAccessedLessonUrl || "#"} className="w-full group flex items-center justify-center px-5 py-3 bg-brand-purple text-white font-semibold text-sm rounded-lg hover:bg-purple-700 dark:hover:bg-purple-500 transition-colors transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800">
                        <PlayCircleIcon className="h-5 w-5 mr-2 transition-transform duration-200 group-hover:scale-110"/>
                        Lanjutkan: {courseData.lastAccessedLessonTitle.length > 20 ? courseData.lastAccessedLessonTitle.substring(0,20) + "..." : courseData.lastAccessedLessonTitle}
                    </Link>
                )}
                {isCourseCompleted && courseData.certificateUrl && (
                    <Link href={courseData.certificateUrl} className="w-full group flex items-center justify-center px-5 py-3 bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-700 transition-colors shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800">
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2 transition-transform duration-200 group-hover:scale-110"/> Unduh Sertifikat Anda
                    </Link>
                )}
                 {!isCourseCompleted && courseData.isEnrolled && (
                    <p className="text-xs text-center text-gray-500 dark:text-neutral-400 mt-3">
                        Selesaikan kursus untuk mendapatkan sertifikat.
                    </p>
                )}
            </div>
        )}
        {!courseData.isEnrolled && courseData.price !== undefined && (
            <div className="bg-white dark:bg-neutral-800/90 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700/70 space-y-3">
                 <div className="text-center">
                    {typeof courseData.price === 'number' ? (
                        <>
                            <p className="text-3xl font-bold text-brand-purple dark:text-purple-400">Rp{courseData.price.toLocaleString('id-ID')}</p>
                            {courseData.originalPrice && courseData.originalPrice > courseData.price && (
                                <span className="text-sm line-through text-gray-500 dark:text-neutral-400 ml-1.5">Rp{courseData.originalPrice.toLocaleString('id-ID')}</span>
                            )}
                        </>
                    ) : (
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">GRATIS</p>
                    )}
                </div>
                <button className="w-full flex items-center justify-center px-8 py-3 border-2 border-transparent text-base font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50">
                    <CurrencyDollarIcon className="h-6 w-6 mr-2.5" />
                    Daftar Kursus Sekarang
                </button>
                <button className="w-full flex items-center justify-center px-6 py-3 border-2 border-neutral-300 dark:border-neutral-600 text-base font-medium rounded-lg text-gray-700 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-700/50 transition-colors focus:outline-none focus:ring-4 focus:ring-neutral-400/50">
                    <HeartIcon className="h-5 w-5 mr-2"/> Tambah ke Wishlist
                </button>
            </div>
        )}
    </div>
  );


// --- Halaman Utama ---
export default function CourseDetailPage({ params: paramsFromProps }: { params: { slug: string } }) {
  const resolvedParams = use(paramsFromProps as any);
  const slug = resolvedParams.slug; // Menggunakan variabel `slug` yang sudah di-resolve

  const [courseData, setCourseData] = useState<CourseDetail | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const currentCourse = DUMMY_COURSES_DATABASE.find(course => course.slug === slug);
    if (currentCourse) {
      setCourseData(currentCourse);
    } else {
      setCourseData(null);
    }
  }, [slug]); // Menggunakan `slug` yang sudah di-resolve sebagai dependency

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !courseData) return;
    const comment: DiscussionComment = {
        id: `d${Date.now()}`,
        userName: "Siswa Saat Ini",
        userAvatar: "https://i.pinimg.com/736x/2b/66/82/2b6682ae78887e547674953f993c5756.jpg",
        userRole: "Siswa",
        timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + " " + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit'}),
        text: newComment,
        likes: 0,
        replies: []
    };
    setCourseData(prev => prev ? ({ ...prev, discussions: [comment, ...prev.discussions] }) : null);
    setNewComment("");
  }

  if (!courseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height,8rem))] p-8 text-center bg-gray-50 dark:bg-neutral-900">
        <BookOpenIcon className="h-28 w-28 text-gray-300 dark:text-neutral-700 mb-6 animate-pulse" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-neutral-200">Mencari Kursus...</h1>
        {/* Menggunakan `slug` yang sudah di-resolve */}
        <p className="text-gray-500 dark:text-neutral-400 mt-3">Jika halaman tidak muncul, kursus dengan slug "{slug}" mungkin tidak ada.</p>
        <Link href="/courses" className="mt-8 px-7 py-3 bg-brand-purple text-white font-semibold text-sm rounded-lg hover:bg-purple-700 transition-colors shadow-md">
          Kembali ke Daftar Kursus
        </Link>
      </div>
    );
  }

  const isCourseCompleted = courseData.userProgress === 100;

  return (
    <div className="bg-gray-50 dark:bg-neutral-900 text-text-light-primary dark:text-text-dark-primary">
      <CourseHeader course={courseData} />
      <CourseTabs activeTab={activeTab} setActiveTab={setActiveTab} hasCertificate={courseData.hasCertificate} isEnrolled={courseData.isEnrolled} isCourseCompleted={isCourseCompleted} />

      <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12 items-start">
          <div className="lg:col-span-8 xl:col-span-8 min-w-0 space-y-8 mb-8 lg:mb-0"> {/* Konten Utama */}
            {activeTab === "Overview" && (
              <div className="bg-white dark:bg-neutral-800/90 p-6 sm:p-8 rounded-2xl shadow-xl space-y-10 border border-gray-200 dark:border-neutral-700/70">
                <section id="description">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-5">Deskripsi Lengkap Kursus</h2>
                  <article className="prose prose-base sm:prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                    {courseData.fullDescription}
                  </article>
                </section>

                <section id="what-you-will-learn" className="pt-8 border-t border-gray-200 dark:border-neutral-700/70">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-6">Apa yang akan Anda Pelajari?</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {courseData.whatYouWillLearn.map((obj, i) => (
                        <li key={i} className="flex items-start text-gray-700 dark:text-neutral-300 text-sm sm:text-base">
                            <CheckCircleIconSolid className="h-6 w-6 text-green-500 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0"/>
                            <span>{obj}</span>
                        </li>
                    ))}
                  </ul>
                </section>
                
                {courseData.skillsYouWillGain && courseData.skillsYouWillGain.length > 0 && (
                    <section id="skills" className="pt-8 border-t border-gray-200 dark:border-neutral-700/70">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4">Keahlian yang Akan Anda Dapatkan</h3>
                        <div className="flex flex-wrap gap-2.5">
                            {courseData.skillsYouWillGain.map(skill => (
                                <span key={skill} className="px-3.5 py-1.5 text-xs sm:text-sm font-medium bg-sky-100 text-sky-800 dark:bg-sky-700/40 dark:text-sky-200 rounded-full shadow-sm">{skill}</span>
                            ))}
                        </div>
                    </section>
                )}

                {courseData.toolsYouWillUse && courseData.toolsYouWillUse.length > 0 && (
                    <section id="tools" className="pt-8 border-t border-gray-200 dark:border-neutral-700/70">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4">Tools yang Akan Digunakan</h3>
                         <div className="flex flex-wrap gap-2.5">
                            {courseData.toolsYouWillUse.map(tool => (
                                <span key={tool} className="px-3.5 py-1.5 text-xs sm:text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-700/40 dark:text-indigo-200 rounded-full flex items-center shadow-sm"><SparklesIcon className="h-4 w-4 mr-1.5"/>{tool}</span>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 pt-8 border-t border-gray-200 dark:border-neutral-700/70">
                    <section id="target-audience">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4 flex items-center"><UsersIcon className="h-6 w-6 mr-2 text-blue-500"/>Untuk Siapa Kursus Ini?</h3>
                        <ul className="space-y-2 text-gray-700 dark:text-neutral-300 text-sm">
                            {courseData.targetAudience.map((aud, i) => <li key={i} className="flex items-start"><ChevronRightIcon className="h-5 w-5 text-blue-400 mr-1.5 mt-0.5 flex-shrink-0"/>{aud}</li>)}
                        </ul>
                    </section>
                    <section id="prerequisites">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4 flex items-center"><ShieldCheckIcon className="h-6 w-6 mr-2 text-orange-500"/>Prasyarat Kursus</h3>
                        <ul className="space-y-2 text-gray-700 dark:text-neutral-300 text-sm">
                            {courseData.prerequisites.map((pre, i) => <li key={i} className="flex items-start"><ChevronRightIcon className="h-5 w-5 text-orange-400 mr-1.5 mt-0.5 flex-shrink-0"/>{pre}</li>)}
                        </ul>
                    </section>
                </div>
                <section id="instructor-profile" className="pt-10 border-t border-gray-200 dark:border-neutral-700/70">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-6">Tentang Pengajar</h2>
                    <div className="flex flex-col md:flex-row items-start gap-6 p-6 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-neutral-800/50 dark:via-neutral-700/80 dark:to-neutral-800/50 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700">
                        {courseData.instructorAvatar && <Image src={courseData.instructorAvatar} alt={courseData.instructorName} width={150} height={150} className="rounded-full object-cover shadow-xl flex-shrink-0 border-4 border-white dark:border-neutral-600 mx-auto md:mx-0"/>}
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-bold text-brand-purple dark:text-purple-400">{courseData.instructorName}</h3>
                            {courseData.instructorTitle && <p className="text-sm font-medium text-gray-600 dark:text-neutral-400 mt-0.5">{courseData.instructorTitle}</p>}
                            <p className="text-sm text-gray-700 dark:text-neutral-300 mt-3 leading-relaxed">{courseData.instructorBio}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mt-5 text-sm text-gray-600 dark:text-neutral-300">
                                {courseData.instructorRating && <span className="flex items-center font-medium"><StarIconSolid className="h-5 w-5 inline mr-1.5 text-yellow-400"/>{courseData.instructorRating.toFixed(1)} Rating Pengajar</span>}
                                {courseData.instructorCoursesCount && <span className="flex items-center font-medium"><BookOpenIcon className="h-5 w-5 inline mr-1.5 text-gray-500"/>{courseData.instructorCoursesCount} Kursus</span>}
                                {courseData.instructorStudentsCount && <span className="flex items-center font-medium"><UsersIcon className="h-5 w-5 inline mr-1.5 text-gray-500"/>{courseData.instructorStudentsCount.toLocaleString()} Siswa</span>}
                            </div>
                            <Link href="#" className="inline-block mt-5 text-sm font-semibold text-brand-purple dark:text-purple-400 hover:underline">
                                Lihat Profil Lengkap & Kursus Lainnya <ChevronRightIcon className="h-4 w-4 inline"/>
                            </Link>
                        </div>
                    </div>
                </section>

                {courseData.faq && courseData.faq.length > 0 && (
                    <section id="faq" className="pt-10 border-t border-gray-200 dark:border-neutral-700/70">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-6">Pertanyaan Umum (FAQ)</h2>
                        <div className="space-y-4">
                            {courseData.faq.map((item, index) => (
                                <div key={index} className="border border-gray-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800/70 shadow-sm">
                                    <details className="group">
                                        <summary className="flex justify-between items-center p-4 font-medium cursor-pointer list-none hover:bg-gray-50 dark:hover:bg-neutral-700/50 rounded-t-lg">
                                            <span className="text-gray-800 dark:text-neutral-100">{item.question}</span>
                                            <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-neutral-400 transform transition-transform duration-200 group-open:rotate-180" />
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white dark:bg-neutral-800/90 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700/70">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-2 sm:mb-0">Kurikulum Kursus</h2>
                    <div className="text-right flex-shrink-0">
                        <p className="text-sm text-gray-600 dark:text-neutral-300">{courseData.totalLessons} pelajaran</p>
                        <p className="text-xs text-gray-500 dark:text-neutral-400">Total {courseData.totalDurationHours} jam estimasi</p>
                    </div>
                </div>
                {courseData.modules.map((mod) => <ModuleAccordion key={mod.id} module={mod} courseSlug={slug} initialCollapsed={mod.isCollapsedInitially} />)}
              </div>
            )}
            {activeTab === "Diskusi" && (
                <div className="bg-white dark:bg-neutral-800/90 p-6 sm:p-8 rounded-2xl shadow-xl space-y-8 border border-gray-200 dark:border-neutral-700/70">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100">Forum Diskusi Kursus</h2>
                    <form onSubmit={handleCommentSubmit} className="mb-10 p-5 bg-gray-100 dark:bg-neutral-700/60 rounded-xl shadow-inner">
                      <label htmlFor="comment-input" className="block text-sm font-semibold text-gray-700 dark:text-neutral-200 mb-2">Punya pertanyaan atau ingin berbagi?</label>
                      <textarea
                        id="comment-input"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Tulis pertanyaan atau komentar Anda di sini..."
                        rows={4}
                        className="w-full p-3.5 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent dark:bg-neutral-700 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 text-sm shadow-sm"
                      />
                      <div className="mt-4 flex justify-end">
                        <button type="submit" disabled={!newComment.trim()} className="px-7 py-2.5 bg-brand-purple text-white font-semibold text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                            <PaperAirplaneIcon className="h-5 w-5 mr-2 transform -rotate-45"/> Kirim
                        </button>
                      </div>
                    </form>

                    <div className="space-y-8">
                      {courseData.discussions.length > 0 ? courseData.discussions.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-4 p-1">
                          {comment.userAvatar ? (
                            <Image src={comment.userAvatar} alt={comment.userName} width={48} height={48} className="rounded-full object-cover flex-shrink-0 shadow-md border-2 border-white dark:border-neutral-600"/>
                          ) : (
                            <UserAvatarIcon className="h-12 w-12 text-gray-400 dark:text-neutral-500 flex-shrink-0 rounded-full bg-gray-200 dark:bg-neutral-700 p-1.5 border-2 border-white dark:border-neutral-600" />
                          )}
                          <div className="flex-1 bg-gray-50 dark:bg-neutral-700/60 p-4 rounded-xl shadow-md">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-semibold text-sm text-gray-800 dark:text-neutral-100">{comment.userName}
                                {comment.userRole === 'Pengajar' && <span className="ml-2 text-xs bg-brand-purple text-white px-2 py-0.5 rounded-full font-medium shadow-sm">Pengajar</span>}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-neutral-400">{comment.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">{comment.text}</p>
                            <div className="mt-3 flex items-center space-x-4">
                                <button className="flex items-center text-xs text-gray-500 dark:text-neutral-400 hover:text-brand-purple dark:hover:text-purple-400 transition-colors">
                                    <HandThumbUpIcon className="h-4 w-4 mr-1"/> ({comment.likes || 0}) Suka
                                </button>
                                <button className="flex items-center text-xs text-gray-500 dark:text-neutral-400 hover:text-brand-purple dark:hover:text-purple-400 transition-colors">
                                    <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4 mr-1"/> Balas
                                </button>
                            </div>
                            {/* Implementasi Balasan (Replies) di sini jika ada */}
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-10">
                            <ChatBubbleLeftEllipsisIcon className="h-16 w-16 text-gray-300 dark:text-neutral-600 mx-auto mb-3"/>
                            <p className="text-gray-500 dark:text-neutral-400">Belum ada diskusi untuk kursus ini.</p>
                            <p className="text-sm text-gray-400 dark:text-neutral-500 mt-1">Jadilah yang pertama memulai diskusi atau bertanya!</p>
                        </div>
                      )}
                    </div>
                  </div>
            )}
            {activeTab === "Tugas & Kuis" && (
                 <div className="bg-white dark:bg-neutral-800/90 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700/70 text-center min-h-[300px] flex flex-col justify-center items-center">
                    <QuestionMarkCircleIcon className="h-20 w-20 text-gray-300 dark:text-neutral-600 mx-auto mb-5"/>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Tugas & Kuis</h2>
                    <p className="text-gray-600 dark:text-neutral-400 mt-2 max-w-md mx-auto">Segera hadir! Bagian ini akan menampilkan semua tugas dan kuis yang perlu Anda kerjakan.</p>
                </div>
            )}
            {activeTab === "Sertifikat" && (
              <div className="bg-white dark:bg-neutral-800/90 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700/70 text-center min-h-[400px] flex flex-col justify-center items-center">
                 <AcademicCapIcon className="h-20 w-20 text-brand-purple dark:text-purple-400 mx-auto mb-5"/>
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">Sertifikat Kelulusan</h2>
                 {isCourseCompleted && courseData.hasCertificate && courseData.certificateUrl ? (
                   <>
                     <p className="text-gray-600 dark:text-neutral-300 mt-2 mb-8 max-w-md mx-auto">Selamat! Anda telah berhasil menyelesaikan semua materi kursus ini. Anda berhak mendapatkan sertifikat kelulusan.</p>
                     <Link href={courseData.certificateUrl} className="group inline-flex items-center px-10 py-3.5 bg-green-600 text-white font-semibold text-base rounded-lg hover:bg-green-700 transition-colors shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50">
                       <ArrowDownTrayIcon className="h-6 w-6 mr-2.5 transition-transform duration-200 group-hover:scale-110"/> Unduh Sertifikat Anda
                     </Link>
                   </>
                 ) : courseData.hasCertificate ? (
                   <p className="text-gray-600 dark:text-neutral-400 mt-2 max-w-md mx-auto">Selesaikan <span className="font-semibold">{100 - courseData.userProgress}%</span> sisa materi kursus untuk membuka dan mengunduh sertifikat kelulusan Anda.</p>
                 ) : (
                   <p className="text-gray-600 dark:text-neutral-400 mt-2 max-w-md mx-auto">Mohon maaf, kursus ini saat ini tidak menyediakan sertifikat kelulusan.</p>
                 )}

                 {isCourseCompleted && (
                     <div className="mt-12 pt-8 border-t border-gray-200 dark:border-neutral-700/70 w-full max-w-lg mx-auto">
                         <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4">Bagaimana Pendapat Anda Tentang Kursus Ini?</h3>
                         <form className="space-y-4 text-left">
                             <div>
                                 <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Rating Anda (1-5 Bintang):</label>
                                 <div className="flex space-x-1 mt-1">
                                     {[1,2,3,4,5].map(s => <StarIconSolid key={s} className="h-7 w-7 text-gray-300 dark:text-neutral-600 hover:text-yellow-400 cursor-pointer transition-colors"/>)}
                                 </div>
                             </div>
                             <div>
                                 <label htmlFor="feedbackText" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Ulasan Anda (Opsional):</label>
                                 <textarea id="feedbackText" rows={4} placeholder="Bagikan pengalaman belajar Anda..." className="mt-1 w-full p-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-brand-purple dark:bg-neutral-700 dark:text-neutral-100 text-sm"></textarea>
                             </div>
                             <button type="submit" className="w-full px-6 py-3 bg-brand-purple text-white font-semibold text-sm rounded-lg hover:bg-purple-700 transition-colors shadow-md">Kirim Ulasan</button>
                         </form>
                     </div>
                 )}
              </div>
            )}

            {courseData.relatedCourses && courseData.relatedCourses.length > 0 && (activeTab === "Overview" || isCourseCompleted) && (
                <section className="mt-12 pt-10 border-t border-gray-200 dark:border-neutral-700/70">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-6">Anda Mungkin Juga Tertarik Dengan</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                        {courseData.relatedCourses.slice(0,2).map(related => (
                            <Link key={related.slug} href={`/courses/${related.slug}`} className="group block bg-white dark:bg-neutral-800/90 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-neutral-700/70 transform hover:-translate-y-1">
                                <div className="relative w-full h-36 sm:h-40 rounded-lg overflow-hidden mb-3">
                                    <Image
                                      src={related.thumbnailUrl}
                                      alt={related.title}
                                      fill
                                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <span className="text-xs font-medium text-brand-purple dark:text-purple-400 mb-0.5 uppercase tracking-wider">{related.category}</span>
                                <h4 className="font-semibold text-md text-gray-800 dark:text-neutral-100 group-hover:text-brand-purple dark:group-hover:text-purple-300 line-clamp-2 transition-colors">{related.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">oleh {related.instructorName}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center text-xs">
                                        <StarIconSolid className="h-4 w-4 text-yellow-400 mr-0.5"/> {related.rating?.toFixed(1)}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                                        {(related.price ?? 0) === 0 ? 'Gratis' : `Rp${related.price?.toLocaleString('id-ID')}`}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
          </div>
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-4 relative">
            <CourseInfoSidebar courseData={courseData} isCourseCompleted={isCourseCompleted} />
          </aside>
        </div>
      </div>
    </div>
  );
}
