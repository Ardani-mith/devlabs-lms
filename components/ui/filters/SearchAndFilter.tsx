import React from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ChevronDownIcon, 
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { CourseFilters } from '@/lib/types';

interface FilterOption {
  label: string;
  value: string;
}

interface SearchAndFilterProps {
  filters: CourseFilters;
  onUpdateFilter: (key: keyof CourseFilters, value: string | string[]) => void;
  onResetFilters: () => void;
  options: {
    categories?: FilterOption[];
    levels?: FilterOption[];
  };
  placeholders?: {
    search?: string;
    category?: string;
    level?: string;
  };
  showFilters: boolean;
  onToggleFilters: () => void;
  resultCount?: number;
  className?: string;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  filters,
  onUpdateFilter,
  onResetFilters,
  options,
  placeholders = {
    search: 'Cari...',
    category: 'Kategori',
    level: 'Level',
  },
  showFilters,
  onToggleFilters,
  resultCount,
  className = '',
}) => {
  const hasActiveFilters = filters.searchTerm !== '' || 
                          filters.category !== 'Semua Kategori' || 
                          filters.level !== 'Semua Level';

  return (
    <div className={`sticky top-[calc(var(--header-height,4rem)+1rem)] z-30 bg-gray-50/90 dark:bg-neutral-900/90 backdrop-blur-lg py-5 rounded-xl shadow-lg mb-10 -mx-4 px-4 md:-mx-6 md:px-6 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="relative flex-grow w-full md:w-auto">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
          <input
            type="search"
            placeholder={placeholders.search}
            value={filters.searchTerm}
            onChange={(e) => onUpdateFilter('searchTerm', e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent transition-shadow focus:shadow-lg"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={onToggleFilters}
          className="w-full md:w-auto flex items-center justify-center px-5 py-3.5 rounded-lg border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-800 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-700/70 transition-colors focus:ring-2 focus:ring-brand-purple dark:focus:ring-purple-500"
        >
          <FunnelIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-neutral-400" />
          Filter
          {hasActiveFilters && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-brand-purple rounded-full">
              !
            </span>
          )}
          <ChevronDownIcon className={`h-5 w-5 ml-2 text-gray-400 dark:text-neutral-500 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700/60 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeInDown">
          {/* Category Filter */}
          {options.categories && (
            <div>
              <label htmlFor="category-filter" className="block text-xs font-medium text-gray-700 dark:text-neutral-300 mb-1">
                {placeholders.category}
              </label>
              <div className="relative">
                <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                <select
                  id="category-filter"
                  value={filters.category}
                  onChange={(e) => onUpdateFilter('category', e.target.value)}
                  className="w-full appearance-none pl-10 pr-8 py-2.5 rounded-md border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent"
                >
                  {options.categories.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Level Filter */}
          {options.levels && (
            <div>
              <label htmlFor="level-filter" className="block text-xs font-medium text-gray-700 dark:text-neutral-300 mb-1">
                {placeholders.level}
              </label>
              <div className="relative">
                <ChartBarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                <select
                  id="level-filter"
                  value={filters.level}
                  onChange={(e) => onUpdateFilter('level', e.target.value)}
                  className="w-full appearance-none pl-10 pr-8 py-2.5 rounded-md border border-gray-300 dark:border-neutral-600/80 bg-white dark:bg-neutral-700 text-sm focus:ring-1 focus:ring-brand-purple dark:focus:ring-purple-500 focus:border-transparent"
                >
                  {options.levels.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-neutral-500 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Results Count and Reset */}
          <div className="md:col-span-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            {resultCount !== undefined && (
              <span className="text-sm text-gray-600 dark:text-neutral-400">
                Menampilkan {resultCount} hasil
              </span>
            )}
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="flex items-center text-xs text-gray-600 dark:text-neutral-400 hover:text-brand-purple dark:hover:text-purple-400 font-medium py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-700/50 transition-colors"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Reset Filter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter; 