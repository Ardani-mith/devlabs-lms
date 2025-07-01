"use client";

import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon, 
  ChevronDownIcon, 
  FunnelIcon, 
  XMarkIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  StarIcon,
  CalendarDaysIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { ContentFilters as FilterState, FilterOption, FilterConfig } from '@/lib/types/content';

interface ContentFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  config: FilterConfig;
  availableOptions?: {
    categories?: FilterOption[];
    levels?: FilterOption[];
    statuses?: FilterOption[];
  };
  className?: string;
}

export default function ContentFilters({
  filters,
  onFiltersChange,
  config,
  availableOptions,
  className = ''
}: ContentFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      search: '',
      category: '',
      level: '',
      price: 'all',
      rating: undefined,
      status: '',
      sortBy: 'newest',
      sortOrder: 'desc',
    });
    setShowAdvancedFilters(false);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'search') return value && value.length > 0;
    if (key === 'price') return value && value !== 'all';
    if (key === 'sortBy') return value && value !== 'newest';
    if (key === 'sortOrder') return value && value !== 'desc';
    return value && value !== '';
  });

  return (
    <div className={`sticky top-[calc(var(--header-height,4rem)+1rem)] z-30 bg-gray-50/90 dark:bg-neutral-900/90 backdrop-blur-lg py-5 rounded-xl shadow-lg mb-10 -mx-4 px-4 md:-mx-6 md:px-6 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search Input */}
        {config.showSearch && (
          <div className="relative flex-grow w-full md:w-auto">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
            <input
              type="search"
              placeholder={config.searchPlaceholder || "Cari konten..."}
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent transition-shadow focus:shadow-lg"
            />
          </div>
        )}

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="w-full md:w-auto flex items-center justify-center px-5 py-3.5 rounded-lg border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-700/70 transition-colors focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500"
        >
          <FunnelIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-neutral-400" />
          Filter
          {hasActiveFilters && (
            <span className="ml-2 h-2 w-2 bg-brand-purple rounded-full"></span>
          )}
          <ChevronDownIcon className={`h-5 w-5 ml-2 text-gray-400 dark:text-neutral-500 transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700/60 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
          
          {/* Category Filter */}
          {config.showCategoryFilter && availableOptions?.categories && (
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Kategori
              </label>
              <div className="relative">
                <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                <select
                  value={filters.category || ''}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full appearance-none pl-10 pr-8 py-2.5 rounded-md border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Semua Kategori</option>
                  {availableOptions.categories.map(category => (
                    <option key={category.id} value={category.value}>
                      {category.label}
                      {category.count && ` (${category.count})`}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Level Filter */}
          {config.showLevelFilter && availableOptions?.levels && (
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Level
              </label>
              <div className="relative">
                <ChartBarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                <select
                  value={filters.level || ''}
                  onChange={(e) => updateFilter('level', e.target.value)}
                  className="w-full appearance-none pl-10 pr-8 py-2.5 rounded-md border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Semua Level</option>
                  {availableOptions.levels.map(level => (
                    <option key={level.id} value={level.value}>
                      {level.label}
                      {level.count && ` (${level.count})`}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Price Filter */}
          {config.showPriceFilter && (
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Harga
              </label>
              <div className="relative">
                <CurrencyDollarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                <select
                  value={filters.price || 'all'}
                  onChange={(e) => updateFilter('price', e.target.value)}
                  className="w-full appearance-none pl-10 pr-8 py-2.5 rounded-md border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">Semua Harga</option>
                  <option value="free">Gratis</option>
                  <option value="paid">Berbayar</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Rating Filter */}
          {config.showRatingFilter && (
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Rating Minimum
              </label>
              <div className="relative">
                <StarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                <select
                  value={filters.rating || ''}
                  onChange={(e) => updateFilter('rating', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full appearance-none pl-10 pr-8 py-2.5 rounded-md border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Semua Rating</option>
                  <option value="4">4+ Bintang</option>
                  <option value="3">3+ Bintang</option>
                  <option value="2">2+ Bintang</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Status Filter */}
          {config.showStatusFilter && availableOptions?.statuses && (
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Status
              </label>
              <div className="relative">
                <CalendarDaysIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                <select
                  value={filters.status || ''}
                  onChange={(e) => updateFilter('status', e.target.value)}
                  className="w-full appearance-none pl-10 pr-8 py-2.5 rounded-md border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Semua Status</option>
                  {availableOptions.statuses.map(status => (
                    <option key={status.id} value={status.value}>
                      {status.label}
                      {status.count && ` (${status.count})`}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Sort Options */}
          {config.showSortOptions && (
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300 mb-1">
                Urutkan
              </label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                <select
                  value={`${filters.sortBy || 'newest'}-${filters.sortOrder || 'desc'}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    updateFilter('sortBy', sortBy);
                    updateFilter('sortOrder', sortOrder);
                  }}
                  className="w-full appearance-none pl-10 pr-8 py-2.5 rounded-md border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="newest-desc">Terbaru</option>
                  <option value="oldest-asc">Terlama</option>
                  <option value="popular-desc">Paling Populer</option>
                  <option value="rating-desc">Rating Tertinggi</option>
                  <option value="price-asc">Harga Terendah</option>
                  <option value="price-desc">Harga Tertinggi</option>
                  <option value="title-asc">Nama A-Z</option>
                  <option value="title-desc">Nama Z-A</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Custom Filters */}
          {config.customFilters && config.customFilters.map(customFilter => (
            <div key={customFilter.id}>
              <label className="block text-xs font-medium text-gray-700 dark:text-neutral-300 mb-1">
                {customFilter.label}
              </label>
              <div className="relative">
                <select
                  value={filters[customFilter.id as keyof FilterState] || ''}
                  onChange={(e) => updateFilter(customFilter.id as keyof FilterState, e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-md border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Semua {customFilter.label}</option>
                  <option value={customFilter.value}>{customFilter.label}</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
              </div>
            </div>
          ))}

          {/* Reset Button */}
          <div className="lg:col-span-3 flex justify-end">
            <button
              onClick={resetFilters}
              className="flex items-center text-xs text-gray-600 dark:text-neutral-400 hover:text-brand-purple dark:hover:text-purple-400 font-medium py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-700/50 transition-colors"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Reset Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Export convenience component for specific content types
export function CourseFilters(props: Omit<ContentFiltersProps, 'config'>) {
  const config: FilterConfig = {
    showSearch: true,
    showCategoryFilter: true,
    showLevelFilter: true,
    showPriceFilter: true,
    showRatingFilter: true,
    showSortOptions: true,
    searchPlaceholder: "Cari kursus, instruktur, atau topik...",
  };
  
  return <ContentFilters {...props} config={config} />;
}

export function TeacherFilters(props: Omit<ContentFiltersProps, 'config'>) {
  const config: FilterConfig = {
    showSearch: true,
    showCategoryFilter: true,
    showRatingFilter: true,
    showStatusFilter: true,
    showSortOptions: true,
    searchPlaceholder: "Cari pengajar berdasarkan nama atau keahlian...",
  };
  
  return <ContentFilters {...props} config={config} />;
}

export function WebinarFilters(props: Omit<ContentFiltersProps, 'config'>) {
  const config: FilterConfig = {
    showSearch: true,
    showCategoryFilter: true,
    showPriceFilter: true,
    showStatusFilter: true,
    showSortOptions: true,
    searchPlaceholder: "Cari webinar berdasarkan topik atau pembicara...",
  };
  
  return <ContentFilters {...props} config={config} />;
} 