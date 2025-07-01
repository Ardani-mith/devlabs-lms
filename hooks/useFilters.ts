import { useState, useMemo } from 'react';
import { CourseFilters } from '@/lib/types';

interface UseFiltersProps<T> {
  data: T[];
  initialFilters?: Partial<CourseFilters>;
  filterFunctions: {
    search?: (item: T, searchTerm: string) => boolean;
    category?: (item: T, category: string) => boolean;
    level?: (item: T, level: string) => boolean;
    tags?: (item: T, tags: string[]) => boolean;
    custom?: { [key: string]: (item: T, value: string | number | boolean | string[]) => boolean };
  };
}

export function useFilters<T>({
  data,
  initialFilters = {},
  filterFunctions,
}: UseFiltersProps<T>) {
  const [filters, setFilters] = useState<CourseFilters>({
    searchTerm: '',
    category: 'Semua Kategori',
    level: 'Semua Level',
    ...initialFilters,
  });

  const [customFilters, setCustomFilters] = useState<{ [key: string]: string | number | boolean | string[] | undefined }>({});

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search filter
      if (filters.searchTerm && filterFunctions.search) {
        if (!filterFunctions.search(item, filters.searchTerm)) {
          return false;
        }
      }

      // Category filter
      if (filters.category && filters.category !== 'Semua Kategori' && filterFunctions.category) {
        if (!filterFunctions.category(item, filters.category)) {
          return false;
        }
      }

      // Level filter
      if (filters.level && filters.level !== 'Semua Level' && filterFunctions.level) {
        if (!filterFunctions.level(item, filters.level)) {
          return false;
        }
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0 && filterFunctions.tags) {
        if (!filterFunctions.tags(item, filters.tags)) {
          return false;
        }
      }

      // Custom filters
      if (filterFunctions.custom) {
        for (const [key, value] of Object.entries(customFilters)) {
          if (value !== undefined && filterFunctions.custom[key]) {
            if (!filterFunctions.custom[key](item, value)) {
              return false;
            }
          }
        }
      }

      return true;
    });
  }, [data, filters, customFilters, filterFunctions]);

  const updateFilter = (key: keyof CourseFilters, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateCustomFilter = (key: string, value: string | number | boolean | string[] | undefined) => {
    setCustomFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'Semua Kategori',
      level: 'Semua Level',
      ...initialFilters,
    });
    setCustomFilters({});
  };

  const hasActiveFilters = useMemo(() => {
    const hasBasicFilters = filters.searchTerm !== '' || 
                           filters.category !== 'Semua Kategori' || 
                           filters.level !== 'Semua Level' ||
                           (filters.tags && filters.tags.length > 0);
    
    const hasCustomFilters = Object.values(customFilters).some(value => 
      value !== undefined && value !== '' && value !== null
    );

    return hasBasicFilters || hasCustomFilters;
  }, [filters, customFilters]);

  return {
    filters,
    customFilters,
    filteredData,
    updateFilter,
    updateCustomFilter,
    resetFilters,
    hasActiveFilters,
    resultCount: filteredData.length,
    totalCount: data.length,
  };
}

export default useFilters; 