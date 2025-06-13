import Modal from "components/Modal";
import React, { useState } from "react";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import { BiSolidImageAdd } from "react-icons/bi";
import PrimaryInput from "./inputs/PrimaryInput";
import Placeholder from "components/Placeholder";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useMutation, useQueryClient, useQuery } from "react-query";
import {
	createChapterLead,
	getAChapterLead,
	updateChapterLead,
} from "services";
import ChapterSocialMedia from "./inputs/ChapterSocialMedia";

const ChapterLeadsModal = ({
	newItem,
	chapterId,
	isOpen,
	handleCloseModal,
	toast,
	selectedId,
}) => {
	const queryClient = useQueryClient();
	const [edit, setEdit] = useState(false);
	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">
					{!newItem ? "Update Lead Details" : "Create Chapter Lead"}
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
	const [newLead, setNewLead] = useState({
		name: "",
		linkKey: "",
		linkUrl: "",
		role: "",
		image: "",
	});
	const [socialLinks, setSocialLinks] = useState({});
	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;

	const { data: chapterLead } = useQuery(
		["chapter-lead", selectedId],
		() => getAChapterLead(selectedId),

		{
			onSuccess: (data) => {
				console.log(data);

				setNewLead({
					name: data.name,
					role: data.role || "",
					image: data.image || "",
				});

				setSocialLinks(data.socialMediaLinks || {});
			},
			enabled: !!selectedId,
		}
	);

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		setNewLead((prev) => ({ ...prev, [name]: files ? files[0] : value }));
	};

	const { mutate: createNewLead, isLoading: creating } = useMutation(
		createChapterLead,
		{
			onSuccess: () => {
				setNewLead({
					name: "",
					linkKey: "",
					linkUrl: "",
					role: "",
					image: "",
				});
				toast.success("Lead Created Successfully");
				queryClient.invalidateQueries(["chapter-leads"]);
				handleCloseModal();
			},
			onError: () => {
				toast.error("Could not create Lead");
			},
		}
	);

	const { mutate: updateLead, isLoading: updating } = useMutation(
		updateChapterLead,
		{
			onSuccess: () => {
				toast.success("Lead updated Successfully");
				queryClient.invalidateQueries(["chapter-leads"]);
				handleCloseModal();
			},
			onError: () => {
				toast.error("Could not create Lead");
			},
		}
	);

	const updateChapterLeadDetails = async () => {
		const updatedChapter = {
			...newLead,
			socialMediaLinks: newLead.socialLinks,
		};

		const updatedFields = new FormData();

		for (const [key, value] of Object.entries(updatedChapter)) {
			if (key === "socialMediaLinks" && typeof value === "object") {
				updatedFields.append(key, JSON.stringify(value));
				// updatedFields.append(key, value);
			} else if (updatedChapter[key] !== chapterLead[key]) {
				updatedFields.append(key, value);
			}
		}

		updateLead({ id: selectedId, data: updatedFields });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { name, role, image } = newLead;

		const formData = new FormData();

		formData.append("name", name);
		formData.append("socialMediaLinks", JSON.stringify(socialLinks));
		formData.append("image", image);
		formData.append("chapterId", chapterId);
		formData.append("role", role);

		newItem ? createNewLead(formData) : await updateChapterLeadDetails();
	};
	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={handleCloseModal}
				header={header}
				customHeight={true}
				className="!max-w-3xl">
				<form className="w-full px-4 md:px-8" onSubmit={handleSubmit}>
					<div className="flex flex-col  w-full gap-y-2">
						<div className="self-center relative">
							<input
								required
								className="hidden"
								name="image"
								type="file"
								id="fileInput"
								onChange={handleChange}
								disabled={!edit && !newItem}
							/>
							<label
								htmlFor="fileInput"
								className="flex items-center justify-center bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 text-xs border">
								{newLead.image ? (
									<img
										className="rounded-full w-full max-w-200-px object-cover"
										src={
											newLead.image
												? typeof newLead.image === "string"
													? newLead.image
													: URL.createObjectURL(newLead.image)
												: ""
										}
										alt="event-pic"
										style={{ height: "200px", objectFit: "cover" }}
									/>
								) : (
									<Placeholder name="image" />
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
						<PrimaryInput
							label="Name"
							newItem={newItem}
							name="name"
							handleInputChange={handleChange}
							value={newLead.name}
							edit={edit}
						/>
						<PrimaryInput
							label="Role"
							newItem={newItem}
							name="role"
							handleInputChange={handleChange}
							value={newLead.role}
							edit={edit}
						/>

						<ChapterSocialMedia
							inputClass={inputClass}
							setSocialLinks={setSocialLinks}
							linkKey={newLead.linkKey}
							linkUrl={newLead.linkUrl}
							socialLinks={socialLinks}
							handleInputChange={handleChange}
							edit={edit}
							newItem={newItem}
						/>
					</div>
					<div className="my-4 w-full flex">
						{/* <button
                        className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ml-auto"
                        onClick={handleSubmit}>
                        {creating || isCreating ? (
                          <AiOutlineLoading3Quarters className="animate-spin" />
                        ) : (
                          "SUBMIT"
                        )}
                      </button> */}
						<button
							className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ml-auto"
							onClick={handleSubmit}>
							{creating ? (
								<AiOutlineLoading3Quarters className="animate-spin" />
							) : (
								"SUBMIT"
							)}
						</button>
					</div>
				</form>
			</Modal>
		</>
	);
};

export default ChapterLeadsModal;
