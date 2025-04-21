import React from "react";

const ChapterPagination = ({ currentPage, totalPages, onPageChange }) => {
	return (
		<section className="w-full my-10">
			<div className="flex items-center justify-center gap-4">
				<button
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className={`px-3 py-1 rounded ${
						currentPage === 1
							? "bg-pink-300 text-gray-500 cursor-not-allowed"
							: "bg-pink-500 cursor-pointer text-white "
					}`}>
					Previous
				</button>

				<span className="text-base">
					{currentPage} of {totalPages}
				</span>
				<button
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className={`px-3 py-1 rounded ${
						currentPage === totalPages
							? "cursor-not-allowed bg-pink-300 text-gray-500"
							: "bg-pink-500 text-white cursor-pointer"
					}`}>
					Next
				</button>
			</div>
		</section>
	);
};

export default ChapterPagination;
