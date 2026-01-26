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
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getAllMedia } from "services/media";
import { ToastContainer, toast } from "react-toastify";
import { deleteMedia } from "services/media";

const MediaPage = () => {
	const [openModal, setOpenModal] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [newItem, setNewItem] = useState();
	const [selectedId, setSelectedId] = useState();

	const handleDelete = () => {
		setOpenDeleteModal(false);
	};

	const handleOpenDeleteModal = (id) => {
		setSelectedId(id);
		setOpenDeleteModal(true);
	};

	const queryClient = useQueryClient();

	// get all media
	const { isLoading: loading, data: mediaData } = useQuery(
		"media",
		getAllMedia,
		{
			onError: () => {
				toast.error("Could not fetch media data.");
			},
		},
	);

	// delete media mutation
	const { mutate, isLoading: deleting } = useMutation(deleteMedia, {
		onSuccess: () => {
			toast.success("Media deleted successfully.");
			queryClient.invalidateQueries(["media"]);
		},
		onError: () => {
			toast.error("Could not delete media.");
		},
	});

	const handleDeleteMedia = () => {
		mutate(selectedId);
		handleDelete();
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

				{loading || deleting ? (
					<Loader />
				) : (
					<>
						<Table width="full">
							<TableHeaderRow className="grid grid-cols-[150px_1fr_200px_100px_80px_80px]">
								{mediaHeaders.map(({ label }, index) => {
									return <TableHeader key={index}>{label}</TableHeader>;
								})}
							</TableHeaderRow>

							<TableBody loading={loading}>
								<>
									{loading ? (
										<div className="min-h-[200px] flex items-center">
											<BarrLoader />
										</div>
									) : (
										<>
											{mediaData.length > 0 ? (
												<>
													{mediaData.map(
														(
															{ coverImage, description, type, title, _id },
															idx,
														) => (
															<TableDataRow
																key={idx}
																className="grid grid-cols-[150px_1fr_200px_100px_80px_80px] px-4 py-3 bg-white text-base items-center">
																<TableData>
																	<figure className="m-0 w-12 h-12 rounded-full border-2 overflow-hidden ">
																		<img
																			// src={coverImage}
																			src={
																				coverImage
																					? typeof coverImage === "string"
																						? coverImage
																						: URL.createObjectURL(coverImage)
																					: ""
																			}
																			alt={title}
																			className="w-full h-full object-cover"
																		/>
																	</figure>
																</TableData>
																<TableData>
																	<span className="truncate">
																		{description}
																	</span>
																</TableData>
																<TableData>{title}</TableData>
																<TableData>{type}</TableData>
																<TableData>
																	<span className="flex items-center gap-3">
																		<button
																			onClick={() => {
																				setNewItem(false);
																				setSelectedId(_id);
																				setOpenModal(true);
																			}}>
																			<FaPencilAlt />
																		</button>
																		<button
																			className="text-red-500"
																			onClick={() =>
																				handleOpenDeleteModal(_id)
																			}>
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
														),
													)}
												</>
											) : (
												<TableDataRow className="grid grid-cols-[150px_1fr_200px_100px_80px_80px] px-4 py-3 bg-white text-base items-center">
													<TableData colSpan={6}>
														<span className="truncate col-span-6 w-full  inline-flex">
															No media found.
														</span>
													</TableData>
												</TableDataRow>
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
					handleDelete={handleDeleteMedia}
					isOpen={openDeleteModal}
					handleModal={handleDelete}
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
			<ToastContainer />
		</>
	);
};

export default MediaPage;
