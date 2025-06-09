import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Modal from "components/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { InputGroup, Input, Textarea } from "components/Base";
import { createSAGImpactStory, getSAGSchools } from "services";
import { BiSolidImageAdd } from "react-icons/bi";
import Placeholder from "components/Placeholder";
import { Select } from "components/Base";

const StoryModal = ({ isOpen, handleModal, newItem }) => {
	const queryClient = useQueryClient();
	const intial = {
		name: "",
		image: "",
		story: "",
		school: "",
	};
	const [impactStory, setImpactStory] = useState(intial);
	const [schools, setSchools] = useState([]);
	const { name, image, story, school } = impactStory;
	const { mutate: addImpactStory, isLoading: creating } = useMutation(
		createSAGImpactStory,
		{
			onSuccess: () => {
				setImpactStory(intial);
				toast.success("Impact Story Created Successfully");
				queryClient.invalidateQueries(["stem-a-girl-impact-stories"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not create Impact Story");
			},
		}
	);

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setImpactStory((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setImpactStory]
	);

	const handleOnChange = (e) => {
		setImpactStory((prev) => ({
			...prev,
			image: e.target.files[0],
		}));
	};

	const createImpactStory = () => {
		const formData = new FormData();
		formData.append("name", name);
		formData.append("story", story);
		formData.append("image", image);
		formData.append("school", school);
		addImpactStory(formData);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (name === "" || story === "" || image === "") {
			toast.error("Please fill all fields");
		}
		createImpactStory();
	};

	const { isSchoolLoading } = useQuery(
		["stem-a-girl-schools"],
		() => getSAGSchools(),
		{
			onSuccess: ({ data }) => {
				data.data && setSchools(data.data);
			},
		}
	);

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
							<Select
								label="School"
								name="school"
								options={isSchoolLoading ? [] : schools}
								value={school}
								onChange={(e) => {
									setImpactStory((prev) => ({
										...prev,
										school: e.target.value,
									}));
								}}
							/>
						</InputGroup>

						<InputGroup>
							<Textarea
								name="story"
								value={story}
								onChange={handleInputChange}
								label="Story"
							/>
						</InputGroup>
					</div>

					<div className="my-4 w-full flex">
						{newItem && (
							<button
								className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ml-auto"
								onClick={handleSubmit}>
								{creating ? (
									<AiOutlineLoading3Quarters className="animate-spin" />
								) : (
									"SUBMIT"
								)}
							</button>
						)}
					</div>
				</form>
				<ToastContainer />
			</Modal>
		</>
	);
};

export default StoryModal;
