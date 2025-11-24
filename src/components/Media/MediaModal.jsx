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

	// const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
	// 	edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	// } w-full ease-linear transition-all duration-150 basis-9/12`;

	// // --------------------------
	// // MAIN FORM STATE
	// // --------------------------

	// const [mediaData, setMediaData] = useState({
	// 	title: "",
	// 	description: "",
	// 	type: "",
	// 	author: "",
	// 	tag: "",
	// 	link: "",
	// 	date: "",
	// 	coverImage: null,
	// 	images: [],
	// 	imageUrls: [],
	// 	subcontent: [],
	// });

	// const { data, isLoading } = useQuery(["media", id], () => getAMedia(id), {
	// 	enabled: !newItem && !!id,
	// 	onSuccess: (data) => {
	// 		setMediaData({
	// 			title: data.title,
	// 			description: data.description,
	// 			type: data.type,
	// 			author: data.author,
	// 			tag: data.tag,
	// 			link: data.link || data.videoLink || data.blogLink || "",
	// 			date: data.dateCreated ? data.dateCreated.split("T")[0] : "",
	// 			coverImage: data.coverImage,
	// 			images: data.images || [],
	// 			subcontent: data.subcontent || [],
	// 		});
	// 	},
	// });

	// // --------------------------
	// // HANDLE MAIN FORM INPUT
	// // --------------------------
	// const handleInputChange = (e) => {
	// 	const { name, value } = e.target;
	// 	setMediaData((prev) => ({ ...prev, [name]: value }));
	// };

	// // --------------------------
	// // HANDLE COVER IMAGE (SINGLE)
	// // --------------------------
	// const handleCoverImageUpload = (e) => {
	// 	const file = e.target.files[0];
	// 	setMediaData((prev) => ({ ...prev, coverImage: file }));
	// };

	// // --------------------------
	// // HANDLE MULTIPLE IMAGES
	// // --------------------------
	// const handleImagesUpload = (e) => {
	// 	const files = [...e.target.files];
	// 	setMediaData((prev) => ({ ...prev, images: files }));
	// };

	// // --------------------------
	// // SUBCONTENT
	// // --------------------------
	// const [addSubContent, setAddSubContent] = useState(false);

	// const addNewSubcontent = (item) => {
	// 	setMediaData((prev) => ({
	// 		...prev,
	// 		subcontent: [...prev.subcontent, item],
	// 	}));
	// };
	// const queryClient = useQueryClient();

	// const { mutate: createNewMedia, isLoading: creating } = useMutation(
	// 	createMedia,
	// 	{
	// 		onSuccess: () => {
	// 			toast.success("Media created successfully");
	// 			setMediaData({
	// 				title: "",
	// 				description: "",
	// 				type: "",
	// 				author: "",
	// 				tag: "",
	// 				link: "",
	// 				date: "",
	// 				coverImage: null,
	// 				images: [],
	// 				subcontent: [],
	// 			});
	// 			queryClient.invalidateQueries({ queryKey: ["media"] });
	// 			handleModal();
	// 		},
	// 		onError: () => {
	// 			toast.error("Error Adding Data");
	// 			handleModal();
	// 		},
	// 	}
	// );

	// const { mutateAsync: updateMedia, isLoading: updating } = useMutation(
	// 	editMedia,
	// 	{
	// 		onSuccess: () => {
	// 			queryClient.invalidateQueries({ queryKey: ["media"] });
	// 			queryClient.invalidateQueries({ queryKey: ["media"] });
	// 			toast.success("Updated media successfully");
	// 			handleModal();
	// 		},
	// 		onError: () => {
	// 			toast.error("Error updating media");
	// 			handleModal();
	// 		},
	// 	}
	// );

	// const updateMediaDetails = () => {
	// 	const updatedFields = new FormData();

	// 	for (const [key, value] of Object.entries(mediaData)) {
	// 		const oldValue = data[key];

	// 		// Cover image: only append if it's a new File
	// 		if (key === "coverImage") {
	// 			if (value instanceof File) {
	// 				updatedFields.append("coverImage", value);
	// 			}
	// 			continue;
	// 		}

	// 		// Multiple images: only append new files
	// 		if (key === "images") {
	// 			const newFiles = value.filter((v) => v instanceof File);
	// 			newFiles.forEach((file) => updatedFields.append("images", file));
	// 			continue;
	// 		}

	// 		// Subcontent (must be JSON)
	// 		if (key === "subcontent") {
	// 			if (JSON.stringify(value) !== JSON.stringify(oldValue)) {
	// 				updatedFields.append("subcontent", JSON.stringify(value));
	// 			}
	// 			continue;
	// 		}

	// 		// Normal fields
	// 		if (value !== oldValue) {
	// 			updatedFields.append(key, value);
	// 		}
	// 	}

	// 	updateMedia({ id, data: updatedFields });
	// };

	// const handleSubmit = (e) => {
	// 	e.preventDefault();

	// 	if (!mediaData.title || !mediaData.description || !mediaData.type) {
	// 		toast.error("Please fill all fields");
	// 		return;
	// 	}

	// 	const {
	// 		title,
	// 		description,
	// 		type,
	// 		link,
	// 		author,
	// 		tag,
	// 		date,
	// 		images,
	// 		coverImage,
	// 		subcontent,
	// 	} = mediaData;

	// 	// Convert date safely
	// 	let formattedDate = "";
	// 	if (date) {
	// 		formattedDate = new Date(date).toISOString().split("T")[0];
	// 	}

	// 	const formData = new FormData();
	// 	formData.append("title", title);
	// 	formData.append("description", description);
	// 	formData.append("type", type);
	// 	formData.append("link", link);
	// 	formData.append("author", author);
	// 	formData.append("tag", tag);
	// 	formData.append("dateCreated", formattedDate);

	// 	// Append single cover image
	// 	if (coverImage) {
	// 		formData.append("coverImage", coverImage);
	// 	}

	// 	// Append multiple images
	// 	images.forEach((img) => {
	// 		formData.append("images", img);
	// 	});

	// 	// Append subcontent
	// 	// formData.append("subcontent", subcontent || []);

	// 	newItem ? createNewMedia(formData) : updateMediaDetails();
	// };

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
		subcontent: [],
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
				subcontent: data.subcontent || [],
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

	// --------------------------
	// SUBCONTENT
	// --------------------------
	const [addSubContent, setAddSubContent] = useState(false);

	const addNewSubcontent = (item) => {
		setMediaData((prev) => ({
			...prev,
			subcontent: [...prev.subcontent, item],
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
					subcontent: [],
				});
				queryClient.invalidateQueries({ queryKey: ["media"] });
				handleModal();
			},
			onError: () => {
				toast.error("Error Adding Data");
				handleModal();
			},
		}
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
		}
	);

	// ---------------------------------------------------------------
	// FIXED: UPDATE MEDIA — SEND BOTH OLD IMAGE URLs + NEW FILES
	// ---------------------------------------------------------------
	const updateMediaDetails = () => {
		const updatedFields = new FormData();

		for (const [key, value] of Object.entries(mediaData)) {
			const oldValue = data[key];

			// COVER IMAGE
			if (key === "coverImage") {
				if (value instanceof File) {
					updatedFields.append("coverImage", value);
				}
				continue;
			}

			// IMAGES: separate old URLs from new Files
			if (key === "images") {
				const newFiles = [];
				const existingUrls = [];

				value.forEach((item) => {
					if (item instanceof File) newFiles.push(item);
					else existingUrls.push(item);
				});

				// append new files
				newFiles.forEach((file) => updatedFields.append("images", file));

				// append existing URLs for backend to keep them
				updatedFields.append("existingImages", JSON.stringify(existingUrls));
				continue;
			}

			// SUBCONTENT
			if (key === "subcontent") {
				if (JSON.stringify(value) !== JSON.stringify(oldValue)) {
					updatedFields.append("subcontent", JSON.stringify(value));
				}
				continue;
			}

			// BASIC FIELDS
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
									{/* SUB CONTENT CHECKBOX */}
									<div className="w-full mt-5 flex items-center gap-3">
										<input
											type="checkbox"
											onChange={(e) => setAddSubContent(e.target.checked)}
										/>
										<label className="text-sm text-slate-600">
											Add Sub-content
										</label>
									</div>
								</>
							)}

							{/* SUB CONTENT COMPONENT */}
							{mediaData.type.toLowerCase() === "image" && addSubContent && (
								<SubContentComponent
									edit={edit}
									newItem={newItem}
									inputClass={inputClass}
									addNewSubcontent={addNewSubcontent}
								/>
							)}

							{/* RENDER SUBCONTENTS */}
							{mediaData.subcontent.length > 0 && (
								<div className="w-full mt-6 border p-4 rounded-md bg-slate-50">
									<h2 className="text-slate-700 font-semibold mb-3">
										Sub-contents
									</h2>

									<div className="flex flex-col gap-3">
										{mediaData.subcontent.map((item, idx) => (
											<div
												key={idx}
												className="p-3 rounded-md border bg-white text-sm">
												<p className="font-semibold text-slate-700">
													{item.title}
												</p>

												{item.images?.length > 0 && (
													<p className="text-xs mt-1 text-slate-500">
														{item.images.length} image(s) added
													</p>
												)}
											</div>
										))}
									</div>
								</div>
							)}

							<button className="mt-5 rounded-md bg-pink-500 text-white text-xs  px-4 py-2">
								{newItem ? "Add" : "Update"}
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
