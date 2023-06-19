import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { MdOutlineEdit } from "react-icons/md";
import Modal from "components/Modal";

const Table = ({
	tableData,
	tableHead,
	addNew,
	headers: columns,
	actions,
	handleDelete,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const history = useHistory();
	const { pathname } = history.location;
	const [currItem, setCurrItem] = useState();
	const viewDetails = (data) => {
		pathname === "/admin/team"
			? history.push(`${pathname}/view/${data.team._id}/${data._id}`)
			: history.push(`${pathname}/view/${data._id}`);
	};
	const deleteItem = useCallback(() => {
		if (pathname === "/admin/team") {
			console.log(currItem);
			handleDelete(currItem.team._id, currItem._id);
			setIsOpen(false);
		} else {
			console.log("delete item");
			handleDelete(currItem._id);
			setIsOpen(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currItem, pathname]);
	const handleModal = () => {
		setIsOpen(!isOpen);
	};
	const getTableHeaders = () => {
		if (tableData.length === 0) return null;
		const headers = columns.map((key, index) => {
			return (
				<th
					className={
						"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left  bg-slate-50 text-slate-500 border-slate-100"
					}
					key={index}>
					{key.label}
				</th>
			);
		});

		// Add the new column header for actions
		if (actions) {
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
		return Object.values(tableData).map((data, index) => {
			return (
				<tr key={index} className="hover:cursor-pointer hover:bg-gray-600">
					{columns.map(({ value }, index) => {
						return (
							<td
								className={
									"border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 hover:cursor-pointer capitalize"
								}
								key={index}>
								{value !== "team"
									? typeof data[value] === "boolean"
										? data[value]
											? "Yes"
											: "No"
										: data[value].length > 50
											? data[value].slice(0, 50 - 1) + "..."
											: data[value]
									: data[value].name}
							</td>
						);
					})}
					{/* Add the new column for actions */}
					{actions && (
						<td
							className={
								"border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 flex items-center hover:cursor-pointer"
							}>
							{actions.map((action, index) => {
								if (action === "view") {
									return (
										<button
											key={index}
											onClick={() => {
												viewDetails(data);
											}}>
											<AiOutlineEye size="1rem" />
										</button>
									);
								} else if (action === "edit") {
									return (
										<div
											key={index}
											onClick={() => {
												history.push(`${pathname}/edit/${data._id}`);
											}}
											className="text-black rounded px-2 py-1 hover:cursor-pointer">
											<MdOutlineEdit size="1rem" />
										</div>
									);
								} else if (action === "delete") {
									return (
										<button
											key={index}
											className="bg-transparent text-red-500 rounded px-2 py-1"
											onClick={() => {
												setIsOpen(true);
												setCurrItem(data);
											}}>
											<AiOutlineDelete size="1rem" />
										</button>
									);
								} else {
									return null;
								}
							})}
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
										<button
											onClick={() => history.push(`${pathname}/add`)}
											className="bg-pink-500 py-2 px-4 rounded text-white text-sm">
											Add
										</button>
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

			<Modal title="Delete" isOpen={isOpen} onClose={handleModal}>
				<div>
					<div>
						<p>Are you sure you want to delete this Item?</p>
					</div>
					<div className="flex justify-center mt-3">
						<button
							className="mr-2 bg-red-600 text-white  px-4 py-1 rounded"
							onClick={() => {
								deleteItem();
							}}>
							Yes
						</button>
						<button
							className="bg-slate-600 px-4 py-1 text-white rounded"
							onClick={() => setIsOpen(false)}>
							No
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default Table;
