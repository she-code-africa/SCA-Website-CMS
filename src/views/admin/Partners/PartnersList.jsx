import React, { useState, useEffect } from "react";
import Table from "components/Table";
import { useQuery } from "react-query";
import { getPartners } from "services";

const PartnersList = () => {
	const [partners, setPartners] = useState([]);
	const response = useQuery("partners", getPartners);
	const headers = [
		{
			value: "name",
			label: "Name",
		},
		{
			value: "createdAt",
			label: "Created At",
		},
	];
	useEffect(() => {
		if (response.isSuccess) {
			setPartners(response.data);
		}
		console.log(response);
	}, [response]);
	return (
		<>
			<div className="flex flex-wrap mt-4 w-full">
				<div className="w-full mb-12">
					{partners && (
						<Table
							headers={headers}
							tableData={partners}
							tableHead="Partners"
							addNew
							edit
							deleteBtn
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default PartnersList;
