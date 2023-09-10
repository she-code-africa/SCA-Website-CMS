import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { useParams, Link } from "react-router-dom";
import { getJob, publishJob, archiveJob } from "services";
import Loader from "components/Loader";
import {
	BsFillBuildingsFill,
	BsFillClockFill,
	BsArrowLeft,
} from "react-icons/bs";
import { LiaBusinessTimeSolid } from "react-icons/lia";
import { MdOutlineLocationOn, MdCategory } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { HiChartBar } from "react-icons/hi";
import { IoTimerOutline } from "react-icons/io5";
import { GrStatusInfo } from "react-icons/gr";
import moment from "moment";
import Modal from "components/Modal";
import { paths } from "utils";

const JobDetails = () => {
	const { id } = useParams();
	const [action, setAction] = useState();
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { isSuccess, data, isLoading } = useQuery(["events", id], () =>
		getJob(id)
	);

	const handleModal = () => {
		setIsOpen(!isOpen);
	};

	const publish = useMutation(publishJob, {
		onSuccess: () => {
			setIsOpen(false);
			setLoading(false);
		},
		onError: () => {
			setIsOpen(false);
			setLoading(false);
		},
	});

	const handlePublish = async () => {
		setLoading(true);
		await publish.mutateAsync({ id: id });
	};

	const archive = useMutation(archiveJob, {
		onSuccess: () => {
			setIsOpen(false);
			setLoading(false);
		},
		onError: () => {
			setIsOpen(false);
			setLoading(false);
		},
	});

	const handleArchive = async () => {
		setLoading(true);
		await archive.mutateAsync({ id: id });
	};

	const handleSubmit = () => {
		if (action === "publish") {
			handlePublish();
		} else if (action === "archive") {
			handleArchive();
		}
	};

	return (
		<>
			{isLoading || loading ? (
				<Loader />
			) : (
				isSuccess && (
					<>
						<div className="container mx-auto px-4 self-baseline">
							<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-10">
								<div className="px-4">
									<div className="text-center py-4">
										<div className="flex px-4 justify-between items-center my-4">
											<div className="flex items-center gap-2">
												<Link to={paths.jobs}>
													<BsArrowLeft size="1rem" />
												</Link>
												<h3 className="text-3xl font-semibold leading-normal text-slate-700">
													{data?.title}
												</h3>
											</div>
											<div className="flex items-center">
												<button
													className={`${
														data?.state === "published"
															? "opacity-50"
															: "opacity-0"
													} text-white bg-pink-500 px-4 py-1 mr-2 rounded`}
													disabled={data?.state === "published" ? true : false}
													onClick={() => {
														setAction("publish");
														handleModal();
													}}>
													Publish
												</button>
												<button
													className={`${
														data?.state === "archived"
															? "opacity-50"
															: "opacity-0"
													} bg-slate-600 text-white px-4 py-1 rounded`}
													disabled={data?.state === "archived" ? true : false}
													onClick={() => {
														setAction("archive");
														handleModal();
													}}>
													Archive
												</button>
											</div>
										</div>

										<div className="text-left grid job-grid">
											<div className="mb-2 text-slate-600 flex items-center">
												<BsFillBuildingsFill />
												<p className="ml-1 sm:ml-3 text-sm">
													Company:{" "}
													{(!data.company || data.guestPost) &&
														data.guestPostMetaData.companyName}{" "}
												</p>
											</div>
											<div className="mb-2 text-slate-600 flex items-center">
												<MdOutlineLocationOn />
												<p className="ml-1 sm:ml-3 text-sm ">
													Location: {data?.location}
												</p>
											</div>
											<div className="mb-2 text-slate-600 flex items-center">
												<FaMoneyBillWave />
												<p className="ml-1 sm:ml-3 text-sm">
													Salary Range: {data?.salaryCurrency}{" "}
													{data?.salaryRange}
												</p>
											</div>
											<div className="mb-2 text-slate-600 flex items-center">
												<HiChartBar />
												<p className="ml-1 sm:ml-3 text-sm">
													Min Experience: {data?.minimumExperience}
												</p>
											</div>

											<div className="mb-2 text-slate-600 flex items-center">
												<IoTimerOutline />
												<p className="ml-1 sm:ml-3 text-sm">
													Deadline:{" "}
													{moment(data?.deadline).format("Do MMM, YYYY")}
												</p>
											</div>

											<div className="mb-2 text-slate-600 flex items-center">
												<GrStatusInfo />
												<p className="ml-1 sm:ml-3 text-sm">
													Status: {data?.state}
												</p>
											</div>

											<div className="mb-2 text-slate-600 flex items-center">
												<LiaBusinessTimeSolid />
												<p className="ml-1 sm:ml-3 text-sm">
													Type: {data?.jobType?.name}
												</p>
											</div>
											<div className="mb-2 text-slate-600 flex items-center">
												<MdCategory />
												<p className="ml-1 sm:ml-3 text-sm">
													Category: {data?.jobCategory?.name}
												</p>
											</div>

											<div className="mb-2 text-slate-600 flex items-center">
												<BsFillClockFill />
												<p className="ml-1 sm:ml-3 text-sm">
													Published:{" "}
													{moment(data?.publishedDate).format("Do MMM, YYYY")}
												</p>
											</div>

											<div className="mb-2 text-slate-600 flex items-center">
												<BsFillClockFill />
												<p className="ml-1 sm:ml-3 text-sm">
													Created:{" "}
													{moment(data?.createdAt).format("Do MMM, YYYY")}
												</p>
											</div>

											<div className="mb-2 text-slate-600 flex items-center">
												<BsFillClockFill />
												<p className="ml-1 sm:ml-3 text-sm">
													Updated:{" "}
													{moment(data?.updatedAt).format("Do MMM, YYYY")}
												</p>
											</div>
										</div>
									</div>

									<div className="flex flex-wrap py-4 my-5 text-center">
										<div className="w-full px-4">
											<p className="text-left font-bold text-lg">Description</p>
											<div className="min-h-[80px] max-h-[300px] overflow-y-scroll">
												<p className="mb-4 text-lg leading-relaxed text-slate-700">
													{data?.description}
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<Modal isOpen={isOpen} title="Job" onClose={handleModal}>
							<div>
								<div>
									<p>Are you sure you want to?</p>
								</div>
								<div className="flex justify-center mt-3">
									<button
										className="mr-2 bg-red-600 text-white  px-4 py-1 rounded"
										onClick={handleSubmit}>
										Yes
									</button>
									<button
										className="bg-slate-600 px-4 py-1 text-white rounded"
										onClick={handleModal}>
										No
									</button>
								</div>
							</div>
						</Modal>
					</>
				)
			)}
		</>
	);
};

export default JobDetails;
