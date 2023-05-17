import React, { useState, useEffect } from "react";
import Table from "components/Table";
import { useQuery } from "react-query";
import { getPartners } from "services";

const PartnersList = () => {
	const [partners, setPartners] = useState([]);
	const response = useQuery("partners", getPartners);
	useEffect(() => {
		if (response.isSuccess) {
			setPartners(response.data);
		}
		console.log(response);
	}, [response]);
	return (
		<>
			<div className="flex flex-wrap mt-4">
				<div className="w-full mb-12 px-4">
					{partners && (
						<Table
							tableData={partners}
							tableHead="Partners"
							addNew="addPartner"
							showActions="true"
							edit="editPartner"
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default PartnersList;
