import { useState, useEffect, useCallback } from 'react';
import { ContentResponse, ContentFilters } from '@/lib/types/content';

interface UseContentDataOptions {
  endpoint: string;
  initialFilters?: ContentFilters;
  autoFetch?: boolean;
  pageSize?: number;
}

interface UseContentDataReturn {
  data: ContentResponse | undefined;
  loading: boolean;
  error: string | null;
  filters: ContentFilters;
  setFilters: (filters: ContentFilters) => void;
  refetch: () => Promise<void>;
  fetchMore: () => Promise<void>;
  hasMore: boolean;
}

export function useContentData({
  endpoint,
  initialFilters = {
    search: '',
    category: '',
    level: '',
    price: 'all',
    rating: undefined,
    status: '',
    sortBy: 'newest',
    sortOrder: 'desc',
  },
  autoFetch = true,
  pageSize = 12,
}: UseContentDataOptions): UseContentDataReturn {
  const [data, setData] = useState<ContentResponse | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ContentFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  // Build query string from filters
  const buildQueryString = useCallback((filtersToUse: ContentFilters, page: number = 1) => {
    const params = new URLSearchParams();
    
    if (filtersToUse.search) params.append('search', filtersToUse.search);
    if (filtersToUse.category) params.append('category', filtersToUse.category);
    if (filtersToUse.level) params.append('level', filtersToUse.level);
    if (filtersToUse.price && filtersToUse.price !== 'all') params.append('price', filtersToUse.price);
    if (filtersToUse.rating) params.append('rating', filtersToUse.rating.toString());
    if (filtersToUse.status) params.append('status', filtersToUse.status);
    if (filtersToUse.sortBy) params.append('sortBy', filtersToUse.sortBy);
    if (filtersToUse.sortOrder) params.append('sortOrder', filtersToUse.sortOrder);
    
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    
    return params.toString();
  }, [pageSize]);

  // Fetch data function using mock service
  const fetchData = useCallback(async (filtersToUse: ContentFilters, page: number = 1, append: boolean = false) => {
    if (!endpoint) return;

    setLoading(true);
    setError(null);

    try {
      // Use mock service instead of real API
      const result: ContentResponse = await import('@/lib/services/mockService').then(
        ({ MockServices }) => MockServices.content.getContent(endpoint, filtersToUse)
      );
      
      setData(prevData => {
        if (append && prevData) {
          return {
            ...result,
            data: [...prevData.data, ...result.data],
          };
        }
        return result;
      });
      
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Error fetching content data:', err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, buildQueryString]);

  // Refetch function
  const refetch = useCallback(async () => {
    setCurrentPage(1);
    await fetchData(filters, 1, false);
  }, [filters, fetchData]);

  // Fetch more for pagination
  const fetchMore = useCallback(async () => {
    if (!data?.meta.hasNext) return;
    await fetchData(filters, currentPage + 1, true);
  }, [data?.meta.hasNext, filters, currentPage, fetchData]);

  // Update filters and fetch new data
  const updateFilters = useCallback((newFilters: ContentFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchData(newFilters, 1, false);
  }, [fetchData]);

  // Auto fetch on mount and filter changes
  useEffect(() => {
    if (autoFetch) {
      fetchData(filters, 1, false);
    }
  }, [autoFetch]); // Only run on mount if autoFetch is enabled

  // Check if there's more data to load
  const hasMore = data?.meta.hasNext || false;

  return {
    data,
    loading,
    error,
    filters,
    setFilters: updateFilters,
    refetch,
    fetchMore,
    hasMore,
  };
}

// Specialized hooks for different content types
export function useCourseData(options?: Partial<UseContentDataOptions>) {
  return useContentData({
    endpoint: '/courses',
    ...options,
  });
}

export function useTeacherData(options?: Partial<UseContentDataOptions>) {
  return useContentData({
    endpoint: '/teachers',
    ...options,
  });
}

export function useWebinarData(options?: Partial<UseContentDataOptions>) {
  return useContentData({
    endpoint: '/webinars',
    ...options,
  });
}

export function useNewsData(options?: Partial<UseContentDataOptions>) {
  return useContentData({
    endpoint: '/news',
    ...options,
  });
}

// useMockContentData has been removed - now using real API data only 