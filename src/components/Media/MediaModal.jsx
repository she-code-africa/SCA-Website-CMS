import Modal from "components/Modal";
import React, { useState } from "react";
import Tooltip from "components/Tooltip";
import { GrView } from "react-icons/gr";
import { MdOutlineModeEditOutline } from "react-icons/md";
import Loader from "components/Loader";
import SubContentComponent from "./SubContentComponent";

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

	const isLoading = false;

	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;

	// --------------------------
	// MAIN FORM STATE
	// --------------------------
	const [mediaData, setMediaData] = useState({
		title: "",
		description: "",
		type: "",
		author: "",
		tag: "",
		url: "",
		date: "",
		coverImage: null,
		images: [],
		subcontents: [],
	});

	// --------------------------
	// HANDLE MAIN FORM INPUT
	// --------------------------
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setMediaData((prev) => ({ ...prev, [name]: value }));
	};

	// --------------------------
	// HANDLE COVER IMAGE (SINGLE)
	// --------------------------
	const handleCoverImageUpload = (e) => {
		const file = e.target.files[0];
		setMediaData((prev) => ({ ...prev, coverImage: file }));
	};

	// --------------------------
	// HANDLE MULTIPLE IMAGES
	// --------------------------
	const handleImagesUpload = (e) => {
		const files = [...e.target.files];
		setMediaData((prev) => ({ ...prev, images: files }));
	};

	// --------------------------
	// SUBCONTENT
	// --------------------------
	const [addSubContent, setAddSubContent] = useState(false);

	const addNewSubcontent = (item) => {
		setMediaData((prev) => ({
			...prev,
			subcontents: [...prev.subcontents, item],
		}));
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
						<form className="w-full px-3">
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
										Label
									</label>
									<input
										required
										type="text"
										className={`${inputClass} mt-3`}
										name="tag" // FIXED
										placeholder="Enter media label"
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
										name="url"
										placeholder="Enter a valid url"
										value={mediaData.url}
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
								<div className="w-full mt-5 flex items-center gap-3">
									<label className="text-base font-medium text-slate-600">
										Upload images
									</label>
									<input type="file" multiple onChange={handleImagesUpload} />
								</div>
							)}

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

							{/* SUB CONTENT COMPONENT */}
							{addSubContent && (
								<SubContentComponent
									edit={edit}
									newItem={newItem}
									inputClass={inputClass}
									addNewSubcontent={addNewSubcontent}
								/>
							)}

							{/* RENDER SUBCONTENTS */}
							{mediaData.subcontents.length > 0 && (
								<div className="w-full mt-6 border p-4 rounded-md bg-slate-50">
									<h2 className="text-slate-700 font-semibold mb-3">
										Sub-contents
									</h2>

									<div className="flex flex-col gap-3">
										{mediaData.subcontents.map((item, idx) => (
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
		</>
	);
};

export default MediaModal;
