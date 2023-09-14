import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getCourse, createCourse, editCourse, getSchools } from "services";
import { useParams } from "react-router";
import { paths } from "utils";

const CourseForm = ({ newItem }) => {
	const initialValue = {
		name: "",
		image: "",
		shortDescription: "",
		applicationLink: "",
		school: "",
	};
	const queryClient = useQueryClient();
	const [course, setCourse] = useState(initialValue);
	const { name, image, shortDescription, applicationLink, school } = course;
	const [loading, setLoading] = useState(false);
	const [schools, setSchools] = useState([]);

	const { id } = useParams();
	const { data } = useQuery(["course", id], () => getCourse(id));

	useQuery("schools", getSchools, {
		onSuccess: (data) => {
			setSchools(data);
		},
	});

	const { mutate: addCourse } = useMutation(createCourse, {
		onSuccess: () => {
			setLoading(false);
			setCourse(initialValue);
		},
		onError: () => {
			console.log("error");
			setLoading(false);
		},
	});

	const editMutation = useMutation(editCourse, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["course"] });
			setLoading(false);
		},
		onError: () => {
			console.log("error");
			setLoading(false);
		},
	});

	const updateCourse = async () => {
		if (!data) {
			// Handle the case where data is not available yet, e.g., show an error message
			return;
		}

		// Compare the current course state with the fetched data to identify updated fields
		const updatedFields = new FormData();
		for (const [key, value] of Object.entries(course)) {
			if (course[key] !== data[key]) {
				updatedFields.append(key, value);
			}
		}
		await editMutation.mutateAsync({ id, data: updatedFields });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		const formData = new FormData();
		formData.append("name", name);
		formData.append("shortDescription", shortDescription);
		formData.append("image", image);
		formData.append("school", school);
		formData.append("applicationLink", applicationLink);
		newItem ? addCourse(formData) : updateCourse();
	};

	const handleInputChange = useCallback(
		(e) => {
			const { name: state, value } = e.target;
			setCourse((prevCourse) => ({
				...prevCourse,
				[state]: value,
			}));
		},
		[setCourse]
	);

	const handleOnChange = (e) => {
		setCourse((prev) => ({
			...prev,
			image: e.target.files[0],
		}));
	};

	useEffect(() => {
		data && setCourse(data);
	}, [data]);

	return (
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
						Course
					</h6>
					<div className="flex flex-wrap">
						<div className="w-full lg:w-6/12 px-4">
							<div className="relative w-full mb-3">
								<label
									className="block uppercase text-slate-600 text-xs font-bold mb-2"
									htmlFor="name">
									name
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
									htmlFor="school">
									School
								</label>

								<select
									className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
									name="school"
									value={school._id}
									onChange={handleInputChange}>
									<option value="">School</option>
									{schools.map((s) => (
										<option
											value={s._id}
											className="my-2"
											key={s._id}
											name="school">
											{s.name}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="w-full lg:w-6/12 px-4">
							<div className="relative w-full mb-3">
								<label
									className="block uppercase text-slate-600 text-xs font-bold mb-2"
									htmlFor="applicationLink">
									applicationLink
								</label>
								<input
									type="text"
									className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
									name="applicationLink"
									value={applicationLink}
									onChange={handleInputChange}
								/>
							</div>
						</div>
						<div className="w-full lg:w-6/12 px-4">
							<div className="relative w-full mb-3">
								<label
									className="block uppercase text-slate-600 text-xs font-bold mb-2"
									htmlFor="shortDescription">
									Brief Content
								</label>
								<input
									type="text"
									className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
									name="shortDescription"
									value={shortDescription}
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

								{image && <img src={image} alt={`${name}`} />}
							</div>
						</div>

						<div className="my-4 w-full">
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
	);
};

export default CourseForm;
