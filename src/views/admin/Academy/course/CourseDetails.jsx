import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getSchoolProgram } from "services";
import { useQuery } from "react-query";
import moment from "moment";

const SchoolProgramDetails = () => {
	const [schoolProgram, setSchoolProgram] = useState({});
	const { id } = useParams();
	useQuery(["school-program", id], () => getSchoolProgram(id), {
		onSuccess: (data) => {
			setSchoolProgram(data);
		},
	});
	return (
		<div className="self-start z-10 bg-white shadow-sm rounded-xl py-4 w-full">
			<div className="w-full flex justify-center border-b px-4 pb-2">
				<img
					src={schoolProgram.image}
					alt={schoolProgram?.title}
					className="h-fit max-w-[8rem]"
				/>
			</div>
			<div className="flex items-center justify-between px-4 my-4">
				<h6 className="text-lg font-medium">{schoolProgram?.title}</h6>
				<div>
					<button className="bg-slate-500 px-4 py-2 rounded text-sm text-white">
						Publish/Archive
					</button>
				</div>
			</div>
			<div className="px-4">
				<div className="text-sm mb-5">
					<div>
						<p>Cohort : {schoolProgram?.cohort}</p>
						<p>
							Created : {moment(schoolProgram?.createdAt).format("DD/MM/YYYY")}
						</p>
						<p>
							Published :{" "}
							{schoolProgram?.publishDate
								? moment(schoolProgram?.createdAt).format("DD/MM/YYYY")
								: "---"}
						</p>
					</div>
				</div>
				<div>
					<p className="text-sm font-medium my-2">Description</p>
					<p>{schoolProgram?.extendedContent}</p>
				</div>
			</div>
		</div>
	);
};

export default SchoolProgramDetails;
