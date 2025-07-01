// Dashboard data separated from component logic
import {
  UsersIcon, BookOpenIcon, UserCircleIcon, CurrencyDollarIcon,
  ChatBubbleLeftRightIcon, StarIcon, ClockIcon, DocumentCheckIcon,
  CheckCircleIcon, LightBulbIcon, BellIcon
} from '@heroicons/react/24/outline';

import { StatCardData, ActivityItem, NewsItem, NotificationItem } from '@/lib/types';

export const summaryStatsData: Record<string, StatCardData[]> = {
  ADMIN: [
    { title: "Total Pengguna Aktif", value: "1,250", icon: UsersIcon, color: "text-sky-600 dark:text-sky-400", bgColor: "bg-sky-100 dark:bg-sky-900/50" },
    { title: "Total Kursus Terpublikasi", value: "150", icon: BookOpenIcon, color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-100 dark:bg-emerald-900/50" },
    { title: "Pendaftaran Baru (30 Hari)", value: "78", icon: UserCircleIcon, color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-100 dark:bg-amber-900/50" },
    { title: "Total Pendapatan", value: "Rp 120Jt", icon: CurrencyDollarIcon, color: "text-rose-600 dark:text-rose-400", bgColor: "bg-rose-100 dark:bg-rose-900/50" },
  ],
  INSTRUCTOR: [
    { title: "Kursus Anda", value: "8", icon: BookOpenIcon, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/50" },
    { title: "Total Siswa Anda", value: "850", icon: UsersIcon, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/50" },
    { title: "Diskusi Belum Dibaca", value: "12", icon: ChatBubbleLeftRightIcon, color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-100 dark:bg-orange-900/50" },
    { title: "Rating Rata-rata", value: "4.7", icon: StarIcon, color: "text-yellow-500 dark:text-yellow-400", bgColor: "bg-yellow-100 dark:bg-yellow-900/50" },
  ],
  USER: [
    { title: "Kursus Aktif", value: "5", icon: BookOpenIcon, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/50" },
    { title: "Tugas Belum Selesai", value: "3", icon: DocumentCheckIcon, color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-100 dark:bg-orange-900/50" },
    { title: "Sertifikat Diperoleh", value: "12", icon: StarIcon, color: "text-yellow-500 dark:text-yellow-400", bgColor: "bg-yellow-100 dark:bg-yellow-900/50" },
    { title: "Total Jam Belajar", value: "128", icon: ClockIcon, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/50" },
  ],
};

export const newLaunches = [
  { 
    id: 1, 
    title: "Advanced React Patterns", 
    type: "Kursus", 
    instructor: "Dr. Eva Green", 
    new: true, 
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop", 
    href: "/courses/advanced-react-patterns" 
  },
  { 
    id: 2, 
    title: "Data Science with Python: Module 3", 
    type: "Modul", 
    new: true, 
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop", 
    href: "/courses/data-science-python" 
  },
  { 
    id: 3, 
    title: "UI/UX Design Masterclass", 
    type: "Kursus", 
    instructor: "Alex Johnson", 
    new: false, 
    image: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800&h=600&fit=crop", 
    href: "/courses/ui-ux-design-masterclass" 
  },
];

export const latestActivity: ActivityItem[] = [
  { id: 1, text: "Anda menyelesaikan kuis 'Introduction to AI'", time: "2024-01-15T14:30:00Z", icon: CheckCircleIcon },
  { id: 2, text: "Materi baru ditambahkan ke kursus 'Web Development Bootcamp'", time: "2024-01-15T09:30:00Z", icon: LightBulbIcon },
  { id: 3, text: "Anda bergabung ke forum diskusi 'Project Collaboration'", time: "2024-01-14T16:30:00Z", icon: ChatBubbleLeftRightIcon },
  { id: 4, text: "Pengumuman baru: Jadwal Ujian Akhir Semester", time: "2024-01-13T10:30:00Z", icon: BellIcon },
];

export const graduatedCourses = [
  { id: 1, title: "JavaScript Fundamentals", certificateLink: "#", completionDate: "15 Mei 2025" },
  { id: 2, title: "Introduction to UI/UX Design", certificateLink: "#", completionDate: "20 Apr 2025" },
  { id: 3, title: "Basic HTML & CSS", certificateLink: "#", completionDate: "10 Mar 2025" },
];

export const upcomingDeadlines = [
  { id: 1, title: "Submit Esai Sejarah Modern", due: "3 hari lagi", type: "Tugas", course: "Sejarah Dunia", color: "red" },
  { id: 2, title: "Ujian Tengah Semester Kalkulus", due: "5 hari lagi", type: "Ujian", course: "Kalkulus I", color: "orange" },
  { id: 3, title: "Webinar: Future of Web Development", due: "1 minggu lagi", type: "Event", course: "N/A", color: "blue" },
];

export const newsItems: NewsItem[] = [
  { 
    id: 1, 
    title: "Beasiswa Pendidikan 2025 Telah Dibuka!", 
    date: "2025-05-26", 
    new: true, 
    category: "Beasiswa", 
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop",
    href: "/news/beasiswa-2025"
  },
  { 
    id: 2, 
    title: "Tips Efektif Belajar Online dari Rumah", 
    date: "2025-05-25", 
    new: false, 
    category: "Tips Belajar", 
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
    href: "/news/tips-belajar-online"
  },
  { 
    id: 3, 
    title: "Update Kurikulum: Fokus pada Keterampilan AI", 
    date: "2025-05-24", 
    new: false, 
    category: "Akademik", 
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
    href: "/news/kurikulum-ai"
  },
  { 
    id: 4, 
    title: "Seminar Karir: Mempersiapkan Diri untuk Dunia Kerja", 
    date: "2025-05-23", 
    new: true, 
    category: "Karir", 
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    href: "/news/seminar-karir"
  },
];

export const lightNotifications: NotificationItem[] = [
  { 
    id: 1, 
    text: "Tugas 'Analisis Data' akan berakhir dalam 24 jam.", 
    type: "deadline", 
    icon: CheckCircleIcon 
  },
  { 
    id: 2, 
    text: "Dosen memberikan feedback pada tugas 'Esai Sastra'.", 
    type: "feedback", 
    icon: CheckCircleIcon 
  },
]; 