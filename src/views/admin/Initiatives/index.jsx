import Table from "components/Table";
import React, { useState, useCallback } from "react";
import Category from "components/Categories";

const tableData = [
	{
		id: 1,
		title: "Data Science for Beginners",
	},
];

const ScholarshipCategories = ["Full", "Part"];

const Initiatives = () => {
	const [categories, setCategories] = useState(ScholarshipCategories);
	const addCategory = useCallback(() => {
		console.log("add Category");
	}, []);

	return (
		<>
			<div
				className="flex flex-w
    ">
				<div className="w-full lg:w-9/12 px-4">
					<div>
						<h1>Scholarships</h1>
					</div>
					<Table
						tableData={tableData}
						tableHead="Initiatives"
						addNew="addNewScholarship"
						showActions
						edit="editScholarship"
						view="viewScholarship"
					/>
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
