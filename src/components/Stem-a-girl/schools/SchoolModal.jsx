import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Modal from "components/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import Loader from "components/Loader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { InputGroup, Input, Textarea } from "components/Base";
import { createSAGSchool, getSAGSchool, editSAGSchool } from "services";
import { BiSolidImageAdd } from "react-icons/bi";
import Placeholder from "components/Placeholder";

const SchoolModal = ({
	isOpen,
	handleModal,
	handleDeleteModal,
	newItem,
	id,
}) => {
	const queryClient = useQueryClient();
	const intial = {
		name: "",
		image: "",
		description: "",
	};
	const [school, setSchool] = useState(intial);
	const { name, image, description } = school;
	const [edit, setEdit] = useState(false);
	const { isLoading, data } = useQuery(
		["stem-a-girl-school", id],
		() => getSAGSchool(id),
		{
			onSuccess: ({ data }) => {
				!newItem && setSchool(data.data);
			},
		}
	);

	const { mutate: addSchool, isLoading: creating } = useMutation(
		createSAGSchool,
		{
			onSuccess: () => {
				setSchool(intial);
				toast.success("School Created Successfully");
				queryClient.invalidateQueries(["stem-a-girl-schools"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not create School");
			},
		}
	);

	const { mutateAsync: editSchool, isLoading: updating } = useMutation(
		editSAGSchool,
		{
			onSuccess: () => {
				toast.success("School updated Successfully");
				queryClient.invalidateQueries(["stem-a-girl-school"]);
				queryClient.invalidateQueries(["stem-a-girl-schools"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not update School");
			},
		}
	);

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setSchool((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setSchool]
	);

	const handleOnChange = (e) => {
		setSchool((prev) => ({
			...prev,
			image: e.target.files[0],
		}));
	};

	const createSchool = () => {
		const formData = new FormData();
		formData.append("name", name);
		formData.append("description", description);
		formData.append("image", image);
		addSchool(formData);
	};

	const updateSchool = async () => {
		const updatedFields = new FormData();
		for (const [key, value] of Object.entries(school)) {
			if (school[key] !== data[key]) {
				updatedFields.append(key, value);
			}
		}
		await editSchool({ id, data: updatedFields });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (name === "" || description === "" || image === "") {
			toast.error("Please fill all fields");
		}
		newItem ? createSchool() : updateSchool();
	};

	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">School Details</h2>
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
									className="flex items-center justify-center bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 text-sm border">
									{image ? (
										<img
											className="rounded-full w-16 h-16 md:w-28 md:h-28 "
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
										<div className="absolute right-2 -bottom-1 z-2 text-slate-600 opacity-90 text-xl">
											<BiSolidImageAdd />
										</div>
									)}
								</label>
							</div>
							<InputGroup>
								<Input
									label="Name"
									name="name"
									onChange={handleInputChange}
									value={name}
									disabled={!edit && !newItem}
								/>
							</InputGroup>

							<InputGroup>
								<Textarea
									name="description"
									value={description}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
									label="Description"
								/>
							</InputGroup>
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

export default SchoolModal;
