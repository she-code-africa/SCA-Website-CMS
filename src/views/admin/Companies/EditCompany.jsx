import React, { useState, useCallback } from "react";
import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getCompany } from "services";
import Loader from "components/Loader";
import { editCompany } from "services";
import { Link } from "react-router-dom";
import { paths } from "utils";

const CompanyForm = () => {
	const intialCompanyValue = {
		companyName: "",
		email: "",
		companyUrl: "",
		companyPhone: "",
		companyDescription: "",
		companyLocation: "",
		contactName: "",
	};
	const queryClient = useQueryClient();
	const { id } = useParams();
	const [company, setCompany] = useState(intialCompanyValue);
	const {
		companyName,
		email,
		companyUrl,
		companyDescription,
		companyPhone,
		companyLocation,
		contactName,
	} = company;
	const { isLoading, data } = useQuery(["company", id], () => getCompany(id), {
		onSuccess: (data) => {
			setCompany(data[0]);
		},
		onError: (err) => {
			console.log(err);
		},
	});

	const { mutateAsync } = useMutation(editCompany, {
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["company"] });
		},
		onError: () => {
			console.log("error");
		},
	});

	const handleInputChange = useCallback(
		(e) => {
			const { name, value } = e.target;
			setCompany((prevJob) => ({
				...prevJob,
				[name]: value,
			}));
		},
		[setCompany]
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const updatedFields = {};
		for (const key in company) {
			if (company[key] !== data[0][key]) {
				updatedFields[key] = company[key];
			}
		}

		await mutateAsync({ id, data: updatedFields });
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-100 border-0">
					<div className="rounded-t bg-white mb-0 px-6 py-6">
						<div className="text-center flex gap-2 items-center">
							<Link to={paths.companies}>
								<i className="fas fa-arrow-left"></i>
							</Link>
							<h6 className="text-slate-700 text-xl font-bold">
								Edit Company{" "}
							</h6>
						</div>
					</div>
					<div className="flex-auto px-4 lg:px-10 py-10 pt-0">
						<form onSubmit={handleSubmit}>
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
											value={companyName}
											onChange={handleInputChange}
										/>
									</div>
								</div>
								<div className="w-full lg:w-4/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="email">
											Email
										</label>
										<input
											type="email"
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="email"
											value={email}
											onChange={handleInputChange}
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
											type="url"
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="companyUrl"
											value={companyUrl}
											onChange={handleInputChange}
										/>
									</div>
								</div>

								<div className="w-full lg:w-4/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="companyPhone">
											Company Phone
										</label>
										<input
											type="text"
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="companyPhone"
											value={companyPhone}
											onChange={handleInputChange}
										/>
									</div>
								</div>

								<div className="w-full lg:w-4/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="companyLocation">
											Company Location
										</label>
										<input
											type="text"
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="companyLocation"
											value={companyLocation}
											onChange={handleInputChange}
										/>
									</div>
								</div>

								<div className="w-full lg:w-4/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="contactName">
											Contact Name
										</label>
										<input
											type="text"
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="contactName"
											value={contactName}
											onChange={handleInputChange}
										/>
									</div>
								</div>

								<div className="w-full lg:w-4/12 px-4">
									<div className="relative w-full mb-3">
										<label
											className="block uppercase text-slate-600 text-xs font-bold mb-2"
											htmlFor="companyDescription">
											Company Description
										</label>
										<textarea
											type="text"
											className="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
											name="companyDescription"
											value={companyDescription}
											onChange={handleInputChange}
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
			)}
		</>
	);
};

export default CompanyForm;
