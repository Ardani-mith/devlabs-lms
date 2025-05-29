// app/dashboard/page.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import {
  BellIcon, BookOpenIcon, CalendarDaysIcon, CheckCircleIcon, ChevronDownIcon, ChevronRightIcon,
  ClockIcon, DocumentCheckIcon, FireIcon,
  ChatBubbleLeftRightIcon,
  HomeIcon, LightBulbIcon, NewspaperIcon, SparklesIcon, StarIcon, UserCircleIcon, VideoCameraIcon, BriefcaseIcon, ExclamationTriangleIcon, ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { BackgroundGradient } from '@/components/ui/background-gradient'; // Asumsi komponen dari Aceternity UI

// Placeholder Data (Gantilah dengan data asli dari API)
const userData = {
  name: "Ardani The OG",
  role: "Siswa",
};

const summaryStats = [
  { title: "Kursus Aktif", value: "5", icon: BookOpenIcon, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/50", borderColor: "border-blue-500/30" },
  { title: "Tugas Belum Selesai", value: "3", icon: DocumentCheckIcon, color: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-100 dark:bg-orange-900/50", borderColor: "border-orange-500/30" },
  { title: "Sertifikat Diperoleh", value: "12", icon: StarIcon, color: "text-yellow-500 dark:text-yellow-400", bgColor: "bg-yellow-100 dark:bg-yellow-900/50", borderColor: "border-yellow-500/30" },
  { title: "Total Jam Belajar", value: "128", icon: ClockIcon, color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/50", borderColor: "border-green-500/30" },
];

const newLaunches = [
  { id: 1, title: "Advanced React Patterns", type: "Kursus", instructor: "Dr. Eva Green", new: true, image: "https://i.pinimg.com/736x/be/23/ef/be23ef97f834d42f46a6c23f73c09934.jpg" },
  { id: 2, title: "Data Science with Python: Module 3", type: "Modul", new: true, image: "https://i.pinimg.com/736x/ec/9e/fa/ec9efafdd84f5a8a71e65d9cd3da935e.jpg" },
  { id: 3, title: "UI/UX Design Masterclass", type: "Kursus", instructor: "Alex Johnson", new: false, image: "https://i.pinimg.com/736x/2a/53/70/2a5370c752b7f4bd65766f3550afdb5d.jpg" }, // Contoh tambahan
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

const overallProgress = 75; // Persentase

const quickAccessLinks = [
  { title: "Kursus Saya", icon: BriefcaseIcon, href: "/dashboard/courses" },
  { title: "Tugas", icon: DocumentCheckIcon, href: "/dashboard/assignments" },
  { title: "Forum Diskusi", icon: ChatBubbleLeftRightIcon, href: "/dashboard/forum" },
  { title: "Sertifikat Saya", icon: StarIcon, href: "/dashboard/certificates" },
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
const StatCard = ({ title, value, icon: Icon, color, bgColor, borderColor }: { title: string, value: string, icon: React.ElementType, color: string, bgColor: string, borderColor?: string }) => (
  <BackgroundGradient className="rounded-2xl p-0.5 bg-white dark:bg-neutral-800/80 h-full" containerClassName="h-full">
    <div className={`p-6 rounded-[14px] ${bgColor} h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300`}>
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xs font-semibold text-text-light-secondary dark:text-neutral-400 uppercase tracking-wider">{title}</h3>
          <div className={`p-1.5 rounded-full ${bgColor === 'bg-blue-100 dark:bg-blue-900/50' ? 'bg-blue-200/70 dark:bg-blue-800/70' : bgColor === 'bg-orange-100 dark:bg-orange-900/50' ? 'bg-orange-200/70 dark:bg-orange-800/70' : bgColor === 'bg-yellow-100 dark:bg-yellow-900/50' ? 'bg-yellow-200/70 dark:bg-yellow-800/70' : 'bg-green-200/70 dark:bg-green-800/70'}`}>
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
    <div className={`bg-white dark:bg-neutral-800/80 p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
        {children}
    </div>
);

export default function DashboardPage() {
  const [currentNewsPage, setCurrentNewsPage] = useState(0);
  const newsPerPage = 3; // Jumlah berita per halaman di panel

  return (
    <div className="space-y-10 p-4 sm:p-6 lg:p-8 text-text-light-primary dark:text-text-dark-primary"> {/* Increased spacing */}
      {/* Welcome Section */}
      <section>
        <h1 className="text-4xl font-extrabold tracking-tight dark:text-neutral-100">Selamat Datang Kembali, <span className="text-brand-purple dark:text-purple-400">{userData.name}</span>!</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-md">
          Anda masuk sebagai: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{userData.role}</span>. Mari kita lihat progres Anda hari ini.
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

      {/* Ringkasan (Statistik Cards) */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map(stat => <StatCard key={stat.title} {...stat} />)}
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8"> {/* Increased gap */}
        {/* Kolom Kiri & Tengah (New Launch, Activity, Graduated) */}
        <div className="lg:col-span-2 space-y-8">
          {/* New Launch */}
          <SectionItemCard>
            <h2 className="text-2xl font-bold mb-5 flex items-center dark:text-neutral-100">
              <SparklesIcon className="h-7 w-7 mr-2.5 text-yellow-500" /> Baru Diluncurkan
            </h2>
            <div className="space-y-5">
              {newLaunches.slice(0,2).map(launch => (
                <a href="#" key={launch.id} className="group flex items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700/60 transition-all duration-300 border border-transparent hover:border-brand-purple/30 dark:hover:border-purple-500/40">
                  <Image src={launch.image || "/images/course-placeholder.jpg"} alt={launch.title} width={100} height={75} className="rounded-lg object-cover mr-5 shadow-md group-hover:shadow-lg transition-shadow" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-md group-hover:text-brand-purple dark:group-hover:text-purple-400 transition-colors">{launch.title}</h3>
                        {launch.new && <span className="text-xs bg-green-500 text-white px-2.5 py-1 rounded-full font-semibold">BARU</span>}
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{launch.type} oleh {launch.instructor}</p>
                  </div>
                  <ChevronRightIcon className="h-6 w-6 text-gray-400 dark:text-neutral-500 ml-3 transform group-hover:translate-x-1 transition-transform duration-300"/>
                </a>
              ))}
            </div>
          </SectionItemCard>

          {/* Latest Activity & Graduated Courses */}
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
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-8">
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

          <SectionItemCard>
            <h2 className="text-2xl font-bold mb-3 dark:text-neutral-100">Progres Belajar Anda</h2>
            <div className="flex items-center mb-2">
                <p className="text-3xl font-bold text-brand-purple dark:text-purple-400">{overallProgress}%</p>
                <span className="ml-2 text-sm text-green-500 dark:text-green-400 flex items-center">
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-1"/> +5% minggu ini
                </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-brand-purple h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2.5 text-center">
              Hebat! Terus pertahankan momentum belajar Anda.
            </p>
          </SectionItemCard>

          <SectionItemCard>
            <h2 className="text-2xl font-bold mb-5 dark:text-neutral-100">Akses Cepat</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickAccessLinks.map(link => (
                <a key={link.title} href={link.href} className="group flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-neutral-700/70 rounded-xl hover:bg-brand-purple/10 dark:hover:bg-purple-500/30 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-3 rounded-full bg-brand-purple/10 dark:bg-purple-500/20 group-hover:bg-brand-purple/20 dark:group-hover:bg-purple-500/40 transition-colors mb-2">
                     <link.icon className="h-6 w-6 text-brand-purple dark:text-purple-400" />
                  </div>
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 group-hover:text-brand-purple dark:group-hover:text-purple-300 transition-colors">{link.title}</span>
                </a>
              ))}
            </div>
          </SectionItemCard>
        </div>
      </section>

      {/* Berita Terkait */}
      <section className="bg-white dark:bg-neutral-800/80 p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center dark:text-neutral-100">
            <NewspaperIcon className="h-7 w-7 mr-2.5 text-green-500" /> Berita & Pengumuman
          </h2>
          <a href="/dashboard/news" className="mt-2 sm:mt-0 text-sm text-brand-purple dark:text-purple-400 font-semibold hover:underline flex items-center">
            Lihat Semua Berita <ChevronRightIcon className="h-4 w-4 ml-1"/>
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.slice(currentNewsPage * newsPerPage, (currentNewsPage + 1) * newsPerPage).map(news => (
            <a href="#" key={news.id} className="group rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700/80 flex flex-col hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative w-full h-48 overflow-hidden">
                <Image src={news.image || "/images/news-placeholder.jpg"} alt={news.title} layout="fill" className="object-cover group-hover:scale-105 transition-transform duration-300"/>
                {news.new && <span className="absolute top-3 right-3 text-xs bg-red-500 text-white px-2.5 py-1 rounded-full font-semibold shadow-md">BARU</span>}
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-xs bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-300 px-2.5 py-1 rounded-full self-start mb-2 font-medium">{news.category}</span>
                <h3 className="font-semibold text-md mb-1.5 flex-grow group-hover:text-brand-purple dark:group-hover:text-purple-400 transition-colors dark:text-neutral-100">{news.title}</h3>
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
