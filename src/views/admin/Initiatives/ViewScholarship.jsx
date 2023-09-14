import React from "react";
import { useQuery } from "react-query";
import { getInitiative } from "services";
import { useParams } from "react-router-dom";
import Loader from "components/Loader";

const ScholarshipDetails = () => {
	const { id } = useParams();
	const { data, isLoading } = useQuery(["initiative", id], () =>
		getInitiative(id)
	);
	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className="container mx-auto px-4">
					<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
						<div className="px-6">
							<div className="text-center mt-12">
								<h3 className="text-3xl font-semibold leading-normal text-slate-700 mb-2">
									{data?.name}
								</h3>
								<div className="text-sm leading-normal mt-0 mb-2 text-slate-400 font-bold">
									<i className="fas fa-map-marker-alt mr-2 text-lg text-slate-400"></i>{" "}
									<a href={data?.link}>{data?.link}</a>
								</div>
							</div>
							<div className="mt-10 py-10 border-t border-slate-200 text-center">
								<div className="flex flex-wrap justify-center">
									<div className="w-full lg:w-9/12 px-4">
										<p className="mb-4 text-lg leading-relaxed text-slate-700">
											{data?.description}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ScholarshipDetails;
