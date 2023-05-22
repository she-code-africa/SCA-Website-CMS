import Table from "components/Table";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getCompanies } from "services";

const Companies = () => {
	const [companies, setCompanies] = useState();
	const response = useQuery("team", getCompanies);
	const headers = [
		{
			value: "companyName",
			label: "Company Name",
		},
		{
			value: "email",
			label: "email",
		},
		{
			value: "companyLocation",
			label: "Location",
		},
		{
			value: "companyPhone",
			label: "Phone",
		},
		{
			value: "createdAt",
			label: "Created At",
		},
	];
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
					<div>
						<h1>Companies</h1>
					</div>
					{companies && (
						<Table
							headers={headers}
							tableData={companies}
							tableHead="Companies"
							edit
							view
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default Companies;
