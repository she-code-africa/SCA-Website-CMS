import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { createPartner, editPartner, getPartner } from "services";
import Modal from "components/Modal";
import Placeholder from "components/Placeholder";
import { BiSolidImageAdd } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import Loader from "components/Loader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const PartnerModal = ({
	isOpen,
	handleModal,
	handleDeleteModal,
	newItem,
	id,
}) => {
	const queryClient = useQueryClient();
	const intial = {
		name: "",
		featured: false,
		image: "",
	};
	const [partner, setPartner] = useState(intial);
	const { name, image, featured } = partner;
	const [edit, setEdit] = useState(false);
	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;
	const { isLoading, data } = useQuery(["partner", id], () => getPartner(id), {
		onSuccess: (data) => {
			setPartner(data);
		},
	});
	const { mutate: addPartner, isLoading: creating } = useMutation(
		createPartner,
		{
			onSuccess: () => {
				setPartner(intial);
				toast.success("Partner Created Successfully");
				handleModal();
				queryClient.invalidateQueries(["partners"]);
			},
			onError: () => {
				toast.error("Could not create Partner");
			},
		}
	);

	const { mutateAsync: updatePartner, isLoading: updating } = useMutation(
		editPartner,
		{
			onSuccess: () => {
				toast.success("Partner updated Successfully");
				queryClient.invalidateQueries(["partner"]);
				queryClient.invalidateQueries(["partners"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not update Partner");
			},
		}
	);

	const updatePartnerDetails = async () => {
		// Compare the current partner state with the fetched data to identify updated fields
		const updatedFields = new FormData();
		for (const [key, value] of Object.entries(partner)) {
			if (partner[key] !== data[key]) {
				updatedFields.append(key, value);
			}
		}
		await updatePartner({ id, data: updatedFields });
	};

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setPartner((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setPartner]
	);

	const handleOnChange = (e) => {
		setPartner((prev) => ({
			...prev,
			image: e.target.files[0],
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("name", name);
		formData.append("image", image);
		formData.append("featured", featured ? featured : false);
		newItem ? addPartner(formData) : await updatePartnerDetails();
	};
	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">Partner Details</h2>
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
									Company Name
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
									className="block uppercase text-slate-600 text-xs font-bold basis-1/12 self-start"
									htmlFor="featured">
									Featured
								</label>
								<input
									className={`ml-28`}
									type="checkbox"
									value={featured}
									name="featured"
									onChange={(e) =>
										setPartner((prevPartner) => ({
											...prevPartner,
											featured: e.target.checked,
										}))
									}
									disabled={!edit && !newItem}
									checked={featured}
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

export default PartnerModal;
