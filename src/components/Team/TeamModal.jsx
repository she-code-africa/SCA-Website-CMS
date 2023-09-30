import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
	getTeamCategories,
	addTeamMember,
	getTeamMember,
	editTeamMember,
	publishTeamMember,
	archiveTeamMember,
} from "services";
import Modal from "components/Modal";
import Placeholder from "components/Placeholder";
import { BiSolidImageAdd, BiArchiveIn, BiArchiveOut } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import Loader from "components/Loader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const TeamModal = ({
	isOpen,
	handleModal,
	handleDeleteModal,
	newItem,
	id,
	catId,
}) => {
	const intial = {
		name: "",
		role: "",
		team: "",
		image: "",
		bio: "",
		isLeader: false,
	};
	const [member, setMember] = useState(intial);
	const queryClient = useQueryClient();
	const { name, role, image, bio, team, state, isLeader } = member;
	const [categories, setCategories] = useState([]);
	const [edit, setEdit] = useState(false);
	const [loading, setLoading] = useState(false);
	const inputClass = `px-3 py-0 placeholder-slate-300 text-slate-600 bg-white text-sm ${
		edit || newItem
			? "shadow focus:outline-none !py-3 border border-[#F5F5F5] rounded-lg"
			: ""
	} w-full ease-linear transition-all duration-150 basis-10/12`;

	const { data, isLoading } = useQuery(
		["team-member", id],
		() => getTeamMember(catId, id),
		{
			onSuccess: (data) => {
				setMember(data);
			},
		}
	);

	const { mutate: createTeamMember, isLoading: creating } = useMutation(
		addTeamMember,
		{
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["team"] });
				toast.success("Member added successfully");
				setMember(intial);
				handleModal();
			},
			onError: () => {
				toast.error("Error Adding Data");
				handleModal();
			},
		}
	);

	useQuery("teamCategories", getTeamCategories, {
		onSuccess: (data) => {
			setCategories(data);
		},
	});

	const handleOnChange = (e) => {
		setMember((prev) => ({
			...prev,
			image: e.target.files[0],
		}));
	};

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setMember((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setMember]
	);

	const addMember = (e) => {
		e.preventDefault();
		if (name === "" || bio === "" || team === "" || image === "") {
			toast.error("Please fill all fields");
		} else {
			const formData = new FormData();
			formData.append("name", name);
			formData.append("bio", bio);
			formData.append("team", team);
			formData.append("role", role);
			formData.append("image", image);
			formData.append("isLeader", isLeader);
			newItem ? createTeamMember(formData) : updateTeamMember();
		}
	};

	const { mutateAsync: editMember, isLoading: updating } = useMutation(
		editTeamMember,
		{
			onSuccess: () => {
				toast.success("Updated team member successfully");
				queryClient.invalidateQueries({ queryKey: ["team-member"] });
				queryClient.invalidateQueries({ queryKey: ["team"] });
				handleModal();
			},
			onError: () => {
				toast.error("Error updating team member");
				console.log("error");
				handleModal();
			},
		}
	);

	const updateTeamMember = async () => {
		// Compare the current member state with the fetched data to identify updated fields
		const updatedFields = new FormData();
		for (const [key, value] of Object.entries(member)) {
			if (member[key] !== data[key]) {
				updatedFields.append(key, value);
			}
		}
		await editMember({ id, catId, data: updatedFields });
	};

	const { mutateAsync: publish } = useMutation(publishTeamMember, {
		onSuccess: () => {
			setLoading(false);
			toast.success("Team Member Published Successfully");
			queryClient.invalidateQueries({ queryKey: ["team-member"] });
			queryClient.invalidateQueries({ queryKey: ["team"] });
		},
		onError: () => {
			setLoading(false);
			toast.error("Error Publishing Team Member");
		},
	});

	const { mutateAsync: archive } = useMutation(archiveTeamMember, {
		onSuccess: () => {
			setLoading(false);
			toast.success("Team Member Archived Successfully");
			queryClient.invalidateQueries({ queryKey: ["team-member"] });
			queryClient.invalidateQueries({ queryKey: ["team"] });
		},
		onError: () => {
			setLoading(false);
			toast.error("Error Archiving Team Member");
		},
	});

	const handleState = async () => {
		setLoading(true);
		state === "published"
			? await archive({ catId: catId, id: id })
			: await publish({ catId: catId, id: id });
	};

	const handleCategoryChange = (event) => {
		const categoryId = event.target.value;
		setMember((prevMember) => ({
			...prevMember,
			team: categoryId,
		}));
	};
	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">Team Member Details</h2>
				{!newItem && (
					<div className="flex items-center gap-3 hover:cursor-pointer">
						<div onClick={handleState}>
							{state &&
								(loading ? (
									<AiOutlineLoading3Quarters className="animate-spin" />
								) : state === "published" ? (
									<Tooltip content="Archive">
										<BiArchiveIn size="1.25rem" />
									</Tooltip>
								) : (
									<Tooltip content="Publish">
										<BiArchiveOut size="1.25rem" />
									</Tooltip>
								))}
						</div>
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
									className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 text-sm border">
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
										<div className="absolute right-2 -bottom-1 z-2 text-slate-600 opacity-90 text-xl">
											<BiSolidImageAdd />
										</div>
									)}
								</label>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block text-slate-600 text-base font-semibold basis-2/12"
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
									className="block text-slate-600 text-base font-semibold basis-2/12"
									htmlFor="team">
									Team
								</label>

								{edit || newItem ? (
									<select
										className={`${inputClass}`}
										value={team._id ? team._id : team}
										name="team"
										onChange={handleCategoryChange}>
										<option value="">Select Team</option>
										{categories.map((category, index) => (
											<option
												value={category._id}
												className="my-2"
												key={index}
												name="category">
												{category.name}
											</option>
										))}
									</select>
								) : (
									<span className={`${inputClass}`}>{team?.name}</span>
								)}
							</div>

							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block text-slate-600 text-base font-semibold basis-2/12"
									htmlFor="role">
									Role
								</label>
								<input
									required
									type="text"
									className={`${inputClass}`}
									name="role"
									value={role}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
								/>
							</div>
							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block text-slate-600 text-base font-semibold basis-2/12 self-start"
									htmlFor="bio">
									Bio
								</label>
								<textarea
									className={`${inputClass}`}
									name="bio"
									value={bio}
									onChange={handleInputChange}
									rows={8}
									disabled={!edit && !newItem}
								/>
							</div>

							<div className="relative w-full mb-3 flex items-center">
								<label
									className="block text-slate-600 text-base font-semibold basis-2/12 self-start"
									htmlFor="isLeader">
									Team Lead
								</label>
								<input
									type="checkbox"
									value={isLeader}
									name="isLeader"
									onChange={(e) =>
										setMember((prevMember) => ({
											...prevMember,
											isLeader: e.target.checked,
										}))
									}
									disabled={!edit && !newItem}
									checked={isLeader}
								/>
							</div>
						</div>

						<div className="my-4 w-full flex justify-end">
							{edit || newItem ? (
								<button
									className={`text-white active:bg-pink-6base font-semibold text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ml-auto ${
										!name && !image && !role && !bio
											? "bg-gray-300 cursor-not-allowed"
											: "bg-pink-500"
									}`}
									onClick={addMember}
									disabled={!name && !image && !role && !bio}>
									{creating || updating ? (
										<AiOutlineLoading3Quarters className="animate-spin" />
									) : (
										"SUBMIT"
									)}
								</button>
							) : (
								id && (
									<button
										className="bg-red-500 text-whibase font-semibold text-sm px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 text-white"
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

export default TeamModal;
