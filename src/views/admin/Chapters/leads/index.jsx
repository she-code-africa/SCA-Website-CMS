import CustomSelect from "components/Chapters/inputs/CustomSelect";
import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { getChapters, getChapterLeads, deleteChapterLead } from "services";
import { ToastContainer, toast } from "react-toastify";

import { BsPencil, BsTrash } from "react-icons/bs";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";

import { BarrLoader } from "components/Loader";

import ChapterLeadsModal from "components/Chapters/ChapterLeadsModal";
import DeleteModal from "components/Modal/DeleteModal";

const ChapterLeads = () => {
	const queryClient = useQueryClient();
	const [chapters, setChapters] = useState([]);
	const [selectedChapter, setSelectedChapter] = useState("");
	const [chapterId, setChapterId] = useState("");
	const [createLeadModalOpen, setCreateLeadModalOpen] = useState(false);
	const [newItem, setNewItem] = useState(false);
	const [chapterLeads, setChapterLeads] = useState([]);
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

	const { isLoading: isLeadsLoading } = useQuery(
		["chapter-leads", chapterId],
		() => getChapterLeads(chapterId),
		{
			onSuccess: (data) => {
				console.log("Chapter Leads:", data);
				setChapterLeads(data);
			},
			enabled: !!chapterId,
			onError: () => toast.error("Could not fetch Chapter Leads"),
		}
	);

	const handleSelect = (selectedOption) => {
		console.log("Selected:", selectedOption);
		setSelectedChapter(selectedOption.label);
		setChapterId(selectedOption.value);
		localStorage.setItem("selectedChapterId", JSON.stringify(selectedOption));
	};

	const handleOpenAddLeadModal = () => {
		setCreateLeadModalOpen(true);
		setNewItem(true);
	};

	const handleCloseModal = () => {
		setCreateLeadModalOpen(false);
	};

	const handleOpenEditModal = (id) => {
		setCreateLeadModalOpen(true);
		setNewItem(false);
		setSelectedId(id);
	};

	useEffect(() => {
		const savedSelection = localStorage.getItem("selectedChapterId");
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

	const { mutate: deleteMember } = useMutation(deleteChapterLead, {
		onSuccess: () => {
			queryClient.invalidateQueries(["chapter-leads", chapterId]);
			handleCloseDeleteModal();
			toast.success("Chapter Lead Deleted successfully");
		},
		onError: () => {
			handleCloseDeleteModal();
			toast.error("Could not delete Chapter Lead");
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
						<h5 className="font-medium text-xl w-full">Chapter Leads</h5>

						<h5 className=" text-base mt-3 w-full">
							{selectedChapter ? (
								<span>
									Leads for{" "}
									<span className="font-medium">{selectedChapter}</span>{" "}
									{!selectedChapter.toLowerCase().includes("chapter") &&
										"chapter"}
									.
								</span>
							) : (
								"Select a chapter to view leads"
							)}
						</h5>
					</article>

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
						onClick={handleOpenAddLeadModal}
						disabled={chapterId === ""}
						style={{ backgroundColor: chapterId === "" ? "#f472b6" : "" }}>
						Add Lead
					</button>
				</div>
				<Table width="full">
					<TableHeaderRow className="grid grid-cols-4">
						{["Name", "Role", "Social Media Links", "Actions"].map(
							(label, index) => {
								return <TableHeader key={index}>{label}</TableHeader>;
							}
						)}
						<TableHeader></TableHeader>
					</TableHeaderRow>
					<TableBody loading={isLeadsLoading}>
						<>
							{isLeadsLoading ? (
								<div className="min-h-[200px] flex items-center">
									<BarrLoader />
								</div>
							) : (
								<>
									{chapterLeads.length > 0 ? (
										chapterLeads.map(
											({ name, role, socialMediaLinks, _id }, index) => (
												<TableDataRow
													key={index}
													className="grid grid-cols-4 px-4 py-3 bg-white">
													<TableData>{name}</TableData>
													<TableData>{role}</TableData>
													<TableData>
														{Object.values(socialMediaLinks).length > 0 ? (
															Object.values(socialMediaLinks).map((link, i) => (
																<span key={i}>{link}</span>
															))
														) : (
															<div>No Social Media Links</div>
														)}
													</TableData>
													<TableData className=" items-center flex gap-2">
														<button onClick={() => handleOpenEditModal(_id)}>
															<BsPencil />
														</button>
														<button onClick={() => handleOpenDeleteModal(_id)}>
															<BsTrash />
														</button>
													</TableData>
												</TableDataRow>
											)
										)
									) : (
										<div className="min-h-[200px] flex items-center justify-center w-full">
											There are no leads for this chapter.
										</div>
									)}
								</>
							)}
						</>
					</TableBody>
				</Table>
			</section>
			{createLeadModalOpen && (
				<ChapterLeadsModal
					isOpen={createLeadModalOpen}
					newItem={newItem}
					handleCloseModal={handleCloseModal}
					chapterId={chapterId}
					toast={toast}
					selectedId={selectedId}
				/>
			)}

			{isDeleteModalOpen && (
				<DeleteModal
					title="Delete Chapter Lead"
					isOpen={isDeleteModalOpen}
					handleModal={handleCloseDeleteModal}
					handleDelete={handleDelete}
				/>
			)}
			<ToastContainer />
		</>
	);
};

export default ChapterLeads;
