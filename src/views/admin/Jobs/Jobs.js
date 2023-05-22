import Table from "components/Table";
import React, { useState, useEffect } from "react";
import JobTypeCategory from "./JobTypeCategories";
import { useQuery } from "react-query";
import { getJobs } from "services";

const Jobs = () => {
	const [jobs, setJobs] = useState();
	const response = useQuery("jobs", getJobs);
	const headers = [
		{
			value: "title",
			label: "Title",
		},
		{
			value: "description",
			label: "Description",
		},
		{
			value: "deadline",
			label: "Deadline",
		},
		{
			value: "minimumExperience",
			label: "Minimum Experience",
		},
		{
			value: "location",
			label: "Location",
		},
		{
			value: "salaryRange",
			label: "Salary Range",
		},
	];
	useEffect(() => {
		if (response.isSuccess) {
			setJobs(response.data);
		}
	}, [response]);
	return (
		<>
			<div className="flex flex-col lg:flex-row flex-w w-full">
				<div className="w-full lg:w-9/12">
					<div>
						<h1>Jobs</h1>
						<button>Add New Job</button>
					</div>
					{jobs && (
						<Table
							headers={headers}
							tableData={jobs}
							tableHead="Jobs"
							addNew
							edit
							view
							deleteBtn
						/>
					)}
				</div>
				<div className="w-full lg:w-3/12 px-4">
					<JobTypeCategory />
				</div>
			</div>
		</>
	);
};

export default Jobs;
