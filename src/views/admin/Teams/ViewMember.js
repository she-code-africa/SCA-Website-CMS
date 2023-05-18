import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getTeamMember } from "services";

const ViewMember = () => {
	const [member, setMember] = useState();
	const { bio, name, role, team, image } = member;
	const { id, cat: catId } = useParams();
	const response = useQuery(["member", id], () => getTeamMember(catId, id));
	useEffect(() => {
		if (response.isSuccess) {
			setMember(response.data);
		}
	}, [response]);
	return (
		<>
			<div className="container mx-auto px-4">
				<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-64">
					<div className="px-6">
						<div className="text-center mt-12">
							<div className="flex w-full justify-center">
								<img src={image} alt={name} />
							</div>
							<h3 className="text-3xl font-semibold leading-normal text-slate-700 mb-2">
								{name}
							</h3>
							<div className="mb-2 text-slate-600 mt-10">
								<i className="fas fa-briefcase mr-2 text-lg text-slate-400"></i>
								{role || "N/A"}
							</div>
							<div className="mb-2 text-slate-600">
								<i className="fas fa-university mr-2 text-lg text-slate-400"></i>
								{team.name}
							</div>
						</div>
						<div className="mt-10 py-10 border-t border-slate-200 text-center">
							<div className="flex flex-wrap justify-center">
								<div className="w-full lg:w-9/12 px-4">
									<p className="mb-4 text-lg leading-relaxed text-slate-700">
										{bio}
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

export default ViewMember;
