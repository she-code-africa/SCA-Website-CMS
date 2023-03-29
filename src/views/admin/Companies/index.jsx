import Table from "components/Table";
import React from "react";

const tableData = [
	{
		id: "63ee3e797f41533415ce67f9",
		companyName: "Rocket Funds 3",
		email: "rocketfunds3@yahoo.com",
		companyUrl: "www.rocketfunds.com",
		companyCategory: "63824850916f49748e338bbf",
		companyDescription:
			"We are a new generation wallet for peer to peer transactions",
		companyLocation: "Remote",
		contactName: "May Landers",
		companyPhone: "080980XXXXXX",
		registeredDate: "2023-02-16T14:32:25.954Z",
	},
	{
		id: "63ee3e797f41533415ce67f9",
		companyName: "Rocket Funds ",
		email: "rocketfunds3@yahoo.com",
		companyUrl: "www.rocketfunds.com",
		companyCategory: "63824850916f49748e338bbf",
		companyDescription:
			"We are a new generation wallet for peer to peer transactions",
		companyLocation: "Remote",
		contactName: "May Landers",
		companyPhone: "080980XXXXXX",
		registeredDate: "2023-02-16T14:32:25.954Z",
	},
	// Add more objects for more rows
];

const Companies = () => {
	return (
		<>
			<div
				className="flex flex-w
    ">
				<div className="w-full px-4">
					<div>
						<h1>Companies</h1>
					</div>
					<Table
						tableData={tableData}
						tableHead="Companies"
						showActions="true"
						edit="editCompany"
						view="viewCompany"
					/>
				</div>
			</div>
		</>
	);
};

export default Companies;
