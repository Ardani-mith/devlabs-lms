"use client";

import Image from "next/image";
import { UsersIcon, BookOpenIcon, CurrencyDollarIcon, StarIcon } from "@heroicons/react/24/solid"; // atau outline
// Pertimbangkan menggunakan "BackgroundGradient" atau "HoverBorderGradient" dari Aceternity untuk efek yang lebih menarik.
// Contoh: import { BackgroundGradient } from "@/components/ui/background-gradient"; // Sesuaikan path

interface Teacher {
  id: string;
  name: string;
  subject: string;
  description: string;
  lessonsConducted: number;
  courses: number;
  students: string; // e.g., "250+ students"
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating?: number; // Optional
  tags?: string[]; // e.g., ["TOP TUTOR", "Certified"]
}

interface TeacherCardProps {
  teacher: Teacher;
}

export function TeacherCard({ teacher }: TeacherCardProps) {
  return (
    // <BackgroundGradient className="rounded-[22px] p-0.5 bg-white dark:bg-zinc-900">
      <div className="flex flex-col overflow-hidden rounded-xl bg-card-bg-light dark:bg-card-bg-dark shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-40 w-full">
          <Image
            src={teacher.imageUrl}
            alt={teacher.name}
            layout="fill"
            objectFit="cover"
          />
          {/* Tags bisa ditambahkan di atas gambar jika desainnya seperti itu */}
          {teacher.tags && teacher.tags.length > 0 && (
            <div className="absolute top-2 left-2 flex space-x-2">
              {teacher.tags.map(tag => (
                <span key={tag} className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-800 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-200">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 p-5">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary mr-2">
              {teacher.name}
            </h3>
            {/* Optional: Verified badge or similar */}
          </div>
          <p className="text-sm font-medium text-brand-purple dark:text-purple-400 mb-2">
            {teacher.subject}
          </p>
          <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-4 h-20 overflow-hidden text-ellipsis">
            {teacher.description}
          </p>

          <div className="grid grid-cols-3 gap-x-2 text-xs text-text-light-secondary dark:text-text-dark-secondary mb-4">
            <div className="flex items-center">
              <BookOpenIcon className="h-4 w-4 mr-1 text-gray-400 dark:text-neutral-500" />
              {teacher.lessonsConducted} lessons
            </div>
            <div className="flex items-center">
              {/* Ganti ikon jika perlu */}
              <BookOpenIcon className="h-4 w-4 mr-1 text-gray-400 dark:text-neutral-500" />
              {teacher.courses} courses
            </div>
            <div className="flex items-center">
              <UsersIcon className="h-4 w-4 mr-1 text-gray-400 dark:text-neutral-500" />
              {teacher.students}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary">
                ${teacher.price}
              </span>
              {teacher.originalPrice && (
                <span className="ml-1 text-sm line-through text-text-light-secondary dark:text-text-dark-secondary">
                  ${teacher.originalPrice}
                </span>
              )}
            </div>
            <button className="rounded-lg bg-transparent border border-brand-purple dark:border-purple-500 px-5 py-2 text-sm font-medium text-brand-purple dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-colors">
              View More
            </button>
          </div>
        </div>
      </div>
    // </BackgroundGradient>
  );
}