import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { createChapter, editChapter, getChapter } from "services";
import Modal from "components/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import Loader from "components/Loader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getChapterCategories } from "services";

const ChapterModal = ({
	isOpen,
	handleModal,
	handleDeleteModal,
	newItem,
	categoryId,
	id,
}) => {
	const queryClient = useQueryClient();
	const intial = {
		name: "",
		city: "",
		country: "",
		leader: "",
		category: "",
	};
	const [chapter, setChapter] = useState(intial);
	const { name, city, country, leader, category } = chapter;
	const [edit, setEdit] = useState(false);
	const [categories, setCategories] = useState([]);
	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;
	console.log("hello", categoryId, id);
	const { data, isLoading } = useQuery(
		["chapter", id],
		() => getChapter(categoryId, id),
		{
			onSuccess: (data) => {
				setChapter(data);
			},
		}
	);

	useQuery("chapter-categories", getChapterCategories, {
		onSuccess: (data) => {
			setCategories(data);
		},
	});

	const { mutate: addChapter, isLoading: creating } = useMutation(
		createChapter,
		{
			onSuccess: () => {
				setChapter(intial);
				toast.success("Chapter Created Successfully");
				queryClient.invalidateQueries(["chapters"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not create Chapter");
			},
		}
	);

	const { mutateAsync: updateChapter, isLoading: updating } = useMutation(
		editChapter,
		{
			onSuccess: () => {
				toast.success("Chapter updated Successfully");
				queryClient.invalidateQueries(["chapter"]);
				queryClient.invalidateQueries(["chapters"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not update Chapter");
			},
		}
	);

	const updateChapterDetails = async () => {
		// Compare the current chapter state with the fetched data to identify updated fields
		const updatedFields = {};
		for (const [key] of Object.entries(chapter)) {
			if (chapter[key] !== data[key]) {
				updatedFields[key] = chapter[key];
			}
		}
		await updateChapter({ id, data: updatedFields });
	};

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setChapter((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setChapter]
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		newItem ? addChapter(chapter) : await updateChapterDetails();
	};

	const handleCategoryChange = (event) => {
		const categoryId = event.target.value;
		setChapter((prevChapter) => ({
			...prevChapter,
			category: categoryId,
		}));
	};

	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">Chapter Details</h2>
				{!newItem && (
					<div className="flex items-center gap-3 hover:cursor-pointer">
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
									htmlFor="city">
									City
								</label>
								<input
									required
									type="text"
									className={`${inputClass}`}
									name="city"
									value={city}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="country">
									Country
								</label>
								<input
									required
									type="text"
									className={`${inputClass}`}
									name="country"
									value={country}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
								/>
							</div>

							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="leader">
									Leader
								</label>
								<input
									required
									type="text"
									className={`${inputClass}`}
									name="leader"
									value={leader}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
								/>
							</div>

							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="category">
									Category
								</label>

								{edit || newItem ? (
									<select
										className={`${inputClass}`}
										value={category._id ? category._id : category}
										name="category"
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
									<span className={`${inputClass}`}>{category?.name}</span>
								)}
							</div>
						</div>

						<div className="my-4 w-full flex">
							{edit || newItem ? (
								<button
									className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ml-auto"
									onClick={handleSubmit}>
									{creating || updating ? (
										<AiOutlineLoading3Quarters className="animate-spin" />
									) : (
										"SUBMIT"
									)}
								</button>
							) : (
								id && (
									<button
										className="bg-red-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
										onClick={() => {
											handleModal();
											handleDeleteModal();
										}}>
										Delete
									</button>
								)
							)}
						</div>
					</form>
				)}
				<ToastContainer />
			</Modal>
		</>
	);
};

export default ChapterModal;
