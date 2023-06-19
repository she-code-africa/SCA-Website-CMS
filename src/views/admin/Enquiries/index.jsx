import Loader from "components/Loader";
import Table from "components/Table";
import React from "react";
import { useQuery } from "react-query";
import { getEnquiries } from "services";
import { enquiries as header } from "utils/headers";

const Enquiries = () => {
	const { isLoading, data, isSuccess } = useQuery("enquiries", getEnquiries);

	return (
		<>
			<div className="flex flex-w w-full">
				{isLoading ? (
					<Loader />
				) : (
					<div className="w-full px-4">
						{data && isSuccess && (
							<Table tableData={data} tableHead="Enquiries" headers={header} />
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default Enquiries;
