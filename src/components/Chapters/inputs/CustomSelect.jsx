import React, { useState, useRef, useEffect } from "react";

const CustomSelect = ({
	options = [],
	onSelect,
	placeholder = "Select an option",
	className = "",
	searchable = true,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [selected, setSelected] = useState(null);
	const dropdownRef = useRef(null);

	const filteredOptions = options.filter((opt) =>
		opt.label.toLowerCase().includes(search.toLowerCase())
	);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = (option) => {
		setSelected(option);
		onSelect(option);
		setIsOpen(false);
		setSearch("");
	};

	return (
		<div
			className={`relative w-full max-w-210-px ${className}`}
			ref={dropdownRef}>
			<div
				className="w-full border rounded-md px-3 py-2 cursor-pointer flex justify-between items-center"
				style={{ borderColor: "#ec4899", height: "40px" }}
				onClick={() => setIsOpen(!isOpen)}>
				<span className="text-sm truncate text-pink-500">
					{selected ? selected.label : placeholder}
				</span>
				<span className="text-pink-500">&#9662;</span>
			</div>

			{isOpen && (
				<div
					className="absolute left-0 right-0 w-full mt-1 bg-white border rounded-md shadow-lg z-50 overflow-y-auto"
					style={{ borderColor: "#f9a8d4", maxHeight: "160px" }}>
					{searchable && (
						<input
							type="text"
							className="w-full px-3 py-2 text-sm border-b outline-none"
							placeholder="Search..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					)}
					{filteredOptions.length > 0 ? (
						filteredOptions.map((option) => (
							<div
								key={option.value}
								className="px-3 py-2 text-sm cursor-pointer hover:bg-pink-100"
								onClick={() => handleSelect(option)}>
								{option.label}
							</div>
						))
					) : (
						<div className="px-3 py-2 text-sm text-gray-500">No options</div>
					)}
				</div>
			)}
		</div>
	);
};

export default CustomSelect;
