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
	TableActions,
} from "components/Table/DisplayTable";
import moment from "moment";
import { Link } from "react-router-dom";
import { paths } from "utils";
import { BarrLoader } from "components/Loader";
import DeleteModal from "components/Modal/DeleteModal";

const Events = () => {
	const { isLoading, data } = useQuery("events", getEvents);
	const [selectedId, setSelectedId] = useState();
	const [isOpen, setIsOpen] = useState(false);
	const queryClient = useQueryClient();

	const handleModal = () => {
		setIsOpen(!isOpen);
	};

	const { mutate, isLoading: deleting } = useMutation(deleteEvent, {
		onSuccess: () => {
			queryClient.invalidateQueries(["events"]);
		},
		onError: (err) => {
			console.log(err);
			console.log("error");
		},
	});
	const handleDelete = () => {
		mutate(selectedId);
		setIsOpen(false);
	};
	return (
		<>
			<div className="self-start z-40 bg-white">
				<div className="flex items-center justify-between px-4 mt-2">
					<h5 className="font-medium text-xl mt-3">Events</h5>
					<Link
						to={paths.addNewEvent}
						className="rounded bg-pink-500 text-white text-xs  px-4 py-2 shadow-lg">
						Add
					</Link>
				</div>
				{isLoading || deleting ? (
					<Loader />
				) : (
					<>
						<Table width="full">
							<TableHeaderRow className="grid grid-cols-[150px_1fr_200px_80px_80px_50px]">
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
														eventDate,
														createdAt,
													},
													index
												) => {
													return (
														<TableDataRow
															key={index}
															className="grid grid-cols-[150px_1fr_200px_80px_80px_50px] px-4 py-3 bg-white">
															<TableData>
																<span>{title}</span>
															</TableData>
															<TableData>{description}</TableData>
															<TableData>{link}</TableData>
															<TableData>
																{moment(eventDate).format("DD MMM, YYYY")}
															</TableData>
															<TableData>
																{moment(createdAt).format("DD MMM, YYYY")}
															</TableData>
															<TableData noTruncate>
																<TableActions>
																	<Link
																		to={`${paths.viewEvent}/${_id}`}
																		className="mb-1 px-3 text-sm text-left">
																		View
																	</Link>
																	<Link
																		to={`${paths.editEvent}/${_id}`}
																		className="mb-1 px-3 text-sm text-left">
																		Edit
																	</Link>
																	<button
																		onClick={() => {
																			setSelectedId(_id);
																			handleModal();
																		}}
																		className="mb-1 px-3 text-sm text-left">
																		Delete
																	</button>
																</TableActions>
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

			<DeleteModal
				handleDelete={handleDelete}
				isOpen={isOpen}
				handleModal={handleModal}
			/>
		</>
	);
};

export default Events;
