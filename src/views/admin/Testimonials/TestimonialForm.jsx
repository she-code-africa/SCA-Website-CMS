import Loader from "components/Loader";
import React, { useState, useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { editTestimonial, createTestimonial, getTestimonial } from "services";

const TestimonialForm = ({ newTestimonial }) => {
	const initialTestimonialValue = {
		firstName: "",
		testimony: "",
		lastName: "",
		image: "",
	};
	const { id } = useParams();
	const queryClient = useQueryClient();
	const [testimonial, setTestimonial] = useState(initialTestimonialValue);
	const { firstName, testimony, lastName, image, location } = testimonial;
	const { data, isLoading: fetching } = useQuery(["testimonial", id], () =>
		getTestimonial(id)
	);
	useEffect(() => {
		data && setTestimonial(data);
	}, [data]);
	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setTestimonial((prevTestimonial) => ({
				...prevTestimonial,
				[name]: value,
			}));
		},
		[setTestimonial]
	);

	const { mutate: addTestimonial, isLoading: creating } = useMutation(
		createTestimonial,
		{
			onSuccess: () => {
				setTestimonial(initialTestimonialValue);
			},
			onError: () => {
				console.log("error");
			},
		}
	);

	const { mutate: updateTestimonial, isLoading: updating } = useMutation(
		editTestimonial,
		{
			onSuccess: () => {
				queryClient.invalidateQueries(["testimonial"]);
			},
			onError: () => {
				console.log("error");
			},
		}
	);

	const handleOnChange = (e) => {
		setTestimonial((prev) => ({
			...prev,
			image: e.target.files[0],
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("firstName", firstName);
		formData.append("lastName", lastName);
		formData.append("testimony", testimony);
		formData.append("image", image);
		newTestimonial
			? addTestimonial(formData)
			: updateTestimonial({ id, data: formData });
	};

	return (
		<>
			{fetching || creating || updating ? (
				<Loader />
			) : (
				<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-100 border-0">
					<div className="rounded-t bg-white mb-0 px-6 py-6">
						<div className="text-center flex justify-between">
							<h6 className="text-slate-700 text-xl font-bold">Testimonial</h6>
						</div>
					</div>
					<div className="flex-auto px-4 lg:px-10 py-10 pt-0">
						<form onSubmit={handleSubmit}>
							<h6 className="text-slate-400 text-sm mt-3 mb-6 font-bold uppercase">
								Testimonial
							</h6>
							<div className="flex flex-wrap">
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="firstName">
											First Name
										</label>
										<input
											type="text"
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="firstName"
											value={firstName}
											onChange={handleInputChange}
										/>
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="lastName">
											Last Name
										</label>
										<input
											type="text"
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="lastName"
											value={lastName}
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

										{image && (
											<img src={image} alt={`${firstName} ${lastName}`} />
										)}
									</div>
								</div>

								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="testimony">
											Testimony
										</label>
										<textarea
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="testimony"
											value={testimony}
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

export default TestimonialForm;
