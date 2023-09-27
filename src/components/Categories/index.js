import DeleteModal from "components/Modal/DeleteModal";
import React, { useState } from "react";
import { BsCheck2, BsPencil, BsPlus, BsTrash, BsX } from "react-icons/bs";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Category = ({
	title,
	categories,
	addCategory,
	update,
	remove,
	isLoading,
}) => {
	const [showInput, setShowInput] = useState(false);
	const [newCategory, setNewCategory] = useState("");
	const [showActions, setShowActions] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [editInput, setEditInput] = useState("");
	const [editIndex, setEditIndex] = useState();
	const [deleteIndex, setDeleteIndex] = useState();
	const [isOpen, setIsOpen] = useState(false);

	const handleModal = () => {
		setIsOpen(!isOpen);
	};

	const handleSubmit = async () => {
		if (newCategory) {
			try {
				await addCategory({ name: newCategory });
				toast.success("Category Added Successfully");
			} catch (error) {
				console.log(error);
				toast.error("Could not add Category");
			}
			setNewCategory("");
		}
		setShowInput(false);
	};

	const handleEditClick = () => {
		setShowEdit(!showEdit);
	};

	const handleEditInput = (e) => {
		setEditInput(e.target.value);
	};

	const handleDeleteClick = () => {
		setShowActions(!showActions);
	};

	const handleUpdate = async (id) => {
		try {
			await update({ id, name: editInput });
			toast.success("Category Updated Successfully");
			handleEditInput();
		} catch (error) {
			toast.error("Could not update category");
		}
	};

	const handleDelete = async (id) => {
		try {
			await remove(id);
			toast.success("Category Deleted Successfully");
		} catch (error) {
			toast.error("Error Deleting Category");
		}
	};

	return (
		<>
			<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
				<div className="px-3 lg:px-6">
					<div className="mt-8 mb-5">
						<div>
							<div className="flex justify-between my-2">
								<h6 className="uppercase text-sm font-bold">{title}</h6>
								<div
									className="hover:cursor-pointer text-pink-950"
									onClick={() => setShowInput(true)}>
									<BsPlus size="1.5rem" />
								</div>
							</div>
							<ul
								className="bg-slate-50 p-4 overflow-y-scroll 
								scrollbar-thin
								scrollbar-thumb-pink-500 scrollbar-track-pink-300 grid gap-y-2"
								style={{ maxHeight: "180px", overflowY: "scroll" }}>
								{showInput && (
									<li className="flex flex-col">
										<form
											onSubmit={handleSubmit}
											className="flex gap-2 items-center">
											<input
												className="h-[24px] max-w-[110px] rounded-md px-2"
												type="text"
												value={newCategory}
												onChange={(event) => setNewCategory(event.target.value)}
											/>
											<button
												type="submit"
												className="bg-pink-500 text-xs px-4 py-1 text-white rounded-md"
												onClick={addCategory}
												style={{ alignSelf: "end" }}>
												Add
											</button>
										</form>
									</li>
								)}
								<ReactPlaceholder
									type="text"
									ready={!isLoading}
									rows={4}
									color="#E0E0E0">
									{categories.map(({ _id, name }, index) => (
										<li
											className="my-2 flex justify-between items-center text-xs"
											key={index}>
											{showEdit && editIndex === index ? (
												<div className="flex justify-between w-full">
													<input
														value={editInput}
														onChange={(e) => handleEditInput(e)}
													/>

													<div className="flex justify-between">
														<button
															className="ml-2"
															onClick={() => handleUpdate(_id)}>
															<BsCheck2 />
														</button>
														<button onClick={handleEditClick}>
															<BsX />
														</button>
													</div>
												</div>
											) : (
												<>
													{name}
													{showActions && deleteIndex === index ? (
														<div className="flex justify-between">
															<button
																className="ml-2"
																onClick={() => {
																	handleDelete(_id);
																	handleDeleteClick();
																}}>
																<BsCheck2 />
															</button>
															<button onClick={handleDeleteClick}>
																<BsX />
															</button>
														</div>
													) : (
														<span className="flex items-center">
															<button
																className="mr-2"
																onClick={() => {
																	setEditInput(name);
																	setEditIndex(index);
																	handleEditClick();
																}}>
																<BsPencil size="0.625rem" />
															</button>
															<button
																onClick={() => {
																	setDeleteIndex(index);
																	handleDeleteClick();
																}}>
																<BsTrash size="0.625rem" />
															</button>
														</span>
													)}
												</>
											)}
										</li>
									))}
								</ReactPlaceholder>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<DeleteModal
				handleDelete={handleDelete}
				isOpen={isOpen}
				handleModal={handleModal}
			/>
			<ToastContainer />
		</>
	);
};

export default Category;
