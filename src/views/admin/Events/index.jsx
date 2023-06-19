import Table from "components/Table";
import React, { useState } from "react";
import { getEvents } from "services";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Loader from "components/Loader";
import { events as header } from "utils/headers";
import { deleteEvent } from "services";

const Events = () => {
	const { isSuccess, isLoading, data } = useQuery("events", getEvents);
	const queryClient = useQueryClient();
	const { mutate, isLoading: deleting } = useMutation(deleteEvent, {
		onSuccess: () => {
			queryClient.invalidateQueries(["events"]);
		},
		onError: (err) => {
			console.log(err);
			console.log("error");
		},
	});
	const handleDelete = (id) => {
		mutate(id);
	};
	return (
		<>
			<div className="flex flex-w w-full">
				{isLoading || deleting ? (
					<Loader />
				) : (
					<div className="w-full px-4">
						{data && header && isSuccess && (
							<Table
								tableData={data}
								tableHead="Events"
								headers={header}
								actions={["view", "edit", "delete"]}
								handleDelete={handleDelete}
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
