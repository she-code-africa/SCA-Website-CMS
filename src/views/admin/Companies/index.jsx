import Table from "components/Table";
import React from "react";
import { useQuery } from "react-query";
import { getCompanies } from "services";
import { companies as companyHeader } from "utils/headers";
import Loader from "components/Loader";

const Companies = () => {
	const { isSuccess, isLoading, data } = useQuery("team", getCompanies);
	return (
		<>
			<div className="flex flex-w w-full">
				{isLoading ? (
					<Loader />
				) : (
					<div className="w-full px-4">
						{data && isSuccess && companyHeader && (
							<Table
								headers={companyHeader}
								tableData={data}
								tableHead="Companies"
								actions={["view", "edit"]}
							/>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default Companies;
