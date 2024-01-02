import React, { useState } from "react";
import JobTypeCategory from "./JobTypeCategories";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getJobs, deleteJob } from "services";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "components/Modal/DeleteModal";

const Jobs = () => {
	const [jobs, setJobs] = useState();
	const [selectedId, setSelectedId] = useState("");
	const queryClient = useQueryClient();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const { isLoading } = useQuery("jobs", getJobs, {
		onSuccess: (data) => {
			setJobs(data);
		},
		onError: (err) => {
			toast.error("Error fetching Jobs");
		},
	});

	const { mutate } = useMutation(deleteJob, {
		onSuccess: () => {
			queryClient.invalidateQueries("jobs");
			toast.success("Job Deleted Successfuly");
		},
		onError: () => {
			console.log("error");
			toast.error("Error deleting Jobs");
		},
	});

	const handleDelete = () => {
		mutate(selectedId);
		handleModal();
	};

	const handleModal = () => {
		setIsDeleteModalOpen(!isDeleteModalOpen);
	};

	return (
		<>
			<div className="flex flex-col lg:flex-row flex-w w-full z-50">
				{isLoading ? (
					<Loader />
				) : (
					jobs && (
						<>
							<div className="w-full lg:w-9/12 bg-white rounded-md">
								<div className="flex items-center justify-between px-4 mt-3">
									<h5 className="font-medium text-xl">Jobs</h5>
									<Link
										to={paths.addNewJob}
										className="rounded bg-pink-500 text-white text-xs  px-4 py-2">
										Add
									</Link>
								</div>
								<Table width="full">
									<TableHeaderRow className="grid grid-cols-[100px_1fr_100px_100px_80px_100px_30px]">
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

																updatedAt,
																createdAt,
															},
															index
														) => {
															return (
																<TableDataRow
																	key={index}
																	className="grid grid-cols-[100px_1fr_100px_100px_80px_100px_30px] px-4 py-3 bg-white gap-2">
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
																		{moment(updatedAt).format("DD MMM, YYYY")}
																	</TableData>

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
					)
				)}
			</div>

			{isDeleteModalOpen && (
				<DeleteModal
					title="Delete Job Posting"
					isOpen={isDeleteModalOpen}
					handleModal={handleModal}
					handleDelete={handleDelete}
				/>
			)}
			<ToastContainer />
		</>
	);
};

export default Jobs;
