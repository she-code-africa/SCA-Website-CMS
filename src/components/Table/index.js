import React from "react";
import { Link, useHistory } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";
import { paths } from "utils";

const Table = ({ tableData, tableHead, addNew, showActions, edit, view }) => {
	const history = useHistory();
	const viewDetails = (id) => {
		history.push(`${paths[view]}/${id}`);
	};
	const getTableHeaders = () => {
		if (tableData.length === 0) return null;

		const headers = Object.keys(tableData[0]).map((key, index) => {
			return (
				<th
					className={
						"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left  bg-slate-50 text-slate-500 border-slate-100"
					}
					key={index}>
					{key}
				</th>
			);
		});

		// Add the new column header for actions
		if (showActions) {
			headers.push(
				<th
					className={
						"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left  bg-slate-50 text-slate-500 border-slate-100"
					}
					key="actions">
					Actions
				</th>
			);
		}

		return <tr>{headers}</tr>;
	};

	const getTableRows = () => {
		if (tableData.length === 0) return null;

		return tableData.map((data, index) => {
			return (
				<tr
					key={index}
					className="hover:cursor-pointer hover:bg-gray-600"
					onClick={() => viewDetails(data.id)}>
					{Object.values(data).map((value) => {
						return (
							<td
								className={
									"border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 hover:cursor-pointer"
								}
								key={value}>
								{value}
							</td>
						);
					})}

					{/* Add the new column for actions */}
					{showActions && (
						<td
							className={
								"border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 flex items-center"
							}>
							<Link
								to={`${paths[edit]}/${data.id}`}
								className="text-black rounded px-2 py-1 mr-2 hover:cursor-pointer">
								<MdOutlineEdit size="1rem" />
							</Link>
							<button
								className="bg-transparent text-red-500 rounded px-2 py-1"
								// onClick={() => handleDelete(data.id)}
							>
								<AiOutlineDelete size="1rem" />
							</button>
						</td>
					)}
				</tr>
			);
		});
	};

	return (
		<>
			<div className="flex flex-wrap mt-4">
				<div className="w-full mb-12 px-4">
					<div
						className={
							"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"
						}>
						<div className="rounded-t mb-0 px-4 py-3 border-0">
							<div className="flex flex-wrap items-center">
								<div className="relative w-full px-4 max-w-full flex justify-between flex-grow flex-1">
									<h3 className={"font-semibold text-lg  text-slate-700"}>
										{tableHead}
									</h3>
									{addNew && (
										<Link
											to={paths[addNew]}
											className="bg-pink-500 py-2 px-4 rounded text-white text-sm">
											Add
										</Link>
									)}
								</div>
							</div>
						</div>
						<div className="block w-full overflow-x-auto scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-pink-300">
							<table className="items-center w-full bg-transparent border-collapse group">
								<thead>{getTableHeaders()}</thead>
								<tbody className="group">{getTableRows()}</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Table;
