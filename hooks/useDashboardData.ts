import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserDashboardData, DashboardConfig, StatCardData, QuickAccessLink, DashboardContent } from '@/app/dashboard/types/dashboard';
import {
  UsersIcon, BookOpenIcon, UserCircleIcon, CurrencyDollarIcon,
  ChatBubbleLeftRightIcon, StarIcon, ClockIcon, DocumentCheckIcon,
  CheckCircleIcon, LightBulbIcon, BellIcon
} from '@heroicons/react/24/outline';
import { ChartBarIcon, BriefcaseIcon } from 'lucide-react';

const ROLE_CONFIGS: Record<string, DashboardConfig> = {
  ADMIN: {
    role: 'ADMIN',
    showStatistics: true,
    showProgress: false,
    showDeadlines: true,
    showCompletedCourses: true,
    showQuickAccess: true,
    showNotifications: true,
    sectionsLayout: {
      leftColumn: ['newLaunches', 'activities', 'completedCourses'],
      rightColumn: ['deadlines', 'quickAccess']
    }
  },
  TEACHER: {
    role: 'TEACHER',
    showStatistics: true,
    showProgress: true,
    showDeadlines: false,
    showCompletedCourses: false,
    showQuickAccess: true,
    showNotifications: true,
    sectionsLayout: {
      leftColumn: ['newLaunches', 'activities'],
      rightColumn: ['progress', 'quickAccess']
    }
  },
  USER: {
    role: 'USER',
    showStatistics: true,
    showProgress: true,
    showDeadlines: true,
    showCompletedCourses: true,
    showQuickAccess: true,
    showNotifications: true,
    sectionsLayout: {
      leftColumn: ['newLaunches', 'activities', 'completedCourses'],
      rightColumn: ['deadlines', 'progress', 'quickAccess']
    }
  }
};

