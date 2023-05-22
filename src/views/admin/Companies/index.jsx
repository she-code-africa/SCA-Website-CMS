import Table from "components/Table";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getCompanies } from "services";
import { companies as companyHeader } from "utils/headers";
import Loader from "components/Loader";

const Companies = () => {
	const [companies, setCompanies] = useState();
	const { isSuccess, isLoading, data } = useQuery("team", getCompanies);
	useEffect(() => {
		if (isSuccess) {
			setCompanies(data);
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
						{companies && (
							<Table
								headers={companyHeader}
								tableData={companies}
								tableHead="Companies"
								actions={["view", "edit"]}
							/>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default Companies;
