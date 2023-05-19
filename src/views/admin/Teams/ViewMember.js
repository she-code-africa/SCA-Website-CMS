import Loader from "components/Loader";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getTeamMember } from "services";
import { AiOutlineTeam } from "react-icons/ai";

const ViewMember = () => {
	const [member, setMember] = useState();
	const { id, cat: catId } = useParams();
	const response = useQuery(["member", id], () => getTeamMember(catId, id));
	useEffect(() => {
		if (response.isSuccess) {
			setMember(response.data);
		}
	}, [response]);
	return (
		<div className="container mx-auto px-4">
			{response.isLoading ? (
				<Loader />
			) : (
				<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg">
					<div className="px-6">
						<div className="flex w-full justify-end mt-3 items-center">
							<div className="text-white bg-pink-500 px-4 py-1 mr-2 rounded">
								Publish
							</div>
							<div className="bg-slate-600 text-white px-4 py-1 rounded">
								Archive
							</div>
						</div>
						<div className="text-center mt-6">
							<div className="flex w-full justify-center">
								<img
									src={member?.image}
									alt={member?.name}
									className="w-20 h-20 rounded-full"
								/>
							</div>
							<h3 className="text-2xl font-semibold leading-normal text-slate-700 mb-2">
								{member?.name}
							</h3>
							<div className="mb-2 text-slate-600">
								<i className="fas fa-briefcase mr-2 text-lg text-slate-400"></i>
								{member?.role || "N/A"}
							</div>
							<div className="mb-2 text-slate-600 flex items-center justify-center">
								<AiOutlineTeam size="1.25rem" />
								<p className="ml-2">{member?.team.name}</p>
							</div>
						</div>
						<div className="mt-5 py-10 border-t border-slate-200 text-center">
							<div className="flex flex-wrap justify-center">
								<div className="w-full lg:w-9/12 px-4">
									<p className="mb-4 text-lg leading-relaxed text-slate-700">
										{member?.bio}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ViewMember;