const ROLE_STATISTICS: Record<string, StatCardData[]> = {
  ADMIN: [
    { title: "Total Pengguna Aktif", value: "1,250", icon: UsersIcon, color: "text-sky-600 dark:text-sky-400", bgColor: "bg-sky-100 dark:bg-sky-900/50", href: "/admin/users" },
    { title: "Total Kursus Terpublikasi", value: "150", icon: BookOpenIcon, color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-100 dark:bg-emerald-900/50", href: "/admin/courses" },
    { title: "Pendaftaran Baru (30 Hari)", value: "78", icon: UserCircleIcon, color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-100 dark:bg-amber-900/50", href: "/admin/users?filter=new" },
    { title: "Total Pendapatan", value: "Rp 120Jt", icon: CurrencyDollarIcon, color: "text-rose-600 dark:text-rose-400", bgColor: "bg-rose-100 dark:bg-rose-900/50", href: "/admin/revenue" },
  ],
  TEACHER: [
    { title: "Kursus Anda", value: "8", icon: BookOpenIcon, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/50", href: "/teacher/courses" },
    { title: "Total Siswa Anda", value: "850", icon: UsersIcon, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/50", href: "/teacher/students" },
    { title: "Diskusi Belum Dibaca", value: "12", icon: ChatBubbleLeftRightIcon, color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-100 dark:bg-orange-900/50", href: "/teacher/discussions" },
    { title: "Rating Rata-rata", value: "4.7", icon: StarIcon, color: "text-yellow-500 dark:text-yellow-400", bgColor: "bg-yellow-100 dark:bg-yellow-900/50", href: "/teacher/reviews" },
  ],
  USER: [
    { title: "Kursus Aktif", value: "5", icon: BookOpenIcon, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/50", href: "/dashboard/my-courses" },
    { title: "Tugas Belum Selesai", value: "3", icon: DocumentCheckIcon, color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-100 dark:bg-orange-900/50", href: "/dashboard/assignments" },
    { title: "Sertifikat Diperoleh", value: "12", icon: StarIcon, color: "text-yellow-500 dark:text-yellow-400", bgColor: "bg-yellow-100 dark:bg-yellow-900/50", href: "/dashboard/certificates" },
    { title: "Total Jam Belajar", value: "128", icon: ClockIcon, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/50", href: "/dashboard/progress" },
  ],
};

const ROLE_QUICK_ACCESS: Record<string, QuickAccessLink[]> = {
  ADMIN: [
    { title: "Manajemen User", icon: UsersIcon, href: "/admin/users" },
    { title: "Pengaturan Kursus", icon: BookOpenIcon, href: "/admin/courses" },
    { title: "Laporan & Analitik", icon: ChartBarIcon, href: "/analytics" },
    { title: "Broadcast Notifikasi", icon: BellIcon, href: "/admin/notifications" },
  ],
  TEACHER: [
    { title: "Kursus Saya", icon: BriefcaseIcon, href: "/teacher/courses" },
    { title: "Manajemen Siswa", icon: UsersIcon, href: "/teacher/students" },
    { title: "Forum Pengajar", icon: ChatBubbleLeftRightIcon, href: "/teacher/forum" },
    { title: "Pendapatan", icon: CurrencyDollarIcon, href: "/teacher/earnings" },
  ],
  USER: [
    { title: "Kursus Saya", icon: BriefcaseIcon, href: "/dashboard/my-courses" },
    { title: "Tugas Saya", icon: DocumentCheckIcon, href: "/dashboard/assignments" },
    { title: "Forum Diskusi", icon: ChatBubbleLeftRightIcon, href: "/forum" },
    { title: "Sertifikat Saya", icon: StarIcon, href: "/dashboard/certificates" },
  ],
};

// Mock data - in real app this would come from API
const mockDashboardData = {
  activities: [
    { id: 1, title: "Anda menyelesaikan kuis 'Introduction to AI'", description: "2 jam lalu", contentType: 'activity' as const, icon: CheckCircleIcon },
    { id: 2, title: "Materi baru ditambahkan ke kursus 'Web Development Bootcamp'", description: "5 jam lalu", contentType: 'activity' as const, icon: LightBulbIcon },
    { id: 3, title: "Anda bergabung ke forum diskusi 'Project Collaboration'", description: "1 hari lalu", contentType: 'activity' as const, icon: ChatBubbleLeftRightIcon },
    { id: 4, title: "Pengumuman baru: Jadwal Ujian Akhir Semester", description: "2 hari lalu", contentType: 'activity' as const, icon: BellIcon },
  ],
  newLaunches: [
    { 
      id: 1, 
      title: "Advanced React Patterns", 
      description: "Kursus oleh Dr. Eva Green", 
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop", 
      href: "/courses/advanced-react-patterns",
      contentType: 'course' as const,
      new: true
    },
    { 
      id: 2, 
      title: "Data Science with Python: Module 3", 
      description: "Modul baru tersedia", 
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop", 
      href: "/courses/data-science-python",
      contentType: 'course' as const,
      new: true
    },
  ],
  completedCourses: [
    { id: 1, title: "JavaScript Fundamentals", description: "Selesai: 15 Mei 2025", contentType: 'course' as const, certificateLink: "#" },
    { id: 2, title: "Introduction to UI/UX Design", description: "Selesai: 20 Apr 2025", contentType: 'course' as const, certificateLink: "#" },
    { id: 3, title: "Basic HTML & CSS", description: "Selesai: 10 Mar 2025", contentType: 'course' as const, certificateLink: "#" },
  ],
  deadlines: [
    { id: 1, title: "Submit Esai Sejarah Modern", description: "Sejarah Dunia", dueDate: "3 hari lagi", contentType: 'deadline' as const, urgency: 'high' as const },
    { id: 2, title: "Ujian Tengah Semester Kalkulus", description: "Kalkulus I", dueDate: "5 hari lagi", contentType: 'deadline' as const, urgency: 'medium' as const },
    { id: 3, title: "Webinar: Future of Web Development", description: "Event mendatang", dueDate: "1 minggu lagi", contentType: 'deadline' as const, urgency: 'low' as const },
  ],
  news: [
    { 
      id: 1, 
      title: "Beasiswa Pendidikan 2025 Telah Dibuka!", 
      description: "26 Mei 2025", 
      category: "Beasiswa", 
      image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop",
      href: "/news/beasiswa-2025",
      contentType: 'news' as const,
      new: true
    },
    { 
      id: 2, 
      title: "Tips Efektif Belajar Online dari Rumah", 
      description: "25 Mei 2025", 
      category: "Tips Belajar", 
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
      href: "/news/tips-belajar-online",
      contentType: 'news' as const,
      new: false
    },
  ],
  notifications: [
    { id: 1, title: "Tugas 'Analisis Data' akan berakhir dalam 24 jam.", description: "deadline", contentType: 'notification' as const, urgency: 'high' as const },
    { id: 2, title: "Dosen memberikan feedback pada tugas 'Esai Sastra'.", description: "feedback", contentType: 'notification' as const, urgency: 'low' as const },
  ]
};

export const useDashboardData = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const config = useMemo(() => {
    if (!user?.role) return ROLE_CONFIGS.USER;
    return ROLE_CONFIGS[user.role] || ROLE_CONFIGS.USER;
  }, [user?.role]);

  const statistics = useMemo(() => {
    if (!user?.role) return ROLE_STATISTICS.USER;
    return ROLE_STATISTICS[user.role] || ROLE_STATISTICS.USER;
  }, [user?.role]);

  const quickAccessLinks = useMemo(() => {
    if (!user?.role) return ROLE_QUICK_ACCESS.USER;
    return ROLE_QUICK_ACCESS[user.role] || ROLE_QUICK_ACCESS.USER;
  }, [user?.role]);

  const progress = useMemo(() => {
    if (!user?.role) return 75;
    if (user.role === 'ADMIN') return 90;
    if (user.role === 'TEACHER') return 85;
    return 75;
  }, [user?.role]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // In real app, this would be API calls
        // const response = await api.getDashboardData(user.id, user.role);
        
        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const userData: UserDashboardData = {
          statistics,
          progress,
          quickAccessLinks,
          activities: mockDashboardData.activities.map(item => ({ ...item, id: item.id.toString() })) as DashboardContent[],
          news: mockDashboardData.news.map(item => ({ ...item, id: item.id.toString() })) as DashboardContent[],
          deadlines: mockDashboardData.deadlines.map(item => ({ ...item, id: item.id.toString() })) as DashboardContent[],
          completedCourses: mockDashboardData.completedCourses.map(item => ({ ...item, id: item.id.toString() })) as DashboardContent[],
          notifications: mockDashboardData.notifications.map(item => ({ ...item, id: item.id.toString() })) as DashboardContent[],
          newLaunches: mockDashboardData.newLaunches.map(item => ({ ...item, id: item.id.toString() })) as DashboardContent[],
        };

        setDashboardData(userData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, statistics, progress, quickAccessLinks]);

  return {
    data: dashboardData,
    config,
    isLoading: isAuthLoading || isLoading,
    error: null,
    refetch: () => {
      // Trigger refetch logic
    }
  };
}; 