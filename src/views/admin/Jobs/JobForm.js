import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getJob, createJob, editJob } from "services";
import { useParams } from "react-router";
import { getJobCategories } from "services";
import { getJobTypes } from "services";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { paths } from "utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobForm = ({ newJob }) => {
	const intialJobValue = {
		title: "",
		description: "",
		deadline: new Date(),
		minimumExperience: "",
		applicationLink: "",
		salaryCurrency: "",
		salaryRange: "",
		location: "",
		guestPost: true,
		guestPostMetaData: {
			companyName: "",
			companyEmail: "",
			companyUrl: "",
		},
		company: {
			companyName: "",
			email: "",
			companyUrl: "",
		},
		jobType: "",
		jobCategory: "",
	};
	const queryClient = useQueryClient();
	const [job, setJob] = useState(intialJobValue);
	const {
		title,
		description,
		deadline,
		minimumExperience,
		applicationLink,
		salaryCurrency,
		salaryRange,
		location,
		guestPostMetaData,
		jobType,
		jobCategory,
		company,
	} = job;
	const [categories, setCategories] = useState([]);
	const [types, setTypes] = useState([]);

	const { id } = useParams();
	const { data } = useQuery(["job", id], () => getJob(id));

	useQuery("jobCategories", getJobCategories, {
		onSuccess: (data) => {
			setCategories(data);
		},
	});

	useQuery("jobTypes", getJobTypes, {
		onSuccess: (data) => {
			setTypes(data);
		},
	});

	const { mutate: addJob } = useMutation(createJob, {
		onSuccess: () => {
			toast.success("Job added successfully");
			setJob(intialJobValue);
		},
		onError: () => {
			toast.error("Error creating Job");
		},
	});

	const editMutation = useMutation(editJob, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["job"] });
			toast.success("Updated Job successfully");
		},
		onError: () => {
			toast.error("Error updating job");
			console.log("error");
		},
	});

	const updateJob = async (e) => {
		// Compare the current job state with the fetched data to identify updated fields
		const updatedFields = {};
		for (const key in job) {
			if (job[key] !== data[key]) {
				updatedFields[key] = job[key];
			}
		}
		await editMutation.mutateAsync({ id, data: updatedFields });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const isCompanyEmpty =
			!company.companyName && !company.email && !company.companyUrl;

		// Remove company if details are empty
		const updatedJob = isCompanyEmpty ? { ...job, company: undefined } : job;
		newJob ? addJob(updatedJob) : updateJob();
	};

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			console.log(name);
			setJob((prevJob) => ({
				...prevJob,
				[name]: value,
			}));
		},
		[setJob]
	);

	useEffect(() => {
		data && setJob(data);
	}, [data]);

	return (
		<>
			<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-100 border-0">
				<div className="rounded-t bg-white mb-0 px-6 py-6">
					<div className="text-center flex justify-between">
						<h6 className="text-slate-700 text-xl font-bold">Job Posting</h6>
						<Link to={paths.jobs}>
							<i className="fas fa-arrow-left"></i> Back
						</Link>
					</div>
				</div>
				<div className="flex-auto px-4 lg:px-10 py-10 pt-0">
					<form onSubmit={handleSubmit}>
						<h6 className="text-slate-400 text-sm mt-3 mb-6 font-bold uppercase">
							Job Details
						</h6>
						<div className="flex flex-wrap">
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600 text-xs font-bold mb-2"
										htmlFor="title">
										Title
									</label>
									<input
										type="text"
										className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
										name="title"
										value={title}
										onChange={handleInputChange}
									/>
								</div>
							</div>
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600 text-xs font-bold mb-2"
										htmlFor="applicationLink">
										Application Link
									</label>
									<input
										type="url"
										className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
										name="applicationLink"
										value={applicationLink}
										onChange={handleInputChange}
									/>
								</div>
							</div>
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600 text-xs font-bold mb-2"
										htmlFor="minimumExperience">
										Minimum Experience
									</label>
									<input
										type="text"
										className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
										name="minimumExperience"
										value={minimumExperience}
										onChange={handleInputChange}
									/>
								</div>
							</div>
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600 text-xs font-bold mb-2"
										htmlFor="salaryRange">
										Salary Range
									</label>
									<input
										className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
										name="salaryRange"
										value={salaryRange}
										onChange={handleInputChange}
									/>
								</div>
							</div>
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600 text-xs font-bold mb-2"
										htmlFor="salaryCurrency">
										Salary Currency
									</label>
									<input
										className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
										name="salaryCurrency"
										value={salaryCurrency}
										onChange={handleInputChange}
									/>
								</div>
							</div>
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600 text-xs font-bold mb-2"
										htmlFor="location">
										Location
									</label>
									<input
										className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
										name="location"
										value={location}
										onChange={handleInputChange}
									/>
								</div>
							</div>
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600 text-xs font-bold mb-2"
										htmlFor="jobType">
										Job Type
									</label>

									<select
										className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
										name="jobType"
										onChange={handleInputChange}>
										<option value="">Job Type</option>
										{types.map((type) => (
											<option
												value={type._id}
												className="my-2"
												key={type._id}
												name="jobType">
												{type.name}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600 text-xs font-bold mb-2"
										htmlFor="jobCategory">
										Job Category
									</label>

									<select
										className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
										name="jobCategory"
										onChange={handleInputChange}>
										<option value="">Job Category</option>
										{categories.map((category, index) => (
											<option
												value={category._id}
												className="my-2"
												key={index}
												name="jobCategory">
												{category.name}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600 text-xs font-bold mb-2"
										htmlFor="deadline">
										Deadline
									</label>
									<DatePicker
										selected={moment(deadline).toDate()}
										onChange={(date) =>
											setJob((prevJob) => ({
												...prevJob,
												deadline: date,
											}))
										}
									/>
								</div>
							</div>
							<div className="w-full lg:w-6/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600 text-xs font-bold mb-2"
										htmlFor="description">
										Description
									</label>
									<textarea
										className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
										name="description"
										value={description}
										onChange={handleInputChange}
									/>
								</div>
							</div>
						</div>

						<hr className="mt-6 border-b-1 border-slate-300" />

						<h6 className="text-slate-400 text-sm mt-3 mb-6 font-bold uppercase">
							Company Information
						</h6>
						<div className="flex flex-wrap">
							<div className="w-full lg:w-4/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600 text-xs font-bold mb-2"
										htmlFor="companyName">
										Company Name
									</label>
									<input
										type="text"
										className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
										name="companyName"
										value={
											guestPostMetaData
												? guestPostMetaData?.companyName
												: company?.companyName
										}
										onChange={(e) =>
											guestPostMetaData
												? setJob((prevJob) => ({
														...prevJob,
														guestPostMetaData: {
															...prevJob.guestPostMetaData,
															companyName: e.target.value,
														},
												  }))
												: setJob((prevJob) => ({
														...prevJob,
														company: {
															...prevJob.company,
															companyName: e.target.value,
														},
												  }))
										}
									/>
								</div>
							</div>
							<div className="w-full lg:w-4/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600 text-xs font-bold mb-2"
										htmlFor="companyEmail">
										Email
									</label>
									<input
										type="email"
										className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
										name="companyEmail"
										value={
											guestPostMetaData
												? guestPostMetaData?.companyEmail
												: company?.email
										}
										onChange={(e) =>
											guestPostMetaData
												? setJob((prevJob) => ({
														...prevJob,
														guestPostMetaData: {
															...prevJob.guestPostMetaData,
															companyEmail: e.target.value,
														},
												  }))
												: setJob((prevJob) => ({
														...prevJob,
														company: {
															...prevJob.company,
															email: e.target.value,
														},
												  }))
										}
									/>
								</div>
							</div>

							<div className="w-full lg:w-4/12 px-4">
								<div className="relative w-full mb-3">
									<label
										className="block uppercase text-slate-600 text-xs font-bold mb-2"
										htmlFor="companyUrl">
										Company Url
									</label>
									<input
										type="text"
										className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
										name="companyUrl"
										value={
											!guestPostMetaData
												? company?.companyUrl
												: guestPostMetaData?.companyUrl
										}
										onChange={(e) =>
											guestPostMetaData
												? setJob((prevJob) => ({
														...prevJob,
														guestPostMetaData: {
															...prevJob.guestPostMetaData,
															companyUrl: e.target.value,
														},
												  }))
												: setJob((prevJob) => ({
														...prevJob,
														company: {
															...prevJob.company,
															companyUrl: e.target.value,
														},
												  }))
										}
									/>
								</div>
							</div>
						</div>

						<div className="my-4">
							<button
								type="submit"
								className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150">
								SAVE
							</button>
						</div>
					</form>
				</div>
			</div>
			<ToastContainer />
		</>
	);
};

export default JobForm;
