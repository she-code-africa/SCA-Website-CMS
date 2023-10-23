import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { createCourse, getCourse, editCourse, getSchools } from "services";
import Modal from "components/Modal";
import Placeholder from "components/Placeholder";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { BiSolidImageAdd } from "react-icons/bi";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import Loader from "components/Loader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const CourseModal = ({
	isOpen,
	handleModal,
	handleDeleteModal,
	newItem,
	id,
}) => {
	const intialCourseValue = {
		name: "",
		shortDescription: "",
		school: "",
		image: "",
		applicationLink: "",
	};
	const [event, setCourse] = useState(intialCourseValue);
	const { name, shortDescription, school, applicationLink, image } = event;
	const queryClient = useQueryClient();
	const [edit, setEdit] = useState(false);
	const [schools, setSchools] = useState([]);

	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;

	const { data, isLoading } = useQuery(["event", id], () => getCourse(id), {
		onSuccess: (data) => {
			setCourse(data);
		},
	});

	useQuery("schools", getSchools, {
		onSuccess: (data) => {
			setSchools(data);
		},
	});

	const { mutate: addCourse, isLoading: creating } = useMutation(createCourse, {
		onSuccess: () => {
			toast.success("Course added successfully");
			setCourse(intialCourseValue);
			queryClient.invalidateQueries({ queryKey: ["courses"] });
			handleModal();
		},
		onError: () => {
			toast.error("Error Adding Data");
			handleModal();
		},
	});

	const handleOnChange = (e) => {
		setCourse((prev) => ({
			...prev,
			image: e.target.files[0],
		}));
	};

	const handleSchoolChange = (event) => {
		const schoolId = event.target.value;
		setCourse((prev) => ({
			...prev,
			school: schoolId,
		}));
	};

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setCourse((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setCourse]
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (
			name === "" ||
			shortDescription === "" ||
			school === "" ||
			image === "" ||
			applicationLink === ""
		) {
			toast.error("Please fill all fields");
		} else {
			const formData = new FormData();
			formData.append("name", name);
			formData.append("shortDescription", shortDescription);
			formData.append("school", school);
			formData.append("applicationLink", applicationLink);
			formData.append("image", image);
			newItem ? addCourse(formData) : updateCourseDetails();
		}
	};

	const { mutateAsync: updateCourse, isLoading: updating } = useMutation(
		editCourse,
		{
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["courses"] });
				queryClient.invalidateQueries({ queryKey: ["event"] });
				toast.success("Updated Course successfully");
				handleModal();
			},
			onError: () => {
				toast.error("Error updating Course");
				handleModal();
			},
		}
	);

	const updateCourseDetails = async () => {
		// Compare the current event state with the fetched data to identify updated fields
		const updatedFields = new FormData();
		for (const [key, value] of Object.entries(event)) {
			if (event[key] !== data[key]) {
				updatedFields.append(key, value);
			}
		}
		await updateCourse({ id, data: updatedFields });
	};

	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">Course Details</h2>
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
											alt={name}
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

							<div className="relative w-full mb-3 flex items-center ">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="applicationLink">
									Link
								</label>
								<input
									required
									type="url"
									className={`${inputClass}`}
									name="applicationLink"
									value={applicationLink}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block text-slate-600 text-base font-semibold basis-3/12"
									htmlFor="school">
									School
								</label>

								{edit || newItem ? (
									<select
										className={`${inputClass}`}
										value={school && school._id ? school._id : school}
										name="school"
										onChange={handleSchoolChange}>
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
								) : (
									<span className={`${inputClass}`}>{school?.name}</span>
								)}
							</div>

							<div className="relative w-full mb-3 flex items-center ">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12 self-start"
									htmlFor="shortDescription">
									Description
								</label>
								<textarea
									className={`${inputClass}`}
									name="shortDescription"
									value={shortDescription}
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

export default CourseModal;
