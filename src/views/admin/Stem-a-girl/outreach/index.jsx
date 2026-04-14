import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import React, { useState } from "react";
import { getOutreaches, deleteOutreach } from "services";
import { useMutation, useQuery, useQueryClient } from "react-query";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OutreachModal from "components/Stem-a-girl/outreach/OutreachModal";
import DeleteModal from "components/Modal/DeleteModal";

const headers = [
	{ label: "State" },
	{ label: "Description" },
	{ label: "Gallery Link" },
	{ label: "State" },
	{ label: "Images" },
	{ label: "Outreach Date" },
];

const OutreachPage = () => {
	const queryClient = useQueryClient();
	const [outreaches, setOutreaches] = useState([]);
	const [selectedId, setSelectedId] = useState(null);
	const [newItem, setNewItem] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isOutreachModalOpen, setIsOutreachModalOpen] = useState(false);

	const { isLoading } = useQuery("outreaches", getOutreaches, {
		onSuccess: ({ data }) => {
			setOutreaches(data.data);
		},
		onError: () => {
			toast.error("Could not fetch Outreaches");
		},
	});

	const { mutate: removeOutreach } = useMutation(deleteOutreach, {
		onSuccess: () => {
			queryClient.invalidateQueries(["outreaches"]);
			setIsDeleteModalOpen(false);
			toast.success("Outreach deleted successfully");
		},
		onError: () => {
			setIsDeleteModalOpen(false);
			toast.error("Could not delete Outreach");
		},
	});

	const handleDelete = () => {
		const outreachId = selectedId;

		removeOutreach(outreachId);
	};
	const handleOpenCreateModal = () => {
		console.log(6);
		setNewItem(true);
		setSelectedId(null);
		setIsOutreachModalOpen(true);
	};

	return (
		<>
			<div className="bg-white rounded-md z-10 w-full">
				<div className="flex items-center justify-between px-4 py-3">
					<h5 className="font-medium text-xl mt-3">Outreach</h5>
					<button
						className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
						onClick={handleOpenCreateModal}>
						Add
					</button>
				</div>

				<Table width="full">
					<TableHeaderRow
						className={`grid grid-cols-${headers.length + 1} w-full`}>
						{headers.map(({ label }, index) => (
							<TableHeader key={index} className="w-full">
								{label}
							</TableHeader>
						))}
						<TableHeader></TableHeader>
					</TableHeaderRow>

					<TableBody loading={isLoading}>
						{outreaches.length === 0 ? (
							<TableData
								className={`col-span-${headers.length + 1} text-center py-4`}>
								<div className="text-center w-full">No Outreaches found.</div>
							</TableData>
						) : (
							outreaches.map(
								(
									{
										_id,
										state,
										description,
										outreachDate,
										galleryLink,
										totalImages,
										createdAt,
									},
									index,
								) => (
									<TableDataRow
										key={index}
										onClick={() => {
											setSelectedId(_id);
											setNewItem(false);
											setIsOutreachModalOpen(true);
										}}
										className={`grid grid-cols-${headers.length + 1} px-4 py-3 bg-white group relative cursor-pointer`}>
										<TableData>{state}</TableData>
										<TableData className="truncate max-w-xs">
											{description}
										</TableData>
										<TableData>
											{galleryLink ? (
												<a
													href={galleryLink}
													target="_blank"
													rel="noreferrer"
													onClick={(e) => e.stopPropagation()}
													className="text-pink-500 underline text-xs">
													View
												</a>
											) : (
												"—"
											)}
										</TableData>
										<TableData>{state}</TableData>
										<TableData>{totalImages ?? 0}</TableData>
										<TableData>
											{moment(outreachDate).format("DD MMM, YYYY")}
										</TableData>
										{/* <TableData>
											<button
												onClick={(e) => {
													e.stopPropagation();
													setSelectedId(_id);
													setIsDeleteModalOpen(true);
												}}
												className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors duration-150">
												Delete
											</button>
										</TableData> */}
									</TableDataRow>
								),
							)
						)}
					</TableBody>
				</Table>
			</div>

			{isDeleteModalOpen && (
				<DeleteModal
					title="Delete Outreach"
					isOpen={isDeleteModalOpen}
					handleModal={() => setIsDeleteModalOpen(false)}
					handleDelete={handleDelete}
				/>
			)}

			{isOutreachModalOpen && (
				<OutreachModal
					isOpen={isOutreachModalOpen}
					handleModal={() => setIsOutreachModalOpen(false)}
					handleDeleteModal={() => {
						setIsOutreachModalOpen(false);
						setIsDeleteModalOpen(true);
					}}
					id={selectedId}
					newItem={newItem}
				/>
			)}

			<ToastContainer />
		</>
	);
};

export default OutreachPage;
