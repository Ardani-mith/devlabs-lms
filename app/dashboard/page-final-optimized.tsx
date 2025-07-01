"use client";

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  SparklesIcon, FireIcon, StarIcon, CalendarDaysIcon, NewspaperIcon, ChevronRightIcon,
  UsersIcon, BookOpenIcon, BriefcaseIcon, DocumentCheckIcon, ChatBubbleLeftRightIcon,
  BellIcon, CurrencyDollarIcon, ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardContent, StatCard } from '@/components/ui';
import { ContentCard } from '@/components/shared';
import { usePagination } from '@/hooks/usePagination';

// Import dashboard components (simplified to avoid type conflicts)
import {
  ActivityList, NewLaunchCard, ProgressCard, DeadlineList, 
  CompletedCoursesList, NotificationBanner
} from './components/DashboardContent';

// Import data
import { 
  summaryStatsData, newLaunches, latestActivity, graduatedCourses, 
  upcomingDeadlines, newsItems, lightNotifications 
} from './data';

// Simple role configurations to avoid type issues
const getRoleConfig = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return {
        progress: 90,
        quickAccess: [
          { title: "Manajemen User", icon: UsersIcon, href: "/admin/users" },
          { title: "Pengaturan Kursus", icon: BookOpenIcon, href: "/admin/courses" },
          { title: "Laporan & Analitik", icon: ChartBarIcon, href: "/analytics" },
          { title: "Broadcast Notifikasi", icon: BellIcon, href: "/admin/notifications" },
        ],
        showProgress: false,
        showDeadlines: true,
        showCompletedCourses: true,
      };
    case 'TEACHER':
      return {
        progress: 85,
        quickAccess: [
          { title: "Kursus Saya", icon: BriefcaseIcon, href: "/instructor/courses" },
          { title: "Manajemen Siswa", icon: UsersIcon, href: "/instructor/students" },
          { title: "Forum Pengajar", icon: ChatBubbleLeftRightIcon, href: "/instructor/forum" },
          { title: "Pendapatan", icon: CurrencyDollarIcon, href: "/instructor/earnings" },
        ],
        showProgress: true,
        showDeadlines: false,
        showCompletedCourses: false,
      };
    default: // USER
      return {
        progress: 75,
        quickAccess: [
          { title: "Kursus Saya", icon: BriefcaseIcon, href: "/dashboard/my-courses" },
          { title: "Tugas Saya", icon: DocumentCheckIcon, href: "/dashboard/assignments" },
          { title: "Forum Diskusi", icon: ChatBubbleLeftRightIcon, href: "/forum" },
          { title: "Sertifikat Saya", icon: StarIcon, href: "/dashboard/certificates" },
        ],
        showProgress: true,
        showDeadlines: true,
        showCompletedCourses: true,
      };
  }
};

