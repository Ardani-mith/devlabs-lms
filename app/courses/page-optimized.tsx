"use client";

import React from 'react';
import { BookOpenIcon } from '@heroicons/react/24/solid';
import { ContentLayout } from '@/components/shared';
import { useCourseData } from '@/hooks/useContentData';
import { ContentPageConfig } from '@/lib/types/content';

// Configuration for the courses page
const coursesPageConfig: ContentPageConfig = {
  title: "Jelajahi Dunia Pengetahuan",
  description: "Temukan kursus yang tepat untuk Anda dari berbagai kategori dan tingkat keahlian. Mulai perjalanan belajar Anda hari ini!",
  contentType: 'course',
  apiEndpoint: '/courses',
  displayConfig: {
    showInstructor: true,
    showRating: true,
    showPrice: true,
    showDuration: true,
    showTags: true,
    maxTags: 2,
    cardVariant: 'default',
    gridCols: {
      sm: 1,
      md: 2,
      lg: 3,
      xl: 3,
    },
  },
  filterConfig: {
    showSearch: true,
    showCategoryFilter: true,
    showLevelFilter: true,
    showPriceFilter: true,
    showRatingFilter: true,
    showSortOptions: true,
    searchPlaceholder: "Cari kursus, instruktur, atau topik...",
  },
  emptyState: {
    icon: BookOpenIcon,
    title: 'Oops! Kursus Tidak Ditemukan',
    description: 'Kami tidak dapat menemukan kursus yang cocok dengan pencarian Anda. Coba kata kunci atau filter lain.',
    actionLabel: 'Jelajahi Semua Kategori',
    actionUrl: '/courses/categories',
  },
};

export default function OptimizedCoursesPage() {
  // Use the custom hook to fetch course data
  const {
    data,
    loading,
    error,
    refetch,
  } = useCourseData({
    pageSize: 12,
    autoFetch: true,
  });

  return (
    <ContentLayout
      config={coursesPageConfig}
      data={data}
      loading={loading}
      error={error || undefined}
      onRefresh={() => refetch()}
      className="min-h-screen"
    />
  );
}

// Export configuration for reuse
export { coursesPageConfig }; 