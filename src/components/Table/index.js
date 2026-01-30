// import React, { useCallback, useState } from "react";
// import { useHistory } from "react-router-dom";
// import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
// import { MdOutlineEdit } from "react-icons/md";
// import Modal from "components/Modal";

// const Table = ({
// 	tableData,
// 	tableHead,
// 	addNew,
// 	headers: columns,
// 	actions,
// 	handleDelete,
// }) => {
// 	const [isOpen, setIsOpen] = useState(false);
// 	const history = useHistory();
// 	const { pathname } = history.location;
// 	const [currItem, setCurrItem] = useState();
// 	const viewDetails = (data) => {
// 		pathname === "/admin/team"
// 			? history.push(`${pathname}/view/${data.team._id}/${data._id}`)
// 			: history.push(`${pathname}/view/${data._id}`);
// 	};
// 	const deleteItem = useCallback(() => {
// 		if (pathname === "/admin/team") {
// 			console.log(currItem);
// 			handleDelete(currItem.team._id, currItem._id);
// 			setIsOpen(false);
// 		} else {
// 			console.log("delete item");
// 			handleDelete(currItem._id);
// 			setIsOpen(false);
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [currItem, pathname]);
// 	const handleModal = () => {
// 		setIsOpen(!isOpen);
// 	};
// 	const getTableHeaders = () => {
// 		if (tableData.length === 0) return null;
// 		const headers = columns.map((key, index) => {
// 			return (
// 				<th
// 					className={
// 						"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left  bg-slate-50 text-slate-500 border-slate-100"
// 					}
// 					key={index}>
// 					{key.label}
// 				</th>
// 			);
// 		});

// 		// Add the new column header for actions
// 		if (actions) {
// 			headers.push(
// 				<th
// 					className={
// 						"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left  bg-slate-50 text-slate-500 border-slate-100"
// 					}
// 					key="actions">
// 					Actions
// 				</th>
// 			);
// 		}
// 		return <tr>{headers}</tr>;
// 	};

// 	const getTableRows = () => {
// 		if (tableData.length === 0) return null;
// 		return Object.values(tableData).map((data, index) => {
// 			return (
// 				<tr key={index} className="hover:cursor-pointer">
// 					{columns.map(({ value }, index) => {
// 						return (
// 							<td
// 								className={
// 									"border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 hover:cursor-pointer capitalize"
// 								}
// 								key={index}>
// 								{value !== "team"
// 									? typeof data[value] === "boolean"
// 										? data[value]
// 											? "Yes"
// 											: "No"
// 										: data[value].length > 50
// 										? data[value].slice(0, 50 - 1) + "..."
// 										: data[value]
// 									: data[value].name}
// 							</td>
// 						);
// 					})}
// 					{/* Add the new column for actions */}
// 					{actions && (
// 						<td
// 							className={
// 								"border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 flex items-center hover:cursor-pointer"
// 							}>
// 							{actions.map((action, index) => {
// 								if (action === "view") {
// 									return (
// 										<button
// 											key={index}
// 											onClick={() => {
// 												viewDetails(data);
// 											}}>
// 											<AiOutlineEye size="1rem" />
// 										</button>
// 									);
// 								} else if (action === "edit") {
// 									return (
// 										<div
// 											key={index}
// 											onClick={() => {
// 												history.push(`${pathname}/edit/${data._id}`);
// 											}}
// 											className="text-black rounded px-2 py-1 hover:cursor-pointer">
// 											<MdOutlineEdit size="1rem" />
// 										</div>
// 									);
// 								} else if (action === "delete") {
// 									return (
// 										<button
// 											key={index}
// 											className="bg-transparent text-red-500 rounded px-2 py-1"
// 											onClick={() => {
// 												setIsOpen(true);
// 												setCurrItem(data);
// 											}}>
// 											<AiOutlineDelete size="1rem" />
// 										</button>
// 									);
// 								} else {
// 									return null;
// 								}
// 							})}
// 						</td>
// 					)}
// 				</tr>
// 			);
// 		});
// 	};

