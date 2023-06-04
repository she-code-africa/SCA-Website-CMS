import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { useParams } from "react-router";
import { getEvent, publishEvent, archiveEvent } from "services";
import Loader from "components/Loader";
import moment from "moment";
import Modal from "components/Modal";

const EventDetails = () => {
	const { id } = useParams();
	const [event, setEvent] = useState();
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [action, setAction] = useState();
	const response = useQuery(["event", id], () => getEvent(id));
	useEffect(() => {
		if (response.isSuccess) {
			setEvent(response.data);
		}
	}, [response]);
	const handleModal = () => {
		setIsOpen(!isOpen);
	};

	const publish = useMutation(publishEvent, {
		onSuccess: () => {
			setIsOpen(false);
			setLoading(false);
		},
		onError: () => {
			setIsOpen(false);
			setLoading(false);
		},
	});

	const handlePublish = async () => {
		setLoading(true);
		await publish.mutateAsync({ id: id });
	};

	const archive = useMutation(archiveEvent, {
		onSuccess: () => {
			setIsOpen(false);
			setLoading(false);
		},
		onError: () => {
			setIsOpen(false);
			setLoading(false);
		},
	});

	const handleArchive = async () => {
		setLoading(true);
		await archive.mutateAsync({ id: id });
	};

	const handleSubmit = () => {
		if (action === "publish") {
			handlePublish();
		} else if (action === "archive") {
			handleArchive();
		}
	};
	return (
		<>
			{response.isLoading ? (
				<Loader />
			) : (
				<>
					<div className="container mx-auto px-4">
						<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
							<div className="">
								<img className="w-full" src={event?.image} alt="event" />
							</div>
							<div className="px-6 mt-4">
								<div className="text-left flex justify-between items-center">
									<div>
										<h3 className="text-2xl font-semibold leading-normal text-slate-700 mb-1">
											{event?.title}
										</h3>
										<div className="text-sm leading-normal mt-0 mb-2 text-slate-400 font-bold underline">
											<i className="fas fa-map-marker-alt mr-2 text-lg text-slate-400"></i>{" "}
											<a href={event?.link}>{event?.link}</a>
										</div>
									</div>
									<div>
										<p>Date: {moment(event?.eventDate).format("DD/MM/YY")}</p>
										<div className="flex items-center mt-2">
											<button
												className={`${
													event?.state === "published"
														? "opacity-50"
														: "opacity-0"
												} text-white bg-pink-500 px-4 py-1 mr-2 rounded`}
												disabled={event?.state === "published" ? true : false}
												onClick={() => {
													setAction("publish");
													setIsOpen(true);
												}}>
												Publish
											</button>
											<button
												className={`${
													event?.state === "archived"
														? "opacity-50"
														: "opacity-0"
												} bg-slate-600 text-white px-4 py-1 rounded`}
												disabled={event?.state === "archived" ? true : false}
												onClick={() => {
													setAction("archive");
													handleModal();
												}}>
												Archive
											</button>
										</div>
									</div>
								</div>
								<div className="mt-6 py-5 border-t border-slate-200 text-center">
									<div className="flex flex-wrap justify-center">
										<div className="w-full px-4">
											<p className="mb-4 text-lg leading-relaxed text-slate-700">
												{event?.description}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<Modal isOpen={isOpen} title="Event" onClose={handleModal}>
						<div>
							<div>
								<p>Are you sure you want to?</p>
							</div>
							<div className="flex justify-center mt-3">
								<button
									className="mr-2 bg-red-600 text-white  px-4 py-1 rounded"
									onClick={handleSubmit}>
									Yes
								</button>
								<button
									className="bg-slate-600 px-4 py-1 text-white rounded"
									onClick={handleModal}>
									No
								</button>
							</div>
						</div>
					</Modal>
				</>
			)}
		</>
	);
};

export default EventDetails;
