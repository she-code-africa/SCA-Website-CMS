import Table from "components/Table";
import React, { useEffect, useState } from "react";
import { getEvents } from "services";
import { useQuery } from "react-query";
import Loader from "components/Loader";
import { events as header } from "utils/headers";

const Events = () => {
	const [events, setEvents] = useState();
	const { isSuccess, isLoading, data } = useQuery("events", getEvents);
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
						{events && header && (
							<Table
								tableData={events}
								tableHead="Events"
								headers={header}
								actions={["view", "edit", "delete"]}
								addNew
							/>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default Events;
