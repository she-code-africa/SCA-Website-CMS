import Loader from "components/Loader";
import React from "react";
import { useQuery } from "react-query";
import { getEnquiries } from "services";
import { enquiries as header } from "utils/headers";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import { BarrLoader } from "components/Loader";
import moment from "moment";

const Enquiries = () => {
	const { isLoading, data } = useQuery("enquiries", getEnquiries);

	return (
		<>
			<div className="flex flex-w w-full self-start z-40">
				{isLoading ? (
					<Loader />
				) : (
					<div className="w-full px-4">
						<Table width="full">
							<TableHeaderRow className="grid grid-cols-[150px_150px_1fr_100px] gap-2">
								{header.map(({ label }, index) => {
									return <TableHeader key={index}>{label}</TableHeader>;
								})}
								<TableHeader></TableHeader>
							</TableHeaderRow>
							<TableBody loading={isLoading}>
								<>
									{isLoading ? (
										<div className="min-h-[200px] flex items-center">
											<BarrLoader />
										</div>
									) : (
										<>
											{data.map(
												(
													{
														_id,
														fullName,
														email,
														description,

														createdAt,
													},
													index
												) => {
													return (
														<TableDataRow
															key={index}
															className="grid grid-cols-[150px_150px_1fr_100px] px-4 py-3 gap-2 bg-white">
															<TableData>
																<span>{fullName}</span>
															</TableData>
															<TableData>{email}</TableData>
															<TableData noTruncate>{description}</TableData>

															<TableData>
																{moment(createdAt).format("DD MMM, YYYY")}
															</TableData>
														</TableDataRow>
													);
												}
											)}
										</>
									)}
								</>
							</TableBody>
						</Table>
					</div>
				)}
			</div>
		</>
	);
};

export default Enquiries;
