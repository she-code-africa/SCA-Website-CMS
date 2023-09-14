import Table from "components/Table";
import React from "react";
import { initiatives as header } from "utils/headers";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getInitiatives } from "services";
import Loader from "components/Loader";
import { deleteInitiative } from "services";

const Initiatives = () => {
	const queryClient = useQueryClient();
	const { data, isSuccess, isLoading } = useQuery(
		"initiatives",
		getInitiatives
	);
	const { mutate, isLoading: deleting } = useMutation(deleteInitiative, {
		onSuccess: () => {
			queryClient.invalidateQueries("initiatives");
		},
		onError: () => {
			console.log("error");
		},
	});

	const handleDelete = (id) => {
		mutate(id);
	};

	return (
		<>
			{isLoading || deleting ? (
				<Loader />
			) : (
				<div className="flex w-full">
					<div className="w-full px-4">
						{header && isSuccess && (
							<Table
								headers={header}
								tableData={data}
								tableHead="Initiatives"
								actions={["view", "edit", "delete"]}
								handleDelete={handleDelete}
								addNew
							/>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default Initiatives;
