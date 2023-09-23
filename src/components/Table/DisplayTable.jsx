import React, { useEffect, useRef, useState } from "react";
import { HiEllipsisVertical } from "react-icons/hi2";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";

const DisplayTable = () => {
	return <div>DisplayTable</div>;
};

export default DisplayTable;

export const Table = ({ width, children }) => {
	return (
		<table
			className={`w-${width} flex flex-col min-w-0 break-words w-full shadow-lg border border-transparent rounded py-4 border-collapse  overflow-x-scroll lg:overflow-x-visible`}>
			{children}
		</table>
	);
};

export const TableHeaderRow = ({ className, children }) => {
	return (
		<thead className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left  bg-slate-50 text-slate-500 border-slate-100">
			<tr className={className}>{children}</tr>
		</thead>
	);
};

export const TableHeader = ({ children }) => {
	return <th scope="col">{children}</th>;
};

export const TableBody = ({ loading, children }) => {
	return (
		<tbody className="bg-white">
			<ReactPlaceholder
				ready={!loading}
				rows={4}
				type="text"
				color="#E0E0E0"
				className="p-4">
				<>{children}</>
			</ReactPlaceholder>
		</tbody>
	);
};

export const TableDataRow = ({ className, children }) => {
	return <tr className={className}>{children}</tr>;
};

export const TableData = ({ children, className, noTruncate }) => {
	return (
		<td className={`${!noTruncate && "truncate"} text-xs relative`}>
			{children}
		</td>
	);
};

export const TableActions = ({ children }) => {
	const [open, setOpen] = useState(false);
	const containerRef = useRef(null);

	// Add a click event listener to the document
	useEffect(() => {
		const handleOutsideClick = (event) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target)
			) {
				setOpen(false);
			}
		};

		document.addEventListener("click", handleOutsideClick);

		// Clean up the event listener when the component unmounts
		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, []);

	return (
		<div ref={containerRef} className="hover:cursor-pointer">
			<span onClick={() => setOpen(!open)}>
				<HiEllipsisVertical size="1rem" />
			</span>
			{open && (
				<ul className="absolute grid z-2 bg-white py-3 rounded-md mt-1 shadow min-w-[100px] gap-2">
					{children}
				</ul>
			)}
		</div>
	);
};
