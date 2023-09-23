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
import { courses as headers } from "utils/headers";
import { getCourses } from "services";
import moment from "moment";
import { TableActions } from "components/Table/DisplayTable";
import { Link } from "react-router-dom";
import { paths } from "utils";
import { BarrLoader } from "components/Loader";

const Courses = () => {
	const [courses, setCourses] = useState([]);
	const { isLoading } = useQuery("courses", getCourses, {
		onSuccess: (data) => {
			setCourses(data);
		},
		onError: (err) => {
			console.log(err);
			console.log("error");
		},
	});

	return (
		<div className="bg-white rounded-md">
			<div className="flex items-center justify-between px-2 ">
				<h5 className="font-medium text-xl mt-3">Courses</h5>
				<Link
					to={paths.addCourse}
					className="rounded bg-pink-500 text-white text-xs px-4 py-2">
					Add
				</Link>
			</div>
			<Table width="full">
				<TableHeaderRow className="grid grid-cols-5">
					{headers.map(({ label }, index) => {
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
								{courses.map(
									(
										{
											_id,
											name,
											shortDescription,
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
												className="grid grid-cols-5 px-4 py-3 bg-white">
												<TableData>{name}</TableData>
												<TableData>{shortDescription}</TableData>

												<TableData>{school.name}</TableData>

												<TableData>
													{moment(createdAt).format("DD MMM, YYYY")}
												</TableData>
												<TableData noTruncate>
													<TableActions>
														<button className="mb-1 px-3 text-sm text-left">
															View
														</button>
														<button className="mb-1 px-3 text-sm text-left">
															Delete
														</button>
														<Link
															to={`${paths.editCourse}/${_id}`}
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
	);
};

export default Courses;
