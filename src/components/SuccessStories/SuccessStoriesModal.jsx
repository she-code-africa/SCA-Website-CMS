import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
	createSuccessStory,
	editSuccessStory,
	getSuccessStory,
	getProgramCategories,
} from "services";
import Modal from "components/Modal";
import Placeholder from "components/Placeholder";
import { BiSolidImageAdd, BiArchiveIn, BiArchiveOut } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import Loader from "components/Loader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { publishSuccessStory } from "services";
import { archiveSuccessStory } from "services";

const SuccessStoriesModal = ({
	isOpen,
	handleModal,
	handleDeleteModal,
	newItem,
	id,
}) => {
	const queryClient = useQueryClient();
	const intial = {
		image: "",
		name: "",
		position: "",
		story: "",
		programCategory: "",
		author: "",
		state: "",
		publishDate: "",
	};
	const [successStory, setSuccessStory] = useState(intial);
	const [categories, setCategories] = useState([]);
	const { image, name, position, story, programCategory, state } = successStory;
	const [edit, setEdit] = useState(false);
	const [loading, setLoading] = useState(false);
	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;
	const { isLoading, data } = useQuery(
		["program-success", id],
		() => getSuccessStory(id),
		{
			onSuccess: (data) => {
				setSuccessStory(data);
			},
		}
	);

	const { mutateAsync: publish } = useMutation(publishSuccessStory, {
		onSuccess: () => {
			setLoading(false);
			toast.success("Success Story Published Successfully");
			queryClient.invalidateQueries({ queryKey: ["program-success"] });
			queryClient.invalidateQueries({ queryKey: ["program-successes"] });
		},
		onError: () => {
			setLoading(false);
			toast.error("Error Publishing Success Story");
		},
	});

	const { mutateAsync: archive } = useMutation(archiveSuccessStory, {
		onSuccess: () => {
			setLoading(false);
			toast.success("Success Story Archived Successfully");
			queryClient.invalidateQueries({ queryKey: ["program-success"] });
			queryClient.invalidateQueries({ queryKey: ["program-successes"] });
		},
		onError: () => {
			setLoading(false);
			toast("Error Archiving Success Story");
		},
	});

	const handleState = async () => {
		setLoading(true);
		state === "published" ? await archive(id) : await publish(id);
	};

	useQuery("program-categories", getProgramCategories, {
		onSuccess: (data) => {
			setCategories(data);
		},
	});

	const handleCategoryChange = (event) => {
		const categoryId = event.target.value;
		setSuccessStory((prevStory) => ({
			...prevStory,
			programCategory: categoryId,
		}));
	};
	const { mutate: addSuccessStory, isLoading: creating } = useMutation(
		createSuccessStory,
		{
			onSuccess: () => {
				setSuccessStory(intial);
				toast.success("Success Story Created Successfully");
				handleModal();
				queryClient.invalidateQueries(["program-successes"]);
			},
			onError: () => {
				toast.error("Could not create SuccessStory");
			},
		}
	);

	const { mutateAsync: updateSuccessStory, isLoading: updating } = useMutation(
		editSuccessStory,
		{
			onSuccess: () => {
				toast.success("SuccessStory updated Successfully");
				queryClient.invalidateQueries(["program-success"]);
				queryClient.invalidateQueries(["program-successes"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not update SuccessStory");
			},
		}
	);

	const updateSuccessStoryDetails = async () => {
		// Compare the current successStory state with the fetched data to identify updated fields
		const updatedFields = new FormData();
		for (const [key, value] of Object.entries(successStory)) {
			if (successStory[key] !== data[key]) {
				updatedFields.append(key, value);
			}
		}
		await updateSuccessStory({ id, data: updatedFields });
	};

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setSuccessStory((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setSuccessStory]
	);

	const handleOnChange = (e) => {
		setSuccessStory((prev) => ({
			...prev,
			image: e.target.files[0],
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("name", name);
		formData.append("image", image);
		formData.append("story", story);
		formData.append("programCategory", programCategory);
		formData.append("position", position);

		newItem ? addSuccessStory(formData) : await updateSuccessStoryDetails();
	};
	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">Success Story</h2>
				{!newItem && (
					<div className="flex items-center gap-3 hover:cursor-pointer">
						<div onClick={handleState}>
							{state &&
								(loading ? (
									<AiOutlineLoading3Quarters className="animate-spin" />
								) : state === "published" ? (
									<Tooltip content="Archive">
										<BiArchiveIn size="1.25rem" />
									</Tooltip>
								) : (
									<Tooltip content="Publish">
										<BiArchiveOut size="1.25rem" />
									</Tooltip>
								))}
						</div>
						<div onClick={() => setEdit(!edit)}>
							{edit ? (
								<Tooltip content="View">
									<GrView size="1.25rem" />
								</Tooltip>
							) : (
								<Tooltip content="Edit">
									<MdOutlineModeEditOutline size="1.125rem" />
								</Tooltip>
							)}
						</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={handleModal}
				header={header}
				className="!max-w-3xl">
				{isLoading && !newItem ? (
					<Loader />
				) : (
					<form className="w-full px-4 md:px-8">
						<div className="flex flex-col w-full gap-y-5">
							<div className="self-center relative">
								<input
									required
									className="hidden"
									name="image"
									type="file"
									id="fileInput"
									onChange={handleOnChange}
									disabled={!edit && !newItem}
								/>
								<label
									htmlFor="fileInput"
									className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 text-xs border">
									{image ? (
										<img
											className="rounded-full"
											src={
												image
													? typeof image === "string"
														? image
														: URL.createObjectURL(image)
													: ""
											}
											alt={name}
										/>
									) : (
										<Placeholder />
									)}
									{(edit || newItem) && (
										<div
											className="absolute right-3 bottom-0 z-2 text-black opacity-90 text-base"
											size="2rem">
											<BiSolidImageAdd />
										</div>
									)}
								</label>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="name">
									Name
								</label>
								<input
									required
									type="text"
									className={`${inputClass}`}
									name="name"
									value={name}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="position">
									Position
								</label>
								<input
									required
									type="text"
									className={`${inputClass}`}
									name="position"
									value={position}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="program">
									Program Category
								</label>

								{edit || newItem ? (
									<select
										className={`${inputClass}`}
										name="program"
										value={
											programCategory ? programCategory._id : programCategory
										}
										onChange={handleCategoryChange}>
										<option value="">Select Category</option>
										{categories.map((category, index) => (
											<option
												value={category._id}
												className="my-2"
												key={index}
												name="category">
												{category.name}
											</option>
										))}
									</select>
								) : (
									<span className={`${inputClass}`}>
										{programCategory?.name}
									</span>
								)}
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12 self-start"
									htmlFor="story">
									Story
								</label>
								<textarea
									required
									type="text"
									className={`${inputClass}`}
									name="story"
									value={story}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
									rows={8}
								/>
							</div>
						</div>

						<div className="my-4 w-full flex">
							{edit ||
								(newItem && (
									<button
										className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ml-auto"
										onClick={handleSubmit}>
										{creating || updating ? (
											<AiOutlineLoading3Quarters className="animate-spin" />
										) : (
											"SUBMIT"
										)}
									</button>
								))}
						</div>
					</form>
				)}
				<ToastContainer />
			</Modal>
		</>
	);
};

export default SuccessStoriesModal;
