import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { createInitiative, editInitiative, getInitiative } from "services";
import Modal from "components/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import Loader from "components/Loader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const InitiativeModal = ({
	isOpen,
	handleModal,
	handleDeleteModal,
	newItem,
	id,
}) => {
	const queryClient = useQueryClient();
	const intial = {
		name: "",
		link: "",
		description: "",
		isAvailable: false,
	};
	const [initiative, setInitiative] = useState(intial);
	const { name, description, link, isAvailable } = initiative;
	const [edit, setEdit] = useState(false);
	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;
	const { isLoading, data } = useQuery(
		["initiative", id],
		() => getInitiative(id),
		{
			onSuccess: (data) => {
				setInitiative(data);
			},
		}
	);
	const { mutate: addInitiative, isLoading: creating } = useMutation(
		createInitiative,
		{
			onSuccess: () => {
				setInitiative(intial);
				toast.success("Initiative Created Successfully");
				handleModal();
				queryClient.invalidateQueries(["initiatives"]);
			},
			onError: () => {
				toast.error("Could not create Initiative");
			},
		}
	);

	const { mutateAsync: updateInitiative, isLoading: updating } = useMutation(
		editInitiative,
		{
			onSuccess: () => {
				toast.success("Initiative updated Successfully");
				queryClient.invalidateQueries(["initiative"]);
				queryClient.invalidateQueries(["initiatives"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not update Initiative");
			},
		}
	);

	const updateInitiativeDetails = async () => {
		// Compare the current initiative state with the fetched data to identify updated fields
		const updatedFields = {};
		for (const [key] of Object.entries(initiative)) {
			if (initiative[key] !== data[key]) {
				updatedFields[key] = initiative[key];
			}
		}
		await updateInitiative({ id, data: updatedFields });
	};

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setInitiative((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setInitiative]
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(initiative);
		newItem
			? addInitiative({ name, description, link, isAvailable })
			: await updateInitiativeDetails();
	};
	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">Initiative Details</h2>
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
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="description">
									Description
								</label>
								<textarea
									required
									type="text"
									className={`${inputClass}`}
									name="description"
									value={description}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-1/12 self-start"
									htmlFor="featured">
									Available
								</label>
								<input
									className={`ml-28`}
									type="checkbox"
									value={isAvailable}
									name="isAvailable"
									onChange={(e) =>
										setInitiative((prevInitiative) => ({
											...prevInitiative,
											isAvailable: e.target.checked,
										}))
									}
									disabled={!edit && !newItem}
									checked={isAvailable}
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

export default InitiativeModal;
