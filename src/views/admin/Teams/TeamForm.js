import React, { useState, useCallback, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { paths } from "utils";
import { useQuery, useMutation } from "react-query";
import { getTeamCategories, addTeamMember } from "services";
const TeamForm = () => {
	const nav = useHistory();
	const intial = {
		firstname: "",
		lastname: "",
		role: "",
		category: "",
		image: "",
		bio: "",
	};
	const [member, setMember] = useState(intial);
	const { firstname, lastname, role, category, image, bio } = member;
	const [categories, setCategories] = useState([]);
	const mutation = useMutation(addTeamMember);

	const response = useQuery("teamCategories", getTeamCategories);
	useEffect(() => {
		if (response.isSuccess) {
			setCategories(response.data);
		}
		console.log(response);
	}, [response]);

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

	const addMember = useCallback(
		(e) => {
			e.preventDefault();
			mutation.mutate(member);
			if (mutation.isSuccess) {
				setMember(intial);
			} else {
				console.log("error");
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[member]
	);

	return (
		<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-100 border-0">
			<div className="rounded-t bg-white mb-0 px-6 py-6">
				<div className="text-center flex justify-between">
					<h6 className="text-slate-700 text-xl font-bold">SCA Team Form</h6>
					<Link to={paths.team}>
						<i class="fas fa-arrow-left" onClick={() => nav(-1)}></i> Back
					</Link>
				</div>
			</div>
			<div className="flex-auto px-4 lg:px-10 py-10 pt-0">
				<form>
					<h6 className="text-slate-400 text-sm mt-3 mb-6 font-bold uppercase">
						Member Details
					</h6>
					<div className="flex flex-wrap">
						<div className="w-full lg:w-6/12 px-4">
							<div className="relative w-full mb-3">
								<label
									className="block uppercase text-slate-600 text-xs font-bold mb-2"
									htmlFor="firstname">
									First Name
								</label>
								<input
									type="text"
									className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
									name="firstname"
									value={firstname}
									onChange={handleInputChange}
								/>
							</div>
						</div>
						<div className="w-full lg:w-6/12 px-4">
							<div className="relative w-full mb-3">
								<label
									className="block uppercase text-slate-600 text-xs font-bold mb-2"
									htmlFor="lastname">
									Last Name
								</label>
								<input
									type="text"
									className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
									name="lastname"
									value={lastname}
									onChange={handleInputChange}
								/>
							</div>
						</div>

						<div className="w-full lg:w-6/12 px-4">
							<div className="relative w-full mb-3">
								<label
									className="block uppercase text-slate-600 text-xs font-bold mb-2"
									htmlFor="category">
									Category
								</label>

								<select
									className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
									name="category"
									value={category}
									onChange={handleInputChange}>
									<option value="">Select Category</option>
									{categories.map((category, index) => (
										<option
											value={category.id}
											className="my-2"
											key={index}
											name="category">
											{category.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="w-full lg:w-6/12 px-4">
							<div className="relative w-full mb-3">
								<label
									className="block uppercase text-slate-600 text-xs font-bold mb-2"
									htmlFor="role">
									Role
								</label>
								<input
									type="text"
									className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
									name="role"
									value={role}
									onChange={handleInputChange}
								/>
							</div>
						</div>
						<div className="w-full lg:w-6/12 px-4">
							<div className="relative w-full mb-3">
								<label
									className="block uppercase text-slate-600 text-xs font-bold mb-2"
									htmlFor="image">
									Image
								</label>
								<input
									type="text"
									className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
									name="image"
									value={image}
									onChange={handleInputChange}
								/>
							</div>
						</div>
						<div className="w-full   px-4">
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
								/>
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
	);
};

export default TeamForm;
