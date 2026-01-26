import Modal from "components/Modal";
import React, { useState } from "react";
import Tooltip from "components/Tooltip";
import { GrView } from "react-icons/gr";
import { MdOutlineModeEditOutline } from "react-icons/md";
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
		images: [], // mix of old urls + new Files
	});

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
			});
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
		setMediaData((prev) => ({ ...prev, coverImage: file }));
	};

	// ----------------------------------------------------
	// FIXED: HANDLE MULTIPLE IMAGES (RETAIN OLD + ADD NEW FILES)
	// ----------------------------------------------------
	const handleImagesUpload = (e) => {
		const uploadedFiles = [...e.target.files];

		setMediaData((prev) => ({
			...prev,
			images: [...prev.images, ...uploadedFiles], // keep old urls and add new Files
		}));
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
				});
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
	// FIXED: UPDATE MEDIA — SEND BOTH OLD IMAGE URLs + NEW FILES
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

			// IMAGES - only if new files were added
			if (key === "images") {
				const newFiles = value.filter((item) => item instanceof File);

				if (newFiles.length > 0) {
					newFiles.forEach((file) => {
						updatedFields.append("images", file);
					});
				}
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

		if (coverImage) {
			formData.append("coverImage", coverImage);
		}

		images.forEach((img) => {
			if (img instanceof File) formData.append("images", img);
		});
		// formData.append("subcontent", subcontent || []);

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
										name="tag" // FIXED
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

							<div className="w-full mt-5">
								<label className="text-base font-medium text-slate-600">
									Textarea
								</label>
								<textarea
									required
									className={`${inputClass} mt-3`}
									name="description"
									placeholder="Enter a valid description"
									value={mediaData.description}
									onChange={handleInputChange}
									disabled={!edit && !newItem}></textarea>
							</div>

							{/* COVER IMAGE */}
							<div className="w-full mt-5 flex items-center gap-3">
								<label className="text-base font-medium text-slate-600">
									Cover Image
								</label>
								<input type="file" onChange={handleCoverImageUpload} />
							</div>

							{/* MULTIPLE IMAGES */}
							{mediaData.type.toLowerCase() === "image" && (
								<>
									<div className="w-full mt-5 flex items-center gap-3">
										<label className="text-base font-medium text-slate-600">
											Upload images
										</label>
										<input type="file" multiple onChange={handleImagesUpload} />
									</div>
								</>
							)}

							<button className="mt-5 rounded-md bg-pink-500 text-white text-xs  px-4 py-2">
								{creating || updating
									? "Loading..."
									: newItem
										? "Add"
										: "Update"}
							</button>
						</form>
					)}
				</div>
			</Modal>

			<ToastContainer />
		</>
	);
};

export default MediaModal;
