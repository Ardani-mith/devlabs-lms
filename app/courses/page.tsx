"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { CourseDisplayCard } from '@/app/courses/CourseDisplayCard'; // Pastikan path ini benar
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, ChevronDownIcon, FunnelIcon, XMarkIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { BookOpenIcon as NoCourseIcon } from '@heroicons/react/24/solid';

// Course interface definition
interface Course {
  id: string;
  title: string;
  thumbnailUrl: string;
  instructorName: string;
  instructorAvatarUrl?: string;
  category: string;
  lessonsCount: number;
  totalDurationHours: number;
  level: "Pemula" | "Menengah" | "Lanjutan" | "Semua Level";
  rating?: number;
  studentsEnrolled?: number;
  price?: number | "Gratis";
  courseUrl?: string;
  isNew?: boolean;
  tags?: string[];
}


const courseCategories = ["Semua Kategori", "Web Development", "Data Science", "UI/UX Design", "Digital Marketing", "Bahasa", "Manajemen", "Bisnis"];
const courseLevels = ["Semua Level", "Pemula", "Menengah", "Lanjutan"];


export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [selectedLevel, setSelectedLevel] = useState("Semua Level");
  const [showFilters, setShowFilters] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const filteredCourses = useMemo(() => {
    return courses
      .filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.tags && course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      )
      .filter(course =>
        selectedCategory === "Semua Kategori" || course.category === selectedCategory
      )
      .filter(course =>
        selectedLevel === "Semua Level" || course.level === selectedLevel
      );
  }, [searchTerm, selectedCategory, selectedLevel, courses]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`);
        const courseData = await response.json();
        setCourses(courseData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    
    fetchCourses();
  }, []);

  return (
    <div className="space-y-10 p-4 sm:p-6 lg:p-8 text-text-light-primary dark:text-text-dark-primary">
      <header className="mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-neutral-100 sm:text-5xl">
          Jelajahi Dunia Pengetahuan
        </h1>
        <p className="mt-3 text-base text-gray-600 dark:text-neutral-400 max-w-3xl">
          Temukan kursus yang tepat untuk Anda dari berbagai kategori dan tingkat keahlian.
          Mulai perjalanan belajar Anda hari ini!
        </p>
      </header>

      {/* Fitur Search dan Filter */}
      <div className="sticky top-[calc(var(--header-height,4rem)+1rem)] z-30 bg-gray-50/90 dark:bg-neutral-900/90 backdrop-blur-lg py-5 rounded-xl shadow-lg mb-10 -mx-4 px-4 md:-mx-6 md:px-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full md:w-auto">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
            <input
              type="search"
              placeholder="Cari kursus, instruktur, atau topik..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent transition-shadow focus:shadow-lg"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full md:w-auto flex items-center justify-center px-5 py-3.5 rounded-lg border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-700/70 transition-colors focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500"
          >
            <FunnelIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-neutral-400" />
            Filter
            <ChevronDownIcon className={`h-5 w-5 ml-2 text-gray-400 dark:text-neutral-500 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700/60 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
            <div>
              <label htmlFor="category-filter" className="block text-xs font-medium text-gray-700 dark:text-neutral-300 mb-1">Kategori Kursus</label>
              <div className="relative">
                <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none pl-10 pr-8 py-2.5 rounded-md border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent"
                >
                  {courseCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                 <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label htmlFor="level-filter" className="block text-xs font-medium text-gray-700 dark:text-neutral-300 mb-1">Tingkat Kesulitan</label>
               <div className="relative">
                <ChartBarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                <select
                  id="level-filter"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full appearance-none pl-10 pr-8 py-2.5 rounded-md border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent"
                >
                  {courseLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
              </div>
            </div>
             <div className="md:col-span-2 flex justify-end">
                <button
                    onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("Semua Kategori");
                        setSelectedLevel("Semua Level");
                        setShowFilters(false);
                    }}
                    className="flex items-center text-xs text-gray-600 dark:text-neutral-400 hover:text-brand-purple dark:hover:text-purple-400 font-medium py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-700/50"
                >
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    Reset Filter
                </button>
            </div>
          </div>
        )}
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10">
          {filteredCourses.map((course) => (
            <CourseDisplayCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <NoCourseIcon className="mx-auto h-20 w-20 text-gray-300 dark:text-neutral-700" />
          <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-neutral-200">Oops! Kursus Tidak Ditemukan</h3>
          <p className="mt-2 text-base text-gray-500 dark:text-neutral-400">
            Kami tidak dapat menemukan kursus yang cocok dengan pencarian Anda. Coba kata kunci atau filter lain.
          </p>
           <button
                onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Semua Kategori");
                    setSelectedLevel("Semua Level");
                }}
                className="mt-6 px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-brand-purple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-neutral-900"
            >
                Lihat Semua Kursus
            </button>
        </div>
      )}
    </div>
  );
}