import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
	createSchoolProgram,
	getSchoolProgram,
	editSchoolProgram,
	getSchools,
	publishSchoolProgram,
	unpublishSchoolProgram,
} from "services";
import Modal from "components/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import Loader from "components/Loader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiArchiveIn, BiArchiveOut, BiSolidImageAdd } from "react-icons/bi";
import Placeholder from "components/Placeholder";

const SchoolProgramModal = ({
	isOpen,
	handleModal,
	handleDeleteModal,
	newItem,
	id,
}) => {
	const intialSchoolValue = {
		title: "",
		cohort: "",
		briefContent: "",
		extendedContent: "",
		school: "",
		state: "",
		link: "",
		image: "",
	};
	const [schoolProgram, setSchoolProgram] = useState(intialSchoolValue);
	const {
		title,
		cohort,
		briefContent,
		extendedContent,
		school,
		state,
		link,
		image,
	} = schoolProgram;
	const queryClient = useQueryClient();
	const [edit, setEdit] = useState(false);
	const [schools, setSchools] = useState([]);
	const [loading, setLoading] = useState(false);
	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;

	const { data, isLoading } = useQuery(
		["schoolProgram", id],
		() => getSchoolProgram(id),
		{ enabled: !!id },
		{
			onSuccess: (data) => {
				setSchoolProgram(data);
			},
		}
	);

	useQuery("schools", getSchools, {
		onSuccess: (data) => {
			setSchools(data);
		},
	});

	const handleOnChange = (e) => {
		setSchoolProgram((prev) => ({
			...prev,
			image: e.target.files[0],
		}));
	};

	const { mutate: addSchool, isLoading: creating } = useMutation(
		createSchoolProgram,
		{
			onSuccess: () => {
				toast.success("School added successfully");
				setSchoolProgram(intialSchoolValue);
				queryClient.invalidateQueries({ queryKey: ["schoolPrograms"] });

				handleModal();
			},
			onError: () => {
				toast.error("Error Adding Data");
				handleModal();
			},
		}
	);

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setSchoolProgram((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setSchoolProgram]
	);

	const handleSchoolChange = (event) => {
		const schoolId = event.target.value;
		setSchoolProgram((prev) => ({
			...prev,
			school: schoolId,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (
			title === "" ||
			extendedContent === "" ||
			school === "" ||
			briefContent === "" ||
			cohort === "" ||
			link === "" ||
			image === ""
		) {
			toast.error("Please fill all fields");
		} else {
			const formData = new FormData();
			formData.append("title", title);
			formData.append("extendedContent", extendedContent);
			formData.append("school", school);
			formData.append("cohort", cohort);
			formData.append("briefContent", briefContent);
			formData.append("link", link);
			formData.append("image", image);
			newItem ? addSchool(formData) : await updateSchoolDetails();
		}
	};

	const { mutateAsync: updateSchool, isLoading: updating } = useMutation(
		editSchoolProgram,
		{
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["schoolPrograms"] });
				queryClient.invalidateQueries({ queryKey: ["schoolProgram"] });
				toast.success("Updated School successfully");
				handleModal();
			},
			onError: () => {
				toast.error("Error updating School");
				handleModal();
			},
		}
	);

	const updateSchoolDetails = async () => {
		// Compare the current schoolProgram state with the fetched data to identify updated fields
		const updatedFields = {};
		for (const [key] of Object.entries(schoolProgram)) {
			if (schoolProgram[key] !== data[key]) {
				updatedFields[key] = schoolProgram[key];
			}
		}
		await updateSchool({ id, data: updatedFields });
	};

	const { mutateAsync: publish } = useMutation(publishSchoolProgram, {
		onSuccess: () => {
			setLoading(false);
			toast.success("School Program Published Successfully");
			queryClient.invalidateQueries({ queryKey: ["schoolProgram"] });
			queryClient.invalidateQueries({ queryKey: ["schoolPrograms"] });
		},
		onError: () => {
			setLoading(false);
			toast.error("Error Publishing School Program");
		},
	});

	const { mutateAsync: archive } = useMutation(unpublishSchoolProgram, {
		onSuccess: () => {
			setLoading(false);
			toast.success("School Program Archived Successfully");
			queryClient.invalidateQueries({ queryKey: ["schoolProgram"] });
			queryClient.invalidateQueries({ queryKey: ["schoolPrograms"] });
		},
		onError: () => {
			setLoading(false);
			toast.error("Error Archiving School Program");
		},
	});

	const handleState = async () => {
		setLoading(true);
		state === "published" ? await archive(id) : await publish(id);
	};

	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">School Program Details</h2>
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
						<div className="flex flex-col w-full gap-y-3">
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
									className="flex items-center justify-center bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 text-xs border">
									{image ? (
										<img
											className="rounded-full w-full max-h-40"
											src={
												image
													? typeof image === "string"
														? image
														: URL.createObjectURL(image)
													: ""
											}
											alt={title}
										/>
									) : (
										<Placeholder name="image" />
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
							<div className="relative w-full mb-3 flex items-center ">
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
									onChange={handleInputChange}
									disabled={!edit && !newItem}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center ">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="cohort">
									Cohort
								</label>
								<input
									required
									type="number"
									className={`${inputClass}`}
									name="cohort"
									value={cohort}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center ">
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
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="link">
									Link
								</label>
								<input
									required
									type="url"
									className={`${inputClass}`}
									name="link"
									value={link}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block text-slate-600 text-xs font-bold basis-3/12 uppercase"
									htmlFor="school">
									School
								</label>

								<select
									className={`${inputClass}`}
									value={school}
									name="school"
									onChange={handleSchoolChange}
									disabled={edit}>
									<option value="">Select School</option>
									{schools.map((school, index) => (
										<option
											value={school._id}
											className="my-2"
											key={index}
											name="school">
											{school.name}
										</option>
									))}
								</select>
							</div>
							<div className="relative w-full mb-3 flex items-center ">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12 self-start"
									htmlFor="extendedContent">
									Extended Content
								</label>
								<textarea
									className={`${inputClass}`}
									name="extendedContent"
									value={extendedContent}
									onChange={handleInputChange}
									rows={8}
									disabled={!edit && !newItem}
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
			</Modal>
			<ToastContainer />
		</>
	);
};

export default SchoolProgramModal;
