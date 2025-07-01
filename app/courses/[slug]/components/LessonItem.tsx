"use client";

import React from "react";
import Link from "next/link";
import {
  VideoCameraIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  PresentationChartLineIcon,
  SparklesIcon,
  BookOpenIcon,
  CheckCircleIcon as CheckCircleIconSolid,
  PlayCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { ClockIcon as ClockIconOutline } from "@heroicons/react/24/outline";
import { Lesson } from "../types/course";
import { statusColors, badgeStyles } from "../utils/styles";

interface LessonItemProps {
  lesson: Lesson;
  courseSlug: string;
}

export default function LessonItem({ lesson, courseSlug }: LessonItemProps) {
  // Get appropriate icon for lesson type
  const getIconComponent = (type: string) => {
    const iconMap = {
      video: VideoCameraIcon,
      bacaan: DocumentTextIcon,
      kuis: QuestionMarkCircleIcon,
      tugas: PresentationChartLineIcon,
      interaktif: SparklesIcon,
    };
    return iconMap[type as keyof typeof iconMap] || BookOpenIcon;
  };

  // Get appropriate status icon
  const getStatusIcon = (status: string) => {
    const statusIconMap = {
      selesai: CheckCircleIconSolid,
      sedang_dipelajari: PlayCircleIcon,
      selanjutnya: ClockIconOutline,
      terkunci: LockClosedIcon,
    };
    return statusIconMap[status as keyof typeof statusIconMap];
  };

  const IconComponent = getIconComponent(lesson.type);
  const StatusIconComponent = getStatusIcon(lesson.status);
  const statusColor = statusColors[lesson.status as keyof typeof statusColors];

  const lessonLink =
    lesson.status !== "terkunci"
      ? lesson.url.startsWith("#")
        ? `#${courseSlug}${lesson.url}`
        : lesson.url
      : "#";

  const isLocked = lesson.status === "terkunci";
  const isActive = lesson.status === "sedang_dipelajari";
  const isCompleted = lesson.status === "selesai";

  return (
    <Link
      href={lessonLink}
      className={`group flex items-center justify-between p-4 rounded-lg transition-all duration-200
        ${
          isLocked
            ? "opacity-70 cursor-not-allowed bg-gray-100 dark:bg-neutral-800/60"
            : "hover:bg-gray-100 dark:hover:bg-neutral-700/70 cursor-pointer"
        }
        ${
          isActive
            ? "bg-blue-50 dark:bg-blue-900/40 border-l-4 border-blue-500 shadow-sm"
            : ""
        }
        ${
          isCompleted
            ? "bg-green-50 dark:bg-green-900/30 opacity-80 hover:opacity-100"
            : ""
        }
      `}
    >
      <div className="flex items-center min-w-0">
        <IconComponent
          className={`h-5 w-5 mr-3.5 flex-shrink-0 ${
            isLocked
              ? "text-gray-400 dark:text-neutral-600"
              : "text-brand-purple dark:text-purple-400"
          }`}
        />
        <span
          className={`text-sm font-medium truncate ${
            isLocked
              ? "text-gray-500 dark:text-neutral-500"
              : "text-gray-800 dark:text-neutral-100"
          }`}
        >
          {lesson.title}
        </span>
        {lesson.isPreviewable && isLocked && (
          <span className={badgeStyles.preview}>PREVIEW</span>
        )}
      </div>
      
      <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
        {lesson.durationMinutes && (
          <span className="text-xs text-gray-500 dark:text-neutral-400">
            {lesson.durationMinutes} mnt
          </span>
        )}
        {StatusIconComponent && (
          <StatusIconComponent className={`h-5 w-5 ${statusColor}`} />
        )}
      </div>
    </Link>
  );
} 