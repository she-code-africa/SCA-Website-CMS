import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
	createProgram,
	editProgram,
	getProgram,
	getProgramCategories,
} from "services";
import Modal from "components/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import Loader from "components/Loader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Placeholder from "components/Placeholder";
import { BiSolidImageAdd, BiArchiveIn, BiArchiveOut } from "react-icons/bi";
import DatePicker from "react-datepicker";
import { publishProgram } from "services";
import { archiveProgram } from "services";

const ProgramModal = ({
	isOpen,
	handleModal,
	handleDeleteModal,
	newItem,
	id,
	categoryId,
}) => {
	const queryClient = useQueryClient();
	const intial = {
		title: "",
		banner: "",
		cohort: "",
		extendedContent: "",
		briefContent: "",
		endDate: "",
		startDate: "",
		name: "",
		city: "",
		country: "",
		leader: "",
		author: "",
		category: "",
		images: [],
		slug: "",
	};
	const [program, setProgram] = useState(intial);
	const {
		name,
		cohort,
		author,
		category,
		title,
		banner,
		images,
		endDate,
		startDate,
		briefContent,
		extendedContent,
		slug,
		state,
	} = program;
	const [edit, setEdit] = useState(false);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);

	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;
	const { data, isLoading } = useQuery(
		["program", id],
		() => getProgram(categoryId, id),
		{
			onSuccess: (data) => {
				!newItem && setProgram(data);
			},
		}
	);

	useQuery("program-categories", getProgramCategories, {
		onSuccess: (data) => {
			setCategories(data);
		},
	});

	const { mutate: addProgram, isLoading: creating } = useMutation(
		createProgram,
		{
			onSuccess: () => {
				setProgram(intial);
				toast.success("Program Created Successfully");
				queryClient.invalidateQueries(["programs"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not create Program");
			},
		}
	);

	const { mutateAsync: updateProgram, isLoading: updating } = useMutation(
		editProgram,
		{
			onSuccess: () => {
				toast.success("Program updated Successfully");
				queryClient.invalidateQueries(["program"]);
				queryClient.invalidateQueries(["programs"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not update Program");
			},
		}
	);

	const updateProgramDetails = async () => {
		// Compare the current program state with the fetched data to identify updated fields
		const updatedFields = new FormData();
		for (const [key, value] of Object.entries(program)) {
			if (program[key] !== data[key]) {
				updatedFields.append(key, value);
			}
		}
		await updateProgram({ id, categoryId, data: updatedFields });
	};

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setProgram((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setProgram]
	);

	const { mutateAsync: publish } = useMutation(publishProgram, {
		onSuccess: () => {
			setLoading(false);
			toast.success("Program Published Successfully");
			queryClient.invalidateQueries({ queryKey: ["programs"] });
			queryClient.invalidateQueries({ queryKey: ["program"] });
		},
		onError: () => {
			setLoading(false);
			toast.error("Error Publishing Program");
		},
	});

	const { mutateAsync: archive } = useMutation(archiveProgram, {
		onSuccess: () => {
			setLoading(false);
			toast.success("Program Archived Successfully");

			queryClient.invalidateQueries({ queryKey: ["programs"] });
			queryClient.invalidateQueries({ queryKey: ["program"] });
		},
		onError: () => {
			setLoading(false);
			toast.error("Error Archiving Program");
		},
	});

	const handleState = async () => {
		setLoading(true);
		state === "published"
			? await archive({ id, categoryId })
			: await publish({ id, categoryId });
	};

	const handleSubmit = async (e) => {
		e.prprogramDefault();
		const formData = new FormData();
		formData.append("title", title);
		formData.append("briefContent", briefContent);
		formData.append("extendedContent", extendedContent);
		formData.append("startDate", startDate);
		formData.append("endDate", endDate);
		formData.append("banner", banner);
		formData.append("slug", slug);
		formData.append("category", category);
		formData.append("cohort", cohort);
		newItem ? addProgram(formData) : await updateProgramDetails();
	};

	const handleCategoryChange = (program) => {
		const categoryId = program.target.value;
		setProgram((prevProgram) => ({
			...prevProgram,
			category: categoryId,
		}));
	};

	const handleOnChange = (e) => {
		setProgram((prev) => ({
			...prev,
			banner: e.target.files[0],
		}));
	};

	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">Program Details</h2>
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
						<div className="flex flex-col w-full gap-y-2">
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
									{banner ? (
										<img
											className="rounded-full"
											src={
												banner
													? typeof banner === "string"
														? banner
														: URL.createObjectURL(banner)
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
									htmlFor="title">
									Title
								</label>
								<input
									required
									type="text"
									className={`${inputClass}`}
									name="title"
									value={title}
									onChange={(e) =>
										setProgram((prev) => ({
											...prev,
											slug: e.target.value.toLowerCase().replace(/ /g, "-"),
											title: e.target.value,
										}))
									}
									disabled={!edit && !newItem}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="title">
									Slug
								</label>
								<input
									required
									type="text"
									className={`${inputClass}`}
									name="slug"
									value={slug}
									disabled
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="cohort">
									Cohort
								</label>
								<input
									required
									type="text"
									className={`${inputClass}`}
									name="cohort"
									value={cohort}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="briefContent">
									Brief Content
								</label>
								<input
									required
									type="text"
									className={`${inputClass}`}
									name="briefContent"
									value={briefContent}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center ">
								<label
									className="block uppercase text-slate-600 text-xs font-bold  basis-3/12"
									htmlFor="startDate">
									Start Date
								</label>
								<DatePicker
									selected={startDate ? new Date(startDate) : new Date()}
									onChange={(date) =>
										setProgram((prevProgram) => ({
											...prevProgram,
											startDate: date,
										}))
									}
									className={`${inputClass} ml-8 !w-[93%]`}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center ">
								<label
									className="block uppercase text-slate-600 text-xs font-bold  basis-3/12"
									htmlFor="endDate">
									End Date
								</label>
								<DatePicker
									selected={endDate ? new Date(endDate) : new Date()}
									onChange={(date) =>
										setProgram((prevProgram) => ({
											...prevProgram,
											endDate: date,
										}))
									}
									className={`${inputClass} ml-8 !w-[93%]`}
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

							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12 self-start"
									htmlFor="extendedContent">
									Extended Content
								</label>
								<textarea
									required
									type="text"
									className={`${inputClass}`}
									name="extendedContent"
									value={extendedContent}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
									rows={5}
								/>
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

export default ProgramModal;
