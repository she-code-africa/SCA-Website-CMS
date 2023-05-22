import React, { useState, useEffect } from "react";
import Table from "components/Table";
import { useQuery } from "react-query";
import { getPartners } from "services";
import { partners as header } from "utils/headers";

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
			<div className="flex flex-wrap mt-4 w-full">
				<div className="w-full mb-12">
					{partners && header && (
						<Table
							headers={header}
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
