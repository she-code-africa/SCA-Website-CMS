import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { paths } from "utils";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getTeamCategories, addTeamMember } from "services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTeamMember } from "services";
import { useParams } from "react-router";
import { editTeamMember } from "services";

const TeamForm = ({ newItem }) => {
	const intial = {
		name: "",
		role: "",
		team: "",
		image: "",
		bio: "",
	};
	const [member, setMember] = useState(intial);
	const queryClient = useQueryClient();

	const { name, role, image, bio, team } = member;
	const [categories, setCategories] = useState([]);
	const { id, catId } = useParams();

	const { data } = useQuery(
		["team-member", id],
		() => getTeamMember(catId, id),
		{
			onSuccess: (data) => {
				setMember(data);
			},
		}
	);

	const mutation = useMutation(addTeamMember, {
		onSuccess: () => {
			toast.success("Member added successfully");
			setMember(intial);
		},
		onError: () => {
			toast.error("Error Adding Data");
		},
	});

	useQuery("teamCategories", getTeamCategories, {
		onSuccess: (data) => {
			setCategories(data);
		},
	});

	const handleOnChange = (e) => {
		const selectedImage = e.target.files[0];
		if (selectedImage) {
			// Create a temporary URL for the selected image
			const imageUrl = URL.createObjectURL(selectedImage);

			// Set the image URL in the component state
			setMember((prev) => ({
				...prev,
				image: imageUrl,
			}));
		}
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
			newItem ? mutation.mutate(formData) : updateTeamMember();
		}
	};

	const { mutateAsync: editMember } = useMutation(editTeamMember, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["team-member"] });
			toast.success("Updated team member successfully");
		},
		onError: () => {
			toast.error("Error updating team member");
			console.log("error");
		},
	});

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

	const handleCategoryChange = (event) => {
		const categoryId = event.target.value;
		setMember((prevMember) => ({
			...prevMember,
			team: categoryId,
		}));
	};

	return (
		<>
			<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-100 border-0">
				<div className="rounded-t bg-white mb-0 px-6 py-6">
					<div className="text-center flex justify-between">
						<Link to={paths.team}>
							<i className="fas fa-arrow-left"></i> Back
						</Link>
					</div>
				</div>
				<div className="flex-auto px-4 lg:px-6 py-10 pt-0">
					<form>
						<h6 className="text-slate-400 text-sm mt-3 mb-6 font-bold uppercase">
							Team Member Details
						</h6>
						<div className="flex flex-wrap">
							<div className="w-full lg:w-6/12 px-2">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600 text-xs font-bold mb-2"
										htmlFor="name">
										Name
									</label>
									<input
										required
										type="text"
										className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
										name="name"
										value={name}
										onChange={handleInputChange}
									/>
								</div>
							</div>

							<div className="w-full lg:w-6/12 px-2">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600 text-xs font-bold mb-2"
										htmlFor="team">
										Team
									</label>

									<select
										className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
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
								</div>
							</div>

							<div className="w-full lg:w-6/12 px-2">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600 text-xs font-bold mb-2"
										htmlFor="role">
										Role
									</label>
									<input
										required
										type="text"
										className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
										name="role"
										value={role}
										onChange={handleInputChange}
									/>
								</div>
							</div>
							<div className="w-full lg:w-6/12 px-2">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600 text-xs font-bold mb-2"
										htmlFor="bio">
										Bio
									</label>
									<textarea
										className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
										name="bio"
										value={bio}
										onChange={handleInputChange}
										rows={1}
									/>
								</div>
							</div>
							<div className="w-full lg:w-6/12 px-2">
								<div className="relative w-full ">
									<label
										className="block uppercase text-slate-600 text-xs font-bold mb-2"
										htmlFor="image">
										Image
									</label>
									<input
										required
										className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
										name="image"
										type="file"
										onChange={handleOnChange}
									/>

									{image && (
										<img
											className="w-12 h-12 mt-2"
											src={image}
											alt={`${name}`}
										/>
									)}
								</div>
							</div>
						</div>

						<div className="my-4">
							<button
								className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
								onClick={addMember}>
								SUBMIT
							</button>
						</div>
					</form>
				</div>
			</div>
			<ToastContainer toastStyle={{ backgroundColor: "red" }} />
		</>
	);
};

export default TeamForm;
