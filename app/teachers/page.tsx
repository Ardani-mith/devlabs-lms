"use client"; // Diperlukan untuk useState (fitur search/filter)

import React, { useState, useMemo } from 'react';
import { TeacherDisplayCard, TeacherProfile } from '@/app/teachers/TeacherDisplayCard'; // Sesuaikan path jika berbeda
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

// Placeholder data untuk daftar pengajar
const allTeachersData: TeacherProfile[] = [
  {
    id: "t001",
    name: "Dr. Ardani Setiawan",
    avatarUrl: "https://i.pinimg.com/736x/30/ce/7b/30ce7b1af10a76e967c010ead2b62c5a.jpg",
    expertiseAreas: ["Data Science", "Machine Learning", "Python"],
    shortBio: "Pakar Data Science dengan pengalaman 10+ tahun di industri dan akademisi. Fokus pada aplikasi AI praktis.",
    coursesCount: 8,
    lessonsCount: 120,
    rating: 4.9,
    isVerified: true,
    profileUrl: "/dashboard/teachers/ardani-setiawan",
  },
  {
    id: "t002",
    name: "Dani, M.Kom.",
    avatarUrl: "https://i.pinimg.com/736x/f4/d3/ca/f4d3ca27e01d6bd08bc1980bdae30b73.jpg",
    expertiseAreas: ["Web Development", "React", "Node.js", "JavaScript"],
    shortBio: "Full-stack developer dan instruktur berpengalaman, membantu siswa membangun aplikasi web modern dari nol.",
    coursesCount: 12,
    lessonsCount: 250,
    rating: 4.8,
    isVerified: true,
    profileUrl: "/dashboard/teachers/budi-santoso",
  },
  {
    id: "t003",
    name: "Prof. Dani",
    avatarUrl: "https://i.pinimg.com/736x/2a/53/70/2a5370c752b7f4bd65766f3550afdb5d.jpg",
    expertiseAreas: ["UI/UX Design", "Figma", "Prototyping"],
    shortBio: "Desainer UI/UX pemenang penghargaan dengan passion untuk menciptakan pengalaman pengguna yang intuitif dan indah.",
    coursesCount: 6,
    lessonsCount: 95,
    rating: 4.7,
    profileUrl: "/dashboard/teachers/citra-dewi",
  },
  {
    id: "t004",
    name: "Sir Dani",
    avatarUrl: null, // Contoh tanpa avatar, akan menampilkan inisial
    expertiseAreas: ["Digital Marketing", "SEO", "Content Strategy"],
    shortBio: "Spesialis Digital Marketing yang membantu bisnis bertumbuh secara online melalui strategi yang terukur.",
    coursesCount: 7,
    lessonsCount: 110,
    isVerified: true,
    profileUrl: "/dashboard/teachers/eko-prasetyo",
  },
   {
    id: "t005",
    name: "Fiona Anggraini",
    avatarUrl: "https://i.pinimg.com/736x/46/d8/dd/46d8dd0b665770c3a0b1d161571f5f93.jpg",
    expertiseAreas: ["Bahasa Inggris", "TOEFL Prep", "Business English"],
    shortBio: "Pengajar Bahasa Inggris bersertifikat dengan metode pengajaran yang interaktif dan menyenangkan.",
    coursesCount: 10,
    lessonsCount: 180,
    rating: 4.9,
    profileUrl: "/dashboard/teachers/fiona-anggraini",
  },
  {
    id: "t006",
    name: "Gilang Maulana",
    avatarUrl: "https://i.pinimg.com/736x/1c/cf/63/1ccf63e85c4574a24621ac587c831b5e.jpg",
    expertiseAreas: ["Manajemen Proyek", "Agile", "Scrum"],
    shortBio: "Manajer proyek berpengalaman yang membagikan praktik terbaik untuk mengelola proyek dengan sukses.",
    coursesCount: 5,
    lessonsCount: 75,
    isVerified: true,
    rating: 4.6,
    profileUrl: "/dashboard/teachers/gilang-maulana",
  },
];

const expertiseCategories = ["Semua Kategori", "Data Science", "Web Development", "UI/UX Design", "Digital Marketing", "Bahasa Inggris", "Manajemen Proyek"];


export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  // Untuk pagination, Anda bisa menambahkan state untuk currentPage dan itemsPerPage

  const filteredTeachers = useMemo(() => {
    return allTeachersData
      .filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.expertiseAreas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .filter(teacher =>
        selectedCategory === "Semua Kategori" ||
        teacher.expertiseAreas.includes(selectedCategory)
      );
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-10 p-4 sm:p-6 lg:p-8 text-text-light-primary dark:text-text-dark-primary">
      {/* Header Halaman */}
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-neutral-100 sm:text-5xl">
          Temukan Pengajar Ahli Kami
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-neutral-400 max-w-2xl">
          Jelajahi daftar pengajar profesional kami yang siap membantu Anda mencapai tujuan belajar.
          Filter berdasarkan keahlian atau cari berdasarkan nama.
        </p>
      </header>

      {/* Fitur Search dan Filter */}
      <div className="sticky top-[calc(var(--header-height,4rem)+1rem)] z-30 bg-gray-50/80 dark:bg-neutral-900/80 backdrop-blur-md py-4 rounded-xl shadow-sm mb-8 -mx-4 px-4 md:-mx-6 md:px-6"> {/* Sticky dengan backdrop blur */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full md:w-auto">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
            <input
              type="search"
              placeholder="Cari nama atau keahlian pengajar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent transition-shadow focus:shadow-md"
            />
          </div>
          <div className="relative w-full md:w-auto md:min-w-[200px]">
            <AdjustmentsHorizontalIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none pl-12 pr-10 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent transition-shadow focus:shadow-md"
            >
              {expertiseCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid Daftar Pengajar */}
      {filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTeachers.map((teacher) => (
            <TeacherDisplayCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <UserCircleIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-neutral-600" />
          <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-neutral-200">Pengajar Tidak Ditemukan</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            Coba ubah kata kunci pencarian atau filter Anda.
          </p>
        </div>
      )}

      {/* Placeholder untuk Pagination atau Infinite Scroll */}
      {/* <div className="mt-12 flex justify-center">
        <button className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-brand-purple hover:bg-purple-700">
          Muat Lebih Banyak
        </button>
      </div>
      */}
    </div>
  );
}