export default function DashboardFinalOptimized() {
  const { user, isLoading: isAuthLoading } = useAuth();

  // Pagination for news
  const newsPagination = usePagination({
    totalItems: newsItems.length,
    itemsPerPage: 3,
  });

  // Memoized user-specific data
  const userConfig = useMemo(() => getRoleConfig(user?.role || 'USER'), [user?.role]);
  const userStatistics = useMemo(() => {
    return summaryStatsData[user?.role || 'USER'] || summaryStatsData.USER;
  }, [user?.role]);

  const currentNewsItems = newsPagination.getPageItems(newsItems);

  // Loading state
  if (isAuthLoading) {
    return (
      <div className="space-y-10 p-4 sm:p-6 lg:p-8 animate-pulse">
        <div className="h-12 bg-gray-200 dark:bg-neutral-700 rounded w-3/4"></div>
        <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_,i) => (
            <div key={i} className="h-36 bg-gray-200 dark:bg-neutral-700 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  // Not authenticated state
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Silakan login untuk mengakses dashboard.
        </p>
        <Link 
          href="/auth/login" 
          className="mt-4 px-6 py-2 bg-brand-purple text-white rounded-lg hover:bg-purple-700"
        >
          Ke Halaman Login
        </Link>
      </div>
    );
  }

  const displayName = user.name || user.username;

  return (
    <div className="space-y-12 p-4 sm:p-6 lg:p-8 text-text-light-primary dark:text-text-dark-primary">
      {/* Welcome Section */}
      <section>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight dark:text-neutral-100">
          Selamat Datang Kembali, <span className="text-brand-purple dark:text-purple-400">{displayName}</span>!
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-md">
          Anda masuk sebagai: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{user.role || 'USER'}</span>. Mari kita lihat progres Anda hari ini.
        </p>
      </section>

      {/* Notifications */}
      {lightNotifications.length > 0 && (
        <section className="space-y-3">
          {lightNotifications.map(notif => (
            <NotificationBanner key={notif.id} notification={notif} />
          ))}
        </section>
      )}

      {/* Statistics Grid */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {userStatistics.map(stat => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* New Launches */}
          <Card variant="elevated" padding="md">
            <CardHeader>
              <h2 className="text-2xl font-bold flex items-center dark:text-neutral-100">
                <SparklesIcon className="h-7 w-7 mr-2.5 text-yellow-500" /> Baru Diluncurkan
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {newLaunches.slice(0, 2).map(launch => (
                  <NewLaunchCard key={launch.id} launch={launch} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity & Completed Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Activities */}
            <Card variant="elevated" padding="md">
              <CardHeader>
                <h2 className="text-2xl font-bold flex items-center dark:text-neutral-100">
                  <FireIcon className="h-7 w-7 mr-2.5 text-red-500" /> Aktivitas Terkini
                </h2>
              </CardHeader>
              <CardContent>
                <ActivityList activities={latestActivity} />
              </CardContent>
            </Card>

            {/* Completed Courses (show only for USER and ADMIN) */}
            {userConfig.showCompletedCourses && (
              <Card variant="elevated" padding="md">
                <CardHeader>
                  <h2 className="text-2xl font-bold flex items-center dark:text-neutral-100">
                    <StarIcon className="h-7 w-7 mr-2.5 text-yellow-500" /> Kursus Selesai
                  </h2>
                </CardHeader>
                <CardContent>
                  <CompletedCoursesList courses={graduatedCourses} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Deadlines (show only for USER and ADMIN) */}
          {userConfig.showDeadlines && (
            <Card variant="elevated" padding="md">
              <CardHeader>
                <h2 className="text-2xl font-bold flex items-center dark:text-neutral-100">
                  <CalendarDaysIcon className="h-7 w-7 mr-2.5 text-indigo-500" /> Tenggat Waktu
                </h2>
              </CardHeader>
              <CardContent>
                <DeadlineList deadlines={upcomingDeadlines} />
              </CardContent>
            </Card>
          )}

          {/* Progress (show only for USER and TEACHER) */}
          {userConfig.showProgress && (
            <Card variant="elevated" padding="md">
              <CardContent>
                <ProgressCard progress={userConfig.progress} role={user.role || 'USER'} />
              </CardContent>
            </Card>
          )}

          {/* Quick Access */}
          <Card variant="elevated" padding="md">
            <CardHeader>
              <h2 className="text-2xl font-bold dark:text-neutral-100">Akses Cepat</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {userConfig.quickAccess.map(link => (
                  <Link 
                    key={link.title} 
                    href={link.href} 
                    className="group flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-neutral-700/70 rounded-xl hover:bg-brand-purple/10 dark:hover:bg-purple-500/30 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="p-3 rounded-full bg-brand-purple/10 dark:bg-purple-500/20 group-hover:bg-brand-purple/20 dark:group-hover:bg-purple-500/40 transition-colors mb-2">
                      <link.icon className="h-6 w-6 text-brand-purple dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-center text-neutral-700 dark:text-neutral-200 group-hover:text-brand-purple dark:group-hover:text-purple-300 transition-colors">
                      {link.title}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* News Section - Using Generic ContentCard */}
      <Card variant="elevated" padding="lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center dark:text-neutral-100">
            <NewspaperIcon className="h-7 w-7 mr-2.5 text-green-500" /> Berita & Pengumuman
          </h2>
          <Link 
            href="/dashboard/news" 
            className="mt-2 sm:mt-0 text-sm text-brand-purple dark:text-purple-400 font-semibold hover:underline flex items-center"
          >
            Lihat Semua Berita <ChevronRightIcon className="h-4 w-4 ml-1"/>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentNewsItems.map(news => (
            <ContentCard
              key={news.id}
              content={{
                id: news.id.toString(),
                title: news.title,
                description: news.date || '',
                category: news.category,
                thumbnailUrl: news.image || '',
                type: 'news' as const,
                authorName: 'Admin',
                publishedAt: news.date || new Date().toISOString(),
              }}
            />
          ))}
        </div>
        {newsPagination.hasMultiplePages && (
          <div className="flex justify-center mt-8 space-x-2.5">
            {newsPagination.getVisiblePageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => newsPagination.goToPage(pageNum)}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  newsPagination.currentPage === pageNum 
                    ? 'bg-brand-purple scale-125' 
                    : 'bg-gray-300 dark:bg-neutral-600 hover:bg-gray-400 dark:hover:bg-neutral-500'
                }`}
                aria-label={`Go to page ${pageNum + 1}`}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
} 