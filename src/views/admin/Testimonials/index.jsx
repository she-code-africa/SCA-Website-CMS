import Table from "components/Table";
import React from "react";
import { testimonials as header } from "utils/headers";

const tableData = [
	{
		id: 1,
		name: "Olubukunmi Awo",
	},
];

const Testimonials = () => {
	return (
		<>
			<div className="flex flex-w w-full">
				<div className="w-full px-4">
					<Table
						tableData={tableData}
						tableHead="Testimonials"
						headers={header}
						actions={["view", "edit"]}
						addNew
					/>
				</div>
			</div>
		</>
	);
};

export default Testimonials;
