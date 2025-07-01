"use client";

import React, { useState, useMemo } from 'react';
import { BookOpenIcon as NoContentIcon } from '@heroicons/react/24/solid';
import { Content, ContentPageConfig, ContentFilters, ContentResponse } from '@/lib/types/content';
import ContentCard from './ContentCard';
import ContentFiltersComponent from './ContentFilters';
import { Card } from '@/components/ui';

interface ContentLayoutProps {
  config: ContentPageConfig;
  data?: ContentResponse;
  loading?: boolean;
  error?: string;
  onFiltersChange?: (filters: ContentFilters) => void;
  onRefresh?: () => void;
  className?: string;
}

export default function ContentLayout({
  config,
  data,
  loading = false,
  error,
  onFiltersChange,
  onRefresh,
  className = ''
}: ContentLayoutProps) {
  const [filters, setFilters] = useState<ContentFilters>({
    search: '',
    category: '',
    level: '',
    price: 'all',
    rating: undefined,
    status: '',
    sortBy: 'newest',
    sortOrder: 'desc',
  });

  // Filtered and sorted content
  const filteredContent = useMemo(() => {
    if (!data?.data) return [];

    let filtered = [...data.data];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        // Content-specific search
        (item.type === 'course' && item.instructorName.toLowerCase().includes(searchTerm)) ||
        (item.type === 'teacher' && item.specialization.toLowerCase().includes(searchTerm)) ||
        (item.type === 'webinar' && item.hostName.toLowerCase().includes(searchTerm)) ||
        (item.type === 'news' && item.authorName.toLowerCase().includes(searchTerm))
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Apply level filter (for courses)
    if (filters.level && filtered.some(item => item.type === 'course')) {
      filtered = filtered.filter(item => 
        item.type !== 'course' || (item.type === 'course' && item.level === filters.level)
      );
    }

    // Apply price filter
    if (filters.price && filters.price !== 'all') {
      filtered = filtered.filter(item => {
        if (!('price' in item)) return true;
        if (filters.price === 'free') return item.price === 'Gratis' || item.price === 0;
        if (filters.price === 'paid') return typeof item.price === 'number' && item.price > 0;
        return true;
      });
    }

    // Apply rating filter
    if (filters.rating) {
      filtered = filtered.filter(item => 
        'rating' in item && item.rating && item.rating >= filters.rating!
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(item => {
        if (item.type === 'webinar') return item.status === filters.status;
        if (item.type === 'teacher') return item.availability === filters.status;
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      
      switch (filters.sortBy) {
        case 'title':
          return order * a.title.localeCompare(b.title);
        case 'popular':
          // Sort by student count for courses, students count for teachers, etc.
          const aPopularity = getPopularityScore(a);
          const bPopularity = getPopularityScore(b);
          return order * (bPopularity - aPopularity);
        case 'rating':
          const aRating = 'rating' in a ? a.rating || 0 : 0;
          const bRating = 'rating' in b ? b.rating || 0 : 0;
          return order * (bRating - aRating);
        case 'price':
          const aPrice = getPrice(a);
          const bPrice = getPrice(b);
          return order * (aPrice - bPrice);
        case 'oldest':
          const aDate = new Date(a.createdAt || a.updatedAt || '').getTime();
          const bDate = new Date(b.createdAt || b.updatedAt || '').getTime();
          return aDate - bDate;
        case 'newest':
        default:
          const aNewDate = new Date(a.updatedAt || a.createdAt || '').getTime();
          const bNewDate = new Date(b.updatedAt || b.createdAt || '').getTime();
          return bNewDate - aNewDate;
      }
    });

    return filtered;
  }, [data?.data, filters]);

  // Handle filter changes
  const handleFiltersChange = (newFilters: ContentFilters) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  // Grid column configuration
  const gridCols = config.displayConfig.gridCols || {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 3,
  };

  const gridClass = `grid grid-cols-${gridCols.sm} sm:grid-cols-${gridCols.md} lg:grid-cols-${gridCols.lg} xl:grid-cols-${gridCols.xl} gap-x-6 gap-y-10`;

  return (
    <div className={`space-y-10 p-4 sm:p-6 lg:p-8 text-text-light-primary dark:text-text-dark-primary ${className}`}>
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-neutral-100 sm:text-5xl">
          {config.title}
        </h1>
        {config.description && (
          <p className="mt-3 text-base text-gray-600 dark:text-neutral-400 max-w-3xl">
            {config.description}
          </p>
        )}
      </header>

      {/* Filters */}
      <ContentFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        config={config.filterConfig}
        availableOptions={data?.filters}
      />

      {/* Error State */}
      {error && (
        <Card className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <NoContentIcon className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Terjadi Kesalahan</h3>
            <p className="text-sm mt-2 text-gray-600 dark:text-neutral-400">{error}</p>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="mt-4 px-6 py-2.5 bg-brand-purple text-white font-semibold text-sm rounded-lg hover:bg-purple-700 transition-colors"
            >
              Coba Lagi
            </button>
          )}
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className={gridClass}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-96 animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-neutral-700 rounded-t-xl"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Content Grid */}
      {!loading && !error && filteredContent.length > 0 && (
        <div className={gridClass}>
          {filteredContent.map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              config={config.displayConfig}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredContent.length === 0 && (
        <div className="text-center py-16">
          {config.emptyState?.icon ? (
            <config.emptyState.icon className="mx-auto h-20 w-20 text-gray-300 dark:text-neutral-700" />
          ) : (
            <NoContentIcon className="mx-auto h-20 w-20 text-gray-300 dark:text-neutral-700" />
          )}
          <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-neutral-200">
            {config.emptyState?.title || 'Tidak Ada Konten'}
          </h3>
          <p className="mt-2 text-base text-gray-500 dark:text-neutral-400">
            {config.emptyState?.description || 'Konten tidak ditemukan dengan filter yang diterapkan.'}
          </p>
          
          {/* Reset filters or action button */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => handleFiltersChange({
                search: '',
                category: '',
                level: '',
                price: 'all',
                rating: undefined,
                status: '',
                sortBy: 'newest',
                sortOrder: 'desc',
              })}
              className="px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-brand-purple hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-neutral-900"
            >
              Lihat Semua {config.contentType === 'course' ? 'Kursus' : 
                         config.contentType === 'teacher' ? 'Pengajar' :
                         config.contentType === 'webinar' ? 'Webinar' : 'Konten'}
            </button>
            
            {config.emptyState?.actionUrl && config.emptyState?.actionLabel && (
              <a
                href={config.emptyState.actionUrl}
                className="px-5 py-2.5 border border-gray-300 dark:border-neutral-600 text-sm font-medium rounded-md text-gray-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                {config.emptyState.actionLabel}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Pagination (if needed) */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <nav className="flex items-center space-x-2">
            {/* Simple pagination - can be enhanced */}
            <span className="text-sm text-gray-500 dark:text-neutral-400">
              Halaman {data.meta.page} dari {data.meta.totalPages} 
              ({data.meta.total} total item)
            </span>
          </nav>
        </div>
      )}
    </div>
  );
}

// Helper functions
function getPopularityScore(content: Content): number {
  switch (content.type) {
    case 'course':
      return content.studentsEnrolled || 0;
    case 'teacher':
      return content.studentsCount || 0;
    case 'webinar':
      return content.attendeesCount || 0;
    default:
      return 0;
  }
}

function getPrice(content: Content): number {
  if ('price' in content) {
    if (typeof content.price === 'number') return content.price;
    if (content.price === 'Gratis') return 0;
  }
  if (content.type === 'teacher' && content.hourlyRate) {
    return content.hourlyRate;
  }
  return 0;
} 