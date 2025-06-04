// app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from 'react'; // Menambahkan useEffect
import Image from 'next/image';
import Link from 'next/link'; // Menambahkan impor Link
import {
  BellIcon, BookOpenIcon, CalendarDaysIcon, CheckCircleIcon, ChevronRightIcon,
  ClockIcon, DocumentCheckIcon, FireIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon, LightBulbIcon, NewspaperIcon, SparklesIcon, StarIcon, UserCircleIcon, VideoCameraIcon, BriefcaseIcon, ExclamationTriangleIcon, ArrowTrendingUpIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { useAuth } from '@/contexts/AuthContext'; // <<< 1. Impor useAuth
import { ChartBarIcon, UsersIcon } from 'lucide-react';

// --- Placeholder Data (Data ini bisa Anda pindahkan atau sesuaikan nanti) ---
const summaryStatsData = {
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

const newLaunches = [
  { id: 1, title: "Advanced React Patterns", type: "Kursus", instructor: "Dr. Eva Green", new: true, image: "https://i.pinimg.com/736x/be/23/ef/be23ef97f834d42f46a6c23f73c09934.jpg", href:"/courses/advanced-react-patterns" },
  { id: 2, title: "Data Science with Python: Module 3", type: "Modul", new: true, image: "https://i.pinimg.com/736x/ec/9e/fa/ec9efafdd84f5a8a71e65d9cd3da935e.jpg", href:"/courses/data-science-python" },
  { id: 3, title: "UI/UX Design Masterclass", type: "Kursus", instructor: "Alex Johnson", new: false, image: "https://i.pinimg.com/736x/2a/53/70/2a5370c752b7f4bd65766f3550afdb5d.jpg", href:"/courses/ui-ux-design-masterclass" },
];

const latestActivity = [
  { id: 1, text: "Anda menyelesaikan kuis 'Introduction to AI'", time: "2 jam lalu", icon: CheckCircleIcon },
  { id: 2, text: "Materi baru ditambahkan ke kursus 'Web Development Bootcamp'", time: "5 jam lalu", icon: LightBulbIcon },
  { id: 3, text: "Anda bergabung ke forum diskusi 'Project Collaboration'", time: "1 hari lalu", icon: ChatBubbleLeftRightIcon },
  { id: 4, text: "Pengumuman baru: Jadwal Ujian Akhir Semester", time: "2 hari lalu", icon: BellIcon },
];

const graduatedCourses = [
  { id: 1, title: "JavaScript Fundamentals", certificateLink: "#", completionDate: "15 Mei 2025" },
  { id: 2, title: "Introduction to UI/UX Design", certificateLink: "#", completionDate: "20 Apr 2025" },
  { id: 3, title: "Basic HTML & CSS", certificateLink: "#", completionDate: "10 Mar 2025" },
];

const upcomingDeadlines = [
  { id: 1, title: "Submit Esai Sejarah Modern", due: "3 hari lagi", type: "Tugas", course: "Sejarah Dunia", color: "red" },
  { id: 2, title: "Ujian Tengah Semester Kalkulus", due: "5 hari lagi", type: "Ujian", course: "Kalkulus I", color: "orange" },
  { id: 3, title: "Webinar: Future of Web Development", due: "1 minggu lagi", type: "Event", course: "N/A", color: "blue" },
];

const newsItems = [
  { id: 1, title: "Beasiswa Pendidikan 2025 Telah Dibuka!", date: "26 Mei 2025", new: true, category: "Beasiswa", image: "https://i.pinimg.com/736x/30/51/91/3051913846ace310db6e66c5450f8f7b.jpg" },
  { id: 2, title: "Tips Efektif Belajar Online dari Rumah", date: "25 Mei 2025", new: false, category: "Tips Belajar", image: "https://i.pinimg.com/736x/e1/d6/85/e1d685ad4d2f7bef2c9fd0da126d68b4.jpg" },
  { id: 3, title: "Update Kurikulum: Fokus pada Keterampilan AI", date: "24 Mei 2025", new: false, category: "Akademik", image: "https://i.pinimg.com/736x/67/d8/3c/67d83c1fb9aab00ec58e0a9820bbb70c.jpg" },
  { id: 4, title: "Seminar Karir: Mempersiapkan Diri untuk Dunia Kerja", date: "23 Mei 2025", new: true, category: "Karir", image: "https://i.pinimg.com/736x/5a/8c/5c/5a8c5c3d35b9e4a76e1f1e390439f2d5.jpg" },
];

const lightNotifications = [
  { id: 1, text: "Tugas 'Analisis Data' akan berakhir dalam 24 jam.", type: "deadline", icon: ExclamationTriangleIcon },
  { id: 2, text: "Dosen memberikan feedback pada tugas 'Esai Sastra'.", type: "feedback", icon: CheckCircleIcon },
];

// Komponen Kartu Statistik yang Ditingkatkan
const StatCard = ({ title, value, icon: Icon, color, bgColor }: { title: string, value: string, icon: React.ElementType, color: string, bgColor: string }) => (
  <BackgroundGradient className="rounded-2xl p-0.5 bg-white dark:bg-neutral-800/80 h-full" containerClassName="h-full">
    <div className={`p-6 rounded-[14px] ${bgColor} h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300`}>
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xs font-semibold text-text-light-secondary dark:text-neutral-400 uppercase tracking-wider">{title}</h3>
          <div className={`p-1.5 rounded-full ${bgColor.replace('bg-', 'bg-').replace('/50', '/70')}`}> {/* Sedikit penyesuaian warna ikon background */}
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
        <p className="text-4xl font-bold text-text-light-primary dark:text-neutral-50">{value}</p>
      </div>
      <button className={`mt-4 text-xs ${color} font-semibold flex items-center group transition-all duration-300 hover:opacity-80`}>
        Lihat Detail
        <ChevronRightIcon className="h-3.5 w-3.5 ml-1 transform group-hover:translate-x-0.5 transition-transform duration-300"/>
      </button>
    </div>
  </BackgroundGradient>
);

// Komponen untuk setiap item di section (New Launch, Activity, Graduated)
const SectionItemCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white dark:bg-neutral-800/80 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-200 dark:border-neutral-700/70 ${className}`}>
        {children}
    </div>
);

// Tipe untuk data pengguna dari AuthContext
type UserRole = 'ADMIN' | 'INSTRUCTOR' | 'USER' | string; // Sesuaikan dengan definisi Role Anda

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth(); // <<< 2. Dapatkan user dan status loading
  const [currentNewsPage, setCurrentNewsPage] = useState(0);
  const newsPerPage = 3;

  // State untuk data dinamis yang mungkin berbeda per peran
  const [userSpecificSummary, setUserSpecificSummary] = useState<any[]>([]);
  const [userOverallProgress, setUserOverallProgress] = useState(0);
  const [userQuickAccessLinks, setUserQuickAccessLinks] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      // Set data berdasarkan peran pengguna
      setUserSpecificSummary(summaryStatsData[user.role as UserRole] || summaryStatsData['USER']);
      
      // Contoh: Progres dan Quick Access bisa berbeda per peran
      if (user.role === 'ADMIN') {
        setUserOverallProgress(90); // Admin mungkin tidak punya progress personal
        setUserQuickAccessLinks([
            { title: "Manajemen User", icon: UsersIcon, href: "/admin/users" },
            { title: "Pengaturan Kursus", icon: BookOpenIcon, href: "/admin/courses" },
            { title: "Laporan & Analitik", icon: ChartBarIcon, href: "/analytics" },
            { title: "Broadcast Notifikasi", icon: BellIcon, href: "/admin/notifications" },
        ]);
      } else if (user.role === 'INSTRUCTOR') {
        setUserOverallProgress(0); // Instruktur mungkin tidak punya progress personal
        setUserQuickAccessLinks([
            { title: "Kursus Saya", icon: BriefcaseIcon, href: "/courses/my-creations" },
            { title: "Manajemen Siswa", icon: UsersIcon, href: "/instructor/students" },
            { title: "Forum Pengajar", icon: ChatBubbleLeftRightIcon, href: "/instructor/forum" },
            { title: "Pendapatan", icon: CurrencyDollarIcon, href: "/instructor/earnings" },
        ]);
      } else { // USER
        setUserOverallProgress(75); // Ambil dari data pengguna jika ada
        setUserQuickAccessLinks([
            { title: "Kursus Saya", icon: BriefcaseIcon, href: "/courses" },
            { title: "Tugas Saya", icon: DocumentCheckIcon, href: "/assignments" },
            { title: "Forum Diskusi", icon: ChatBubbleLeftRightIcon, href: "/forum" },
            { title: "Sertifikat Saya", icon: StarIcon, href: "/certificates" },
        ]);
      }
    }
  }, [user]); // Jalankan efek ketika objek user berubah

  if (isAuthLoading) {
    // Tampilkan skeleton loader atau pesan loading saat data auth dimuat
    return (
      <div className="space-y-10 p-4 sm:p-6 lg:p-8 animate-pulse">
        <div className="h-12 bg-gray-200 dark:bg-neutral-700 rounded w-3/4"></div>
        <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_,i) => <div key={i} className="h-36 bg-gray-200 dark:bg-neutral-700 rounded-2xl"></div>)}
        </div>
        {/* Tambahkan skeleton lain untuk bagian berikutnya */}
      </div>
    );
  }

  if (!user) {
    // Jika tidak ada user setelah loading selesai (misal, token tidak valid atau belum login)
    // Idealnya, ini akan di-handle oleh HOC atau middleware yang me-redirect ke /login
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
            <p className="text-lg text-neutral-600 dark:text-neutral-400">Silakan login untuk mengakses dashboard.</p>
            <Link href="/login" className="mt-4 px-6 py-2 bg-brand-purple text-white rounded-lg hover:bg-purple-700">
                Ke Halaman Login
            </Link>
        </div>
    );
  }

  // Data pengguna sekarang berasal dari context
  const displayName = user.name || user.username; // Gunakan nama jika ada, fallback ke username
  const displayRole = user.role;

  return (
    <div className="space-y-12 p-4 sm:p-6 lg:p-8 text-text-light-primary dark:text-text-dark-primary">
      {/* Welcome Section */}
      <section>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight dark:text-neutral-100">Selamat Datang Kembali, <span className="text-brand-purple dark:text-purple-400">{displayName}</span>!</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-md">
          Anda masuk sebagai: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{displayRole}</span>. Mari kita lihat progres Anda hari ini.
        </p>
      </section>

      {/* Light Notifications */}
      {lightNotifications.length > 0 && (
        <section className="space-y-3">
          {lightNotifications.map(notif => (
            <div key={notif.id} className={`flex items-center p-4 rounded-xl text-sm shadow-md transition-all hover:shadow-lg ${notif.type === 'deadline' ? 'bg-red-100 dark:bg-red-700/30 text-red-800 dark:text-red-200 border-l-4 border-red-500' : 'bg-blue-100 dark:bg-blue-700/30 text-blue-800 dark:text-blue-200 border-l-4 border-blue-500'}`}>
              <notif.icon className={`h-6 w-6 mr-3 flex-shrink-0 ${notif.type === 'deadline' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} />
              <span className="font-medium">{notif.text}</span>
            </div>
          ))}
        </section>
      )}

      {/* Ringkasan (Statistik Cards) - Menggunakan data dinamis berdasarkan peran */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {userSpecificSummary.map(stat => <StatCard key={stat.title} {...stat} />)}
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* New Launch */}
          <SectionItemCard>
            <h2 className="text-2xl font-bold mb-5 flex items-center dark:text-neutral-100">
              <SparklesIcon className="h-7 w-7 mr-2.5 text-yellow-500" /> Baru Diluncurkan
            </h2>
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
          </SectionItemCard>

          {/* Latest Activity & Graduated Courses - Konten ini bisa juga disesuaikan berdasarkan peran */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SectionItemCard>
              <h2 className="text-2xl font-bold mb-5 flex items-center dark:text-neutral-100">
                <FireIcon className="h-7 w-7 mr-2.5 text-red-500" /> Aktivitas Terkini
              </h2>
              <ul className="space-y-4">
                {latestActivity.slice(0, 3).map(activity => (
                  <li key={activity.id} className="flex items-start text-sm group">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-brand-purple/10 dark:bg-purple-500/20 flex items-center justify-center mr-3 group-hover:bg-brand-purple/20 dark:group-hover:bg-purple-500/30 transition-colors">
                        <activity.icon className="h-4 w-4 text-brand-purple dark:text-purple-400" />
                    </div>
                    <div>
                      <span className="dark:text-neutral-200">{activity.text}</span>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </SectionItemCard>

            { (user.role === 'USER' || user.role === 'ADMIN') && // Hanya tampilkan untuk USER atau ADMIN
                <SectionItemCard>
                <h2 className="text-2xl font-bold mb-5 flex items-center dark:text-neutral-100">
                    <StarIcon className="h-7 w-7 mr-2.5 text-yellow-500" /> Kursus Selesai
                </h2>
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
                </SectionItemCard>
            }
          </div>
        </div>

        {/* Kolom Kanan - Konten ini bisa juga disesuaikan berdasarkan peran */}
        <div className="space-y-8">
            { (user.role === 'USER' || user.role === 'ADMIN') && // Hanya tampilkan untuk USER atau ADMIN
                <SectionItemCard>
                    <h2 className="text-2xl font-bold mb-5 flex items-center dark:text-neutral-100">
                    <CalendarDaysIcon className="h-7 w-7 mr-2.5 text-indigo-500" /> Tenggat Waktu
                    </h2>
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
                </SectionItemCard>
            }

            { (user.role === 'USER' || user.role === 'INSTRUCTOR') && // Tampilkan untuk USER atau INSTRUCTOR
                <SectionItemCard>
                    <h2 className="text-2xl font-bold mb-3 dark:text-neutral-100">Progres Belajar Anda</h2>
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
                </SectionItemCard>
            }

          <SectionItemCard>
            <h2 className="text-2xl font-bold mb-5 dark:text-neutral-100">Akses Cepat</h2>
            <div className="grid grid-cols-2 gap-4">
              {userQuickAccessLinks.map(link => (
                <Link key={link.title} href={link.href} className="group flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-neutral-700/70 rounded-xl hover:bg-brand-purple/10 dark:hover:bg-purple-500/30 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-3 rounded-full bg-brand-purple/10 dark:bg-purple-500/20 group-hover:bg-brand-purple/20 dark:group-hover:bg-purple-500/40 transition-colors mb-2">
                     <link.icon className="h-6 w-6 text-brand-purple dark:text-purple-400" />
                  </div>
                  <span className="text-sm font-medium text-center text-neutral-700 dark:text-neutral-200 group-hover:text-brand-purple dark:group-hover:text-purple-300 transition-colors">{link.title}</span>
                </Link>
              ))}
            </div>
          </SectionItemCard>
        </div>
      </section>

      {/* Berita Terkait - Ini bisa bersifat umum untuk semua peran */}
      <section className="bg-white dark:bg-neutral-800/80 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700/70">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center dark:text-neutral-100">
            <NewspaperIcon className="h-7 w-7 mr-2.5 text-green-500" /> Berita & Pengumuman
          </h2>
          <Link href="/dashboard/news" className="mt-2 sm:mt-0 text-sm text-brand-purple dark:text-purple-400 font-semibold hover:underline flex items-center">
            Lihat Semua Berita <ChevronRightIcon className="h-4 w-4 ml-1"/>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.slice(currentNewsPage * newsPerPage, (currentNewsPage + 1) * newsPerPage).map(news => (
            <a href="#" key={news.id} className="group rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700/80 flex flex-col hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative w-full h-48 overflow-hidden">
                <Image src={news.image || "/images/news-placeholder.jpg"} alt={news.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-300"/>
                {news.new && <span className="absolute top-3 right-3 text-xs bg-red-500 text-white px-2.5 py-1 rounded-full font-semibold shadow-md">BARU</span>}
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-xs bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 px-2.5 py-1 rounded-full self-start mb-2 font-medium">{news.category}</span>
                <h3 className="font-semibold text-md mb-1.5 flex-grow group-hover:text-brand-purple dark:group-hover:text-purple-400 transition-colors dark:text-neutral-100 line-clamp-2">{news.title}</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{news.date}</p>
              </div>
            </a>
          ))}
        </div>
         {Math.ceil(newsItems.length / newsPerPage) > 1 && (
            <div className="flex justify-center mt-8 space-x-2.5">
                {Array.from({ length: Math.ceil(newsItems.length / newsPerPage) }).map((_, i) => (
                <button
                    key={i}
                    onClick={() => setCurrentNewsPage(i)}
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${currentNewsPage === i ? 'bg-brand-purple scale-125' : 'bg-gray-300 dark:bg-neutral-600 hover:bg-gray-400 dark:hover:bg-neutral-500'}`}
                    aria-label={`Go to page ${i + 1}`}
                />
                ))}
            </div>
         )}
      </section>
    </div>
  );
}
