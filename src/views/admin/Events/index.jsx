import Table from "components/Table";
import React from "react";
import { getEvents } from "services";
import { useQuery } from "react-query";
import Loader from "components/Loader";
import { events as header } from "utils/headers";

const Events = () => {
	const { isSuccess, isLoading, data } = useQuery("events", getEvents);
	return (
		<>
			<div className="flex flex-w w-full">
				{isLoading ? (
					<Loader />
				) : (
					<div className="w-full px-4">
						{data && header && isSuccess && (
							<Table
								tableData={data}
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
