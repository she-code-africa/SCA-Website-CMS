import Modal from "components/Modal";
import React, { useState } from "react";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { GrView } from "react-icons/gr";
import Tooltip from "components/Tooltip";
import { BiSolidImageAdd, BiArchiveIn, BiArchiveOut } from "react-icons/bi";
import PrimaryInput from "./inputs/PrimaryInput";
import Placeholder from "components/Placeholder";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useMutation, useQueryClient, useQuery } from "react-query";
import {
	createChapterEvent,
	getAChapterEvent,
	updateChapterEvent,
	publishChapterEvent,
	archiveChapterEvent,
} from "services";

const CreateChapterEventsModal = ({
	newItem,
	chapterId,
	isOpen,
	handleCloseModal,
	toast,
	selectedId,
}) => {
	const queryClient = useQueryClient();
	const [edit, setEdit] = useState(false);
	const [eventId, setEventId] = useState("");

	const [newEvent, setNewEvent] = useState({
		name: "",
		description: "",
		link: "",
		eventDate: new Date(),
		image: "",
		eventState: "draft",
	});
	const [loading, setLoading] = useState(false);

	const { data: chapterEvent } = useQuery(
		["chapter-event", selectedId],
		() => getAChapterEvent(selectedId),

		{
			onSuccess: (data) => {
				console.log("Chapter Event Data:", data);
				setEventId(data._id);
				setNewEvent({
					name: data.title,
					description: data.description,
					link: data.link,
					eventDate: new Date(data.eventDate),
					image: data.images[0] || "",
					eventState: data.eventState || "draft", // default to draft if not set
				});
			},
			enabled: !!selectedId,
		}
	);

	console.log(chapterEvent);

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		setNewEvent((prev) => ({ ...prev, [name]: files ? files[0] : value }));
	};

	const { mutate: createNewEvent, isLoading: creating } = useMutation(
		createChapterEvent,
		{
			onSuccess: () => {
				setNewEvent({
					name: "",
					description: "",
					link: "",
					eventDate: new Date(),
					image: "",
				});
				toast.success("Event Created Successfully");
				queryClient.invalidateQueries(["chapter-events"]);
				handleCloseModal();
			},
			onError: () => {
				toast.error("Could not create Event");
			},
		}
	);

	const { mutate: updateEvent, isLoading: isCreating } = useMutation(
		updateChapterEvent,
		{
			onSuccess: () => {
				setNewEvent({
					name: "",
					description: "",
					link: "",
					eventDate: new Date(),
					image: "",
					eventState: "draft",
				});
				toast.success("Event Updated Successfully");
				queryClient.invalidateQueries(["chapter-events"]);
				handleCloseModal();
			},
			onError: () => {
				toast.error("Could not update Event");
			},
		}
	);

	const { mutateAsync: publishEvent } = useMutation(publishChapterEvent, {
		onSuccess: () => {
			setLoading(false);
			toast.success("Chapter Event Published Successfully");
			queryClient.invalidateQueries({ queryKey: ["chapter-events"] });
			queryClient.invalidateQueries({ queryKey: ["chapter-event"] });
		},
		onError: () => {
			setLoading(false);
			toast.error("Error Publishing Chapter Event");
		},
	});

	const { mutateAsync: archiveEvent } = useMutation(archiveChapterEvent, {
		onSuccess: () => {
			setLoading(false);
			toast.success("Chapter Event Archived Successfully");
			queryClient.invalidateQueries({ queryKey: ["chapter-events"] });
			queryClient.invalidateQueries({ queryKey: ["chapter-event"] });
		},
		onError: () => {
			setLoading(false);
			toast.error("Error Archiving Chapter Event");
		},
	});

	const handleState = async () => {
		setLoading(true);
		newEvent?.eventState === "published"
			? await archiveEvent(eventId)
			: await publishEvent(eventId);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { name, description, link, eventDate, image } = newEvent;

		const formattedDate = eventDate.toISOString().split("T")[0];

		const formData = new FormData();

		formData.append("title", name);
		formData.append("link", link);
		formData.append("description", description);
		formData.append("images", image);
		formData.append("chapterId", chapterId);
		formData.append("eventDate", formattedDate);

		newItem
			? createNewEvent(formData)
			: updateEvent({ id: selectedId, data: formData });
	};

	const header = () => {
		return (
			<div className="flex justify-between items-center w-full mr-5 px-2">
				<h2 className="font-semibold">
					{!newItem ? "Update Chapter Event" : "Create Chapter Event"}
				</h2>
				{!newItem && (
					<div className="flex items-center gap-3">
						<div onClick={handleState} className="hover:cursor-pointer">
							{newEvent?.eventState &&
								(loading ? (
									<AiOutlineLoading3Quarters className="animate-spin" />
								) : newEvent?.eventState === "published" ? (
									<Tooltip content="Archive">
										<BiArchiveIn size="1.25rem" />
									</Tooltip>
								) : (
									<Tooltip content="Publish">
										<BiArchiveOut size="1.25rem" />
									</Tooltip>
								))}
						</div>
						<div
							onClick={() => setEdit(!edit)}
							className="hover:cursor-pointer">
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
				onClose={handleCloseModal}
				header={header}
				customHeight={true}
				className="!max-w-3xl">
				<form className="w-full px-4 md:px-8" onSubmit={handleSubmit}>
					<div className="flex flex-col  w-full gap-y-2">
						<div className="self-center relative">
							<input
								required
								className="hidden"
								name="image"
								type="file"
								id="fileInput"
								onChange={handleChange}
								disabled={!edit && !newItem}
							/>
							<label
								htmlFor="fileInput"
								className="flex items-center justify-center bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 text-xs border">
								{newEvent.image ? (
									<img
										className="rounded-full w-full max-w-200-px object-cover"
										src={
											newEvent.image
												? typeof newEvent.image === "string"
													? newEvent.image
													: URL.createObjectURL(newEvent.image)
												: ""
										}
										alt="event-pic"
										style={{ height: "200px", objectFit: "cover" }}
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
						<PrimaryInput
							label="Name"
							newItem={newItem}
							name="name"
							handleInputChange={handleChange}
							value={newEvent.name}
							edit={edit}
						/>
						<PrimaryInput
							label="Description"
							newItem={newItem}
							name="description"
							handleInputChange={handleChange}
							value={newEvent.description}
							edit={edit}
						/>
						<PrimaryInput
							label="Event URL"
							newItem={newItem}
							name="link"
							handleInputChange={handleChange}
							value={newEvent.link}
							edit={edit}
						/>
						<PrimaryInput
							label="Event Date"
							newItem={newItem}
							name="eventDate"
							value={newEvent.eventDate}
							eventDate={newEvent.eventDate}
							isDate={true}
							onChangeDate={(date) =>
								setNewEvent((prevEvent) => ({
									...prevEvent,
									eventDate: date,
								}))
							}
							edit={edit}
						/>
					</div>

					<div className="my-4 w-full flex">
						<button
							className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 ml-auto"
							onClick={handleSubmit}>
							{creating || isCreating ? (
								<AiOutlineLoading3Quarters className="animate-spin" />
							) : (
								"SUBMIT"
							)}
						</button>
					</div>
				</form>
			</Modal>
		</>
	);
};

export default CreateChapterEventsModal;
