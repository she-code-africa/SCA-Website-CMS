import Table from "components/Table";
import React from "react";
import AcademyCategory from "./Categories";
import { academy as academyHeaders } from "utils/headers";

const tableData = [
	{
		title: "Data Science for Beginners",
	},
];

const Academy = () => {
	return (
		<>
			<div className="flex flex-w w-full flex-col lg:flex-row -mt-20">
				<div className="w-full lg:w-9/12">
					{academyHeaders && (
						<Table
							headers={academyHeaders}
							tableData={tableData}
							tableHead="Academy"
						/>
					)}
				</div>
				<div className="w-full lg:w-3/12">
					<AcademyCategory />
				</div>
			</div>
		</>
	);
};

export default Academy;
