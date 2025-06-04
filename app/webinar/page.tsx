// 6. app/dashboard/webinar/page.tsx
// Path: app/dashboard/webinar/page.tsx

"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { WebinarCard } from './components/WebinarCard';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Tv2 } from 'lucide-react';

interface Speaker { name: string; title: string; avatarUrl?: string; }
type WebinarStatus = "LIVE" | "UPCOMING" | "ENDED";
interface Webinar {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  category: string;
  thumbnailUrl: string;
  speakers: Speaker[];
  dateTime: string;
  durationMinutes: number;
  status: WebinarStatus;
  joinUrl?: string;
  replayUrl?: string;
  materialsUrl?: { name: string; url: string }[];
  tags?: string[];
}

const allWebinarsData: Webinar[] = [
  { id: "web001", slug: "mastering-nextjs-14", title: "Mastering Next.js 14: Dari Dasar hingga Aplikasi Skala Besar", tagline: "Pelajari fitur terbaru Next.js dan bangun aplikasi web modern yang super cepat.", category: "Teknologi", thumbnailUrl: "https://i.pinimg.com/736x/be/23/ef/be23ef97f834d42f46a6c23f73c09934.jpg", speakers: [{ name: "Budi Santoso", title: "Lead Developer" }], dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), durationMinutes: 90, status: "UPCOMING", joinUrl: "#", tags: ["Next.js", "React", "TypeScript"] },
  { id: "web002", slug: "digital-marketing-trends-2025", title: "Tren Digital Marketing 2025: Strategi Jitu untuk Bisnis Anda", tagline: "Kupas tuntas tren terbaru dan siapkan strategi marketing Anda untuk tahun depan.", category: "Bisnis", thumbnailUrl: "https://i.pinimg.com/736x/e1/d6/85/e1d685ad4d2f7bef2c9fd0da126d68b4.jpg", speakers: [{ name: "Citra Dewi", title: "Marketing Expert" }], dateTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: "LIVE", joinUrl: "#", tags: ["Marketing", "SEO", "Social Media"] },
  { id: "web003", slug: "ui-ux-design-fundamental", title: "Fundamental Desain UI/UX untuk Aplikasi Mobile", tagline: "Pahami prinsip dasar desain antarmuka dan pengalaman pengguna yang memukau.", category: "Desain", thumbnailUrl: "https://i.pinimg.com/736x/2a/53/70/2a5370c752b7f4bd65766f3550afdb5d.jpg", speakers: [{ name: "Alex Johnson", title: "Senior UI/UX Designer" }], dateTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 120, status: "ENDED", replayUrl: "#", materialsUrl: [{name: "Slide PDF", url: "#"}] , tags: ["UI Design", "UX Research", "Mobile Apps"]},
  { id: "web004", slug: "investasi-saham-pemula", title: "Panduan Investasi Saham untuk Pemula", category: "Keuangan", thumbnailUrl: "https://i.pinimg.com/736x/30/51/91/3051913846ace310db6e66c5450f8f7b.jpg", speakers: [{ name: "Rina Wijaya", title: "Financial Advisor" }], dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 75, status: "UPCOMING", joinUrl: "#", tags: ["Investasi", "Saham", "Pasar Modal"] },
  { id: "web005", slug: "fotografi-produk-ecommerce", title: "Teknik Fotografi Produk untuk E-commerce yang Menjual", category: "Kreatif", thumbnailUrl: "https://i.pinimg.com/736x/55/c8/5b/55c85be926efc0b1a90f64d607d3ec8e.jpg", speakers: [{ name: "Andi Pratama", title: "Professional Photographer" }], dateTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 90, status: "ENDED", replayUrl: "#", tags: ["Fotografi", "E-commerce", "Produk"] },
  { id: "web006", slug: "public-speaking-mastery", title: "Public Speaking Mastery: Berbicara PD di Depan Umum", category: "Pengembangan Diri", thumbnailUrl: "https://i.pinimg.com/736x/ec/9e/fa/ec9efafdd84f5a8a71e65d9cd3da935e.jpg", speakers: [{ name: "Sarah Lee", title: "Communication Coach" }], dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), durationMinutes: 60, status: "UPCOMING", joinUrl: "#", tags: ["Komunikasi", "Presentasi"] },
];

const webinarCategoriesFilter = ["Semua Kategori", "Teknologi", "Bisnis", "Desain", "Keuangan", "Kreatif", "Pengembangan Diri"];
const webinarDateFilters = ["Semua Waktu", "Minggu Ini", "Bulan Ini", "Akan Datang", "Sudah Lewat"];


