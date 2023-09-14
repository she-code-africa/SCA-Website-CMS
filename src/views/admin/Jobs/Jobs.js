import React, { useState } from "react";
import JobTypeCategory from "./JobTypeCategories";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getJobs } from "services";
import { jobs as header } from "utils/headers";
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
import Modal from "components/Modal";
import { deleteJob } from "services";

const Jobs = () => {
	const [jobs, setJobs] = useState();
	const [isOpen, setIsOpen] = useState(false);
	const [selectedId, setSelectedId] = useState("");
	const queryClient = useQueryClient();

	const { isLoading } = useQuery("jobs", getJobs, {
		onSuccess: (data) => {
			setJobs(data);
		},
		onError: (err) => {
			console.log(err);
			console.log("error");
		},
	});

	const { mutate } = useMutation(deleteJob, {
		onSuccess: () => {
			queryClient.invalidateQueries("jobs");
		},
		onError: () => {
			console.log("error");
		},
	});

	const handleDelete = () => {
		mutate(selectedId);
		setIsOpen(!isOpen);
	};

	const handleModal = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			<div className="flex flex-col lg:flex-row flex-w w-full z-50">
				{isLoading ? (
					<Loader />
				) : (
					<>
						<div className="w-full lg:w-9/12 bg-white rounded-md">
							<div className="flex items-center justify-between px-4 mt-3">
								<h5 className="font-medium text-xl">Jobs</h5>
								<Link
									to={paths.addMember}
									className="rounded bg-pink-500 text-white text-xs  px-4 py-2">
									Add
								</Link>
							</div>
							<Table width="full">
								<TableHeaderRow className="grid grid-cols-[100px_1fr_100px_100px_80px_20px]">
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
												{jobs.map(
													(
														{
															_id,
															title,
															description,
															location,
															deadline,

															createdAt,
														},
														index
													) => {
														return (
															<TableDataRow
																key={index}
																className="grid grid-cols-[100px_1fr_100px_100px_80px_20px] px-4 py-3 bg-white gap-2">
																<TableData>
																	<span>{title}</span>
																</TableData>
																<TableData>{description}</TableData>
																<TableData>
																	{deadline
																		? moment(deadline).format("DD MMM, YYYY")
																		: "---"}
																</TableData>

																<TableData>{location}</TableData>

																<TableData>
																	{moment(createdAt).format("DD MMM, YYYY")}
																</TableData>
																<TableData noTruncate>
																	<TableActions>
																		<Link
																			to={`${paths.viewJob}/${_id}`}
																			className="mb-1 px-3 text-sm text-left">
																			View
																		</Link>
																		<Link
																			to={`${paths.editJob}/${_id}`}
																			className="mb-1 px-3 text-sm text-left">
																			Edit
																		</Link>
																		<button
																			className="mb-1 px-3 text-sm text-left"
																			onClick={() => {
																				setSelectedId(_id);
																				handleModal();
																			}}>
																			Delete
																		</button>
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
						<div className="w-full lg:w-3/12 pl-4">
							<JobTypeCategory />
						</div>
					</>
				)}
			</div>

			<Modal title="Delete Job" isOpen={isOpen} onClose={handleModal}>
				<div>
					<div>
						<p>Are you sure you want to delete this job posting?</p>
					</div>
					<div className="flex justify-center mt-3">
						<button
							className="mr-2 bg-red-600 text-white  px-4 py-1 rounded"
							onClick={() => {
								handleDelete();
							}}>
							Yes
						</button>
						<button
							className="bg-slate-600 px-4 py-1 text-white rounded"
							onClick={() => setIsOpen(false)}>
							No
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default Jobs;
