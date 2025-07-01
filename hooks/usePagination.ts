import { useState, useMemo } from 'react';
import { PaginationData } from '@/lib/types';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}

export function usePagination({
  totalItems,
  itemsPerPage = 10,
  initialPage = 0,
}: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const paginationData = useMemo<PaginationData>(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
    };
  }, [currentPage, totalItems, itemsPerPage]);

  const paginatedIndexes = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    
    return {
      startIndex,
      endIndex,
    };
  }, [currentPage, itemsPerPage, totalItems]);

  const goToPage = (page: number) => {
    const maxPage = paginationData.totalPages - 1;
    const validPage = Math.max(0, Math.min(page, maxPage));
    setCurrentPage(validPage);
  };

  const goToNextPage = () => {
    if (currentPage < paginationData.totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(0);
  };

  const goToLastPage = () => {
    setCurrentPage(paginationData.totalPages - 1);
  };

  const canGoNext = currentPage < paginationData.totalPages - 1;
  const canGoPrevious = currentPage > 0;

  const getVisiblePageNumbers = (maxVisible: number = 5) => {
    const { totalPages } = paginationData;
    const pages: number[] = [];
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate start and end around current page
      const sidePages = Math.floor(maxVisible / 2);
      let startPage = Math.max(0, currentPage - sidePages);
      let endPage = Math.min(totalPages - 1, currentPage + sidePages);
      
      // Adjust if we're near the beginning or end
      if (endPage - startPage < maxVisible - 1) {
        if (startPage === 0) {
          endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);
        } else {
          startPage = Math.max(0, endPage - maxVisible + 1);
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const getPageItems = <T>(items: T[]): T[] => {
    const { startIndex, endIndex } = paginatedIndexes;
    return items.slice(startIndex, endIndex);
  };

  const reset = () => {
    setCurrentPage(initialPage);
  };

  return {
    currentPage,
    paginationData,
    paginatedIndexes,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    canGoNext,
    canGoPrevious,
    getVisiblePageNumbers,
    getPageItems,
    reset,
    // Helper properties
    isFirstPage: currentPage === 0,
    isLastPage: currentPage === paginationData.totalPages - 1,
    hasMultiplePages: paginationData.totalPages > 1,
  };
}

export default usePagination; 