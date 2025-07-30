"use client";

import Link from "next/link";
import {
  BookOpenIcon,
  ClockIcon,
  UserCircleIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import SafeImage from "@/components/ui/SafeImage";

export interface CourseDetails {
  id: string;
  slug: string;
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
  isNew?: boolean;
  tags?: string[];
  loading?: boolean;
}

interface CourseDisplayCardProps {
  course: CourseDetails;
}

export function CourseDisplayCard({ course }: CourseDisplayCardProps) {
  const {
    slug,
    title,
    thumbnailUrl,
    instructorName,
    instructorAvatarUrl,
    lessonsCount,
    totalDurationHours,
    level,
    rating,
    studentsEnrolled,
    price,
    isNew,
    loading,
  } = course;

  if (loading) {
    return (
      <div className="animate-pulse bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
        <div className="aspect-video bg-gray-200 dark:bg-neutral-700" />
        <div className="p-5 space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/courses/${slug}`}
      className="group bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      {/* Course Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-neutral-900">
        <SafeImage
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        {isNew && (
          <span className="absolute top-4 left-4 bg-brand-purple text-white text-xs font-semibold px-2 py-1 rounded-full">
            Baru
          </span>
        )}
        {price === "Gratis" && (
          <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Gratis
          </span>
        )}
      </div>

      {/* Course Info */}
      <div className="flex-1 p-5 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand-purple dark:group-hover:text-purple-400 transition-colors">
            {title}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-neutral-700">
              <SafeImage
                src={instructorAvatarUrl || ""}
                alt={instructorName}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm text-gray-600 dark:text-neutral-400">
              {instructorName}
            </span>
          </div>
        </div>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-neutral-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <BookOpenIcon className="w-4 h-4 mr-1" />
              {lessonsCount} Pelajaran
            </span>
            <span className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              {totalDurationHours} Jam
            </span>
          </div>
          <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-neutral-700 text-xs font-medium">
            {level}
          </span>
        </div>

        {/* Rating and Price */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-neutral-700">
          <div className="flex items-center space-x-1">
            <StarIcon className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {rating?.toFixed(1) || "N/A"}
            </span>
            {studentsEnrolled && (
              <span className="text-sm text-gray-500 dark:text-neutral-400">
                ({studentsEnrolled} siswa)
              </span>
            )}
          </div>
          <div className="text-right">
            {price === "Gratis" ? (
              <span className="text-green-500 font-semibold">Gratis</span>
            ) : (
              <span className="text-brand-purple dark:text-purple-400 font-semibold">
                {typeof price === "number"
                  ? new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(price)
                  : "N/A"}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
