import React, { useState, useEffect } from "react";
import Table from "components/Table";
import { useQuery } from "react-query";
import { getPartners } from "services";
import { partners as header } from "utils/headers";
import Loader from "components/Loader";

const PartnersList = () => {
	const [partners, setPartners] = useState([]);
	const { isSuccess, isLoading, data } = useQuery("partners", getPartners);
	useEffect(() => {
		if (isSuccess) {
			setPartners(data);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess]);
	return (
		<>
			<div className="flex flex-wrap mt-4 w-full">
				{isLoading ? (
					<Loader />
				) : (
					<div className="w-full mb-12">
						{partners && header && (
							<Table
								headers={header}
								tableData={partners}
								tableHead="Partners"
								actions={["edit", "delete"]}
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
