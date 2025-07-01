import { useState, useEffect, useCallback } from 'react';
import { ContentResponse, ContentFilters, Content } from '@/lib/types/content';

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

  // Fetch data function
  const fetchData = useCallback(async (filtersToUse: ContentFilters, page: number = 1, append: boolean = false) => {
    if (!endpoint) return;

    setLoading(true);
    setError(null);

    try {
      const queryString = buildQueryString(filtersToUse, page);
      const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}?${queryString}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          // Add auth header if needed
          ...(typeof window !== 'undefined' && localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ContentResponse = await response.json();
      
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

// Mock data hook for development/testing
export function useMockContentData(mockData: Content[]): UseContentDataReturn {
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

  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Filter and sort mock data
  const filteredData = mockData.filter(item => {
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
      
      if (!matchesSearch) return false;
    }

    // Apply category filter
    if (filters.category && item.category !== filters.category) {
      return false;
    }

    // Apply level filter (for courses)
    if (filters.level && item.type === 'course' && item.level !== filters.level) {
      return false;
    }

    // Apply price filter
    if (filters.price && filters.price !== 'all' && 'price' in item) {
      if (filters.price === 'free' && !(item.price === 'Gratis' || item.price === 0)) {
        return false;
      }
      if (filters.price === 'paid' && !(typeof item.price === 'number' && item.price > 0)) {
        return false;
      }
    }

    return true;
  });

  const data: ContentResponse = {
    data: filteredData,
    meta: {
      page: 1,
      pageSize: filteredData.length,
      total: filteredData.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };

  const refetch = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
  };

  const fetchMore = async () => {
    // No more pages in mock data
  };

  return {
    data,
    loading,
    error,
    filters,
    setFilters,
    refetch,
    fetchMore,
    hasMore: false,
  };
} 