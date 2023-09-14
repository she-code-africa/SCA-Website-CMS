import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
	getSchoolProgram,
	createSchoolProgram,
	editSchoolProgram,
	getSchools,
} from "services";
import { useParams } from "react-router";
import { paths } from "utils";
import Loader from "components/Loader";

const SPForm = ({ newItem }) => {
	const initialValue = {
		title: "",
		image: "",
		briefContent: "",
		cohort: "",
		extendedContent: "",
		school: "",
	};
	const queryClient = useQueryClient();
	const [schoolProgram, setSchoolProgram] = useState(initialValue);
	const { title, image, briefContent, cohort, extendedContent, school } =
		schoolProgram;
	const [schools, setSchools] = useState([]);

	const { id } = useParams();
	const { data } = useQuery(["school-program", id], () => getSchoolProgram(id));

	const { isLoading } = useQuery("schools", getSchools, {
		onSuccess: (data) => {
			setSchools(data);
		},
	});

	const { mutate: addSchoolProgram } = useMutation(createSchoolProgram, {
		onSuccess: () => {
			setSchoolProgram(initialValue);
		},
		onError: () => {
			console.log("error");
		},
	});

	const editMutation = useMutation(editSchoolProgram, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["school-program"] });
		},
		onError: () => {
			console.log("error");
		},
	});

	const updateSchoolProgram = async () => {
		// Compare the current schoolProgram state with the fetched data to identify updated fields
		const updatedFields = new FormData();
		for (const [key, value] of Object.entries(schoolProgram)) {
			if (schoolProgram[key] !== data[key]) {
				updatedFields.append(key, value);
			}
		}

		await editMutation.mutateAsync({ id, data: updatedFields });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("title", title);
		formData.append("briefContent", briefContent);
		formData.append("image", image);
		formData.append("school", school);
		formData.append("extendedContent", extendedContent);
		formData.append("cohort", cohort);
		newItem ? addSchoolProgram(formData) : updateSchoolProgram();
	};

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			console.log(name);
			setSchoolProgram((prevSchoolProgram) => ({
				...prevSchoolProgram,
				[name]: value,
			}));
		},
		[setSchoolProgram]
	);

	const handleOnChange = (e) => {
		setSchoolProgram((prev) => ({
			...prev,
			image: e.target.files[0],
		}));
	};

	useEffect(() => {
		data && setSchoolProgram(data);
	}, [data]);

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-100 border-0 pb-10 self-start">
					<div className="rounded-t bg-white mb-0 px-6 py-6">
						<div className="text-center flex justify-between">
							<Link to={paths.academy}>
								<i className="fas fa-arrow-left"></i> Back
							</Link>
						</div>
					</div>
					<div className="flex-auto px-4 lg:px-10 py-10 pt-0">
						<form onSubmit={handleSubmit}>
							<h6 className="text-slate-400 text-sm mt-3 mb-6 font-bold uppercase">
								School Program
							</h6>
							<div className="flex flex-wrap">
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="title">
											Title
										</label>
										<input
											type="text"
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="title"
											value={title}
											onChange={handleInputChange}
										/>
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="school">
											School
										</label>

										<select
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="school"
											value={school}
											onChange={handleInputChange}>
											<option value="">School</option>
											{schools.map((type) => (
												<option
													value={type._id}
													className="my-2"
													key={type._id}
													name="school">
													{type.name}
												</option>
											))}
										</select>
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="cohort">
											Cohort
										</label>
										<input
											type="text"
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="cohort"
											value={cohort}
											onChange={handleInputChange}
										/>
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="briefContent">
											Brief Content
										</label>
										<input
											type="text"
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="briefContent"
											value={briefContent}
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
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="image"
											type="file"
											onChange={handleOnChange}
										/>

										{image && <img src={image} alt={`${title}`} />}
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="extendedContent">
											Extended Content
										</label>
										<textarea
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="extendedContent"
											value={extendedContent}
											onChange={handleInputChange}
										/>
									</div>
								</div>

								<div className="my-4">
									<button
										type="submit"
										className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">
										SUBMIT
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default SPForm;
