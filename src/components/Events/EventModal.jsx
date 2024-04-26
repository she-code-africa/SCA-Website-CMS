import React, { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { createEvent, getEvent, editEvent } from "services";
import Modal from "components/Modal";
import Placeholder from "components/Placeholder";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { BiSolidImageAdd, BiArchiveIn, BiArchiveOut } from "react-icons/bi";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import Loader from "components/Loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { publishEvent } from "services";
import { archiveEvent } from "services";

const EventModal = ({
	isOpen,
	handleModal,
	handleDeleteModal,
	newItem,
	id,
	catId,
}) => {
	const intialEventValue = {
		title: "",
		description: "",
		eventDate: new Date(),
		image: "",
		link: "",
	};

	const [event, setEvent] = useState(intialEventValue);
	const { title, description, eventDate, link, image, state } = event;
	const queryClient = useQueryClient();
	const [edit, setEdit] = useState(false);
	const [loading, setLoading] = useState(false);
	const inputClass = `border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
		edit || newItem ? "shadow focus:outline-none focus:ring !py-3" : ""
	} w-full ease-linear transition-all duration-150 basis-9/12`;

	const { data, isLoading } = useQuery(["event", id], () => getEvent(id), {
		enabled: !!id,
	});

	useEffect(() => {
		if (!data) return;
		setEvent(data);
	});

	console.log(data, isLoading);

	const { mutate: addEvent, isLoading: creating } = useMutation(createEvent, {
		onSuccess: () => {
			toast.success("Event added successfully");
			setEvent(intialEventValue);
			queryClient.invalidateQueries({ queryKey: ["events"] });
			handleModal();
		},
		onError: () => {
			toast.error("Error Adding Data");
			handleModal();
		},
	});

	const handleOnChange = (e) => {
		setEvent((prev) => ({
			...prev,
			image: e.target.files[0],
		}));
	};

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setEvent((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		[setEvent]
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(!!eventDate);
		if (
			title === "" ||
			description === "" ||
			!eventDate ||
			image === "" ||
			link === ""
		) {
			toast.error("Please fill all fields");
		} else {
			const formattedDate = eventDate.toISOString().split("T")[0];
			const formData = new FormData();
			formData.append("title", title);
			formData.append("description", description);
			formData.append("eventDate", formattedDate);
			formData.append("link", link);
			formData.append("image", image);
			newItem ? addEvent(formData) : updateEventDetails();
		}
	};

	const { mutateAsync: updateEvent, isLoading: updating } = useMutation(
		editEvent,
		{
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["events"] });
				queryClient.invalidateQueries({ queryKey: ["event"] });
				toast.success("Updated Event successfully");
				handleModal();
			},
			onError: () => {
				toast.error("Error updating Event");
				handleModal();
			},
		}
	);

	const updateEventDetails = async () => {
		// Compare the current event state with the fetched data to identify updated fields
		const updatedFields = new FormData();
		for (const [key, value] of Object.entries(event)) {
			if (event[key] !== data[key]) {
				updatedFields.append(key, value);
			}
		}
		await updateEvent({ id, catId, data: updatedFields });
	};

	const { mutateAsync: publish } = useMutation(publishEvent, {
		onSuccess: () => {
			setLoading(false);
			toast.success("Event Published Successfully");
			queryClient.invalidateQueries({ queryKey: ["events"] });
			queryClient.invalidateQueries({ queryKey: ["event"] });
		},
		onError: () => {
			setLoading(false);
			toast.error("Error Publishing Event");
		},
	});

	const { mutateAsync: archive } = useMutation(archiveEvent, {
		onSuccess: () => {
			setLoading(false);
			toast.success("Event Archived Successfully");

			queryClient.invalidateQueries({ queryKey: ["events"] });
			queryClient.invalidateQueries({ queryKey: ["event"] });
		},
		onError: () => {
			setLoading(false);
			toast.error("Error Archiving Event");
		},
	});

	const handleState = async () => {
		setLoading(true);
		state === "published" ? await archive(id) : await publish(id);
	};

	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">Event Details</h2>
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
											alt={title}
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
									htmlFor="title">
									Title
								</label>
								<input
									required
									type="text"
									className={`${inputClass}`}
									name="title"
									value={title}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
								/>
							</div>

							<div className="relative w-full mb-3 flex items-center ">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12"
									htmlFor="link">
									Link
								</label>
								<input
									required
									type="url"
									className={`${inputClass}`}
									name="link"
									value={link}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
								/>
							</div>

							<div className="relative w-full mb-3 flex items-center ">
								<label
									className="block uppercase text-slate-600 text-xs font-bold  basis-3/12"
									htmlFor="eventDate">
									Event Date
								</label>
								<DatePicker
									selected={eventDate ? new Date(eventDate) : new Date()}
									dateFormat="yyyy-MM-dd"
									onChange={(date) =>
										setEvent((prevEvent) => ({
											...prevEvent,
											eventDate: date,
										}))
									}
									className={`${inputClass} ml-6 !w-[95%]`}
								/>
							</div>

							<div className="relative w-full mb-3 flex items-center ">
								<label
									className="block uppercase text-slate-600 text-xs font-bold basis-3/12 self-start"
									htmlFor="description">
									Description
								</label>
								<textarea
									className={`${inputClass}`}
									name="description"
									value={description}
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

export default EventModal;
