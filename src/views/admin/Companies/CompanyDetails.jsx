import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { getCompany } from "services";
import moment from "moment";
import { FiExternalLink } from "react-icons/fi";
import { HiSquaresPlus } from "react-icons/hi2";
import Loader from "components/Loader";
import JobCard from "components/Cards/JobCard";
import { paths } from "utils";
import { unarchiveCompany } from "services";
import { archiveCompany } from "services";
import Modal from "components/Modal";

const CompanyDetails = () => {
	const { id } = useParams();
	const [company, setCompany] = useState();
	const [isOpen, setIsOpen] = useState(false);

	const queryClient = useQueryClient();
	const { isLoading } = useQuery(["company", id], () => getCompany(id), {
		onSuccess: (data) => {
			setCompany(data[0]);
		},
	});

	const { mutateAsync: publish } = useMutation(archiveCompany, {
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["company"] });
			setIsOpen(false);
		},
	});

	const { mutateAsync: unpublish } = useMutation(unarchiveCompany, {
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["company"] });
			setIsOpen(false);
		},
	});

	const handlePublish = async () => {
		company.state === "published"
			? await unpublish(company._id)
			: await publish(company._id);
	};

	const handleModal = () => {
		setIsOpen(!isOpen);
	};
	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className="container mx-auto px-4 self-start">
					<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
						<div className="p-6">
							<div className="mb-3">
								<Link to={paths.companies}>
									<i className="fas fa-arrow-left"></i> Back
								</Link>
							</div>
							<div className="mb-32 text-sm">
								<div className="flex gap-1 items-center">
									<h3 className="text-3xl font-semibold leading-normal text-slate-700 mb-2">
										{company?.companyName}
									</h3>
									<a href={`${company?.companyUrl}`}>
										<FiExternalLink size="1.5rem" />
									</a>
								</div>

								<div>
									<div className="text-sm leading-normal mt-0 mb-2 text-slate-400 font-bold uppercase">
										<i className="fas fa-map-marker-alt mr-2 text-lg text-slate-400"></i>{" "}
										{company?.companyLocation}
									</div>
									<div className="mb-2 text-slate-600">
										<i className="fas fa-briefcase mr-2 text-lg text-slate-400"></i>
										email: {company?.email}
									</div>

									<div className="mb-2 text-slate-600">
										<i className="fas fa-briefcase mr-2 text-lg text-slate-400"></i>
										Phone Number: {company?.companyPhone}
									</div>
									<div className="mb-2 text-slate-600">
										<i className="fas fa-briefcase mr-2 text-lg text-slate-400"></i>
										Registered:{" "}
										{moment(company?.registeredDate).format("DD MMM, YYYY")}
									</div>
								</div>
								<div className="w-full flex justify-end">
									<button
										className="rounded-lg bg-slate-500 px-4 py-2 text-sm text-white"
										onClick={handleModal}>
										{company?.state === "active" ? `Archive` : `Unarchive`}
									</button>
								</div>
								<div>
									<p className="font-medium text-lg my-2">
										Company Description
									</p>
									<p className="ml-2">{company?.companyDescription}</p>
								</div>
							</div>

							<div>
								<h6 className="font-medium text-xl">Jobs</h6>

								<div className="grid grid-cols-3 gap-4 py-4">
									{company?.jobs?.length > 0 && (
										<>
											{company?.jobs?.map(
												({ _id, title, createdAt, location }, index) => {
													return (
														<JobCard
															key={index}
															id={_id}
															title={title}
															createdAt={createdAt}
															location={location}
														/>
													);
												}
											)}
										</>
									)}

									<div
										className={`${
											company?.jobs.length === 0
												? "col-span-3 py-12 mx-auto shadow-none text-base"
												: ""
										} w-full flex justify-center border rounded-lg shadow`}>
										<Link
											to={paths.addNewJob}
											className="hover:text-pink-500 flex items-center gap-2 mt-1 text-sm">
											<HiSquaresPlus />
											<p>Add job</p>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			<Modal
				isOpen={isOpen}
				title={`${
					company?.state === "active" ? `Archive` : `Unarchive`
				} School Program`}
				onClose={handleModal}>
				<div>
					<div>
						<p>
							Are you sure you want to {""}
							{`${company?.state === "active" ? "archive" : "unarchive"}`}
							{""} this company?
						</p>
					</div>
					<div className="flex justify-center mt-3">
						<button
							className="mr-2 bg-red-600 text-white  px-4 py-1 rounded"
							onClick={handlePublish}>
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
	);
};

export default CompanyDetails;
