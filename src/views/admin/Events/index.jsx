import React, { useState } from "react";
import { getEvents } from "services";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Loader from "components/Loader";
import { events as header } from "utils/headers";
import { deleteEvent } from "services";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import moment from "moment";
import { BarrLoader } from "components/Loader";
import DeleteModal from "components/Modal/DeleteModal";
import EventModal from "components/Events/EventModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Events = () => {
	const { isLoading, data } = useQuery("events", getEvents, {
		onError: () => {
			toast.error("Could not fetch Events");
		},
	});
	const [selectedId, setSelectedId] = useState();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isEventModalOpen, setIsEventModalOpen] = useState(false);
	const [newItem, setNewItem] = useState();

	const queryClient = useQueryClient();

	const handleDeleteModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	const handleEventModal = () => {
		setIsEventModalOpen(!isEventModalOpen);
	};

	const { mutate, isLoading: deleting } = useMutation(deleteEvent, {
		onSuccess: () => {
			toast.success("Event Deleted Successfully");
			queryClient.invalidateQueries(["events"]);
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
			<div className="self-start z-40 bg-white w-full">
				<div className="flex items-center justify-between px-4 mt-2">
					<h5 className="font-medium text-xl mt-3">Events</h5>
					<button
						className="rounded-md bg-pink-500 text-white text-xs  px-4 py-2"
						onClick={() => {
							setNewItem(true);
							setSelectedId("");
							handleEventModal();
						}}>
						Add
					</button>
				</div>
				{isLoading || deleting ? (
					<Loader />
				) : (
					<>
						<Table width="full">
							<TableHeaderRow className="grid grid-cols-[150px_1fr_200px_100px_80px_80px]">
								{header.map(({ label }, index) => {
									return <TableHeader key={index}>{label}</TableHeader>;
								})}
								<TableHeader></TableHeader>
							</TableHeaderRow>
							<TableBody loading={isLoading}>
								<>
									{isLoading ? (
										<div className="min-h-[200px] flex items-center">
											<BarrLoader />
										</div>
									) : (
										<>
											{data.map(
												(
													{
														_id,
														title,
														description,
														link,
														state,
														eventDate,
														createdAt,
													},
													index
												) => {
													return (
														<TableDataRow
															key={index}
															onClick={() => {
																setSelectedId(_id);
																handleEventModal();
																setNewItem(false);
															}}
															className="grid grid-cols-[150px_1fr_200px_100px_80px_80px] px-4 py-3 bg-white">
															<TableData>{title}</TableData>
															<TableData>{description}</TableData>
															<TableData>{link}</TableData>
															<TableData>{state}</TableData>

															<TableData>
																{moment(eventDate).format("DD MMM, YYYY")}
															</TableData>
															<TableData>
																{moment(createdAt).format("DD MMM, YYYY")}
															</TableData>
														</TableDataRow>
													);
												}
											)}
										</>
									)}
								</>
							</TableBody>
						</Table>
					</>
				)}
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
					handleModal={handleEventModal}
					id={selectedId}
					newItem={newItem}
				/>
			)}
			<ToastContainer />
		</>
	);
};

export default Events;
