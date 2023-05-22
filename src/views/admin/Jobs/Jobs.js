import Table from "components/Table";
import React, { useState, useEffect } from "react";
import JobTypeCategory from "./JobTypeCategories";
import { useQuery } from "react-query";
import { getJobs } from "services";
import { jobs as header } from "utils/headers";

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
			<div className="flex flex-col lg:flex-row flex-w w-full">
				<div className="w-full lg:w-9/12">
					{jobs && header && (
						<Table
							headers={header}
							tableData={jobs}
							tableHead="Jobs"
							actions={["view", "edit", "delete"]}
							addNew
						/>
					)}
				</div>
				<div className="w-full lg:w-3/12 pl-4">
					<JobTypeCategory />
				</div>
			</div>
		</>
	);
};

export default Jobs;
