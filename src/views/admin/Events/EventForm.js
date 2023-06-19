import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createEvent, getEvent } from "services";
import Loader from "components/Loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router";
import { editEvent } from "services";

const EventForm = ({ newEvent }) => {
	const intialEventValue = {
		title: "",
		description: "",
		eventDate: new Date(),
		image: "",
		link: "",
	};
	const queryClient = useQueryClient();
	const [event, setEvent] = useState(intialEventValue);
	const { title, description, eventDate, link, image } = event;
	const [loading, setLoading] = useState(false);
	const { id } = useParams();
	const { data } = useQuery(["event", id], () => getEvent(id));
	const { createEvnt } = useMutation(createEvent, {
		onSuccess: () => {
			setEvent(intialEventValue);
			setLoading(false);
		},
		onError: () => {
			console.log("error");
			setLoading(false);
		},
	});
	const editMutation = useMutation(editEvent, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["event"] });
			setLoading(false);
		},
		onError: () => {
			console.log("error");
			setLoading(false);
		},
	});

	useEffect(() => {
		if (data) {
			setEvent(data);
		}
	}, [data]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEvent((prevEvent) => ({
			...prevEvent,
			[name]: value,
		}));
	};

	const handleEdit = async (e) => {
		await editMutation.mutateAsync({ id, data: event });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		newEvent ? createEvnt(event) : handleEdit();
	};

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-100 border-0">
					<div className="rounded-t bg-white mb-0 px-6 py-6">
						<div className="text-center flex justify-between">
							<h6 className="text-slate-700 text-xl font-bold">Event</h6>
						</div>
					</div>
					<div className="flex-auto px-4 lg:px-10 py-10 pt-0">
						<form onSubmit={handleSubmit}>
							<h6 className="text-slate-400 text-sm mt-3 mb-6 font-bold uppercase">
								Event Details
							</h6>
							<div className="flex flex-wrap">
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="title">
											Title
										</label>
										<input
											type="text"
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="title"
											value={title}
											onChange={handleInputChange}
										/>
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="link">
											Link
										</label>
										<input
											type="url"
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="link"
											value={link}
											onChange={handleInputChange}
										/>
									</div>
								</div>
								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="eventDate">
											Event Date
										</label>
										<DatePicker
											selected={new Date(eventDate)}
											onChange={(date) =>
												setEvent((prevEvent) => ({
													...prevEvent,
													eventDate: date,
												}))
											}
											className="border-1 border-slate-200 p-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full ease-linear transition-all duration-150 py-4"
										/>
									</div>
								</div>

								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="description">
											Description
										</label>
										<textarea
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="description"
											value={description}
											onChange={handleInputChange}
										/>
									</div>
								</div>

								<div className="w-full lg:w-6/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600  font-bold my-2"
											htmlFor=" ">
											Upload Image
										</label>
										<input
											type="file"
											className="border-1 border-slate-200 p-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring focus:ring-blue-400 w-full ease-linear transition-all duration-150"
										/>

										{image && (
											<div className="mt-3">
												<img src={image} alt={title} />
											</div>
										)}
									</div>
								</div>
							</div>

							<div className="my-4">
								<button
									type="submit"
									className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">
									SAVE
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default EventForm;
