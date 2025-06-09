import React, { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";
import Modal from "components/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { InputGroup, Input, Textarea } from "components/Base";
import { createSAGTestimonial } from "services";
import { BiSolidImageAdd } from "react-icons/bi";
import Placeholder from "components/Placeholder";

const TestimonialModal = ({ isOpen, handleModal, newItem }) => {
	const queryClient = useQueryClient();
	const intial = {
		name: "",
		image: "",
		testimony: "",
	};
	const [school, setSchool] = useState(intial);
	const { name, image, testimony } = school;

	const { mutate: addSchool, isLoading: creating } = useMutation(
		createSAGTestimonial,
		{
			onSuccess: () => {
				setSchool(intial);
				toast.success("School Created Successfully");
				queryClient.invalidateQueries(["stem-a-girl-testimonials"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not create School");
			},
		}
	);

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setSchool((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setSchool]
	);

	const handleOnChange = (e) => {
		setSchool((prev) => ({
			...prev,
			image: e.target.files[0],
		}));
	};

	const createSchool = () => {
		const formData = new FormData();
		formData.append("name", name);
		formData.append("testimony", testimony);
		formData.append("image", image);
		addSchool(formData);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (name === "" || testimony === "" || image === "") {
			toast.error("Please fill all fields");
		}
		createSchool();
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={handleModal} className="!max-w-3xl">
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
							/>
							<label
								htmlFor="fileInput"
								className="flex items-center justify-center bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 text-sm border">
								{image ? (
									<img
										className="rounded-full w-16 h-16 md:w-28 md:h-28 "
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

								<div className="absolute right-2 -bottom-1 z-2 text-slate-600 opacity-90 text-xl">
									<BiSolidImageAdd />
								</div>
							</label>
						</div>
						<InputGroup>
							<Input
								label="Name"
								name="name"
								onChange={handleInputChange}
								value={name}
							/>
						</InputGroup>

						<InputGroup>
							<Textarea
								name="testimony"
								value={testimony}
								onChange={handleInputChange}
								label="Testimony"
							/>
						</InputGroup>
					</div>

					<div className="my-4 w-full flex">
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
				<ToastContainer />
			</Modal>
		</>
	);
};

export default TestimonialModal;