export default function AllWebinarsPage() {
  const searchParams = useSearchParams();
  const activeCategoryParam = searchParams.get('category') || 'all';

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Semua Kategori");
  const [selectedDate, setSelectedDate] = useState("Semua Waktu");
  const [showFilters, setShowFilters] = useState(false);

  const filteredWebinars = useMemo(() => {
    let webinars = allWebinarsData;

    if (activeCategoryParam === 'upcoming') {
      webinars = webinars.filter(w => w.status === 'UPCOMING' || w.status === 'LIVE');
    } else if (activeCategoryParam === 'past') {
      webinars = webinars.filter(w => w.status === 'ENDED');
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      webinars = webinars.filter(webinar =>
        webinar.title.toLowerCase().includes(lowerSearchTerm) ||
        webinar.speakers.some(s => s.name.toLowerCase().includes(lowerSearchTerm)) ||
        (webinar.tags && webinar.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm)))
      );
    }

    if (selectedTopic !== "Semua Kategori") {
      webinars = webinars.filter(webinar => webinar.category === selectedTopic);
    }
    
    const now = new Date();
    if (selectedDate === "Minggu Ini") {
        const currentDay = now.getDay(); 
        const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        webinars = webinars.filter(w => new Date(w.dateTime) >= startOfWeek && new Date(w.dateTime) <= endOfWeek);
    } else if (selectedDate === "Bulan Ini") {
        webinars = webinars.filter(w => new Date(w.dateTime).getMonth() === now.getMonth() && new Date(w.dateTime).getFullYear() === now.getFullYear());
    } else if (selectedDate === "Akan Datang") {
        webinars = webinars.filter(w => new Date(w.dateTime) > now && (w.status === "UPCOMING" || w.status === "LIVE"));
    } else if (selectedDate === "Sudah Lewat") {
        webinars = webinars.filter(w => new Date(w.dateTime) < now && w.status === "ENDED");
    }

    return webinars;
  }, [activeCategoryParam, searchTerm, selectedTopic, selectedDate]);
  
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);


  return (
    <div className="space-y-10">
      <div className="bg-white dark:bg-neutral-800/80 p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700/70">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
          <div className="relative flex-grow w-full">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
            <input
              type="search"
              placeholder="Cari webinar, pembicara, atau topik..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700/60 text-sm focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent transition-shadow focus:shadow-lg"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full md:w-auto flex items-center justify-center px-5 py-3.5 rounded-xl border-2 border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700/60 text-sm font-semibold text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500"
          >
            <FunnelIcon className="h-5 w-5" />
            
          </button>
        </div>
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-fadeIn">
            <div>
              <label htmlFor="topic-filter" className="block text-xs font-medium text-gray-700 dark:text-neutral-300 mb-1">Kategori Topik</label>
              <div className="relative">
                <select id="topic-filter" value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-md border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent">
                  {webinarCategoriesFilter.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-neutral-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label htmlFor="date-filter" className="block text-xs font-medium text-gray-700 dark:text-neutral-300 mb-1">Filter Waktu</label>
              <div className="relative">
                <select id="date-filter" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-md border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent">
                  {webinarDateFilters.map(dateOpt => <option key={dateOpt} value={dateOpt}>{dateOpt}</option>)}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-neutral-500 pointer-events-none" />
              </div>
            </div>
            <div className="sm:col-span-2 md:col-span-1 flex items-end">
                <button
                    onClick={() => { setSearchTerm(""); setSelectedTopic("Semua Kategori"); setSelectedDate("Semua Waktu"); setShowFilters(false); }}
                    className="w-full flex items-center justify-center text-xs text-gray-600 dark:text-neutral-400 hover:text-brand-purple dark:hover:text-purple-400 font-medium py-2.5 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-700/50 border border-gray-300 dark:border-neutral-600"
                >
                    <XMarkIcon className="h-4 w-4 mr-1" /> Reset Filter
                </button>
            </div>
          </div>
        )}
      </div>

      {filteredWebinars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          {filteredWebinars.map((webinar) => (
            <WebinarCard key={webinar.id} webinar={webinar} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 col-span-full bg-white dark:bg-neutral-800/80 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700/70">
          <Tv2 className="mx-auto h-20 w-20 text-gray-300 dark:text-neutral-700 mb-4" strokeWidth={1.5}/>
          <h3 className="mt-2 text-2xl font-semibold text-gray-900 dark:text-neutral-200">Oops! Webinar Tidak Ditemukan</h3>
          <p className="mt-2 text-base text-gray-500 dark:text-neutral-400 max-w-md mx-auto">
            Kami tidak dapat menemukan webinar yang cocok dengan pencarian atau filter Anda. Coba kata kunci atau filter lain.
          </p>
           <button
                onClick={() => { setSearchTerm(""); setSelectedTopic("Semua Kategori"); setSelectedDate("Semua Waktu"); }}
                className="mt-8 px-6 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-brand-purple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-neutral-900"
            >
                Lihat Semua Webinar
            </button>
        </div>
      )}

      {filteredWebinars.length > 6 && (
          <div className="mt-16 flex justify-center">
            <button className="px-8 py-3 border border-gray-300 dark:border-neutral-600 text-sm font-semibold rounded-lg text-gray-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700/70 transition-colors">
                Muat Lebih Banyak Webinar
            </button>
          </div>
      )}
    </div>
  );
}
