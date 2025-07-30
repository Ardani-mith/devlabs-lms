// 6. app/dashboard/webinar/page.tsx
// Path: app/dashboard/webinar/page.tsx

"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarDaysIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { WebinarCard } from './components/WebinarCard';

// TypeScript Types
interface Webinar {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  category: string;
  thumbnailUrl: string;
  speakers: Array<{ name: string; title: string }>;
  dateTime: string;
  durationMinutes: number;
  status: "UPCOMING" | "LIVE" | "ENDED";
  joinUrl?: string;
  replayUrl?: string;
  materialsUrl?: Array<{ name: string; url: string }>;
  tags: string[];
}

interface WebinarData {
  webinars: Webinar[];
  categories: string[];
}

// API function to fetch webinar data
const fetchWebinarData = async (): Promise<WebinarData> => {
  try {
    // Use mock service instead of API
    const { MockServices } = await import('@/lib/services/mockService');
    return await MockServices.webinar.getWebinars();
  } catch (error) {
    console.error('Webinar API error:', error);
    return {
      webinars: [],
      categories: ["Semua Kategori"]
    };
  }
};

export default function WebinarPage() {
  const { user } = useAuth();
  const [webinarData, setWebinarData] = useState<WebinarData>({
    webinars: [],
    categories: ["Semua Kategori"]
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [selectedDateFilter, setSelectedDateFilter] = useState("Semua Waktu");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadWebinarData = async () => {
      try {
        setLoading(true);
        const data = await fetchWebinarData();
        setWebinarData(data);
      } catch (error) {
        console.error('Error loading webinar data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWebinarData();
  }, []);

  const { webinars } = webinarData;
  const webinarCategories = ["Semua Kategori", ...webinarData.categories];
  const webinarDateFilters = ["Semua Waktu", "Minggu Ini", "Bulan Ini", "Akan Datang", "Sudah Lewat"];

  // Filter webinars based on search, category, and date
  const filteredWebinars = useMemo(() => {
    return webinars.filter(webinar => {
      // Search filter
      const matchesSearch = webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           webinar.speakers.some(speaker => speaker.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           webinar.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === "Semua Kategori" || webinar.category === selectedCategory;

      // Date filter
      const now = new Date();
      const webinarDate = new Date(webinar.dateTime);
      let matchesDate = true;

      if (selectedDateFilter === "Minggu Ini") {
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        matchesDate = webinarDate >= weekStart && webinarDate < weekEnd;
      } else if (selectedDateFilter === "Bulan Ini") {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        matchesDate = webinarDate >= monthStart && webinarDate < monthEnd;
      } else if (selectedDateFilter === "Akan Datang") {
        matchesDate = webinarDate > now;
      } else if (selectedDateFilter === "Sudah Lewat") {
        matchesDate = webinarDate < now;
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [webinars, searchQuery, selectedCategory, selectedDateFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary">
        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-neutral-700 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary">
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 space-y-10">
        
        {/* Header */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Webinar & Online Events
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto lg:mx-0">
            Bergabunglah dengan webinar eksklusif dan perluas pengetahuan Anda bersama para ahli di berbagai bidang.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search Bar */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500" />
            <input
              type="search"
              placeholder="Cari webinar, pembicara, atau topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative min-w-[200px]">
            <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none pl-10 pr-8 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            >
              {webinarCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className="relative min-w-[160px]">
            <CalendarDaysIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500" />
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="w-full appearance-none pl-10 pr-8 py-3 rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            >
              {webinarDateFilters.map((filter) => (
                <option key={filter} value={filter}>{filter}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-neutral-400">
            Menampilkan {filteredWebinars.length} webinar
            {selectedCategory !== "Semua Kategori" && ` dalam kategori "${selectedCategory}"`}
            {searchQuery && ` yang cocok dengan "${searchQuery}"`}
          </p>
        </div>

        {/* Webinar Grid */}
        {filteredWebinars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWebinars.map((webinar) => (
              <WebinarCard key={webinar.id} webinar={webinar} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <CalendarDaysIcon className="h-16 w-16 text-gray-300 dark:text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Tidak ada webinar ditemukan
              </h3>
              <p className="text-gray-600 dark:text-neutral-400 mb-6">
                Coba ubah filter atau kata kunci pencarian Anda.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Semua Kategori");
                  setSelectedDateFilter("Semua Waktu");
                }}
                className="bg-brand-purple hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Reset Filter
              </button>
            </div>
          </div>
        )}

        {/* Call to Action for Teachers/Admins */}
        {user && (user.role === 'TEACHER' || user.role === 'ADMIN') && (
          <div className="bg-gradient-to-r from-brand-purple to-purple-700 p-8 rounded-2xl text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Ingin mengadakan webinar?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Berbagi pengetahuan Anda dengan komunitas pembelajar melalui webinar interaktif.
            </p>
            <button className="bg-white text-brand-purple hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
              Ajukan Webinar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
