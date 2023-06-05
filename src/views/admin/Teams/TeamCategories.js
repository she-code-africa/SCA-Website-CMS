import React, { useCallback, useState, useEffect } from "react";
import { BsCheck2, BsPencil, BsPlus, BsTrash, BsX } from "react-icons/bs";
import { getTeamCategories, addTeamCategory } from "services";
import { useQuery, useMutation } from "react-query";
import { editTeamCategories } from "services";
import { deleteTeamCategory } from "services";

const TeamCategory = () => {
	const [showCategoryInput, setShowCategoryInput] = useState(false);
	const [newCategory, setNewCategory] = useState("");
	const [showActions, setShowActions] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [editInput, setEditInput] = useState("");
	const [editIndex, setEditIndex] = useState();
	const [deleteIndex, setDeleteIndex] = useState();
	const mutation = useMutation(addTeamCategory);
	const editMutation = useMutation(editTeamCategories);

	const [Categories, setCategories] = useState([]);

	const handleEditInput = (e) => {
		setEditInput(e.target.value);
	};

	const handleEditClick = () => {
		setShowEdit(!showEdit);
	};

	const handleEditSubmit = (id) => {
		editMutation.mutateAsync({ catId: id, name: editInput });
	};

	const handleDeleteClick = () => {
		console.log("Trash clicked");
		setShowActions(!showActions);
	};

	const deleteCategory = useMutation(deleteTeamCategory, {
		onSuccess: () => {
			console.log("success");
		},
		onError: () => {
			console.log("error");
		},
	});

	const handleDelete = async (id) => {
		await deleteCategory.mutateAsync({ catId: id });
	};

	const response = useQuery("teamCategories", getTeamCategories);
	useEffect(() => {
		if (response.isSuccess) {
			setCategories(response.data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [response.isSuccess]);

	const handleAddCategory = useCallback(() => {
		if (newCategory) {
			setCategories((prevCategories) => [...prevCategories, newCategory]);
			mutation.mutate({ name: newCategory });
			if (mutation.isSuccess) {
				setNewCategory("");
			} else {
				console.log("error");
			}
		}
		setShowCategoryInput(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [newCategory]);

	return (
		<>
			<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
				<div className="px-3 lg:px-6">
					<div className="mt-8 mb-5">
						<div className="my-3">
							<div className="flex justify-between my-4">
								<h6 className="uppercase font-bold">Team Category</h6>
								<div
									className="hover:cursor-pointer"
									onClick={() => setShowCategoryInput(true)}>
									<BsPlus size="1.5rem" />
								</div>
							</div>
							<ul
								className="bg-slate-50 py-4 px-2 overflow-y-scroll block "
								style={{ minHeight: "180px" }}>
								{showCategoryInput && (
									<li className="flex flex-col text-sm">
										<input
											type="text"
											value={newCategory}
											onChange={(event) => setNewCategory(event.target.value)}
											onKeyDown={(event) => {
												if (event.key === "Enter") {
													handleAddCategory();
												}
											}}
										/>
										<button
											onClick={handleAddCategory}
											className="bg-pink-500 px-4 py-1 text-white mt-3"
											style={{ alignSelf: "end" }}>
											Add
										</button>
									</li>
								)}
								{Categories.map((Category, index) => (
									<li
										className="my-2 flex justify-between items-center"
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
														onClick={() => handleEditSubmit(Category._id)}>
														<BsCheck2 />
													</button>
													<button onClick={handleEditClick}>
														<BsX />
													</button>
												</div>
											</div>
										) : (
											<>
												{Category.name}
												{showActions && deleteIndex === index ? (
													<div className="flex justify-between">
														<button
															className="ml-2"
															onClick={() => handleDelete(Category._id)}>
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
																setEditInput(Category.name);
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
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default TeamCategory;
