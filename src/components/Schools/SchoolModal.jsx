import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { createSchool, getSchool, editSchool } from "services";
import Modal from "components/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import Loader from "components/Loader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const SchoolModal = ({
	isOpen,
	handleModal,
	handleDeleteModal,
	newItem,
	id,
}) => {
	const intialSchoolValue = {
		name: "",
		description: "",
	};
	const [school, setSchool] = useState(intialSchoolValue);
	const { name, description } = school;
	const queryClient = useQueryClient();
	const [edit, setEdit] = useState(false);

	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;

	const { data, isLoading } = useQuery(["school", id], () => getSchool(id), {
		onSuccess: (data) => {
			setSchool(data);
		},
	});

	console.log(id);
	const { mutate: addSchool, isLoading: creating } = useMutation(createSchool, {
		onSuccess: () => {
			toast.success("School added successfully");
			setSchool(intialSchoolValue);
			queryClient.invalidateQueries({ queryKey: ["schools"] });
			handleModal();
		},
		onError: () => {
			toast.error("Error Adding Data");
			handleModal();
		},
	});

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (name === "" || description === "") {
			toast.error("Please fill all fields");
		} else {
			newItem ? addSchool({ name, description }) : await updateSchoolDetails();
		}
	};

	const { mutateAsync: updateSchool, isLoading: updating } = useMutation(
		editSchool,
		{
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["schools"] });
				queryClient.invalidateQueries({ queryKey: ["school"] });
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
		// Compare the current school state with the fetched data to identify updated fields
		const updatedFields = {};
		for (const [key] of Object.entries(school)) {
			if (school[key] !== data[key]) {
				updatedFields[key] = school[key];
			}
		}
		await updateSchool({ id, data: updatedFields });
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
						<div className="flex flex-col w-full gap-y-3">
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
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12 self-start"
									htmlFor="description">
									Description
								</label>
								<textarea
									className={`${inputClass}`}
									name="description"
									value={description}
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

export default SchoolModal;
