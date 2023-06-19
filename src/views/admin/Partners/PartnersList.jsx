import React from "react";
import Table from "components/Table";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getPartners } from "services";
import { partners as header } from "utils/headers";
import Loader from "components/Loader";
import { deletePartner } from "services";

const PartnersList = () => {
	const queryClient = useQueryClient();
	const { isSuccess, isLoading, data } = useQuery("partners", getPartners);
	const { mutate, isLoading: deleting } = useMutation(deletePartner, {
		onSuccess: () => {
			queryClient.invalidateQueries(["partners"]);
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
			<div className="flex flex-wrap mt-4 w-full">
				{isLoading || deleting ? (
					<Loader />
				) : (
					<div className="w-full mb-12">
						{data && header && isSuccess && (
							<Table
								headers={header}
								tableData={data}
								tableHead="Partners"
								actions={["edit", "delete"]}
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

export default PartnersList;
