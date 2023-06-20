import React, { useState, useCallback, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { editInitiative, createInitiative } from "services";
import { useParams } from "react-router-dom";
import { getInitiative } from "services";
import Loader from "components/Loader";

const ScholarshipForm = ({ newScholarship }) => {
	const queryClient = useQueryClient();
	const initialScholarshipValue = {
		name: "",
		description: "",
		link: "",
	};
	const [scholarship, setScholarship] = useState(initialScholarshipValue);
	const { name, description, link } = scholarship;
	const { id } = useParams();
	const { data, isLoading: fetching } = useQuery(["initiative", id], () =>
		getInitiative(id)
	);

	useEffect(() => {
		if (data) {
			setScholarship(data);
		}
	}, [data]);
	const { mutate: addInitiatives, isLoading: creating } = useMutation(
		createInitiative,
		{
			onSuccess: () => {
				setScholarship(initialScholarshipValue);
			},
			onError: () => {
				console.log("error");
			},
		}
	);
	const { mutate: updateInitiatives, isLoading: updating } = useMutation(
		editInitiative,
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["initiative"]);
			},
			onError: () => {
				console.log("error");
			},
		}
	);
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setScholarship((prevScholarship) => ({
			...prevScholarship,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		newScholarship
			? addInitiatives(scholarship)
			: updateInitiatives({ id, data: scholarship });
	};

	return (
		<>
			{fetching || creating || updating ? (
				<Loader />
			) : (
				<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-100 border-0">
					<div className="rounded-t bg-white mb-0 px-6 py-6">
						<div className="text-center flex justify-between">
							<h6 className="text-slate-700 text-xl font-bold">Initiative</h6>
						</div>
					</div>
					<div className="flex-auto px-4 lg:px-10 py-10 pt-0">
						<form onSubmit={handleSubmit}>
							<h6 className="text-slate-400 text-sm mt-3 mb-6 font-bold uppercase">
								Scholarship Details
							</h6>
							<div className="flex flex-wrap">
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="name">
											Name
										</label>
										<input
											type="text"
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="name"
											value={name}
											onChange={handleInputChange}
										/>
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="link">
											Link
										</label>
										<input
											type="url"
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="link"
											value={link}
											onChange={handleInputChange}
										/>
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="description">
											Description
										</label>
										<textarea
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="description"
											value={description}
											onChange={handleInputChange}
										/>
									</div>
								</div>
							</div>

							<div className="my-4">
								<button
									type="submit"
									className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">
									SAVE
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default ScholarshipForm;
