"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  StarIcon as StarIconSolid,
  PlayCircleIcon,
  UserCircleIcon as UserAvatarIcon,
  UsersIcon,
  HeartIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import { CourseDetail } from "@/lib/types";
import { extractYouTubeVideoId, getYouTubeThumbnail, isYouTubeUrl } from "@/lib/utils/youtube";
import { type TestEnrollmentData } from "@/lib/utils/testEnrollment";

interface CourseHeaderProps {
  course: CourseDetail;
  testEnrollmentData?: TestEnrollmentData;
}

export default function CourseHeader({ course, testEnrollmentData }: CourseHeaderProps) {
  // Use test data in development, real data in production
  const effectiveEnrollmentData = process.env.NODE_ENV === 'development' && testEnrollmentData
    ? {
        isEnrolled: testEnrollmentData.isEnrolled,
        userProgress: testEnrollmentData.userProgress,
      }
    : {
        isEnrolled: course.isEnrolled || false,
        userProgress: course.userProgress || 0,
      };

  // Function to get proper image URL, converting YouTube URLs to thumbnails
  const getProperImageUrl = (url: string | undefined): string => {
    if (!url) return '/images/default-course-banner.jpg';
    
    // If it's a YouTube URL, convert to thumbnail
    if (isYouTubeUrl(url)) {
      const videoId = extractYouTubeVideoId(url);
      if (videoId) {
        return getYouTubeThumbnail(videoId, 'maxres');
      }
    }
    
    // Return the URL as-is if it's not a YouTube URL
    return url;
  };

  const imageUrl = getProperImageUrl(course.bannerUrl || course.thumbnailUrl);

  return (
    <div className="relative text-white pt-10 pb-8 md:pt-16 md:pb-12 px-4 sm:px-6 lg:px-8 shadow-2xl overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={`${course.title} banner`}
          fill
          sizes="100vw"
          className="object-cover opacity-40 dark:opacity-30 blur-sm scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent dark:from-black dark:via-black/80"></div>
      </div>
      
      <div className="relative max-w-5xl mx-auto z-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-purple dark:text-purple-400 mb-2 bg-white/10 dark:bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md inline-block">
          {course.category} - {course.level}
        </p>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3 text-shadow-md">
          {course.title}
        </h1>
        
        {course.tagline && (
          <p className="text-lg sm:text-xl text-neutral-200 dark:text-neutral-300 mb-5 max-w-3xl">
            {course.tagline}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 text-sm text-neutral-200 dark:text-neutral-300">
          <div className="flex items-center">
            {course.instructorAvatar ? (
              <Image
                src={course.instructorAvatar}
                alt={course.instructorName}
                width={36}
                height={36}
                className="rounded-full mr-2.5 border-2 border-neutral-500 object-cover"
              />
            ) : (
              <UserAvatarIcon className="h-9 w-9 text-neutral-400 mr-2.5" />
            )}
            <span>
              Diajarkan oleh{" "}
              <Link href="#" className="font-semibold hover:underline text-white">
                {course.instructorName}
              </Link>
            </span>
          </div>
          
          <div className="flex items-center">
            <StarIconSolid className="h-5 w-5 text-yellow-400 mr-1" />
            <span className="font-semibold text-white">
              {(course.rating || 0).toFixed(1)}
            </span>
            <span className="ml-1 text-neutral-300">
              ({(course.reviewCount || 0).toLocaleString()} ulasan)
            </span>
          </div>
          
          <div className="flex items-center">
            <UsersIcon className="h-5 w-5 text-neutral-300 mr-1" />
            <span className="text-neutral-200">
              {(course.studentCount || course.studentsEnrolled || 0).toLocaleString()} siswa terdaftar
            </span>
          </div>
        </div>
        
        {effectiveEnrollmentData.isEnrolled && (
          <div className="mb-7 max-w-md">
            <div className="flex justify-between items-center text-xs text-neutral-200 mb-1">
              <span>Progres Belajar Anda</span>
              <span className="font-semibold">{effectiveEnrollmentData.userProgress}%</span>
            </div>
            <div className="w-full bg-white/20 dark:bg-black/30 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-brand-purple h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${effectiveEnrollmentData.userProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {effectiveEnrollmentData.isEnrolled ? (
            <Link
              href={course.lastAccessedLessonUrl || "#"}
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 border-2 border-transparent text-base font-semibold rounded-lg text-white bg-brand-purple hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
            >
              <PlayCircleIcon className="h-6 w-6 mr-2.5" />
              {effectiveEnrollmentData.userProgress > 0 ? "Lanjutkan Belajar" : "Mulai Belajar Sekarang"}
            </Link>
          ) : (
            <button className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 border-2 border-transparent text-base font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50">
              <CurrencyDollarIcon className="h-6 w-6 mr-2.5" />
              {course.price === 0 ? "Daftar Gratis" : `Daftar Kursus (Rp${course.price?.toLocaleString?.("id-ID") || "N/A"})`}
              {course.originalPrice && course.price !== 0 && (
                <span className="ml-2 line-through text-sm opacity-80">
                  Rp{course.originalPrice.toLocaleString("id-ID")}
                </span>
              )}
            </button>
          )}
          
          {/* Wishlist button - only show for non-enrolled users */}
          {!effectiveEnrollmentData.isEnrolled && (
            <button className="w-full sm:w-auto flex items-center justify-center px-6 py-3.5 border-2 border-neutral-500/70 text-base font-medium rounded-lg text-white hover:bg-white/10 dark:hover:bg-black/20 transition-colors focus:outline-none focus:ring-4 focus:ring-neutral-500/50">
              <HeartIcon className="h-5 w-5 mr-2" /> Simpan ke Wishlist
            </button>
          )}
        </div>
        
        <p className="text-xs text-neutral-300 dark:text-neutral-400 mt-5">
          Terakhir diperbarui:{" "}
          {course.updatedAt || course.lastUpdated ? 
            new Date(course.updatedAt || course.lastUpdated).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }) : "N/A"
          }{" "}
          • Bahasa: {course.language || "Indonesia"}
        </p>
      </div>
    </div>
  );
} 