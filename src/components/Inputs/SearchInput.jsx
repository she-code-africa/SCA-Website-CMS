import React from "react";
import { FiSearch } from "react-icons/fi";

const SearchInput = ({ placeholder = "Search...", value, onChange }) => {
  return (
    <div className="relative w-full max-w-sm">
      <FiSearch
        className={`absolute bg-white`}
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          right: "12px",
          color: "#ec4899",
        }}
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full pl-10 px-3 py-2 text-sm border rounded-md focus:outline-none"
        placeholder={placeholder}
        style={{ borderColor: "#ec4899" }}
      />
    </div>
  )
}

export default SearchInput
