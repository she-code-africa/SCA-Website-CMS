import CustomSelect from "components/Chapters/inputs/CustomSelect";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getChapters, getChapterEvents, deleteChapterEvent } from "services";
import { ToastContainer, toast } from "react-toastify";
import CreateChapterEventsModal from "components/Chapters/CreateChapterEventsModal";
import { BsPencil, BsTrash } from "react-icons/bs";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import { chapterEventsHeaders as header } from "utils/headers";
import { BarrLoader } from "components/Loader";
import moment from "moment";
import DeleteModal from "components/Modal/DeleteModal";

const ChapterEvents = () => {
	const queryClient = useQueryClient();
	const [chapters, setChapters] = useState([]);
	const [selectedChapter, setSelectedChapter] = useState("");
	const [chapterId, setChapterId] = useState("");
	const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
	const [newItem, setNewItem] = useState(false);
	const [chapterEvents, setChapterEvents] = useState([]);
	const [selectedId, setSelectedId] = useState("");
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const { isLoading } = useQuery(["chapters"], () => getChapters(0, 1000), {
		onSuccess: (data) => {
			console.log("Chapters Data:", data);
			const formattedData = data.data
				.sort((a, b) => a.name.localeCompare(b.name))
				.map((chapter) => ({
					label: chapter.name,
					value: chapter._id,
				}));
			setChapters(formattedData);
		},
		onError: (err) => {
			toast.error("Could not fetch Chapters");
		},
	});

	const { isLoading: isEventsLoading } = useQuery(
		["chapter-events", chapterId],
		() => getChapterEvents(chapterId),
		{
			onSuccess: (data) => {
				console.log("Chapter Events:", data);
				setChapterEvents(data);
			},
			enabled: !!chapterId, // only runs when a chapter is selected
			onError: () => toast.error("Could not fetch Chapter Events"),
		}
	);

	const handleSelect = (selectedOption) => {
		console.log("Selected:", selectedOption);
		setSelectedChapter(selectedOption.label);
		setChapterId(selectedOption.value);
		localStorage.setItem("selectedChapter", JSON.stringify(selectedOption));
	};

	const handleOpenAddEventModal = () => {
		setCreateEventModalOpen(true);
		setNewItem(true);
	};

	const handleCloseModal = () => {
		setCreateEventModalOpen(false);
	};

	const handleOpenEditModal = (id) => {
		setCreateEventModalOpen(true);
		setNewItem(false);
		setSelectedId(id);
	};

	useEffect(() => {
		const savedSelection = localStorage.getItem("selectedChapter");
		if (savedSelection) {
			const parsedSelection = JSON.parse(savedSelection);

			console.log("Parsed Selection:", parsedSelection);
			setSelectedChapter(parsedSelection.label);
			setChapterId(parsedSelection.value);
		}
	}, []);

	const handleOpenDeleteModal = (id) => {
		setSelectedId(id);
		setIsDeleteModalOpen(true);
	};

	const handleCloseDeleteModal = () => {
		setIsDeleteModalOpen(false);
	};

	const { mutate: deleteMember } = useMutation(deleteChapterEvent, {
		onSuccess: () => {
			queryClient.invalidateQueries(["chapter-events", chapterId]);
			handleCloseDeleteModal();
			toast.success("Chapter Event Deleted successfully");
		},
		onError: () => {
			handleCloseDeleteModal();
			toast.error("Could not delete Chapter Event");
		},
	});

	const handleDelete = () => {
		deleteMember(selectedId);
	};

	return (
		<>
			<section className="w-full bg-white rounded-lg z-40 gap-4 p-6">
				<div className="flex items-center gap-5 justify-between">
					<article className="w-full">
						<h5 className="font-medium text-xl w-full">Chapter Events</h5>

						<h5 className=" text-base mt-3 w-full">
							{selectedChapter ? (
								<span>
									Events for{" "}
									<span className="font-medium">{selectedChapter}</span>{" "}
									{!selectedChapter.toLowerCase().includes("chapter") &&
										"chapter"}
									.
								</span>
							) : (
								"Select a chapter to view events"
							)}
						</h5>
					</article>

					{/* <div
						className="max-w-210-px w-full border rounded-md"
						style={{ borderColor: "#ec4899", height: "40px" }}></div> */}
					<CustomSelect
						options={chapters}
						onSelect={handleSelect}
						placeholder={isLoading ? "Loading Chapters..." : "Select a Chapter"}
					/>
				</div>

				<div className="mt-6 mb-4 flex w-full justify-end">
					<button
						className={`rounded-md ${
							chapterId !== "" && "bg-pink-500"
						} text-white text-xs  px-4 py-2`}
						onClick={handleOpenAddEventModal}
						disabled={chapterId === ""}
						style={{ backgroundColor: chapterId === "" ? "#f472b6" : "" }}>
						Add Event
					</button>
				</div>

				{/*  */}
				<Table width="full">
					<TableHeaderRow className="grid grid-cols-7">
						{header.map(({ label }, index) => {
							return <TableHeader key={index}>{label}</TableHeader>;
						})}
						<TableHeader></TableHeader>
					</TableHeaderRow>
					<TableBody loading={isEventsLoading}>
						<>
							{isEventsLoading ? (
								<div className="min-h-[200px] flex items-center">
									<BarrLoader />
								</div>
							) : (
								<>
									{chapterEvents.length > 0 ? (
										chapterEvents?.map(
											(
												{
													title,
													description,
													link,
													eventState,
													eventDate,
													createdAt,
													_id,
												},
												index
											) => {
												return (
													<TableDataRow
														key={index}
														className="grid grid-cols-7 px-4 py-3 bg-white">
														<TableData>{title}</TableData>
														<TableData>{description}</TableData>
														<TableData>{link}</TableData>
														<TableData>{eventState}</TableData>

														<TableData>
															{moment(eventDate).format("DD MMM, YYYY")}
														</TableData>
														<TableData>
															{moment(createdAt).format("DD MMM, YYYY")}
														</TableData>
														<TableData>
															<span className=" items-center flex gap-2">
																<button
																	className="mr-2"
																	onClick={() => handleOpenEditModal(_id)}>
																	<BsPencil size="0.625rem" />
																</button>
																<button
																	onClick={() => {
																		handleOpenDeleteModal(_id);
																		console.log("Delete Event", _id);
																	}}>
																	<BsTrash size="0.625rem" />
																</button>
															</span>
														</TableData>
													</TableDataRow>
												);
											}
										)
									) : (
										<div className="min-h-[200px] flex items-center justify-center w-full">
											There are no events for this chapter.
										</div>
									)}
								</>
							)}
						</>
					</TableBody>
				</Table>
			</section>
			<ToastContainer />

			{createEventModalOpen && (
				<CreateChapterEventsModal
					isOpen={createEventModalOpen}
					newItem={newItem}
					handleCloseModal={handleCloseModal}
					chapterId={chapterId}
					toast={toast}
					selectedId={selectedId}
				/>
			)}

			{isDeleteModalOpen && (
				<DeleteModal
					title="Delete Chapter Event"
					isOpen={isDeleteModalOpen}
					handleModal={handleCloseDeleteModal}
					handleDelete={handleDelete}
				/>
			)}
			<ToastContainer />
		</>
	);
};

export default ChapterEvents;
