import React from "react";

const CompanyDetails = () => {
	return (
		<>
			<div className="container mx-auto px-4">
				<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-64">
					<div className="px-6">
						<div className="text-center mt-12">
							<h3 className="text-3xl font-semibold leading-normal text-slate-700 mb-2">
								Rocket Funds
							</h3>
							<div className="text-sm leading-normal mt-0 mb-2 text-slate-400 font-bold uppercase">
								<i className="fas fa-map-marker-alt mr-2 text-lg text-slate-400"></i>{" "}
								Lagos, Nigeria
							</div>
							<div className="mb-2 text-slate-600 mt-10">
								<i className="fas fa-briefcase mr-2 text-lg text-slate-400"></i>
								email: rocketfund@gmail.com
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CompanyDetails;
