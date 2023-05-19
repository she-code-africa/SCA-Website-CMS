import Table from "components/Table";
import React from "react";

const tableData = [
	{
		id: 1,
		name: "Olubukunmi Awo",
	},
];

const Testimonials = () => {
	const headers = [
		{
			value: "id",
			label: "ID",
		},
		{
			value: "name",
			label: "Name",
		},
	];
	return (
		<>
			<div className="flex flex-w w-full">
				<div className="w-full px-4">
					<Table
						tableData={tableData}
						tableHead="Testimonials"
						headers={headers}
						addNew
						edit
						view
					/>
				</div>
			</div>
		</>
	);
};

export default Testimonials;
