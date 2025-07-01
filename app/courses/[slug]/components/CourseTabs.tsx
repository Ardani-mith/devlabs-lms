"use client";

import React from "react";

interface CourseTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasCertificate: boolean;
  isEnrolled: boolean;
  isCourseCompleted: boolean;
}

export default function CourseTabs({
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