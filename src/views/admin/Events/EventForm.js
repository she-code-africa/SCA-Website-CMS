import React, { useState, useCallback } from "react";

const EventForm = ({ newEvent }) => {
	const intialEventValue = {
		title: "",
		description: "",
		eventDate: "",
		image: "",
		link: "",
	};
	const [event, setEvent] = useState(intialEventValue);
	const { title, description, eventDate, link } = event;

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setEvent((prevEvent) => ({
				...prevEvent,
				[name]: value,
			}));
		},
		[setEvent]
	);

	return (
		<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-100 border-0">
			<div className="rounded-t bg-white mb-0 px-6 py-6">
				<div className="text-center flex justify-between">
					<h6 className="text-slate-700 text-xl font-bold">Event</h6>
				</div>
			</div>
			<div className="flex-auto px-4 lg:px-10 py-10 pt-0">
				<form>
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
									type="email"
									className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
									name="link"
									value={link}
									onChange={handleInputChange}
								/>
							</div>
						</div>
						<div className="w-full lg:w-6/12 px-4">
							{/* To do 
                            Add DatePicker */}
							<div className="relative w-full mb-3">
								<label
									className="block uppercase text-slate-600 text-xs font-bold mb-2"
									htmlFor="eventDate">
									Event Date
								</label>
								<input
									type="text"
									className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
									name="eventDate"
									value={eventDate}
									onChange={handleInputChange}
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
							</div>
						</div>
					</div>

					<div className="my-4">
						<button className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">
							SAVE
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EventForm;
