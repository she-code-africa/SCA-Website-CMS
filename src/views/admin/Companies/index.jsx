import Table from "components/Table";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getCompanies } from "services";

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
			<div
				className="flex flex-w
    ">
				<div className="w-full px-4">
					<div>
						<h1>Companies</h1>
					</div>
					{companies && (
						<Table
							tableData={companies}
							tableHead="Companies"
							showActions="true"
							edit="editCompany"
							view="viewCompany"
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default Companies;
