import Table from "components/Table";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";

const tableData = [
	{
		id: 1,
		title: "How can I join the community",
		name: "Olalekan Abisola",
	},
];

const Enquiries = () => {
	return (
		<>
			<div className="flex flex-w">
				<div className="w-full px-4">
					<div>
						<h1>Enquiries</h1>
					</div>
					<Table tableData={tableData} tableHead="Enquiries" />
				</div>
			</div>
		</>
	);
};

export default Enquiries;
