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
	getPrograms,
	deleteProgram,
	getProgramCategories,
	createProgramCategory,
	editProgramCategory,
	deleteProgramCategory,
} from "services";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { programs as header } from "utils/headers";
import moment from "moment";
import DeleteModal from "components/Modal/DeleteModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgramModal from "components/Program/ProgramModal";
import Category from "components/Categories";

const Programs = () => {
	const [selectedId, setSelectedId] = useState();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
	const queryClient = useQueryClient();
	const [newItem, setNewItem] = useState();
	const [programs, setPrograms] = useState([]);
	const [categories, setCatgeories] = useState([]);
	const [categoryId, setCategoryId] = useState();

	useQuery("program-categories", getProgramCategories, {
		onSuccess: (data) => {
			setCatgeories(data);
		},
	});

	const { mutate: addCategory } = useMutation(createProgramCategory, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["program-categories"] });
		},
	});
	const { mutate: updateCategory } = useMutation(editProgramCategory, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["program-categories"] });
		},
	});

	const { mutateAsync: removeCategory } = useMutation(deleteProgramCategory, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["program-categories"] });
		},
	});

	const { isLoading } = useQuery("programs", getPrograms, {
		onSuccess: (data) => {
			setPrograms(data);
		},
		onError: (err) => {
			toast.error("Could not fetch Programs");
		},
	});

	const handleModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	const handleProgramModal = () => {
		setIsProgramModalOpen(!isProgramModalOpen);
	};

	const { mutate: deleteMember } = useMutation(deleteProgram, {
		onSuccess: () => {
			queryClient.invalidateQueries(["programs"]);
			handleModal();
			toast.success("Program Deleted successfully");
		},
		onError: () => {
			handleModal();
			toast.error("Could not delete Program");
		},
	});

	const handleDelete = () => {
		deleteMember({ id: selectedId, categoryId: categoryId });
	};

	return (
		<>
			<div className="w-full grid grid-cols-12 z-40 gap-4">
				<div className="col-span-9 bg-white rounded-md">
					<div className="flex items-center justify-between px-4 mt-3">
						<h5 className="font-medium text-xl">Programs</h5>
						<button
							className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
							onClick={() => {
								setNewItem(true);
								setSelectedId("");
								setCategoryId("");
								handleProgramModal();
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
							{programs?.map(
								(
									{
										_id,
										title,
										cohort,
										category,
										briefContent,
										state,
										author,

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
												handleProgramModal();
												setNewItem(false);
											}}
											key={index}
											className="grid grid-cols-8 px-4 py-3 bg-white group relative">
											<TableData>{title}</TableData>
											<TableData>{cohort}</TableData>
											<TableData>{category.name}</TableData>
											<TableData>{briefContent}</TableData>
											<TableData>{state}</TableData>
											<TableData>{author}</TableData>

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
						title="Program Catgeories"
						categories={categories}
						addCategory={addCategory}
						remove={removeCategory}
						update={updateCategory}
					/>
				</div>
			</div>
			{isDeleteModalOpen && (
				<DeleteModal
					title="Delete Program"
					isOpen={isDeleteModalOpen}
					handleModal={handleModal}
					handleDelete={handleDelete}
				/>
			)}
			<ToastContainer />
			{isProgramModalOpen && (
				<ProgramModal
					handleDeleteModal={() => setIsDeleteModalOpen(true)}
					isOpen={isProgramModalOpen}
					handleModal={handleProgramModal}
					id={selectedId}
					newItem={newItem}
					categoryId={categoryId}
				/>
			)}
		</>
	);
};

export default Programs;