// 	return (
// 		<>
// 			<div className="flex flex-wrap mt-4">
// 				<div className="w-full mb-12 px-4">
// 					<div
// 						className={
// 							"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"
// 						}>
// 						<div className="rounded-t mb-0 px-4 py-3 border-0">
// 							<div className="flex flex-wrap items-center">
// 								<div className="relative w-full px-4 max-w-full flex justify-between flex-grow flex-1">
// 									<h3 className={"font-semibold text-lg  text-slate-700"}>
// 										{tableHead}
// 									</h3>
// 									{addNew && (
// 										<button
// 											onClick={() => history.push(`${pathname}/add`)}
// 											className="bg-pink-500 py-2 px-4 rounded text-white text-sm">
// 											Add
// 										</button>
// 									)}
// 								</div>
// 							</div>
// 						</div>
// 						<div className="block w-full overflow-x-auto scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-pink-300">
// 							<table className="items-center w-full bg-transparent border-collapse group">
// 								<thead>{getTableHeaders()}</thead>
// 								<tbody className="group">{getTableRows()}</tbody>
// 							</table>
// 						</div>
// 					</div>
// 				</div>
// 			</div>

// 			<Modal title="Delete" isOpen={isOpen} onClose={handleModal}>
// 				<div>
// 					<div>
// 						<p>Are you sure you want to delete this Item?</p>
// 					</div>
// 					<div className="flex justify-center mt-3">
// 						<button
// 							className="mr-2 bg-red-600 text-white  px-4 py-1 rounded"
// 							onClick={() => {
// 								deleteItem();
// 							}}>
// 							Yes
// 						</button>
// 						<button
// 							className="bg-slate-600 px-4 py-1 text-white rounded"
// 							onClick={() => setIsOpen(false)}>
// 							No
// 						</button>
// 					</div>
// 				</div>
// 			</Modal>
// 		</>
// 	);
// };

// export default Table;


