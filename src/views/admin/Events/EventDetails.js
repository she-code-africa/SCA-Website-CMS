import React from "react";

const EventDetails = () => {
	return (
		<>
			<div className="container mx-auto px-4">
				<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-64">
					<div className="px-6">
						<div className="text-left mt-12">
							<h3 className="text-2xl font-semibold leading-normal text-slate-700 mb-1">
								Meet and Code
							</h3>
							<div className="text-sm leading-normal mt-0 mb-2 text-slate-400 font-bold underline">
								<i className="fas fa-map-marker-alt mr-2 text-lg text-slate-400"></i>{" "}
								http://new.com
							</div>
						</div>
						<div className="mt-6 py-5 border-t border-slate-200 text-center">
							<div className="flex flex-wrap justify-center">
								<div className="w-full px-4">
									<p className="mb-4 text-lg leading-relaxed text-slate-700">
										A collaboration of coders and painters. Lorem ipsum dolor
										sit amet, consectetur adipiscing elit, sed do eiusmod tempor
										incididunt ut labore et dolore magna aliqua. Ut enim ad
										minim veniam, quis nostrud exercitation ullamco laboris nisi
										ut aliquip ex ea commodo consequat. Duis aute irure dolor in
										reprehenderit in voluptate velit esse cillum dolore eu
										fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
										proident, sunt in culpa qui officia deserunt mollit anim id
										est laborum
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default EventDetails;
