import { useQuery } from "react-query";
import {
	TableHeaderRow,
	TableHeader,
	Table,
	TableDataRow,
	TableData,
	TableBody,
} from "components/Table/DisplayTable";
import React, { useState } from "react";
import { schoolPrograms as schoolProgramsHeaders } from "utils/headers";
import { getSchoolPrograms } from "services";
import moment from "moment";
import { TableActions } from "components/Table/DisplayTable";
import { Link } from "react-router-dom";
import { paths } from "utils";
import { BarrLoader } from "components/Loader";

const SchoolPrograms = () => {
	const [schoolPrograms, setSchoolPrograms] = useState([]);
	const { isLoading } = useQuery("school-programs", getSchoolPrograms, {
		onSuccess: (data) => {
			setSchoolPrograms(data);
		},
		onError: (err) => {
			console.log(err);
			console.log("error");
		},
	});

	return (
		<>
			<div className="flex items-center justify-between px-2">
				<h5 className="font-medium text-xl mt-3">School Programs</h5>
				<Link
					to={paths.addSchoolProgram}
					className="rounded bg-pink-500 text-white text-xs  px-4 py-2">
					Add
				</Link>
			</div>
			<Table width="full">
				<TableHeaderRow className="grid grid-cols-[50px_60px_1fr_1fr_100px_100px_50px]">
					{schoolProgramsHeaders.map(({ label }, index) => {
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
								{schoolPrograms.map(
									(
										{
											_id,
											title,
											cohort,
											briefContent,
											publishDate,
											school,
											createdAt,
										},
										index
									) => {
										return (
											<TableDataRow
												key={index}
												className="grid grid-cols-[60px_60px_1fr_1fr_100px_100px_50px] px-4 py-3 bg-white">
												<TableData>
													<span>{title}</span>
												</TableData>
												<TableData>{cohort}</TableData>
												<TableData>{briefContent}</TableData>
												<TableData>{school.name}</TableData>
												<TableData>
													{publishDate
														? moment(publishDate).format("DD MMM, YYYY")
														: "---"}
												</TableData>
												<TableData>
													{moment(createdAt).format("DD MMM, YYYY")}
												</TableData>
												<TableData noTruncate>
													<TableActions>
														<Link
															to={`${paths.viewSchoolProgram}/${_id}`}
															className="mb-1 px-3 text-sm text-left">
															View
														</Link>
														<Link
															to={`${paths.editSchoolProgram}/${_id}`}
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
		</>
	);
};

export default SchoolPrograms;
