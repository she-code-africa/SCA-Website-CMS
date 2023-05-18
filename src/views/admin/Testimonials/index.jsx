import Table from "components/Table";
import React from "react";

const tableData = [
	{
		id: 1,
		name: "Olubukunmi Awo",
	},
];

const Testimonials = () => {
	return (
		<>
			<div className="flex flex-w">
				<div className="w-full px-4">
					<div>
						<h1>Testimonials</h1>
					</div>
					<Table
						tableData={tableData}
						tableHead="Testimonials"
						addNew="addNewTestimonial"
						showActions
						edit="editTestimonial"
						view="viewTestimonial"
					/>
				</div>
			</div>
		</>
	);
};

export default Testimonials;
