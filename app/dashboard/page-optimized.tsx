"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BellIcon, BookOpenIcon, CalendarDaysIcon, ChevronRightIcon,
  DocumentCheckIcon, FireIcon, ChatBubbleLeftRightIcon,
  LightBulbIcon, NewspaperIcon, SparklesIcon, StarIcon,
  BriefcaseIcon, ArrowTrendingUpIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

import { useAuth } from '@/contexts/AuthContext';
import { ChartBarIcon, UsersIcon } from '@heroicons/react/24/outline';
import { StatCard, Card, CardHeader, CardContent } from '@/components/ui';
import { usePagination } from '@/hooks/usePagination';
import { StatCardData, ActivityItem, NewsItem, NotificationItem, QuickAccessLink } from '@/lib/types';

// Utility functions
const formatTimeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} jam yang lalu`;
  return `${Math.floor(diffInMinutes / 1440)} hari yang lalu`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Data moved to separate file/API calls in real app
import { summaryStatsData, newLaunches, latestActivity, graduatedCourses, upcomingDeadlines, newsItems, lightNotifications } from './data';

type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'USER' | string;

// Reusable components extracted
const NotificationBanner: React.FC<{ notification: NotificationItem }> = ({ notification }) => (
  <div className={`flex items-center p-4 rounded-xl text-sm shadow-md transition-all hover:shadow-lg ${
    notification.type === 'deadline' 
      ? 'bg-red-100 dark:bg-red-700/30 text-red-800 dark:text-red-200 border-l-4 border-red-500' 
      : 'bg-blue-100 dark:bg-blue-700/30 text-blue-800 dark:text-blue-200 border-l-4 border-blue-500'
  }`}>
    <notification.icon className={`h-6 w-6 mr-3 flex-shrink-0 ${
      notification.type === 'deadline' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
    }`} />
    <span className="font-medium">{notification.text}</span>
  </div>
);

const ActivityList: React.FC<{ activities: ActivityItem[]; maxItems?: number }> = ({ 
  activities, 
  maxItems = 3 
}) => (
  <ul className="space-y-4">
    {activities.slice(0, maxItems).map(activity => (
      <li key={activity.id} className="flex items-start text-sm group">
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-purple/10 dark:bg-purple-500/20 flex items-center justify-center mr-3 group-hover:bg-brand-purple/20 dark:group-hover:bg-purple-500/30 transition-colors">
          <activity.icon className="h-4 w-4 text-brand-purple dark:text-purple-400" />
        </div>
        <div>
          <span className="dark:text-neutral-200">{activity.text}</span>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {formatTimeAgo(activity.time)}
          </p>
        </div>
      </li>
    ))}
  </ul>
);

const NewsCard: React.FC<{ news: NewsItem }> = ({ news }) => (
  <Link href={news.href || "#"} className="group rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700/80 flex flex-col hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="relative w-full h-48 overflow-hidden">
      <Image 
        src={news.image || "/images/news-placeholder.jpg"} 
        alt={news.title} 
        fill 
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {news.new && (
        <span className="absolute top-3 right-3 text-xs bg-red-500 text-white px-2.5 py-1 rounded-full font-semibold shadow-md">
          BARU
        </span>
      )}
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <span className="text-xs bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 px-2.5 py-1 rounded-full self-start mb-2 font-medium">
        {news.category}
      </span>
      <h3 className="font-semibold text-md mb-1.5 flex-grow group-hover:text-brand-purple dark:group-hover:text-purple-400 transition-colors dark:text-neutral-100 line-clamp-2">
        {news.title}
      </h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        {formatDate(news.date)}
      </p>
    </div>
  </Link>
);

const QuickAccessGrid: React.FC<{ links: QuickAccessLink[] }> = ({ links }) => (
  <div className="grid grid-cols-2 gap-4">
    {links.map(link => (
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
);

export default function DashboardPageOptimized() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [userSpecificSummary, setUserSpecificSummary] = useState<StatCardData[]>([]);
  const [userOverallProgress, setUserOverallProgress] = useState(0);
  const [userQuickAccessLinks, setUserQuickAccessLinks] = useState<QuickAccessLink[]>([]);

  // Pagination for news
  const newsPagination = usePagination({
    totalItems: newsItems.length,
    itemsPerPage: 3,
  });

  useEffect(() => {
    if (user) {
      setUserSpecificSummary(summaryStatsData[user.role as UserRole] || summaryStatsData['USER']);
      
      if (user.role === 'ADMIN') {
        setUserOverallProgress(90);
        setUserQuickAccessLinks([
          { title: "Manajemen User", icon: UsersIcon, href: "/admin/users" },
          { title: "Pengaturan Kursus", icon: BookOpenIcon, href: "/admin/courses" },
          { title: "Laporan & Analitik", icon: ChartBarIcon, href: "/analytics" },
          { title: "Broadcast Notifikasi", icon: BellIcon, href: "/admin/notifications" },
        ]);
      } else if (user.role === 'TEACHER') {
        setUserOverallProgress(0);
        setUserQuickAccessLinks([
          { title: "Kursus Saya", icon: BriefcaseIcon, href: "/courses/my-creations" },
          { title: "Manajemen Siswa", icon: UsersIcon, href: "/instructor/students" },
          { title: "Forum Pengajar", icon: ChatBubbleLeftRightIcon, href: "/instructor/forum" },
          { title: "Pendapatan", icon: CurrencyDollarIcon, href: "/instructor/earnings" },
        ]);
      } else {
        setUserOverallProgress(75);
        setUserQuickAccessLinks([
          { title: "Kursus Saya", icon: BriefcaseIcon, href: "/courses" },
          { title: "Tugas Saya", icon: DocumentCheckIcon, href: "/assignments" },
          { title: "Forum Diskusi", icon: ChatBubbleLeftRightIcon, href: "/forum" },
          { title: "Sertifikat Saya", icon: StarIcon, href: "/certificates" },
        ]);
      }
    }
  }, [user]);

  if (isAuthLoading) {
    return (
      <div className="space-y-10 p-4 sm:p-6 lg:p-8 animate-pulse">
        <div className="h-12 bg-gray-200 dark:bg-neutral-700 rounded w-3/4"></div>
        <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_,i) => <div key={i} className="h-36 bg-gray-200 dark:bg-neutral-700 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <p className="text-lg text-neutral-600 dark:text-neutral-400">Silakan login untuk mengakses dashboard.</p>
        <Link href="/auth/login" className="mt-4 px-6 py-2 bg-brand-purple text-white rounded-lg hover:bg-purple-700">
          Ke Halaman Login
        </Link>
      </div>
    );
  }

  const displayName = user.name || user.username;
  const displayRole = user.role;
  const currentNewsItems = newsPagination.getPageItems(newsItems);

  return (
    <div className="space-y-12 p-4 sm:p-6 lg:p-8 text-text-light-primary dark:text-text-dark-primary">
      {/* Welcome Section */}
      <section>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight dark:text-neutral-100">
          Selamat Datang Kembali, <span className="text-brand-purple dark:text-purple-400">{displayName}</span>!
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-md">
          Anda masuk sebagai: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{displayRole}</span>. Mari kita lihat progres Anda hari ini.
        </p>
      </section>

      {/* Light Notifications */}
      {lightNotifications.length > 0 && (
        <section className="space-y-3">
          {lightNotifications.map(notif => (
            <NotificationBanner key={notif.id} notification={notif} />
          ))}
        </section>
      )}

      {/* Statistics Cards */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {userSpecificSummary.map(stat => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* New Launch */}
          <Card variant="elevated" padding="md">
            <CardHeader>
              <h2 className="text-2xl font-bold flex items-center dark:text-neutral-100">
                <SparklesIcon className="h-7 w-7 mr-2.5 text-yellow-500" /> Baru Diluncurkan
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {newLaunches.slice(0,2).map(launch => (
                  <Link href={launch.href || "#"} key={launch.id} className="group flex items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700/60 transition-all duration-300 border border-transparent hover:border-brand-purple/30 dark:hover:border-purple-500/40">
                    <Image src={launch.image || "/images/course-placeholder.jpg"} alt={launch.title} width={100} height={75} className="rounded-lg object-cover mr-5 shadow-md group-hover:shadow-lg transition-shadow" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-md group-hover:text-brand-purple dark:group-hover:text-purple-400 transition-colors">{launch.title}</h3>
                        {launch.new && <span className="text-xs bg-green-500 text-white px-2.5 py-1 rounded-full font-semibold">BARU</span>}
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{launch.type} oleh {launch.instructor}</p>
                    </div>
                    <ChevronRightIcon className="h-6 w-6 text-gray-400 dark:text-neutral-500 ml-3 transform group-hover:translate-x-1 transition-transform duration-300"/>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity & Graduated Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

            {(user.role === 'USER' || user.role === 'ADMIN') && (
              <Card variant="elevated" padding="md">
                <CardHeader>
                  <h2 className="text-2xl font-bold flex items-center dark:text-neutral-100">
                    <StarIcon className="h-7 w-7 mr-2.5 text-yellow-500" /> Kursus Selesai
                  </h2>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {graduatedCourses.slice(0, 2).map(course => (
                      <li key={course.id} className="flex justify-between items-center text-sm p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700/60 transition-colors">
                        <div>
                          <h4 className="font-semibold dark:text-neutral-200">{course.title}</h4>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">Selesai: {course.completionDate}</p>
                        </div>
                        <a href={course.certificateLink} className="text-xs text-brand-purple dark:text-purple-400 font-semibold hover:underline flex items-center">
                          Sertifikat <ChevronRightIcon className="h-3.5 w-3.5 ml-0.5"/>
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {(user.role === 'USER' || user.role === 'ADMIN') && (
            <Card variant="elevated" padding="md">
              <CardHeader>
                <h2 className="text-2xl font-bold flex items-center dark:text-neutral-100">
                  <CalendarDaysIcon className="h-7 w-7 mr-2.5 text-indigo-500" /> Tenggat Waktu
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.slice(0,3).map(deadline => (
                    <div key={deadline.id} className={`p-4 rounded-lg border-l-4 ${
                      deadline.color === 'red' ? 'border-red-500 bg-red-50 dark:bg-red-700/20' :
                      deadline.color === 'orange' ? 'border-orange-500 bg-orange-50 dark:bg-orange-700/20' :
                      'border-blue-500 bg-blue-50 dark:bg-blue-700/20'
                    }`}>
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-sm dark:text-neutral-100">{deadline.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          deadline.color === 'red' ? 'bg-red-200 dark:bg-red-600/50 text-red-700 dark:text-red-200' :
                          deadline.color === 'orange' ? 'bg-orange-200 dark:bg-orange-600/50 text-orange-700 dark:text-orange-200' :
                          'bg-blue-200 dark:bg-blue-600/50 text-blue-700 dark:text-blue-200'
                        }`}>{deadline.type}</span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5">
                        {deadline.course !== "N/A" && `${deadline.course} - `}
                        <span className={`font-semibold ${deadline.color === 'red' ? 'text-red-600 dark:text-red-400' : deadline.color === 'orange' ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'}`}>{deadline.due}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {(user.role === 'USER' || user.role === 'TEACHER') && (
            <Card variant="elevated" padding="md">
              <CardHeader>
                <h2 className="text-2xl font-bold mb-3 dark:text-neutral-100">Progres Belajar Anda</h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-2">
                  <p className="text-3xl font-bold text-brand-purple dark:text-purple-400">{userOverallProgress}%</p>
                  {user.role === 'USER' && <span className="ml-2 text-sm text-green-500 dark:text-green-400 flex items-center"><ArrowTrendingUpIcon className="h-4 w-4 mr-1"/> +5% minggu ini</span>}
                </div>
                <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-brand-purple h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${userOverallProgress}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2.5 text-center">
                  {user.role === 'USER' ? 'Hebat! Terus pertahankan momentum belajar Anda.' : 'Ringkasan progres siswa Anda.'}
                </p>
              </CardContent>
            </Card>
          )}

          <Card variant="elevated" padding="md">
            <CardHeader>
              <h2 className="text-2xl font-bold dark:text-neutral-100">Akses Cepat</h2>
            </CardHeader>
            <CardContent>
              <QuickAccessGrid links={userQuickAccessLinks} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* News Section */}
      <Card variant="elevated" padding="lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center dark:text-neutral-100">
            <NewspaperIcon className="h-7 w-7 mr-2.5 text-green-500" /> Berita & Pengumuman
          </h2>
          <Link href="/dashboard/news" className="mt-2 sm:mt-0 text-sm text-brand-purple dark:text-purple-400 font-semibold hover:underline flex items-center">
            Lihat Semua Berita <ChevronRightIcon className="h-4 w-4 ml-1"/>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentNewsItems.map(news => (
            <NewsCard key={news.id} news={news} />
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