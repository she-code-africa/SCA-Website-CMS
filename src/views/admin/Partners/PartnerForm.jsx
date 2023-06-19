import Loader from "components/Loader";
import React, { useState, useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Link } from "react-router-dom";
import { getPartner } from "services";
import { createPartner, editPartner } from "services";
import { paths } from "utils";
import { useParams } from "react-router";

const AddPartner = ({ newPartner }) => {
	const queryClient = useQueryClient();
	const intial = {
		name: "",
		// type: "",
		// featured: false,
		image: "",
	};
	const [partner, setPartner] = useState(intial);
	const { name, image } = partner;
	const { id } = useParams();
	const { data, isLoading: fetching } = useQuery(["partner", id], () =>
		getPartner(id)
	);
	useEffect(() => {
		if (data) {
			setPartner(data);
		}
	}, [data]);
	const { mutate: addPartner, isLoading: addingPartner } = useMutation(
		createPartner,
		{
			onSuccess: () => {
				setPartner(intial);
			},
			onError: () => {
				console.log("error");
			},
		}
	);

	const { mutateAsync: updatePartner, isLoading: upadtingPartner } =
		useMutation(editPartner, {
			onSuccess: () => {
				queryClient.invalidateQueries(["partner"]);
			},
			onError: () => {
				console.log("error");
			},
		});

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setPartner((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setPartner]
	);

	const handleOnChange = (e) => {
		setPartner((prev) => ({
			...prev,
			image: URL.createObjectURL(e.target.files[0]),
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("name", name);
		// formData.append("image", image);
		newPartner
			? addPartner(formData)
			: await updatePartner({ id, data: formData });
	};

	return (
		<>
			{addingPartner || upadtingPartner || fetching ? (
				<Loader />
			) : (
				<div className="  relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-100 border-0">
					<div className="rounded-t bg-white mb-0 px-6 py-6">
						<div className="text-center flex justify-between">
							<h6 className="text-slate-700 text-xl font-bold">
								Partner/Sponsor
							</h6>

							<Link to={paths.partners}>
								<i class="fas fa-arrow-left"></i> Back
							</Link>
						</div>
					</div>
					<div className="flex-auto px-4 lg:px-10 py-10 pt-0">
						<form onSubmit={handleSubmit}>
							<h6 className="text-slate-400 text-sm mt-3 mb-6 font-bold uppercase">
								Partner/Sponsor Details
							</h6>
							<div className="flex flex-wrap py-10">
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600  font-bold my-2"
											htmlFor="name">
											Company Name
										</label>
										<input
											type="text"
											className="border-1 border-slate-200 p-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full ease-linear transition-all duration-150"
											placeholder=""
											name="name"
											value={name}
											onChange={handleInputChange}
											id="name"
										/>
									</div>
								</div>
								{/* <div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600  font-bold my-2"
										htmlFor=" ">
										Type
									</label>

									<select
										name="type"
										id="type"
										className="border-1 border-slate-200 p-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full ease-linear transition-all duration-150"
										value={type}
										onChange={handleInputChange}>
										<option value="" selected hidden>
											Please select
										</option>
										<option>Partner</option>
										<option>Sponsor</option>
									</select>
								</div>
							</div> */}
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600  font-bold my-2"
											htmlFor=" ">
											Upload Logo(200 x 200px)
										</label>
										<input
											type="file"
											className="border-1 border-slate-200 p-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full ease-linear transition-all duration-150"
											onChange={handleOnChange}
										/>
									</div>
								</div>
								{/* <div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600  font-bold my-2"
										htmlFor="featured">
										Featured?
									</label>
									<input
										type="checkbox"
										checked={featured}
										name="featured"
										value={featured}
										onChange={handleInputChange}
									/>
								</div>
							</div> */}
							</div>

							<div className="my-4">
								<button
									className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
									type="submit">
									SUBMIT
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default AddPartner;
