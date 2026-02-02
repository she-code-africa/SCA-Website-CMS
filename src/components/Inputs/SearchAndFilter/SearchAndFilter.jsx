import React from "react";
import { LuListFilter } from "react-icons/lu";
import SearchInput from "../SearchInput";
import FilterDropdown from "../FilterDropdown";

/**
 * Unified Search and Filter Container Component
 * Combines search input, filter button, and filter dropdown in a reusable component
 * 
 * @param {string} searchPlaceholder - Placeholder for search input
 * @param {string} searchValue - Current search value
 * @param {Function} onSearchChange - Search change handler
 * @param {boolean} showFilter - Filter dropdown visibility state
 * @param {Function} setShowFilter - Function to toggle filter visibility
 * @param {Object} filters - Current filter state
 * @param {Function} setFilters - Function to update filters
 * @param {Array} filterConfig - Filter configuration array
 * @param {Function} onFilterClear - Optional callback when filters are cleared
 * @param {string} className - Additional CSS classes for container
 */
const SearchAndFilter = ({
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  showFilter,
  setShowFilter,
  filters,
  setFilters,
  filterConfig = [],
  onFilterClear,
  className = ""
}) => {
  
  // Count active filters (excluding search)
  const activeFilterCount = filterConfig.filter(
    config => filters[config.key] && filters[config.key] !== ""
  ).length;

  return (
    <div className={`flex items-center gap-2 relative ${className}`}>
      {/* Search Input */}
      <SearchInput
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={onSearchChange}
      />

      {/* Filter Button */}
      <div className="relative">
        <button
          onClick={() => setShowFilter(prev => !prev)}
          className={`relative p-2 rounded-md transition-all ${
            showFilter || activeFilterCount > 0
              ? 'bg-pink-500 text-white' 
              : 'bg-pink-100 text-pink-500 hover:bg-pink-200'
          }`}
          aria-label="Toggle filters"
        >
          <LuListFilter className="text-xl" />
          
          {/* Active filter badge */}
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-pink-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-pink-500">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Filter Dropdown */}
        <FilterDropdown
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          filters={filters}
          setFilters={setFilters}
          filterConfig={filterConfig}
          onClear={onFilterClear}
        />
      </div>
    </div>
  );
};

export default SearchAndFilter; 