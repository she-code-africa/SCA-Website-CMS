import {
	TableHeaderRow,
	TableHeader,
	TableBody,
	TableData,
	TableDataRow,
	Table,
} from "components/Table/DisplayTable";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import moment from "moment";
import EventModal from "components/Stem-a-girl/events/EventModal";
import { ToastContainer, toast } from "react-toastify";
import DeleteModal from "components/Modal/DeleteModal";
import { getSAGEvents, deleteSAGEvent } from "services";

const Events = () => {
	const [events, setEvents] = useState([]);
	const [selectedId, setSelectedId] = useState("");
	const [isEventModalOpen, setIsEventModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [newItem, setNewItem] = useState();
	const queryClient = useQueryClient();

	const tableHeader = [
		{
			value: "title",
			label: "Title",
		},
		{
			value: "description",
			label: "Description",
		},
		{
			value: "link",
			label: "Link",
		},
		{
			value: "activity",
			label: "Activity",
		},
		{
			value: "state",
			label: "State",
		},
		{
			value: "eventDate",
			label: "Event Date",
		},
		{
			value: "updatedAt",
			label: "Updated At",
		},
		{
			value: "createdAt",
			label: "Created At",
		},
	];

	const handleSchoolModal = () => {
		setIsEventModalOpen(!isEventModalOpen);
	};

	const handleDeleteModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	const { isLoading } = useQuery("stem-a-girl-events", getSAGEvents, {
		onSuccess: ({ data }) => {
			!!data && setEvents(data.data);
		},
		onError: (err) => {
			console.log(err);
		},
	});

	const { mutate, isLoading: deleting } = useMutation(deleteSAGEvent, {
		onSuccess: () => {
			toast.success("Event Deleted Successfully");
			queryClient.invalidateQueries(["stem-a-girl-events"]);
		},
		onError: () => {
			toast.error("Could not delete Event");
		},
	});
	const handleDelete = () => {
		mutate(selectedId);
		handleDeleteModal();
	};

	return (
		<>
			<div className="bg-white rounded-md z-10 w-full">
				<div className="flex items-center justify-between px-4 py-3">
					<h5 className="font-medium text-xl mt-3">Events</h5>
					<button
						className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
						onClick={() => {
							setNewItem(true);
							setSelectedId("");
							handleSchoolModal();
						}}>
						Add
					</button>
				</div>
				<Table width="full">
					<TableHeaderRow className="grid grid-cols-8">
						{tableHeader.map(({ label, name }) => (
							<TableHeader key={name}>{label}</TableHeader>
						))}
					</TableHeaderRow>
					<TableBody loading={isLoading}>
						{events?.map((event) => (
							<TableDataRow
								onClick={() => {
									setSelectedId(event._id);
									handleSchoolModal();
									setNewItem(false);
								}}
								key={event._id}
								className="grid grid-cols-8 px-4 py-3 bg-white">
								<TableData>
									<div className="flex gap-2 items-start">
										<img
											src={event.image}
											alt={event.title}
											className="w-6 h-6"
										/>
										{event.title}
									</div>
								</TableData>
								<TableData>{event.description.substring(0, 100)}...</TableData>
								<TableData>{event.link}</TableData>
								<TableData>{event.activity.title}</TableData>
								<TableData>{event.state}</TableData>
								<TableData>
									{moment(event.eventDate).format("DD MMM, YYYY")}
								</TableData>
								<TableData>
									{" "}
									{moment(event.updatedAt).format("DD MMM, YYYY")}
								</TableData>
								<TableData>
									{moment(event.createdAt).format("DD MMM, YYYY")}
								</TableData>
							</TableDataRow>
						))}
					</TableBody>
				</Table>
			</div>
			{isDeleteModalOpen && (
				<DeleteModal
					handleDelete={handleDelete}
					isOpen={isDeleteModalOpen}
					handleModal={handleDeleteModal}
				/>
			)}
			{isEventModalOpen && (
				<EventModal
					handleDeleteModal={() => setIsDeleteModalOpen(true)}
					isOpen={isEventModalOpen}
					handleModal={handleSchoolModal}
					id={selectedId}
					newItem={newItem}
				/>
			)}
			<ToastContainer />
		</>
	);
};

export default Events;
