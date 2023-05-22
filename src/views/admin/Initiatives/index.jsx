import Table from "components/Table";
import React, { useState, useCallback } from "react";
import Category from "components/Categories";
import { initiatives as header } from "utils/headers";

const tableData = [
	{
		title: "Data Science for Beginners",
	},
];

const ScholarshipCategories = ["Full", "Part"];

const Initiatives = () => {
	const [categories] = useState(ScholarshipCategories);
	const addCategory = useCallback(() => {
		console.log("add Category");
	}, []);

	return (
		<>
			<div className="flex flex-w w-full flex-col lg:flex-row -mt-20">
				<div className="w-full lg:w-9/12 px-4">
					{header && (
						<Table
							headers={header}
							tableData={tableData}
							tableHead="Initiatives"
							addNew
							edit
							view
						/>
					)}
				</div>
				<div className="w-full lg:w-3/12 px-4">
					<Category
						title="Scholarship Categories"
						categories={categories}
						addCategory={addCategory}
					/>
				</div>
			</div>
		</>
	);
};

export default Initiatives;
