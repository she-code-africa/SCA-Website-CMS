import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { createOurReach, editOurReach, getReach } from "services";
import Modal from "components/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import Loader from "components/Loader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ReachModal = ({
	isOpen,
	handleModal,
	handleDeleteModal,
	newItem,
	id,
}) => {
	const queryClient = useQueryClient();
	const intial = {
		name: "",
		value: 0,
	};
	const [reach, setReach] = useState(intial);
	const { name, value } = reach;
	const [edit, setEdit] = useState(false);
	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;
	const { isLoading, data } = useQuery(["reach", id], () => getReach(id), {
		onSuccess: (data) => {
			!newItem && setReach(data);
		},
	});

	const { mutate: addReach, isLoading: creating } = useMutation(
		createOurReach,
		{
			onSuccess: () => {
				setReach(intial);
				toast.success("Reach Created Successfully");
				queryClient.invalidateQueries(["reachs"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not create Reach");
			},
		}
	);

	const { mutateAsync: updateReach, isLoading: updating } = useMutation(
		editOurReach,
		{
			onSuccess: () => {
				toast.success("Reach updated Successfully");
				queryClient.invalidateQueries(["reach"]);
				queryClient.invalidateQueries(["reachs"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not update Reach");
			},
		}
	);

	const updateReachDetails = async () => {
		// Compare the current reach state with the fetched data to identify updated fields
		const updatedFields = {};
		for (const [key] of Object.entries(reach)) {
			if (reach[key] !== data[key]) {
				updatedFields[key] = reach[key];
			}
		}
		await updateReach({ id, data: updatedFields });
	};

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setReach((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setReach]
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		newItem ? addReach(reach) : await updateReachDetails();
	};
	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">Reach Details</h2>
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
									htmlFor="value">
									Value
								</label>
								<input
									required
									type="number"
									className={`${inputClass}`}
									name="value"
									value={value}
									onChange={(e) =>
										setReach((prev) => ({
											...prev,
											value: e.target.value,
										}))
									}
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
				<ToastContainer />
			</Modal>
		</>
	);
};

export default ReachModal;
