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

// API function to fetch dashboard data
const fetchDashboardDataFromAPI = async (userId: string, userRole: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300'}/api/dashboard/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      // Return empty data structure if API fails
      return {
        activities: [],
        newLaunches: [],
        completedCourses: [],
        deadlines: [],
        news: [],
        notifications: []
      };
    }
  } catch (error) {
    console.error('Dashboard API error:', error);
    return {
      activities: [],
      newLaunches: [],
      completedCourses: [],
      deadlines: [],
      news: [],
      notifications: []
    };
  }
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
        
        // Fetch real dashboard data from API
        const apiData = await fetchDashboardDataFromAPI(user.id?.toString() || '', user.role || 'USER');
        
        const userData: UserDashboardData = {
          statistics,
          progress,
          quickAccessLinks,
          activities: (apiData.activities || []).map((item: any) => ({ 
            ...item, 
            id: item.id?.toString() || Math.random().toString(),
            contentType: 'activity' as const,
            icon: CheckCircleIcon
          })) as DashboardContent[],
          news: (apiData.news || []).map((item: any) => ({ 
            ...item, 
            id: item.id?.toString() || Math.random().toString(),
            contentType: 'news' as const
          })) as DashboardContent[],
          deadlines: (apiData.deadlines || []).map((item: any) => ({ 
            ...item, 
            id: item.id?.toString() || Math.random().toString(),
            contentType: 'deadline' as const
          })) as DashboardContent[],
          completedCourses: (apiData.completedCourses || []).map((item: any) => ({ 
            ...item, 
            id: item.id?.toString() || Math.random().toString(),
            contentType: 'course' as const
          })) as DashboardContent[],
          notifications: (apiData.notifications || []).map((item: any) => ({ 
            ...item, 
            id: item.id?.toString() || Math.random().toString(),
            contentType: 'notification' as const
          })) as DashboardContent[],
          newLaunches: (apiData.newLaunches || []).map((item: any) => ({ 
            ...item, 
            id: item.id?.toString() || Math.random().toString(),
            contentType: 'course' as const
          })) as DashboardContent[],
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