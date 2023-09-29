import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import React, { useState } from "react";
import {
	getChapters,
	deleteChapter,
	getChapterCategories,
	createChapterCategory,
	editChapterCategory,
	deleteChapterCategory,
} from "services";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { chapters as header } from "utils/headers";
import moment from "moment";
import DeleteModal from "components/Modal/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChapterModal from "components/Chapters/ChapterModal";
import Category from "components/Categories";

const Chapters = () => {
	const [selectedId, setSelectedId] = useState();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
	const queryClient = useQueryClient();
	const [newItem, setNewItem] = useState();
	const [chapters, setChapters] = useState([]);
	const [categories, setCatgeories] = useState([]);
	const [categoryId, setCategoryId] = useState();

	useQuery("chapter-categories", getChapterCategories, {
		onSuccess: (data) => {
			setCatgeories(data);
		},
	});

	const { mutate: addCategory } = useMutation(createChapterCategory, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["chapter-categories"] });
		},
	});
	const { mutate: updateCategory } = useMutation(editChapterCategory, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["chapter-categories"] });
		},
	});

	const { mutateAsync: removeCategory } = useMutation(deleteChapterCategory, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["chapter-categories"] });
		},
	});

	const { isLoading } = useQuery("chapters", getChapters, {
		onSuccess: (data) => {
			setChapters(data);
		},
		onError: (err) => {
			toast.error("Could not fetch Chapters");
		},
	});

	const handleModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	const handleChapterModal = () => {
		setIsChapterModalOpen(!isChapterModalOpen);
	};

	const { mutate: deleteMember } = useMutation(deleteChapter, {
		onSuccess: () => {
			queryClient.invalidateQueries(["chapters"]);
			handleModal();
			toast.success("Chapter Deleted successfully");
		},
		onError: () => {
			handleModal();
			toast.error("Could not delete Chapter");
		},
	});

	const handleDelete = () => {
		deleteMember({ id: selectedId, categoryId: categoryId });
	};

	return (
		<>
			<div className="w-full grid grid-cols-12 z-40 gap-4">
				<div className="col-span-9 bg-white rounded-md h-fit">
					<div className="flex items-center justify-between px-4 mt-3">
						<h5 className="font-medium text-xl">Chapters</h5>
						<button
							className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
							onClick={() => {
								setNewItem(true);
								setSelectedId("");
								setCategoryId("");
								handleChapterModal();
							}}>
							Add
						</button>
					</div>
					<Table width="full">
						<TableHeaderRow className="grid grid-cols-8">
							{header.map(({ label }, index) => {
								return <TableHeader key={index}>{label}</TableHeader>;
							})}
							<TableHeader></TableHeader>
						</TableHeaderRow>
						<TableBody loading={isLoading}>
							{chapters?.map(
								(
									{
										_id,
										name,
										city,
										country,
										category,
										leader,
										state,

										publishDate,
										updateAt,
										createdAt,
									},
									index
								) => {
									return (
										<TableDataRow
											onClick={() => {
												setCategoryId(category._id);
												setSelectedId(_id);
												handleChapterModal();
												setNewItem(false);
											}}
											key={index}
											className="grid grid-cols-8 px-4 py-3 bg-white group relative">
											<TableData>{name}</TableData>
											<TableData>
												{city}, {""}
												{country}
											</TableData>
											<TableData>{category.name}</TableData>
											<TableData>{leader}</TableData>

											<TableData>{state}</TableData>
											<TableData>
												{moment(publishDate).format("DD MMM, YYYY")}
											</TableData>
											<TableData>
												{moment(updateAt).format("DD MMM, YYYY")}
											</TableData>
											<TableData>
												{moment(createdAt).format("DD MMM, YYYY")}
											</TableData>
										</TableDataRow>
									);
								}
							)}
						</TableBody>
					</Table>
				</div>
				<div className="col-span-3">
					<Category
						title="Chapter Catgeories"
						categories={categories}
						addCategory={addCategory}
						remove={removeCategory}
						update={updateCategory}
					/>
				</div>
			</div>
			{isDeleteModalOpen && (
				<DeleteModal
					title="Delete Chapter"
					isOpen={isDeleteModalOpen}
					handleModal={handleModal}
					handleDelete={handleDelete}
				/>
			)}
			<ToastContainer />
			{isChapterModalOpen && (
				<ChapterModal
					handleDeleteModal={() => setIsDeleteModalOpen(true)}
					isOpen={isChapterModalOpen}
					handleModal={handleChapterModal}
					id={selectedId}
					newItem={newItem}
					categoryId={categoryId}
				/>
			)}
		</>
	);
};

export default Chapters;
