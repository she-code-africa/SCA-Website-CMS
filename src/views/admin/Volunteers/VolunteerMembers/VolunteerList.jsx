import React from "react";
import { Link } from "react-router-dom";

// components

// utils
import { paths } from "utils";

const VolunteerList = () => {
	return (
		<>
			<div className="flex flex-wrap mt-4 w-full">
				<div className="w-full mb-12 px-4">
					<div
						className={
							"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"
						}>
						<div className="rounded-t mb-0 px-4 py-3 border-0">
							<div className="flex flex-wrap items-center">
								<div className="relative w-full px-4 max-w-full flex justify-between flex-grow flex-1">
									<h3 className={"font-semibold text-lg  text-slate-700"}>
										SCA Volunteers
									</h3>
									<Link
										to={paths.addVolunteer}
										className="bg-pink-500 py-2 px-4 rounded text-white text-sm">
										Add Volunteer
									</Link>
								</div>
							</div>
						</div>
						<div className="block w-full overflow-x-auto">
							{/* Projects table */}
							<table className="items-center w-full bg-transparent border-collapse">
								<thead>
									<tr>
										<th
											className={
												"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left  bg-slate-50 text-slate-500 border-slate-100"
											}>
											Name
										</th>
										<th
											className={
												"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left  bg-slate-50 text-slate-500 border-slate-100"
											}>
											Role
										</th>
										<th
											className={
												"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left   bg-slate-50 text-slate-500 border-slate-100"
											}>
											Unit
										</th>

										<th
											className={
												"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left  bg-slate-50 text-slate-500 border-slate-100"
											}></th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
											<img
												src={require("assets/img/bootstrap.jpg").default}
												className="h-12 w-12 bg-white rounded-full border"
												alt="..."></img>{" "}
											<span className={"ml-3 font-bold  text-slate-600"}>
												Adeola Adekoyejo
											</span>
										</th>
										<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
											Technical Facilitator
										</td>
										<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
											Engineering Team
										</td>

										<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right"></td>
									</tr>
									<tr>
										<th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
											<img
												src={require("assets/img/bootstrap.jpg").default}
												className="h-12 w-12 bg-white rounded-full border"
												alt="..."></img>{" "}
											<span className={"ml-3 font-bold  text-slate-600"}>
												Adeola Adekoyejo
											</span>
										</th>
										<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
											Technical Facilitator
										</td>
										<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
											Engineering Team
										</td>

										<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right"></td>
									</tr>
									<tr>
										<th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
											<img
												src={require("assets/img/bootstrap.jpg").default}
												className="h-12 w-12 bg-white rounded-full border"
												alt="..."></img>{" "}
											<span className={"ml-3 font-bold  text-slate-600"}>
												Adeola Adekoyejo
											</span>
										</th>
										<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
											Technical Facilitator
										</td>
										<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
											Engineering Team
										</td>

										<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right"></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default VolunteerList;
