import React, { useState } from "react";
import { useQuery } from "react-query";
import { getCompanies } from "services";
import { companies as companyHeader } from "utils/headers";
import Loader from "components/Loader";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
	TableActions,
} from "components/Table/DisplayTable";
import { Link } from "react-router-dom";
import { paths } from "utils";
import { BarrLoader } from "components/Loader";
import moment from "moment";

const Companies = () => {
	const [companies, setCompanies] = useState([]);
	const { isLoading } = useQuery("companies", getCompanies, {
		onSuccess: (data) => {
			setCompanies(data);
		},
		onError: (err) => {
			console.log(err);
			console.log("error");
		},
	});
	return (
		<>
			<div className="flex w-full self-start">
				{isLoading ? (
					<Loader />
				) : (
					<div className="w-full px-4 z-40">
						<Table width="full">
							<TableHeaderRow className="grid grid-cols-[1fr_1fr_1fr_200px_100px_100px_30px]">
								{companyHeader.map(({ label }, index) => {
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
											{companies.map(
												(
													{
														_id,
														companyName,
														email,
														companyLocation,
														state,
														companyPhone,
														createdAt,
													},
													index
												) => {
													return (
														<TableDataRow
															key={index}
															className="grid grid-cols-[1fr_1fr_1fr_200px_100px_100px_30px] px-4 py-3 bg-white">
															<TableData>
																<span>{companyName}</span>
															</TableData>
															<TableData>{email}</TableData>
															<TableData>{companyLocation}</TableData>
															<TableData>{companyPhone}</TableData>
															<TableData>{state}</TableData>
															<TableData>
																{moment(createdAt).format("DD MMM, YYYY")}
															</TableData>
															<TableData noTruncate>
																<TableActions>
																	<Link
																		to={`${paths.viewCompany}/${_id}`}
																		className="mb-1 px-3 text-sm text-left">
																		View
																	</Link>
																	<Link
																		to={`${paths.editCompany}/${_id}`}
																		className="mb-1 px-3 text-sm text-left">
																		Edit
																	</Link>
																</TableActions>
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

export default Companies;
