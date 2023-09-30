import React from "react";
import { PiCaretDoubleLeftBold, PiCaretDoubleRightBold } from "react-icons/pi";

function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	const handlePageChange = (page) => {
		onPageChange(page);
	};

	return (
		<div className="flex items-center justify-end space-x-2 mt-4 px-4">
			{currentPage > 1 && (
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					className="px-3 py-2 rounded-md bg-pink-500 text-white hover:bg-pink-600 focus:outline-none">
					<PiCaretDoubleLeftBold />
				</button>
			)}

			{Array.from({ length: totalPages }).map((_, index) => (
				<button
					key={index}
					onClick={() => handlePageChange(index + 1)}
					className={`px-3 py-1 rounded-md ${
						index + 1 === currentPage
							? "bg-pink-500 text-white"
							: "bg-gray-200 text-gray-700 hover:bg-pink-100"
					} focus:outline-none`}>
					{index + 1}
				</button>
			))}

			{currentPage < totalPages && (
				<button
					onClick={() => handlePageChange(currentPage + 1)}
					className="px-3 py-2 rounded-md bg-pink-500 text-white hover:bg-pink-600 focus:outline-none">
					<PiCaretDoubleRightBold />
				</button>
			)}
		</div>
	);
}

export default Pagination;
