import { useState, useEffect, useCallback, useRef } from 'react';

const useSearchAndFilter = (initialFilters = {}, debounceDelay = 300, onFilterChange) => {
  const [filters, setFilters] = useState(initialFilters);
  const [debouncedFilters, setDebouncedFilters] = useState(initialFilters);
  const [showFilter, setShowFilter] = useState(false);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedFilters(filters);
      onFilterChange?.(filters);
    }, debounceDelay);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filters, debounceDelay, onFilterChange]);

  const handleSearchChange = useCallback((value) => {
    setFilters(prev => ({ ...prev, search: value }));
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // OPTION A: Flexible update handler
  const updateFilters = useCallback((newFiltersOrFunction) => {
    if (typeof newFiltersOrFunction === 'function') {
      // Handle function updates for complex logic
      setFilters(newFiltersOrFunction);
    } else {
      // Handle object updates for simple merges
      setFilters(prev => ({ ...prev, ...newFiltersOrFunction }));
    }
  }, []);

  const clearAllFilters = useCallback((filterConfig = []) => {
    const clearedFilters = { search: '' };
    filterConfig.forEach(config => {
      clearedFilters[config.key] = '';
    });
    setFilters(clearedFilters);
    setDebouncedFilters(clearedFilters);
  }, []);

  return {
    filters,
    debouncedFilters,
    showFilter,
    handleSearchChange,
    handleFilterChange,
    updateFilters,
    clearAllFilters,
    setShowFilter,
  };
};

export default useSearchAndFilter;