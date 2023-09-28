import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { createTestimonial, getTestimonial, editTestimonial } from "services";
import Modal from "components/Modal";
import Placeholder from "components/Placeholder";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { BiSolidImageAdd, BiArchiveIn, BiArchiveOut } from "react-icons/bi";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import Loader from "components/Loader";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { publishTestimonial } from "services";
import { archiveTestimonial } from "services";
import { updateTestimonialStatus } from "services";

const TestimonialModal = ({
	isOpen,
	handleModal,
	handleDeleteModal,
	newItem,
	id,
}) => {
	const intialTestimonialValue = {
		firstName: "",
		testimony: "",
		image: "",
		lastName: "",
	};
	const [testimonial, setTestimonial] = useState(intialTestimonialValue);
	const { firstName, testimony, lastName, image, state } = testimonial;
	const queryClient = useQueryClient();
	const [edit, setEdit] = useState(false);
	const [loading, setLoading] = useState(false);
	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;

	const { data, isLoading } = useQuery(
		["testimonial", id],
		() => getTestimonial(id),
		{
			onSuccess: (data) => {
				setTestimonial(data);
			},
		}
	);

	const { mutate: addTestimonial, isLoading: creating } = useMutation(
		createTestimonial,
		{
			onSuccess: () => {
				toast.success("Testimonial added successfully");
				setTestimonial(intialTestimonialValue);
				queryClient.invalidateQueries({ queryKey: ["testimonials"] });
				handleModal();
			},
			onError: () => {
				toast.error("Error Adding Data");
				handleModal();
			},
		}
	);

	const handleOnChange = (e) => {
		setTestimonial((prev) => ({
			...prev,
			image: e.target.files[0],
		}));
	};

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setTestimonial((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setTestimonial]
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (
			firstName === "" ||
			testimony === "" ||
			image === "" ||
			lastName === ""
		) {
			toast.error("Please fill all fields");
		} else {
			const formData = new FormData();
			formData.append("firstName", firstName);
			formData.append("testimony", testimony);
			formData.append("lastName", lastName);
			formData.append("image", image);
			newItem ? addTestimonial(formData) : updateTestimonialDetails();
		}
	};

	const { mutateAsync: updateTestimonial, isLoading: updating } = useMutation(
		editTestimonial,
		{
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["testimonials"] });
				queryClient.invalidateQueries({ queryKey: ["testimonial"] });
				toast.success("Updated Testimonial successfully");
				handleModal();
			},
			onError: () => {
				toast.error("Error updating Testimonial");
				handleModal();
			},
		}
	);

	const updateTestimonialDetails = async () => {
		// Compare the current testimonial state with the fetched data to identify updated fields
		const updatedFields = new FormData();
		for (const [key, value] of Object.entries(testimonial)) {
			if (testimonial[key] !== data[key]) {
				updatedFields.append(key, value);
			}
		}
		await updateTestimonial({ id, data: updatedFields });
	};

	const { mutateAsync: updateState } = useMutation(updateTestimonialStatus, {
		onSuccess: () => {
			toast.success("Testimonial state updated successfully");
			queryClient.invalidateQueries(["testimonial"]);
			queryClient.invalidateQueries(["testimonials"]);
			setLoading(false);
		},
		onError: () => {
			toast.error("Error updating testimonial state");
			setLoading(false);
		},
	});

	const handleState = async () => {
		setLoading(true);
		let state = testimonial.state === "published" ? "draft" : "published";
		await updateState({ id, data: { state: state } });
	};

	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">Testimonial Details</h2>
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
						<div className="flex flex-col w-full gap-y-3">
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
									className="flex items-center justify-center bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 text-xs border">
									{image ? (
										<img
											className="rounded-full w-full max-h-40"
											src={
												image
													? typeof image === "string"
														? image
														: URL.createObjectURL(image)
													: ""
											}
											alt={firstName}
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
							<div className="relative w-full mb-3 flex items-center ">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="firstName">
									First Name
								</label>
								<input
									required
									type="text"
									className={`${inputClass}`}
									name="firstName"
									value={firstName}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
								/>
							</div>

							<div className="relative w-full mb-3 flex items-center ">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="lastName">
									Last Name
								</label>
								<input
									required
									type="text"
									className={`${inputClass}`}
									name="lastName"
									value={lastName}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
								/>
							</div>

							<div className="relative w-full mb-3 flex items-center ">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12 self-start"
									htmlFor="testimony">
									testimony
								</label>
								<textarea
									className={`${inputClass}`}
									name="testimony"
									value={testimony}
									onChange={handleInputChange}
									rows={8}
									disabled={!edit && !newItem}
								/>
							</div>
						</div>

						<div className="my-4 w-full flex">
							{edit || newItem ? (
								<button
									className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ml-auto"
									onClick={handleSubmit}>
									{creating || updating ? (
										<AiOutlineLoading3Quarters className="animate-spin" />
									) : (
										"SUBMIT"
									)}
								</button>
							) : (
								id && (
									<button
										className="bg-red-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
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
			</Modal>
			<ToastContainer />
		</>
	);
};

export default TestimonialModal;
