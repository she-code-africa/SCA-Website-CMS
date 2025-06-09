import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Modal from "components/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import Loader from "components/Loader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { InputGroup, Input, Textarea } from "components/Base";
import {
	createSAGEvent,
	getSAGEvent,
	editSAGEvent,
	getSAGActivities,
} from "services";
import { BiArchiveIn, BiArchiveOut, BiSolidImageAdd } from "react-icons/bi";
import Placeholder from "components/Placeholder";
import { Select } from "components/Base";
import { Label } from "components/Base";
import DatePicker from "react-datepicker";

const EventModal = ({
	isOpen,
	handleModal,
	handleDeleteModal,
	newItem,
	id,
}) => {
	const queryClient = useQueryClient();
	const intial = {
		title: "",
		image: "",
		description: "",
		activity: "",
		link: "",
		state: "draft",
		eventDate: new Date(),
	};
	const [event, setEvent] = useState(intial);
	const { title, image, description, activity, link, state, eventDate } = event;
	const [edit, setEdit] = useState(false);
	const [activties, setActivities] = useState([]);
	const [loading, setLoading] = useState(false);
	const { isLoading, data } = useQuery(
		["stem-a-girl-event", id],
		() => getSAGEvent(id),
		{
			onSuccess: ({ data }) => {
				const newData = data.data;
				!newItem &&
					setEvent({
						title: newData.title,
						description: newData.description,
						activity: newData.activity._id,
						image: newData.image,
						link: newData.link,
						state: newData.state,
						eventDate: newData.eventDate,
					});
			},
		}
	);

	const { isActivitiesLoading } = useQuery(
		["stem-a-girl-activties"],
		() => getSAGActivities(),
		{
			onSuccess: ({ data }) => {
				data.data && setActivities(data.data);
			},
			onError: () => {
				toast.error("Could not fetch activities");
			},
		}
	);

	const { mutate: addEvent, isLoading: creating } = useMutation(
		createSAGEvent,
		{
			onSuccess: () => {
				setEvent(intial);
				toast.success("Event Created Successfully");
				queryClient.invalidateQueries(["stem-a-girl-events"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not create Event");
			},
		}
	);

	const { mutateAsync: editEvent, isLoading: updating } = useMutation(
		editSAGEvent,
		{
			onSuccess: () => {
				toast.success("Event updated Successfully");
				queryClient.invalidateQueries(["stem-a-girl-event"]);
				queryClient.invalidateQueries(["stem-a-girl-events"]);
				handleModal();
			},
			onError: () => {
				toast.error("Could not update Event");
			},
			onSettled: () => {
				setLoading(false);
			},
		}
	);

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

	const handleOnChange = (e) => {
		setEvent((prev) => ({
			...prev,
			image: e.target.files[0],
		}));
	};

	const createEvent = () => {
		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		formData.append("image", image);
		formData.append("activity", activity);
		formData.append("link", link);
		formData.append("eventDate", eventDate);
		addEvent(formData);
	};

	const updateEvent = async () => {
		const updatedFields = new FormData();
		for (const [key, value] of Object.entries(event)) {
			if (intial.hasOwnProperty(key) && event[key] !== data[key]) {
				updatedFields.append(key, value);
			}
		}
		await editEvent({ id, data: updatedFields });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (
			title === "" ||
			description === "" ||
			image === "" ||
			activity === "" ||
			link === ""
		) {
			toast.error("Please fill all fields");
		}
		newItem ? createEvent() : updateEvent();
	};

	const handleState = async () => {
		setLoading(true);
		console.log(event.state);
		await editEvent({
			id,
			data: { state: event.state === "draft" ? "published" : "draft" },
		});
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
						<div className="flex flex-col w-full gap-y-5">
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
											alt={title}
										/>
									) : (
										<Placeholder name="image" />
									)}
									{(edit || newItem) && (
										<div className="absolute right-2 -bottom-1 z-2 text-slate-600 opacity-90 text-xl">
											<BiSolidImageAdd />
										</div>
									)}
								</label>
							</div>
							<InputGroup>
								<Input
									label="Title"
									name="title"
									onChange={handleInputChange}
									value={title}
									disabled={!edit && !newItem}
								/>
							</InputGroup>
							<InputGroup>
								<Input
									label="Link"
									type="url"
									name="link"
									onChange={handleInputChange}
									value={link}
									disabled={!edit && !newItem}
								/>
							</InputGroup>
							<InputGroup>
								<Select
									label="Activity"
									value={activity}
									name="activity"
									options={isActivitiesLoading ? [] : activties}
									onChange={(e) => {
										setEvent((prev) => ({
											...prev,
											activity: e.target.value,
										}));
									}}
								/>
							</InputGroup>
							<InputGroup>
								<Label htmlFor="eventDate" name="Event Date" />
								<DatePicker
									selected={eventDate ? new Date(eventDate) : new Date()}
									dateFormat="yyyy-MM-dd"
									onChange={(date) =>
										setEvent((prevEvent) => ({
											...prevEvent,
											eventDate: date,
										}))
									}
									className={`border-0 px-3 py-0 placeholder-slate-300 text-slate-600 bg-white rounded text-sm ${
										edit || newItem
											? "shadow focus:outline-none focus:ring !py-3"
											: ""
									} w-full ease-linear transition-all duration-150 basis-9/12ass} ml-6 !w-[95%]`}
								/>
							</InputGroup>

							<InputGroup>
								<Textarea
									name="description"
									value={description}
									onChange={handleInputChange}
									disabled={!edit && !newItem}
									label="Description"
								/>
							</InputGroup>
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
				<ToastContainer />
			</Modal>
		</>
	);
};

export default EventModal;
