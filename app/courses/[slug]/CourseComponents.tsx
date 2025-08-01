"use client";

import React, { useState } from "react";
import { ChevronDownIcon, LockClosedIcon, EyeIcon } from "@heroicons/react/24/solid";
import { Module, Lesson } from "@/lib/types";
import { getLessonTypeIcon, getLessonStatusColor } from "@/lib/utils/courseHelpers";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Course Tabs Component
interface CourseTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasCertificate: boolean;
  isEnrolled: boolean;
  isCourseCompleted: boolean;
}

export function CourseTabs({
  activeTab,
  setActiveTab,
  hasCertificate,
  isEnrolled,
  isCourseCompleted,
}: CourseTabsProps) {
  const baseTabs = ["Overview", "Materi Pembelajaran"];
  
  if (isEnrolled) {
    baseTabs.push("Diskusi", "Tugas & Kuis");
  }
  
  if (isEnrolled && hasCertificate) {
    baseTabs.push("Sertifikat");
  }

  return (
    <div className="border-b border-gray-200 dark:border-neutral-700/80 sticky top-[var(--header-height,4rem)] z-20 bg-gray-50/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-sm">
      <nav
        className="-mb-px flex space-x-5 sm:space-x-8 px-4 sm:px-6 lg:px-8 overflow-x-auto"
        aria-label="Tabs"
      >
        {baseTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            disabled={tab === "Sertifikat" && !isCourseCompleted && hasCertificate}
            className={`whitespace-nowrap py-4 px-1.5 border-b-2 font-semibold text-sm transition-all duration-200 focus:outline-none
              ${
                activeTab === tab
                  ? "border-brand-purple text-brand-purple dark:border-purple-400 dark:text-purple-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:border-neutral-600"
              }
              ${
                tab === "Sertifikat" && !isCourseCompleted && hasCertificate
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            `}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
}

// Lesson Item Component
interface LessonItemProps {
  lesson: Lesson;
  courseSlug: string;
  isEnrolled?: boolean;
}

export function LessonItem({ lesson, courseSlug, isEnrolled = true }: LessonItemProps) {
  const router = useRouter();
  const isAccessible = isEnrolled ? lesson.status !== "terkunci" : lesson.isPreviewable;
  const statusColor = getLessonStatusColor(lesson.status);
  const typeIcon = getLessonTypeIcon(lesson.type);
  const isLocked = !isEnrolled && !lesson.isPreviewable;
  const hasValidId = lesson.id && lesson.id !== 'undefined' && lesson.id !== '';

  const handleLessonClick = () => {
    if (isAccessible && hasValidId) {
      console.log(`Navigating to lesson: ${lesson.id} in course: ${courseSlug}`);
      router.push(`/courses/${courseSlug}/lessons/${lesson.id}`);
    } else {
      console.warn(`Cannot navigate to lesson: ${lesson.id}, accessible: ${isAccessible}, hasValidId: ${hasValidId}`);
    }
  };

  const LessonContent = (      <div
        className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 
          ${isAccessible && hasValidId
            ? "border-gray-200 dark:border-neutral-700 hover:border-brand-purple/30 dark:hover:border-purple-400/30 hover:shadow-md cursor-pointer" 
            : "border-gray-100 dark:border-neutral-800 opacity-60 cursor-not-allowed"
          }`}
        onClick={isAccessible && hasValidId ? handleLessonClick : undefined}
      >
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <div className="flex-shrink-0">
          {isLocked ? (
            <LockClosedIcon className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
          ) : (
            <span className="text-2xl">{typeIcon}</span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium truncate ${
            isAccessible 
              ? "text-gray-900 dark:text-neutral-100 group-hover:text-brand-purple dark:group-hover:text-purple-400" 
              : "text-gray-500 dark:text-neutral-500"
          }`}>
            {lesson.title}
            {isLocked && (
              <span className="ml-2 text-xs text-gray-400 dark:text-neutral-500">
                (Terkunci)
              </span>
            )}
          </h4>
          
          <div className="flex items-center space-x-2 mt-1">
            {isEnrolled ? (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                {lesson.status?.replace('_', ' ') || 'Tersedia'}
              </span>
            ) : (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                lesson.isPreviewable 
                  ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800/20 dark:text-gray-400'
                }`}>
                  {lesson.isPreviewable ? 'Preview Tersedia' : 'Perlu Daftar'}
                </span>
              )}
              
              {lesson.durationMinutes && (
                <span className="text-xs text-gray-500 dark:text-neutral-400">
                  {lesson.durationMinutes} mnt
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {lesson.isPreviewable && !isEnrolled && (
            <div className="flex items-center space-x-1">
              <EyeIcon className="h-4 w-4 text-brand-purple dark:text-purple-400" />
              <span className="text-xs text-brand-purple dark:text-purple-400 font-medium">
                Preview
              </span>
            </div>
          )}
          
          {isLocked && (
            <span className="text-xs text-gray-400 dark:text-neutral-500 font-medium">
              Daftar untuk Akses
            </span>
          )}
        </div>
      </div>
    );

  return <li className="group">{LessonContent}</li>;
}

// Module Accordion Component
interface ModuleAccordionProps {
  module: Module;
  courseSlug: string;
  initialCollapsed?: boolean;
  isEnrolled?: boolean;
}

export function ModuleAccordion({
  module,
  courseSlug,
  initialCollapsed = true,
  isEnrolled = true,
}: ModuleAccordionProps) {
  const [isOpen, setIsOpen] = useState(!initialCollapsed);

  return (
    <div className="bg-white dark:bg-neutral-800/90 rounded-2xl shadow-xl border border-gray-200 dark:border-neutral-700/70 overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
        aria-expanded={isOpen}
        aria-controls={`module-content-${module.id}`}
      >
        <div className="text-left">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-100">
            {module.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
            {module.lessons.length} materi
            {module.description && ` • ${module.description}`}
            {!isEnrolled && (
              <span className="ml-2 text-brand-purple dark:text-purple-400">
                • Daftar untuk akses penuh
              </span>
            )}
          </p>
        </div>
        <ChevronDownIcon
          className={`h-6 w-6 text-gray-500 dark:text-neutral-400 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      
      {isOpen && (
        <div
          id={`module-content-${module.id}`}
          className="p-2 sm:p-3 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700/80"
        >
          <ul className="space-y-2">
            {module.lessons.map((lesson) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                courseSlug={courseSlug}
                isEnrolled={isEnrolled}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
