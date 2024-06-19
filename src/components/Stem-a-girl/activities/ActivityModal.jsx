import React, { useState, useCallback, useEffect } from "react";
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
import { createSAGActivity, getSAGActivity, editSAGActivity } from "services";
import { BiSolidImageAdd } from "react-icons/bi";
import Placeholder from "components/Placeholder";
import DefaultImage from "../../../assets/img/default-stem-photo.png";

const ActivityModal = ({
	isOpen,
	handleModal,
	handleDeleteModal,
	newItem,
	id,
}) => {
	const queryClient = useQueryClient();
	const intial = {
		title: "",
		image: "",
		description: "",
	};
	const [activityDetails, setActivityDetails] = useState(intial);
	const { title, image, description } = activityDetails;
	const [edit, setEdit] = useState(false);
	const { isLoading, data } = useQuery(
		["steam-a-girl-activity", id],
		() => getSAGActivity(id),
		{
			onSuccess: ({ data }) => {
				!newItem && setActivityDetails(data.data);
			},
		}
	);

	const { mutate: addActivity, isLoading: creating } = useMutation(
		createSAGActivity,
		{
			onSuccess: () => {
				setActivityDetails(intial);
				toast.success("Activity Created Successfully");
				queryClient.invalidateQueries(["stem-a-girl-activities"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not create Activity");
			},
		}
	);

	const { mutateAsync: editActivity, isLoading: updating } = useMutation(
		editSAGActivity,
		{
			onSuccess: () => {
				toast.success("Activity updated Successfully");
				queryClient.invalidateQueries(["stem-a-girl-activity"]);
				queryClient.invalidateQueries(["stem-a-girl-activities"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not update Activity");
			},
		}
	);

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setActivityDetails((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setActivityDetails]
	);

	const handleOnChange = (e) => {
		setActivityDetails((prev) => ({
			...prev,
			image: e.target.files[0],
		}));
	};
	useEffect(() => {
		// URL to your image
		fetch(DefaultImage)
			.then((response) => response.blob())
			.then((blob) => {
				setActivityDetails((prev) => ({ ...prev, image: blob }));
			})
			.catch((error) => console.error("Error fetching the image:", error));
	}, []);
	const createActivity = () => {
		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		formData.append("image", image);
		addActivity(formData);
	};

	const updateActivity = async () => {
		const updatedFields = new FormData();
		for (const [key, value] of Object.entries(activityDetails)) {
			if (activityDetails[key] !== data[key]) {
				updatedFields.append(key, value);
			}
		}
		await editActivity({ id, data: updatedFields });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (title === "" || description === "") {
			toast.error("Please fill all fields");
		}
		newItem ? createActivity() : updateActivity();
	};

	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">Activity Details</h2>
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
											alt={title}
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
									label="Title"
									name="title"
									onChange={handleInputChange}
									value={title}
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

export default ActivityModal;
