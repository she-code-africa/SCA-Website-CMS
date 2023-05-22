import Table from "components/Table";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getCompanies } from "services";
import { companies as companyHeader } from "utils/headers";

const Companies = () => {
	const [companies, setCompanies] = useState();
	const response = useQuery("team", getCompanies);
	useEffect(() => {
		if (response.isSuccess) {
			setCompanies(response.data);
		}
		console.log(response);
	}, [response]);
	return (
		<>
			<div className="flex flex-w w-full">
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
			</div>
		</>
	);
};

export default Companies;
