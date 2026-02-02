import Modal from "components/Modal";
import React, { useState } from "react";
import Tooltip from "components/Tooltip";
import { GrView } from "react-icons/gr";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import Loader from "components/Loader";
import SubContentComponent from "./SubContentComponent";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { createMedia } from "services/media";
import { ToastContainer, toast } from "react-toastify";
import { getAMedia } from "services/media";
import { editMedia } from "services/media";

const MediaModal = ({ isOpen, handleModal, id, newItem }) => {
	const [edit, setEdit] = useState(true);

	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">
					{newItem ? "Upload Media" : "Edit Media"}
				</h2>

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

	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;

	// ----------------------------------------------------
	// MAIN FORM STATE
	// ----------------------------------------------------
	const [mediaData, setMediaData] = useState({
		title: "",
		description: "",
		type: "",
		author: "",
		tag: "",
		link: "",
		date: "",
		coverImage: null,
		images: [],
		embedUrl: "",
	});

	// Store cover image preview URL
	const [coverImagePreview, setCoverImagePreview] = useState(null);

	const { data, isLoading } = useQuery(["media", id], () => getAMedia(id), {
		enabled: !newItem && !!id,
		onSuccess: (data) => {
			setMediaData({
				title: data.title,
				description: data.description,
				type: data.type,
				author: data.author,
				tag: data.tag,
				link: data.link || data.videoLink || data.blogLink || "",
				date: data.dateCreated ? data.dateCreated.split("T")[0] : "",
				coverImage: data.coverImage,
				images: data.images || [],
				emebedUrl: data.embedUrl || "",
			});
			// Set initial cover image preview if exists
			if (data.coverImage) {
				setCoverImagePreview(data.coverImage);
			}
		},
	});

	// --------------------------
	// HANDLE MAIN INPUTS
	// --------------------------
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setMediaData((prev) => ({ ...prev, [name]: value }));
	};

	// --------------------------
	// HANDLE COVER IMAGE
	// --------------------------
	const handleCoverImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setMediaData((prev) => ({ ...prev, coverImage: file }));
			// Create preview URL for the new file
			const previewUrl = URL.createObjectURL(file);
			setCoverImagePreview(previewUrl);
		}
	};

	// --------------------------
	// REMOVE COVER IMAGE
	// --------------------------
	const removeCoverImage = () => {
		setMediaData((prev) => ({ ...prev, coverImage: null }));
		setCoverImagePreview(null);
	};

	// ----------------------------------------------------
	// HANDLE MULTIPLE IMAGES (RETAIN OLD + ADD NEW FILES)
	// ----------------------------------------------------
	const handleImagesUpload = (e) => {
		const uploadedFiles = [...e.target.files];

		setMediaData((prev) => ({
			...prev,
			images: [...prev.images, ...uploadedFiles],
		}));
	};

	// ----------------------------------------------------
	// DELETE IMAGE FROM ARRAY
	// ----------------------------------------------------
	const handleDeleteImage = (index) => {
		// Simply remove from images array
		setMediaData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	// ----------------------------------------------------
	// GET IMAGE PREVIEW URL
	// ----------------------------------------------------
	const getImagePreviewUrl = (image) => {
		if (typeof image === "string") {
			// Existing image URL from server
			return image;
		} else if (image instanceof File) {
			// New file - create object URL
			return URL.createObjectURL(image);
		}
		return "";
	};

	const queryClient = useQueryClient();

	// --------------------------
	// CREATE MEDIA MUTATION
	// --------------------------
	const { mutate: createNewMedia, isLoading: creating } = useMutation(
		createMedia,
		{
			onSuccess: () => {
				toast.success("Media created successfully");
				setMediaData({
					title: "",
					description: "",
					type: "",
					author: "",
					tag: "",
					link: "",
					date: "",
					coverImage: null,
					images: [],
					embedUrl: "",
				});
				setCoverImagePreview(null);
				queryClient.invalidateQueries({ queryKey: ["media"] });
				handleModal();
			},
			onError: () => {
				toast.error("Error Adding Data");
				handleModal();
			},
		},
	);

	// --------------------------
	// UPDATE MEDIA MUTATION
	// --------------------------
	const { mutateAsync: updateMedia, isLoading: updating } = useMutation(
		editMedia,
		{
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["media"] });
				toast.success("Updated media successfully");
				handleModal();
			},
			onError: () => {
				toast.error("Error updating media");
				handleModal();
			},
		},
	);

	// ---------------------------------------------------------------
	// UPDATE MEDIA — SEND COMPLETE IMAGES ARRAY (URLS + NEW FILES)
	// ---------------------------------------------------------------
	const updateMediaDetails = () => {
		const updatedFields = new FormData();

		for (const [key, value] of Object.entries(mediaData)) {
			const oldValue = data[key];

			// COVER IMAGE - only if changed
			if (key === "coverImage") {
				if (value instanceof File) {
					updatedFields.append("coverImage", value);
				}
				continue;
			}

			// IMAGES - send complete array (existing URLs + new Files)
			if (key === "images") {
				// Append all images (both URLs and new Files)
				value.forEach((image) => {
					updatedFields.append("images", image);
				});
				continue;
			}

			// BASIC FIELDS - only if changed
			if (value !== oldValue) {
				updatedFields.append(key, value);
			}
		}

		updateMedia({ id, data: updatedFields });
	};

	// --------------------------
	// HANDLE FORM SUBMIT
	// --------------------------
	const handleSubmit = (e) => {
		e.preventDefault();

		if (!mediaData.title || !mediaData.description || !mediaData.type) {
			toast.error("Please fill all fields");
			return;
		}

		const {
			title,
			description,
			type,
			link,
			author,
			tag,
			date,
			images,
			coverImage,
			embedUrl,
		} = mediaData;

		let formattedDate = "";
		if (date) {
			formattedDate = new Date(date).toISOString().split("T")[0];
		}

		const formData = new FormData();

		formData.append("title", title);
		formData.append("description", description);
		formData.append("type", type);
		formData.append("link", link);
		formData.append("author", author);
		formData.append("tag", tag);
		formData.append("dateCreated", formattedDate);
		formData.append("embedUrl", embedUrl);

		if (coverImage) {
			formData.append("coverImage", coverImage);
		}

		images.forEach((img) => {
			if (img instanceof File) formData.append("images", img);
		});

		newItem ? createNewMedia(formData) : updateMediaDetails();
	};
	

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={handleModal}
				header={header}
				className="!max-w-3xl">
				<div
					className="w-full pb-5"
					style={{ height: "550px", overflow: "auto" }}>
					{isLoading && !newItem ? (
						<Loader />
					) : (
						<form className="w-full px-3" onSubmit={handleSubmit}>
							<section
								className="w-full flex items-center"
								style={{ gap: "40px" }}>
								<div className="w-full mt-3">
									<label
										htmlFor="title"
										className="text-base font-medium text-slate-600">
										Title
									</label>
									<input
										required
										type="text"
										className={`${inputClass} mt-3`}
										name="title"
										placeholder="Enter a title"
										value={mediaData.title}
										onChange={handleInputChange}
										disabled={!edit && !newItem}
									/>
								</div>

								<div className="w-full mt-3">
									<label
										htmlFor="type"
										className="text-base font-medium text-slate-600">
										Type
									</label>

									<select
										required
										className={`${inputClass} mt-3 capitalize`}
										name="type"
										value={mediaData.type}
										onChange={handleInputChange}
										disabled={!edit && !newItem}>
										<option value="">--Select a type--</option>
										{["blog", "video", "image"].map((item, idx) => (
											<option value={item} key={idx} className="capitalize">
												{item}
											</option>
										))}
									</select>
								</div>
							</section>

							<section
								className="w-full flex items-center mt-3"
								style={{ gap: "40px" }}>
								<div className="w-full mt-3">
									<label className="text-base font-medium text-slate-600">
										Author
									</label>
									<input
										required
										type="text"
										className={`${inputClass} mt-3`}
										name="author"
										placeholder="Enter authors name"
										value={mediaData.author}
										onChange={handleInputChange}
										disabled={!edit && !newItem}
									/>
								</div>

								<div className="w-full mt-3">
									<label className="text-base font-medium text-slate-600">
										Tag
									</label>
									<input
										required
										type="text"
										className={`${inputClass} mt-3`}
										name="tag"
										placeholder="Enter media tag"
										value={mediaData.tag}
										onChange={handleInputChange}
										disabled={!edit && !newItem}
									/>
								</div>
							</section>

							<section
								className="w-full flex items-center mt-3"
								style={{ gap: "40px" }}>
								<div className="w-full mt-3">
									<label className="text-base font-medium text-slate-600">
										Date
									</label>
									<input
										required
										type="date"
										className={`${inputClass} mt-3`}
										name="date"
										value={mediaData.date}
										onChange={handleInputChange}
										disabled={!edit && !newItem}
									/>
								</div>

								<div className="w-full mt-3">
									<label className="text-base font-medium text-slate-600">
										Url
									</label>
									<input
										required
										type="text"
										className={`${inputClass} mt-3`}
										name="link"
										placeholder="Enter a valid link"
										value={mediaData.link}
										onChange={handleInputChange}
										disabled={!edit && !newItem}
									/>
								</div>
							</section>

							{/* embed url*/}
							{mediaData.type.toLowerCase() === "video" && (
								<div className="w-full mt-5">
									<label className="text-base font-medium text-slate-600 block mb-3">
										Embed Video URL
									</label>
									<input
										required
										type="text"
										className={`${inputClass} mt-3`}
										name="embedUrl"
										placeholder="Enter a valid url"
										value={mediaData.embedUrl}
										onChange={handleInputChange}
										disabled={!edit && !newItem}
									/>
								</div>
							)}

							<div className="w-full mt-5">
								<label className="text-base font-medium text-slate-600">
									Description
								</label>
								<textarea
									required
									className={`${inputClass} mt-3`}
									name="description"
									placeholder="Enter a valid description"
									value={mediaData.description}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
									rows={4}></textarea>
							</div>

							{/* COVER IMAGE */}
							<div className="w-full mt-5">
								<label className="text-base font-medium text-slate-600 block mb-3">
									Cover Image
								</label>

								{coverImagePreview && (
									<div className="relative inline-block mb-3 mr-4">
										<img
											src={coverImagePreview}
											alt="Cover preview"
											className="w-40 h-40 object-cover rounded-md border border-slate-300"
										/>
										{(edit || newItem) && (
											<button
												type="button"
												onClick={removeCoverImage}
												className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full p-1.5 hover:bg-pink-600 transition-all shadow-md z-10">
												<IoMdClose size="1.25rem" />
											</button>
										)}
									</div>
								)}

								{(edit || newItem) && (
									<label className="cursor-pointer inline-block">
										<input
											type="file"
											onChange={handleCoverImageUpload}
											accept="image/*"
											className="hidden"
											id="cover-upload"
										/>
										<span className="inline-block px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-md border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm mt-3">
											Choose Cover Image
										</span>
									</label>
								)}
							</div>

							{/* MULTIPLE IMAGES */}
							{mediaData.type.toLowerCase() === "image" && (
								<div className="w-full mt-5">
									<label className="text-base font-medium text-slate-600 block mb-3">
										Gallery Images
									</label>

									{/* Image Grid Preview */}
									{mediaData.images.length > 0 && (
										<div className="grid grid-cols-5 gap-3 mb-4">
											{mediaData.images.map((image, index) => (
												<div key={index} className="relative w-full">
													<img
														src={getImagePreviewUrl(image)}
														alt={`Preview ${index + 1}`}
														className="w-full h-24 object-cover rounded-md border border-slate-300"
													/>

													<div className="flex gap-1 absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-b-md items-center">
														{(edit || newItem) && (
															<button
																type="button"
																onClick={() => handleDeleteImage(index)}
																className=" bg-pink-500 text-white rounded-full p-1.5 hover:bg-pink-600 transition-all shadow-md z-10">
																<IoMdClose size="0.875rem" />
															</button>
														)}
														<div className="">
															{typeof image === "string" ? "Existing" : "New"}
														</div>
													</div>
												</div>
											))}
										</div>
									)}

									{/* Upload Input */}
									{(edit || newItem) && (
										<div className="flex items-center gap-3">
											<label className="cursor-pointer">
												<input
													type="file"
													multiple
													onChange={handleImagesUpload}
													accept="image/*"
													className="hidden"
													id="gallery-upload"
												/>
												<span className="inline-block px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-md border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm">
													Choose Files
												</span>
											</label>
											<span className="text-xs text-slate-500">
												{mediaData.images.length} image
												{mediaData.images.length !== 1 ? "s" : ""} selected
											</span>
										</div>
									)}
								</div>
							)}

							{(edit || newItem) && (
								<button
									type="submit"
									disabled={creating || updating}
									className="mt-5 rounded-md bg-pink-500 text-white text-xs px-4 py-2 hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
									{creating || updating
										? "Loading..."
										: newItem
											? "Add Media"
											: "Update Media"}
								</button>
							)}
						</form>
					)}
				</div>
			</Modal>

			<ToastContainer />
		</>
	);
};

export default MediaModal;
