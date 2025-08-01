"use client";

import React from "react";
import Link from "next/link";
import {
  ListBulletIcon,
  ClockIcon as ClockIconSolid,
  AdjustmentsHorizontalIcon,
  AcademicCapIcon,
  LanguageIcon,
  CalendarDaysIcon,
  PlayCircleIcon,
  ArrowDownTrayIcon,
  CurrencyDollarIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import { CourseDetail } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils/courseHelpers";
import { cardStyles, buttonStyles, textStyles } from "@/lib/utils/styles";
import { type TestEnrollmentData } from "@/lib/utils/testEnrollment";

interface CourseInfoSidebarProps {
  courseData: CourseDetail;
  isCourseCompleted: boolean;
  testEnrollmentData?: TestEnrollmentData;
}

export default function CourseInfoSidebar({
  courseData,
  isCourseCompleted,
  testEnrollmentData,
}: CourseInfoSidebarProps) {
  // Use test data in development, real data in production
  const effectiveEnrollmentData = process.env.NODE_ENV === 'development' && testEnrollmentData
    ? {
        isEnrolled: testEnrollmentData.isEnrolled,
        userProgress: testEnrollmentData.userProgress,
      }
    : {
        isEnrolled: courseData.isEnrolled || false,
        userProgress: courseData.userProgress || 0,
      };
  return (
    <div className={cardStyles.sidebar}>
      {/* Course Info Card */}
      <div className={`${cardStyles.main} p-6`}>
        <h3 className={textStyles.heading.h3}>Tentang Kursus Ini</h3>
        <div className="space-y-3.5 text-sm">
          <div className="flex items-center text-gray-700 dark:text-neutral-300">
            <ListBulletIcon className="h-5 w-5 mr-3 text-brand-purple dark:text-purple-400 flex-shrink-0" />
            <span className="font-medium">{courseData.totalLessons}</span>
            <span className="ml-1">total pelajaran</span>
          </div>
          
          <div className="flex items-center text-gray-700 dark:text-neutral-300">
            <ClockIconSolid className="h-5 w-5 mr-3 text-brand-purple dark:text-purple-400 flex-shrink-0" />
            <span className="font-medium">{courseData.totalDurationHours}</span>
            <span className="ml-1">jam estimasi belajar</span>
          </div>
          
          <div className="flex items-center text-gray-700 dark:text-neutral-300">
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-3 text-brand-purple dark:text-purple-400 flex-shrink-0" />
            <span>
              Level <span className="font-medium">{courseData.level}</span>
            </span>
          </div>
          
          <div className="flex items-center text-gray-700 dark:text-neutral-300">
            <AcademicCapIcon className="h-5 w-5 mr-3 text-brand-purple dark:text-purple-400 flex-shrink-0" />
            <span>
              {courseData.hasCertificate
                ? "Sertifikat Kelulusan Tersedia"
                : "Tidak ada sertifikat"}
            </span>
          </div>
          
          <div className="flex items-center text-gray-700 dark:text-neutral-300">
            <LanguageIcon className="h-5 w-5 mr-3 text-brand-purple dark:text-purple-400 flex-shrink-0" />
            <span>
              Bahasa <span className="font-medium">{courseData.language}</span>
            </span>
          </div>
          
          <div className="flex items-center text-gray-700 dark:text-neutral-300">
            <CalendarDaysIcon className="h-5 w-5 mr-3 text-brand-purple dark:text-purple-400 flex-shrink-0" />
            <span>
              Update:{" "}
              <span className="font-medium">
                {formatDate(courseData.updatedAt)}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Progress Card (for enrolled users) */}
      {effectiveEnrollmentData.isEnrolled && (
        <div className={`${cardStyles.main} p-6`}>
          <h3 className={textStyles.heading.h3}>Progres Belajar Anda</h3>
          
          <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-3 mb-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-brand-purple h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${effectiveEnrollmentData.userProgress}%` }}
            ></div>
          </div>
          
          <p className="text-sm font-semibold text-gray-700 dark:text-neutral-200 mb-4 text-right">
            {effectiveEnrollmentData.userProgress}% Selesai
          </p>

          {/* Continue Learning Button */}
          {courseData.lastAccessedLessonTitle && (courseData.userProgress || courseData.progress || 0) < 100 && (
            <Link
              href={courseData.lastAccessedLessonUrl || "#"}
              className={`w-full group flex items-center justify-center ${buttonStyles.primary} text-sm`}
            >
              <PlayCircleIcon className="h-5 w-5 mr-2 transition-transform duration-200 group-hover:scale-110" />
              Lanjutkan:{" "}
              {(courseData.lastAccessedLessonTitle?.length || 0) > 20
                ? courseData.lastAccessedLessonTitle?.substring(0, 20) + "..."
                : courseData.lastAccessedLessonTitle}
            </Link>
          )}

          {/* Download Certificate Button */}
          {isCourseCompleted && courseData.certificateUrl && (
            <Link
              href={courseData.certificateUrl}
              className={`w-full group flex items-center justify-center ${buttonStyles.success} text-sm`}
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2 transition-transform duration-200 group-hover:scale-110" />
              Unduh Sertifikat Anda
            </Link>
          )}

          {/* Completion Message */}
          {!isCourseCompleted && courseData.isEnrolled && (
            <p className="text-xs text-center text-gray-500 dark:text-neutral-400 mt-3">
              Selesaikan kursus untuk mendapatkan sertifikat.
            </p>
          )}
        </div>
      )}

      {/* Purchase Card (for non-enrolled users) */}
      {!effectiveEnrollmentData.isEnrolled && courseData.price !== undefined && (
        <div className={`${cardStyles.main} p-6 space-y-3`}>
          <div className="text-center">
            {courseData.price === 0 ? (
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                GRATIS
              </p>
            ) : (
              <>
                <p className="text-3xl font-bold text-brand-purple dark:text-purple-400">
                  {formatPrice(courseData.price)}
                </p>
                {courseData.originalPrice && 
                 typeof courseData.price === 'number' && 
                 courseData.originalPrice > courseData.price && (
                  <span className="text-sm line-through text-gray-500 dark:text-neutral-400 ml-1.5">
                    {formatPrice(courseData.originalPrice)}
                  </span>
                )}
              </>
            )}
          </div>

          <button className={`w-full flex items-center justify-center ${buttonStyles.success}`}>
            {courseData.price === 0 ? (
              <>
                <AcademicCapIcon className="h-6 w-6 mr-2.5" />
                Daftar Gratis
              </>
            ) : (
              <>
                <CurrencyDollarIcon className="h-6 w-6 mr-2.5" />
                Daftar Kursus Sekarang
              </>
            )}
          </button>

          <button className={`w-full flex items-center justify-center ${buttonStyles.secondary}`}>
            <HeartIcon className="h-5 w-5 mr-2" /> 
            {courseData.price === 0 ? 'Simpan ke Wishlist' : 'Tambah ke Wishlist'}
          </button>
        </div>
      )}
    </div>
  );
} 