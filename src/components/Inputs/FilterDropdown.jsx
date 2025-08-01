// import React, { useEffect, useRef } from "react";

// const FilterDropdown = ({ 
//   showFilter, 
//   setShowFilter, 
//   filters, 
//   setFilters 
// }) => {
//   const filterRef = useRef(null);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (filterRef.current && !filterRef.current.contains(event.target)) {
//         setShowFilter(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [setShowFilter]);

//   const handleClearFilters = () => {
//     setFilters({ search: "", isLeader: "", state: "", team: "" });
//   };

//   if (!showFilter) return null;

//   return (
//     <div 
//       ref={filterRef}
//       className="absolute top-20 right-8 z-50 bg-white shadow-md rounded-md p-4 w-48"
//     >
//       <label className="block text-sm font-medium mb-1">Team Lead</label>
//       <select
//         value={filters.isLeader}
//         onChange={(e) =>
//           setFilters((prev) => ({ ...prev, isLeader: e.target.value }))
//         }
//         className="w-full mb-3 border border-pink-300 rounded p-1"
//       >
//         <option value="">All</option>
//         <option value="true">Yes</option>
//         <option value="false">No</option>
//       </select>

//       <label className="block text-sm font-medium mb-1">State</label>
//       <select
//         value={filters.state}
//         onChange={(e) =>
//           setFilters((prev) => ({ ...prev, state: e.target.value }))
//         }
//         className="w-full mb-3 border border-pink-300 rounded p-1"
//       >
//         <option value="">All</option>
//         <option value="draft">Draft</option>
//         <option value="archived">Archived</option>
//         <option value="published">Published</option>
//       </select>

//       <label className="block text-sm font-medium mb-1">Team</label>
//       <select
//         value={filters.team}
//         onChange={(e) =>
//           setFilters((prev) => ({ ...prev, team: e.target.value }))
//         }
//         className="w-full mb-3 border border-pink-300 rounded p-1"
//       >
//         <option value="">All</option>
//         <option value="Dev team">Dev team</option>
//         <option value="Support Team">Support Team</option>
//         <option value="Advisors">Advisors</option>
//         <option value="Full Time">Full Time</option>
//       </select>

//       <button
//         className="text-sm text-pink-500 underline"
//         onClick={handleClearFilters}
//       >
//         Clear Filters
//       </button>
//     </div>
//   );
// };

// export default FilterDropdown;

import React, { useEffect, useRef } from "react";

const FilterDropdown = ({ 
  showFilter, 
  setShowFilter, 
  filters, 
  setFilters,
  filterConfig = [] // Array of filter configurations
}) => {
  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowFilter]);

  const handleClearFilters = () => {
    // Clear all filters based on the filterConfig keys
    const clearedFilters = {};
    filterConfig.forEach(config => {
      clearedFilters[config.key] = "";
    });
    // Also clear search if it exists in filters
    if (filters.hasOwnProperty('search')) {
      clearedFilters.search = "";
    }
    setFilters(clearedFilters);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (!showFilter) return null;

  return (
    <div 
      ref={filterRef}
      className="absolute top-12 right-0 z-50 bg-white shadow-md rounded-md p-4 w-64"
    >
      {filterConfig.map((config) => (
        <div key={config.key} className="mb-3">
          <label className="block text-sm font-medium mb-1">{config.label}</label>
          {config.type === 'select' && (
            <select
              value={filters[config.key] || ""}
              onChange={(e) => handleFilterChange(config.key, e.target.value)}
              className="w-full border border-pink-300 rounded p-1"
            >
              <option value="">All</option>
              {config.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {config.type === 'input' && (
            <input
              type="text"
              value={filters[config.key] || ""}
              onChange={(e) => handleFilterChange(config.key, e.target.value)}
              placeholder={config.placeholder || ""}
              className="w-full border border-pink-300 rounded p-1"
            />
          )}
        </div>
      ))}

      <button
        className="text-sm text-pink-500 underline"
        onClick={handleClearFilters}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default FilterDropdown;