import React from "react";
import { PiCaretDoubleLeftBold, PiCaretDoubleRightBold } from "react-icons/pi";

function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	if (totalPages <= 1) return null;

	const maxVisiblePages = 5; // how many page numbers to show
	const half = Math.floor(maxVisiblePages / 2);

	let startPage = Math.max(currentPage - half, 1);
	let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

	if (endPage - startPage < maxVisiblePages - 1) {
		startPage = Math.max(endPage - maxVisiblePages + 1, 1);
	}

	const pages = [];
	for (let i = startPage; i <= endPage; i++) {
		pages.push(i);
	}

	return (
		<div className="flex flex-wrap items-center justify-end gap-2 mt-4 px-4">
			{currentPage > 1 && (
				<button
					onClick={() => onPageChange(currentPage - 1)}
					className="px-3 py-2 rounded-md bg-pink-500 text-white hover:bg-pink-600">
					<PiCaretDoubleLeftBold />
				</button>
			)}

			{startPage > 1 && (
				<>
					<button
						onClick={() => onPageChange(1)}
						className="px-3 py-1 rounded-md bg-gray-200 hover:bg-pink-100">
						1
					</button>
					{startPage > 2 && <span className="px-2">...</span>}
				</>
			)}

			{pages.map((page) => (
				<button
					key={page}
					onClick={() => onPageChange(page)}
					className={`px-3 py-1 rounded-md ${
						page === currentPage
							? "bg-pink-500 text-white"
							: "bg-gray-200 text-gray-700 hover:bg-pink-100"
					}`}>
					{page}
				</button>
			))}

			{endPage < totalPages && (
				<>
					{endPage < totalPages - 1 && <span className="px-2">...</span>}
					<button
						onClick={() => onPageChange(totalPages)}
						className="px-3 py-1 rounded-md bg-gray-200 hover:bg-pink-100">
						{totalPages}
					</button>
				</>
			)}

			{currentPage < totalPages && (
				<button
					onClick={() => onPageChange(currentPage + 1)}
					className="px-3 py-2 rounded-md bg-pink-500 text-white hover:bg-pink-600">
					<PiCaretDoubleRightBold />
				</button>
			)}
		</div>
	);
}

export default Pagination;
