import Table from "components/Table";
import React, { useState, useEffect } from "react";
import JobTypeCategory from "./JobTypeCategories";
import { useQuery } from "react-query";
import { getJobs } from "services";

const Jobs = () => {
	const [jobs, setJobs] = useState();
	const response = useQuery("jobs", getJobs);
	useEffect(() => {
		if (response.isSuccess) {
			setJobs(response.data);
		}
	}, [response]);
	return (
		<>
			<div
				className="flex flex-w
    ">
				<div className="w-full lg:w-9/12 px-4">
					<div>
						<h1>Jobs</h1>
						<button>Add New Job</button>
					</div>
					{jobs && (
						<Table
							tableData={jobs}
							tableHead="Jobs"
							addNew="addNewJob"
							showActions="true"
							edit="editJob"
							view="viewJob"
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
