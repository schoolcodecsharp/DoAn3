import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  initialPageSize?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  pageSize: number;
  paginatedData: T[];
  totalItems: number;
  handlePageChange: (page: number, size: number) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

function usePagination<T>({ 
  data, 
  initialPageSize = 10 
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize]);

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page when page size changes
    }
  };

  return {
    currentPage,
    pageSize,
    paginatedData,
    totalItems: data.length,
    handlePageChange,
    setCurrentPage,
    setPageSize,
  };
}

export default usePagination;
