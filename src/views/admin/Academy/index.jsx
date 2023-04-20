import Table from "components/Table";
import React from "react";
import AcademyCategory from "./Categories";

const tableData = [
	{
		id: 1,
		title: "Data Science for Beginners",
	},
];

const Academy = () => {
	return (
		<>
			<div
				className="flex flex-w
    ">
				<div className="w-full lg:w-9/12 px-4">
					<div>
						<h1>Academy</h1>
					</div>
					<Table tableData={tableData} tableHead="Academy" />
				</div>
				<div className="w-full lg:w-3/12 px-4">
					<AcademyCategory />
				</div>
			</div>
		</>
	);
};

export default Academy;
