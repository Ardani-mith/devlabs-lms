"use client";

import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Module, Lesson } from "@/lib/types";
import { getLessonTypeIcon, getLessonStatusColor } from "@/lib/utils/courseHelpers";

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
}

export function LessonItem({ lesson, courseSlug }: LessonItemProps) {
  const isAccessible = lesson.status !== "terkunci";
  const statusColor = getLessonStatusColor(lesson.status);
  const typeIcon = getLessonTypeIcon(lesson.type);

  return (
    <li className="group">
      <div
        className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 
          ${isAccessible 
            ? "border-gray-200 dark:border-neutral-700 hover:border-brand-purple/30 dark:hover:border-purple-400/30 hover:shadow-md cursor-pointer" 
            : "border-gray-100 dark:border-neutral-800 opacity-60 cursor-not-allowed"
          }`}
      >
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <span className="text-2xl">{typeIcon}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium truncate ${
              isAccessible 
                ? "text-gray-900 dark:text-neutral-100 group-hover:text-brand-purple dark:group-hover:text-purple-400" 
                : "text-gray-500 dark:text-neutral-500"
            }`}>
              {lesson.title}
            </h4>
            
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                {lesson.status.replace('_', ' ')}
              </span>
              
              {lesson.durationMinutes && (
                <span className="text-xs text-gray-500 dark:text-neutral-400">
                  {lesson.durationMinutes} mnt
                </span>
              )}
            </div>
          </div>
        </div>
        
        {lesson.isPreviewable && (
          <span className="text-xs text-brand-purple dark:text-purple-400 font-medium">
            Preview
          </span>
        )}
      </div>
    </li>
  );
}

// Module Accordion Component
interface ModuleAccordionProps {
  module: Module;
  courseSlug: string;
  initialCollapsed?: boolean;
}

export function ModuleAccordion({
  module,
  courseSlug,
  initialCollapsed = true,
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
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
