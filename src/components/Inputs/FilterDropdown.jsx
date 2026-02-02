import React, { useEffect, useRef } from "react";

/**
 * Reusable Filter Dropdown Component
 * @param {boolean} showFilter - Controls dropdown visibility
 * @param {Function} setShowFilter - Function to control visibility
 * @param {Object} filters - Current filter state
 * @param {Function} setFilters - Function to update filters
 * @param {Array} filterConfig - Array of filter configurations
 * @param {Function} onClear - Optional callback when filters are cleared
 */

const FilterDropdown = ({ 
  showFilter, 
  setShowFilter, 
  filters, 
  setFilters,
  filterConfig = [],
  onClear
}) => {
  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    }

    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter, setShowFilter]);

  const handleClearFilters = () => {
    const clearedFilters = { search: filters.search || "" };
    filterConfig.forEach(config => {
      clearedFilters[config.key] = "";
    });
    setFilters(clearedFilters);
    if (onClear) onClear();
  };

  const handleFilterChange = (key, value) => {
    console.log(`Filter changed: ${key} = ${value}`);
    // FIXED: Pass an object instead of a function
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const activeFilterCount = filterConfig.filter(
    config => filters[config.key] && filters[config.key] !== ""
  ).length;

  if (!showFilter) return null;

  return (
    <div 
      ref={filterRef}
      className="absolute top-12 right-0 z-50 bg-white shadow-xl rounded-lg p-4 w-96 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-700">Filters</h4>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-pink-100 text-pink-600 text-xs rounded-full font-medium">
              {activeFilterCount} active
            </span>
          )}
          <span className="text-xs text-gray-500">
            Changes apply immediately
          </span>
        </div>
      </div>

      <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
        {filterConfig.map((config) => (
          <div key={config.key}>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              {config.label}
            </label>
            
            {config.type === 'select' && (
              <select
                value={filters[config.key] || ""}
                onChange={(e) => {
                  e.stopPropagation();
                  handleFilterChange(config.key, e.target.value);
                }}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all hover:border-pink-300 cursor-pointer"
              >
                <option value="">All</option>
                {config.options.map((option) => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    className="py-1"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            
            {/* Display current value for debugging */}
            {filters[config.key] && filters[config.key] !== "" && (
              <div className="text-xs text-pink-500 mt-1 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-pink-500"></span>
                Selected: {config.options.find(opt => opt.value === filters[config.key])?.label || filters[config.key]}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
        <button
          className="text-sm text-pink-500 hover:text-pink-600 font-medium transition-colors px-3 py-1.5 hover:bg-pink-50 rounded"
          onClick={handleClearFilters}
        >
          Clear all filters
        </button>
        
        <button
          className="text-sm bg-pink-500 hover:bg-pink-600 text-white px-4 py-1.5 rounded-md transition-colors"
          onClick={() => {
            console.log("Current filters:", filters);
            setShowFilter(false);
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FilterDropdown;