import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

/**
 * Enhanced Search Input Component with clear functionality
 * @param {string} placeholder - Input placeholder text
 * @param {string} value - Current search value
 * @param {Function} onChange - Change handler
 * @param {Function} onClear - Clear handler (optional)
 * @param {string} className - Additional CSS classes
 */
const SearchInput = ({ 
  placeholder = "Search...", 
  value = "", 
  onChange,
  onClear,
  className = ""
}) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <div className={`relative w-full max-w-sm ${className}`}>
      <FiSearch
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          left: "12px",
          color: "#ec4899",
        }}
        size={16}
      />
      
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-10 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
        placeholder={placeholder}
        style={{ borderColor: "#ec4899" }}
      />

      {value && (
        <button
          onClick={handleClear}
          className="absolute bg-white hover:bg-gray-50 rounded-full p-1 transition-colors"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            right: "4px",
          }}
          aria-label="Clear search"
        >
          <FiX className="text-gray-400 hover:text-gray-600" size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;