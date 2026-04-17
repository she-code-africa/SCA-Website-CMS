import React, { useState, useEffect } from "react";
import { createOutreach, getOutreach, updateOutreach } from "services";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";

const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring !py-3 w-full ease-linear transition-all duration-150`;
const labelClass = "block uppercase text-slate-600 text-xs font-bold mb-1";

const defaultForm = {
	state: "",
	description: "",
	outreachDate: "",
	galleryLink: "",
};

const OutreachModal = ({
	isOpen,
	handleModal,
	handleDeleteModal,
	id,
	newItem,
}) => {
	const queryClient = useQueryClient();
	const [formValues, setFormValues] = useState(defaultForm);
	const [editMode, setEditMode] = useState(false);
	const [imagePreviews, setImagePreviews] = useState([]);
	// Holds actual File objects for new uploads
	const [newImageFiles, setNewImageFiles] = useState([]);
	// Holds existing image URLs from the server (edit mode)
	const [existingImages, setExistingImages] = useState([]);

	const { isLoading } = useQuery(["outreach", id], () => getOutreach(id), {
		enabled: !!id && !newItem,
		onSuccess: ({ data }) => {
			console.log(data);
			const d = data.data;
			setFormValues({
				state: d.state || "",
				description: d.description || "",
				outreachDate: d.outreachDate ? d.outreachDate.substring(0, 10) : "",
				galleryLink: d.galleryLink || "",
			});
			setExistingImages(d.images || []);
			setImagePreviews(d.images || []);
			setNewImageFiles([]);
		},
	});

	useEffect(() => {
		if (newItem) {
			setFormValues(defaultForm);
			setImagePreviews([]);
			setNewImageFiles([]);
			setExistingImages([]);
			setEditMode(true);
		}
	}, [newItem]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormValues((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);
		files.forEach((file) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreviews((prev) => [...prev, reader.result]);
			};
			reader.readAsDataURL(file);
		});
		setNewImageFiles((prev) => [...prev, ...files]);
	};

	const removeImage = (index) => {
		const isExisting = index < existingImages.length;

		if (isExisting) {
			setExistingImages((prev) => prev.filter((_, i) => i !== index));
		} else {
			const newIndex = index - existingImages.length;
			setNewImageFiles((prev) => prev.filter((_, i) => i !== newIndex));
		}

		setImagePreviews((prev) => prev.filter((_, i) => i !== index));
	};

	const { mutate: addOutreach, isLoading: creating } = useMutation(
		createOutreach,
		{
			onSuccess: () => {
				toast.success("Outreach created successfully");
				queryClient.invalidateQueries(["outreaches"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not create Outreach");
			},
		},
	);

	const { mutate: editOutreach, isLoading: updating } = useMutation(
		updateOutreach,
		{
			onSuccess: () => {
				toast.success("Outreach updated successfully");
				queryClient.invalidateQueries(["outreaches"]);
				queryClient.invalidateQueries(["outreach", id]);
				setEditMode(false);
				handleModal();
			},
			onError: () => {
				toast.error("Could not update Outreach");
			},
		},
	);

	const handleSubmit = () => {
		const formData = new FormData();
		formData.append("state", formValues.state);
		formData.append("description", formValues.description);
		formData.append("outreachDate", formValues.outreachDate);
		formData.append("galleryLink", formValues.galleryLink);

		if (newItem) {
			newImageFiles.forEach((file) => {
				formData.append("images", file);
			});

			addOutreach(formData);
		} else {
			const imagesData = [...existingImages, ...newImageFiles];
			// Append new image files
			imagesData.forEach((file) => {
				formData.append("images", file);
			});

			editOutreach({ outreachId: id, data: formData });
		}
	};

	if (!isOpen) return null;

	const isBusy = creating || updating;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
			<div
				className="bg-white rounded-lg shadow-xl w-full mx-4 max-h-[90vh] overflow-y-auto"
				style={{ maxWidth: "750px" }}>
				{/* Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
					<h5 className="font-medium text-lg text-slate-700">
						{newItem ? "Add Outreach" : "Outreach Details"}
					</h5>
					<div className="flex items-center gap-4">
						{!newItem && (
							<>
								<button
									onClick={() => setEditMode((prev) => !prev)}
									className="text-xs text-pink-500 font-semibold hover:text-pink-700 transition-colors duration-150">
									{editMode ? "Cancel Edit" : "Edit"}
								</button>
								<button
									onClick={handleDeleteModal}
									className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-semibold transition-colors duration-150">
									<FaTrashAlt />
									Delete
								</button>
							</>
						)}
						<button
							onClick={handleModal}
							className="text-slate-400 hover:text-slate-600 text-lg font-bold transition-colors duration-150">
							✕
						</button>
					</div>
				</div>

				{/* Body */}
				{isLoading ? (
					<div className="px-6 py-10 text-center text-slate-500 text-sm">
						Loading...
					</div>
				) : (
					<div className="px-6 py-5 flex flex-col gap-4">
						{/* State */}
						<div className="relative w-full">
							<label className={labelClass}>State *</label>
							<input
								type="text"
								name="state"
								placeholder="Eg. Lagos"
								value={formValues.state}
								onChange={handleChange}
								disabled={!editMode}
								className={`${inputClass} ${!editMode ? "opacity-60 cursor-not-allowed" : ""}`}
							/>
						</div>

						{/* Description */}
						<div className="relative w-full">
							<label className={labelClass}>Description *</label>
							<textarea
								name="description"
								placeholder="Enter outreach description"
								value={formValues.description}
								onChange={handleChange}
								disabled={!editMode}
								rows={3}
								className={`${inputClass} ${!editMode ? "opacity-60 cursor-not-allowed" : ""}`}
							/>
						</div>

						{/* Outreach Date */}
						<div className="relative w-full">
							<label className={labelClass}>Outreach Date *</label>
							<input
								type="date"
								name="outreachDate"
								value={formValues.outreachDate}
								onChange={handleChange}
								disabled={!editMode}
								className={`${inputClass} ${!editMode ? "opacity-60 cursor-not-allowed" : ""}`}
							/>
						</div>

						{/* Gallery Link */}
						<div className="relative w-full">
							<label className={labelClass}>Gallery Link</label>
							<input
								type="url"
								name="galleryLink"
								placeholder="https://drive.google.com/..."
								value={formValues.galleryLink}
								onChange={handleChange}
								disabled={!editMode}
								className={`${inputClass} ${!editMode ? "opacity-60 cursor-not-allowed" : ""}`}
							/>
						</div>

						{/* Images */}
						<div className="relative w-full">
							<label className={labelClass}>Images</label>

							{editMode && (
								<input
									type="file"
									accept="image/*"
									multiple
									onChange={handleImageUpload}
									className="mt-1 w-full text-sm text-slate-600"
								/>
							)}

							{imagePreviews.length > 0 && (
								<div className="mt-3 flex flex-wrap gap-2">
									{imagePreviews.map((src, i) => (
										<div key={i} className="relative">
											<img
												src={src}
												alt={`preview-${i}`}
												className="h-16 w-20 object-cover rounded shadow"
											/>
											{editMode && (
												<button
													type="button"
													onClick={() => removeImage(i)}
													className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs leading-none">
													✕
												</button>
											)}
										</div>
									))}
								</div>
							)}

							{imagePreviews.length === 0 && !editMode && (
								<p className="text-slate-400 text-xs mt-1">
									No images uploaded.
								</p>
							)}
						</div>

						{/* Submit */}
						{editMode && (
							<div className="flex justify-end mt-2">
								<button
									type="button"
									onClick={handleSubmit}
									disabled={isBusy}
									className="px-6 py-3 bg-pink-500 hover:bg-pink-800 text-white text-sm font-semibold rounded shadow transition-all duration-150 ease-linear disabled:opacity-60 disabled:cursor-not-allowed">
									{isBusy
										? "Saving..."
										: newItem
											? "Create Outreach"
											: "Save Changes"}
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default OutreachModal;
