"use client";

import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Module } from "../types/course";
import { cardStyles } from "../utils/styles";
import LessonItem from "./LessonItem";

interface ModuleAccordionProps {
  module: Module;
  courseSlug: string;
  initialCollapsed?: boolean;
}

export default function ModuleAccordion({
  module,
  courseSlug,
  initialCollapsed = true,
}: ModuleAccordionProps) {
  const [isOpen, setIsOpen] = useState(!initialCollapsed);

  return (
    <div className={`${cardStyles.main} overflow-hidden mb-4`}>
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