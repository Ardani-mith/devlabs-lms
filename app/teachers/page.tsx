"use client"; // Diperlukan untuk useState (fitur search/filter)

import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import TeacherCourseManager from '../manage-course/TeacherCourseManager';
import { TeacherDisplayCard, TeacherProfile } from '@/app/teachers/TeacherDisplayCard';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const expertiseCategories = ["Semua Kategori", "Data Science", "Web Development", "UI/UX Design", "Digital Marketing", "Bahasa Inggris", "Manajemen Proyek"];

function TeacherDirectoryView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch teachers from API
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // TODO: Replace with real API call to backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4300'}/api/teachers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch teachers: ${response.status}`);
        }

        const teachersData = await response.json();
        setTeachers(teachersData);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.expertiseAreas.some(area => 
        area.toLowerCase().includes(searchTerm.toLowerCase())
      )
    ).filter(teacher =>
      selectedCategory === "Semua Kategori" || 
      teacher.expertiseAreas.some(area => 
        area.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    );
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-10 p-4 sm:p-6 lg:p-8 text-text-light-primary dark:text-text-dark-primary">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-neutral-100 sm:text-5xl">
          Instruktur Berpengalaman
        </h1>
        <p className="mt-3 text-base text-gray-600 dark:text-neutral-400 max-w-3xl">
          Belajar langsung dari para ahli di bidangnya. Instruktur kami adalah profesional berpengalaman 
          yang siap membimbing perjalanan belajar Anda.
        </p>
      </header>

      {/* Search and Filter */}
      <div className="bg-gray-50/90 dark:bg-neutral-900/90 backdrop-blur-lg py-5 rounded-xl shadow-lg mb-10">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full md:w-auto">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
            <input
              type="search"
              placeholder="Cari instruktur atau keahlian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent transition-shadow focus:shadow-lg"
            />
          </div>
          <div className="relative w-full md:w-auto">
            <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none pl-10 pr-8 py-3.5 rounded-lg border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent"
            >
              {expertiseCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 dark:bg-neutral-700 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTeachers.map((teacher) => (
            <TeacherDisplayCard 
              key={teacher.id} 
              teacher={teacher}
            />
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-16 text-center bg-gradient-to-r from-brand-purple/10 to-purple-600/10 dark:from-purple-500/20 dark:to-purple-800/20 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-4">
          Ingin Menjadi Instruktur?
        </h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-6 max-w-2xl mx-auto">
          Bergabunglah dengan komunitas instruktur kami dan bagikan keahlian Anda kepada ribuan siswa di seluruh dunia.
        </p>
        <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-purple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors">
          Daftar Sebagai Instruktur
        </button>
      </div>
    </div>
  );
}

export default function TeachersPage() {
  const { user } = useAuth();

  // If user is a teacher or admin, show course management
  if (user && (user.role === 'TEACHER' || user.role === 'ADMIN')) {
    return <TeacherCourseManager />;
  }

  // Otherwise show public teacher directory
  return <TeacherDirectoryView />;
}