// components/Table/index.js - Refactored for better separation of concerns
import React, { useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";
import Modal from "components/Modal";
import { EmptyState } from "./DisplayTable";

/**
 * Reusable Table Component
 * @param {Array} tableData - Array of data objects to display
 * @param {String} tableHead - Table title
 * @param {Array} headers - Column configuration [{label, value}]
 * @param {Array} actions - Available actions ['view', 'edit', 'delete']
 * @param {Function} onView - Callback when view is clicked
 * @param {Function} onEdit - Callback when edit is clicked
 * @param {Function} onDelete - Callback when delete is confirmed
 * @param {Function} onAdd - Callback when add button is clicked
 * @param {Boolean} showAdd - Whether to show add button
 * @param {Boolean} isLoading - Loading state
 * @param {String} emptyMessage - Message to show when no data
 */
const Table = ({
	tableData = [],
	tableHead,
	headers = [],
	actions = [],
	onView,
	onEdit,
	onDelete,
	onAdd,
	showAdd = true,
	isLoading = false,
	emptyMessage = "No data available"
}) => {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);

	const handleDeleteClick = (item) => {
		setSelectedItem(item);
		setIsDeleteModalOpen(true);
	};

	const handleDeleteConfirm = () => {
		if (selectedItem && onDelete) {
			onDelete(selectedItem);
		}
		setIsDeleteModalOpen(false);
		setSelectedItem(null);
	};

	const handleCloseModal = () => {
		setIsDeleteModalOpen(false);
		setSelectedItem(null);
	};

	const renderCellContent = (data, columnValue) => {
		const value = data[columnValue];

		// Handle nested objects (like team.name)
		if (columnValue.includes('.')) {
			const keys = columnValue.split('.');
			let nestedValue = data;
			for (const key of keys) {
				nestedValue = nestedValue?.[key];
			}
			return nestedValue || '—';
		}

		// Handle boolean values
		if (typeof value === "boolean") {
			return (
				<span className={`px-2 py-1 rounded-full text-xs ${
					value 
						? "bg-green-100 text-green-800" 
						: "bg-gray-100 text-gray-800"
				}`}>
					{value ? "Yes" : "No"}
				</span>
			);
		}

		// Handle long text
		if (typeof value === "string" && value.length > 50) {
			return (
				<span className="truncate block" title={value}>
					{value.slice(0, 47)}...
				</span>
			);
		}

		// Handle null/undefined
		if (value === null || value === undefined) {
			return "—";
		}

		return value;
	};

	const renderTableHeaders = () => {
		if (headers.length === 0) return null;

		return (
			<tr>
				{headers.map(({ label }, index) => (
					<th
						key={index}
						className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider bg-slate-50 border-b border-slate-200"
					>
						{label}
					</th>
				))}
				{actions.length > 0 && (
					<th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider bg-slate-50 border-b border-slate-200">
						Actions
					</th>
				)}
			</tr>
		);
	};

	const renderTableRows = () => {
		if (isLoading) {
			return (
				<tr>
					<td colSpan={headers.length + (actions.length > 0 ? 1 : 0)} className="px-6 py-12 text-center">
						<div className="flex items-center justify-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
						</div>
					</td>
				</tr>
			);
		}

		if (tableData.length === 0) {
			return (
				<tr>
					<td colSpan={headers.length + (actions.length > 0 ? 1 : 0)}>
						<EmptyState 
							message={emptyMessage}
							action={showAdd && onAdd ? onAdd : undefined}
							actionLabel="Add New"
						/>
					</td>
				</tr>
			);
		}

		return tableData.map((data, rowIndex) => (
			<tr 
				key={data._id || rowIndex} 
				className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
			>
				{headers.map(({ value }, colIndex) => (
					<td
						key={colIndex}
						className="px-6 py-4 text-sm text-gray-700 capitalize"
					>
						{renderCellContent(data, value)}
					</td>
				))}

				{actions.length > 0 && (
					<td className="px-6 py-4 text-sm">
						<div className="flex items-center gap-2">
							{actions.includes("view") && onView && (
								<button
									onClick={(e) => {
										e.stopPropagation();
										onView(data);
									}}
									className="p-1.5 hover:bg-blue-50 rounded transition-colors text-blue-600"
									title="View details"
								>
									<AiOutlineEye size="1.125rem" />
								</button>
							)}

							{actions.includes("edit") && onEdit && (
								<button
									onClick={(e) => {
										e.stopPropagation();
										onEdit(data);
									}}
									className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-700"
									title="Edit"
								>
									<MdOutlineEdit size="1.125rem" />
								</button>
							)}

							{actions.includes("delete") && onDelete && (
								<button
									onClick={(e) => {
										e.stopPropagation();
										handleDeleteClick(data);
									}}
									className="p-1.5 hover:bg-red-50 rounded transition-colors text-red-600"
									title="Delete"
								>
									<AiOutlineDelete size="1.125rem" />
								</button>
							)}
						</div>
					</td>
				)}
			</tr>
		));
	};

	return (
		<>
			<div className="flex flex-wrap mt-4">
				<div className="w-full mb-12 px-4">
					<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border border-gray-100">
						{/* Header */}
						<div className="rounded-t mb-0 px-6 py-4 border-b border-gray-100">
							<div className="flex flex-wrap items-center justify-between">
								<h3 className="font-semibold text-lg text-slate-700">
									{tableHead}
								</h3>
								{showAdd && onAdd && (
									<button
										onClick={onAdd}
										className="bg-pink-500 hover:bg-pink-600 transition-colors py-2 px-4 rounded-lg text-white text-sm font-medium"
									>
										Add New
									</button>
								)}
							</div>
						</div>

						{/* Table */}
						<div className="block w-full overflow-x-auto">
							<table className="items-center w-full bg-transparent border-collapse">
								<thead>{renderTableHeaders()}</thead>
								<tbody>{renderTableRows()}</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>

			{/* Delete Modal */}
			<Modal 
				title="Confirm Delete" 
				isOpen={isDeleteModalOpen} 
				onClose={handleCloseModal}
			>
				<div className="p-2">
					<p className="text-gray-700 mb-6">
						Are you sure you want to delete this item? This action cannot be undone.
					</p>
					<div className="flex justify-end gap-3">
						<button
							className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
							onClick={handleCloseModal}
						>
							Cancel
						</button>
						<button
							className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
							onClick={handleDeleteConfirm}
						>
							Delete
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default Table;