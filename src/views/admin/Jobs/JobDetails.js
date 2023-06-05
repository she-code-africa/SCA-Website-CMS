import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { getJob, publishJob, archiveJob } from "services";
import Loader from "components/Loader";
import { BsFillBuildingsFill } from "react-icons/bs";
import { MdOutlineLocationOn } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import { HiChartBar } from "react-icons/hi";
import moment from "moment";
import Modal from "components/Modal";

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
							<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-64">
								<div className="px-4">
									<div className="text-center mt-8">
										<h3 className="text-3xl font-semibold leading-normal text-slate-700 mb-2">
											{data?.title}
										</h3>
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
												<HiChartBar />
												<p className="ml-1 sm:ml-3 text-sm">
													Deadline:{" "}
													{moment(data?.deadline).format("Do MMM, YYYY")}
												</p>
											</div>

											<div className="mb-2 text-slate-600 flex items-center">
												<HiChartBar />
												<p className="ml-1 sm:ml-3 text-sm">
													Status: {data?.state}
												</p>
											</div>

											<div className="mb-2 text-slate-600 flex items-center">
												<HiChartBar />
												<p className="ml-1 sm:ml-3 text-sm">
													Type: {data?.state}
												</p>
											</div>
											<div className="mb-2 text-slate-600 flex items-center">
												<HiChartBar />
												<p className="ml-1 sm:ml-3 text-sm">
													Category: {data?.state}
												</p>
											</div>

											<div className="mb-2 text-slate-600 flex items-center">
												<HiChartBar />
												<p className="ml-1 sm:ml-3 text-sm">
													Published:{" "}
													{moment(data?.publishedDate).format("Do MMM, YYYY")}
												</p>
											</div>

											<div className="mb-2 text-slate-600 flex items-center">
												<HiChartBar />
												<p className="ml-1 sm:ml-3 text-sm">
													Created:{" "}
													{moment(data?.createdAt).format("Do MMM, YYYY")}
												</p>
											</div>

											<div className="mb-2 text-slate-600 flex items-center">
												<HiChartBar />
												<p className="ml-1 sm:ml-3 text-sm">
													Updated:{" "}
													{moment(data?.updatedAt).format("Do MMM, YYYY")}
												</p>
											</div>
										</div>
									</div>
									<div className="py-4 my-5 border-t border-slate-200 text-center grid">
										<div className="flex flex-wrap justify-center">
											<div className="w-full lg:w-10/12 px-4">
												<p className="text-left font-bold text-lg">
													Description
												</p>
												<p
													className="mb-4 text-lg leading-relaxed text-slate-700"
													style={{
														overflowY: "scroll",
														minHeight: "10 0px",
														maxHeight: "500px",
													}}>
													{data?.description}
												</p>
											</div>
										</div>

										<div className="ml-auto">
											<div>
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
