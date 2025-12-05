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
import { FiUploadCloud } from "react-icons/fi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const InitiativeModal = ({
	isOpen,
	handleModal,
	handleDeleteModal,
	newItem,
	id
}) => {
	const queryClient = useQueryClient();
	const intial = {
		title: "",
		initiative_url: "",
		donation_url: "",
		description: "",
		isAvailable: false,
		image: null
	};
	const [initiative, setInitiative] = useState(intial);
	const {
		title,
		description,
		initiative_url,
		donation_url,
		isAvailable,
		image
	} = initiative;
	const [edit, setEdit] = useState(false);
	const [imagePreview, setImagePreview] = useState("");
	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;

	// Quill modules configuration
	const modules = {
		toolbar: [
			["bold", "italic", "underline"],
			[{ list: "ordered" }, { list: "bullet" }],
			["clean"]
		]
	};

	// Quill formats
	const formats = ["bold", "italic", "underline", "list", "bullet"];

	const { isLoading, data } = useQuery(
		["initiative", id],
		() => getInitiative(id),
		{
			onSuccess: (data) => {
				setInitiative({
					title: data.title || "",
					initiative_url: data.initiative_url || "",
					donation_url: data.donation_url || "",
					description: data.description || "",
					isAvailable: data.isAvailable || false,
					image: null
				});
				setImagePreview(data.image || "");
			},
			enabled: !newItem && !!id
		}
	);

	const { mutate: addInitiative, isLoading: creating } = useMutation(
		createInitiative,
		{
			onSuccess: () => {
				setInitiative(intial);
				setImagePreview("");
				toast.success("Initiative Created Successfully");
				handleModal();
				queryClient.invalidateQueries(["initiatives"]);
			},
			onError: (error) => {
				toast.error("Could not create Initiative");
				console.error("Create error:", error);
			}
		}
	);

	const { mutateAsync: updateInitiative, isLoading: updating } = useMutation(
		editInitiative,
		{
			onSuccess: () => {
				toast.success("Initiative updated Successfully");
				queryClient.invalidateQueries(["initiative", id]);
				queryClient.invalidateQueries(["initiatives"]);
				handleModal();
			},
			onError: (error) => {
				toast.error("Could not update Initiative");
				console.error("Update error:", error);
			}
		}
	);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const previewUrl = URL.createObjectURL(file);
			setImagePreview(previewUrl);
			setInitiative((prev) => ({
				...prev,
				image: file
			}));
		}
	};

	const prepareFormData = () => {
		const formData = new FormData();

		formData.append("title", title);
		formData.append("description", description);
		formData.append("initiative_url", initiative_url);
		formData.append("donation_url", donation_url);
		formData.append("isAvailable", isAvailable);

		if (image) {
			formData.append("image", image);
		}

		return formData;
	};

	const updateInitiativeDetails = async () => {
		const formData = prepareFormData();
		await updateInitiative({ id, data: formData });
	};

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setInitiative((prev) => ({
				...prev,
				[name]: value
			}));
		},
		[setInitiative]
	);

	// Handle description change from Quill editorr
	const handleDescriptionChange = (content) => {
		setInitiative((prev) => ({
			...prev,
			description: content
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (newItem && !image) {
			toast.error("Please upload an image");
			return;
		}

		const formData = prepareFormData();

		if (newItem) {
			addInitiative(formData);
		} else {
			await updateInitiativeDetails();
		}
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
							{/* Image Upload Section */}
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="image">
									Image
								</label>
								<div className="basis-9/12">
									<div className="flex items-center gap-4">
										{(imagePreview || (data?.image && !edit)) && (
											<div className="w-20 h-20 rounded-md overflow-hidden border">
												<img
													src={imagePreview || data?.image}
													alt="Initiative preview"
													className="w-full h-full object-cover"
													onLoad={() => {
														if (imagePreview) {
															URL.revokeObjectURL(imagePreview);
														}
													}}
												/>
											</div>
										)}

										<div className="flex flex-col items-start">
											<label className="flex flex-col items-center justify-center w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
												<FiUploadCloud className="text-gray-400 text-xl" />
												<span className="text-xs text-gray-500 mt-1">
													Upload Image
												</span>
												<input
													type="file"
													className="hidden"
													accept="image/*"
													onChange={handleImageChange}
													disabled={!edit && !newItem}
													name="image"
												/>
											</label>

											{!imagePreview && !data?.image && (
												<p className="text-xs text-gray-500 mt-2">
													{newItem ? "Image required" : "No image uploaded"}
												</p>
											)}
										</div>
									</div>
								</div>
							</div>

							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="title">
									Name
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

							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="initiative_url">
									Initiative URL
								</label>
								<input
									required
									type="url"
									className={`${inputClass}`}
									name="initiative_url"
									value={initiative_url}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
									placeholder="https://example.com/initiative"
								/>
							</div>

							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="donation_url">
									Donation URL
								</label>
								<input
									type="url"
									className={`${inputClass}`}
									name="donation_url"
									value={donation_url}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
									placeholder="https://example.com/donate"
								/>
							</div>

							{/* Rich Text Editor for Description */}
							<div className="relative w-full mb-3 flex">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12 pt-2"
									htmlFor="description">
									Description
								</label>
								<div className="basis-9/12">
									{edit || newItem ? (
										<ReactQuill
											theme="snow"
											value={description}
											onChange={handleDescriptionChange}
											modules={modules}
											formats={formats}
											className="bg-white rounded"
											placeholder="Enter initiative description..."
										/>
									) : (
										<div
											className="border rounded p-3 bg-gray-50 min-h-[100px]"
											dangerouslySetInnerHTML={{ __html: description }}
										/>
									)}
								</div>
							</div>

							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-1/12 self-start"
									htmlFor="isAvailable">
									Available
								</label>
								<input
									className={`ml-28`}
									type="checkbox"
									checked={isAvailable}
									name="isAvailable"
									onChange={(e) =>
										setInitiative((prevInitiative) => ({
											...prevInitiative,
											isAvailable: e.target.checked
										}))
									}
									disabled={!edit && !newItem}
								/>
							</div>
						</div>

						<div className="my-4 w-full flex">
							{edit || newItem ? (
								<button
									type="button"
									className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ml-auto"
									onClick={handleSubmit}
									disabled={creating || updating}>
									{creating || updating ? (
										<AiOutlineLoading3Quarters className="animate-spin" />
									) : (
										"SUBMIT"
									)}
								</button>
							) : (
								id && (
									<button
										type="button"
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
