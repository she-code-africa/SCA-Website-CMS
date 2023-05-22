import Loader from "components/Loader";
import Table from "components/Table";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getEnquiries } from "services";

const Enquiries = () => {
	const [enquiries, setEnquiries] = useState([]);
	const { isLoading, data, isSuccess } = useQuery("enquiries", getEnquiries);

	useEffect(() => {
		if (isSuccess) {
			setEnquiries(data);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess]);
	const headers = [
		{
			value: "fullName",
			label: "Full Name",
		},
		{
			value: "email",
			label: "Email",
		},
		{
			value: "description",
			label: "Description",
		},
	];
	return (
		<>
			<div className="flex flex-w w-full">
				{isLoading ? (
					<Loader />
				) : (
					<div className="w-full px-4">
						{data && (
							<Table
								tableData={enquiries}
								tableHead="Enquiries"
								headers={headers}
							/>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default Enquiries;
