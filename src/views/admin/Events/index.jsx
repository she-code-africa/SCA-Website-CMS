import Table from "components/Table";
import React, { useEffect, useState } from "react";
import { getEvents } from "services";
import { useQuery } from "react-query";
import Loader from "components/Loader";

const Events = () => {
	const [events, setEvents] = useState();
	const { isSuccess, isLoading, data } = useQuery("events", getEvents);
	const headers = [
		{ value: "title", label: "Title" },
		{ value: "description", label: "Description" },
		{ value: "eventDate", label: "Date" },
		{ value: "link", label: "Link" },
	];
	useEffect(() => {
		if (isSuccess) {
			setEvents(data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess]);
	return (
		<>
			<div className="flex flex-w w-full">
				{isLoading ? (
					<Loader />
				) : (
					<div className="w-full px-4">
						{events && (
							<Table
								tableData={events}
								tableHead="Events"
								headers={headers}
								addNew
								edit
								view
								deleteBtn
							/>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default Events;
