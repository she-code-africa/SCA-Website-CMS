import React, { useState, useEffect } from "react";
import Table from "components/Table";
import { useQuery } from "react-query";
import { getPartners } from "services";
import { partners as header } from "utils/headers";
import Loader from "components/Loader";

const PartnersList = () => {
	const { isSuccess, isLoading, data } = useQuery("partners", getPartners);

	return (
		<>
			<div className="flex flex-wrap mt-4 w-full">
				{isLoading ? (
					<Loader />
				) : (
					<div className="w-full mb-12">
						{data && header && isSuccess && (
							<Table
								headers={header}
								tableData={data}
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
