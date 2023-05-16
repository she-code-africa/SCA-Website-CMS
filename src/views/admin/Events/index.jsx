import Table from "components/Table";
import React, { useEffect, useState } from "react";
import { getEvents } from "services";
import { useQuery } from "react-query";

const Events = () => {
	const [events, setEvents] = useState();
	const response = useQuery("events", getEvents);
	useEffect(() => {
		if (response.isSuccess) {
			setEvents(response.data);
		}
	}, [response]);
	return (
		<>
			<div
				className="flex flex-w
    ">
				<div className="w-full px-4">
					<div>
						<h1>Events</h1>
						<button>Add New Event</button>
					</div>
					{events && (
						<Table
							tableData={events}
							tableHead="Events"
							addNew="addNewEvent"
							showActions="true"
							edit="editEvent"
							view="viewEvent"
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default Events;
