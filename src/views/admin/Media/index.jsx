import React, { useState } from "react";
import Loader from "components/Loader";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import { mediaHeaders } from "utils/headers";
import { BarrLoader } from "components/Loader";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import DeleteModal from "components/Modal/DeleteModal";
import MediaModal from "components/Media/MediaModal";

const MediaPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const data = [
		{
			_id: "iii",
			title: "A table",
			coverImage: "",
			description: "lorem ipsum",
			type: "blog",
		},
		{
			_id: "iii",
			title: "A table",
			coverImage: "",
			description: "lorem ipsum",
			type: "blog",
		},
	];

	const [openModal, setOpenModal] = useState(true);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [newItem, setNewItem] = useState();
	const [selectedId, setSelectedId] = useState();

	const handleDelete = () => {
		setOpenDeleteModal(false);
	};

	return (
		<>
			<div className="self-start z-40 bg-white w-full">
				<div className="flex items-center justify-between px-4 mt-2">
					<h5 className="font-medium text-xl mt-3">Media</h5>
					<button
						className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
						onClick={() => {
							setNewItem(true);
							setSelectedId("");
							setOpenModal(true);
						}}>
						Add
					</button>
				</div>

				{isLoading ? (
					<Loader />
				) : (
					<>
						<Table width="full">
							<TableHeaderRow className="grid grid-cols-[150px_1fr_200px_100px_80px_80px]">
								{mediaHeaders.map(({ label }, index) => {
									return <TableHeader key={index}>{label}</TableHeader>;
								})}
							</TableHeaderRow>

							<TableBody loading={isLoading}>
								<>
									{isLoading ? (
										<div className="min-h-[200px] flex items-center">
											<BarrLoader />
										</div>
									) : (
										<>
											{data.map(
												(
													{ coverImage, description, type, title, _id },
													idx
												) => (
													<TableDataRow
														key={idx}
														onClick={() => {
															// setSelectedId(_id);
															// handleEventModal();
															// setNewItem(false);
														}}
														className="grid grid-cols-[150px_1fr_200px_100px_80px_80px] px-4 py-3 bg-white text-base">
														<TableData>
															<figure className="m-0 w-12 h-12 rounded-full border-2 overflow-hidden ">
																<img
																	src={coverImage}
																	alt={title}
																	className="w-full h-full object-cover"
																/>
															</figure>
														</TableData>
														<TableData>
															<span className="truncate">{description}</span>
														</TableData>
														<TableData>{title}</TableData>
														<TableData>{type}</TableData>
														<TableData>
															<span
																className="flex items-center gap-3"
																onClick={() => {
																	setNewItem(false);
																	setSelectedId(_id);
																	setOpenModal(true);
																}}>
																<button>
																	<FaPencilAlt />
																</button>
																<button
																	className="text-red-500"
																	onClick={() => setOpenDeleteModal(true)}>
																	<FaTrashAlt />
																</button>
															</span>
														</TableData>

														{/* <TableData>
															{moment(eventDate).format("DD MMM, YYYY")}
														</TableData>
														<TableData>
															{moment(createdAt).format("DD MMM, YYYY")}
														</TableData> */}
													</TableDataRow>
												)
											)}
										</>
									)}
								</>
							</TableBody>
						</Table>
					</>
				)}
			</div>

			{openDeleteModal && (
				<DeleteModal
					handleDelete={handleDelete}
					isOpen={openDeleteModal}
					handleModal={() => setOpenDeleteModal(false)}
				/>
			)}

			{openModal && (
				<MediaModal
					isOpen={openModal}
					handleModal={() => setOpenModal(false)}
					newItem={newItem}
					id={selectedId}
				/>
			)}
		</>
	);
};

export default MediaPage;
